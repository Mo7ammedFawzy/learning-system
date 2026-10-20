import type { EngineInterface, Register } from 'claude-code'

// The learning-progress pane: one square per curriculum topic, coloured by how it went.
// Everything is read from the repo this mod sits in (adapters/claude/progress-mod -> ../../..),
// on every draw, so it is never out of date with state/PROGRESS.md.

const PANE = 'learning-progress'
const OPEN = { id: PANE, title: 'Learning progress' }

type State = 'solid' | 'ok' | 'shaky' | 'scr' | 'none'
type Section = { name: string; ids: string[] }
type Track = { name: string; level?: string; next?: string; sections: Section[] }

const COLOR: Record<State, string> = {
  solid: '#5fb36b', ok: '#d9b44a', shaky: '#e0674f', scr: '#7489e0', none: '#4a4a4a',
}
const RANK: Record<string, number> = { solid: 1, ok: 2, shaky: 3 }

// ponytail: spring is these sections of the java curriculum; give it its own CURRICULUM.md if it grows.
const SPRING = /^## Track [FGH] /

const rowCells = (line: string) => line.split('|').slice(1, -1).map(c => c.trim())

export function parse(progress: string, curricula: Record<string, string>): Track[] {
  const state: Record<string, State> = {}
  const levels: Record<string, string> = {}
  const current: Record<string, string> = {}
  let section = ''
  for (const line of progress.split(/\r?\n/)) {
    if (line.startsWith('## ')) { section = line.slice(3).trim(); continue }
    const cur = line.match(/^\*\*(\w+)\*\* — Topic: ([A-Z]*\d{2})[a-z]? — ([^,.:(]+)/)
    if (cur) current[cur[1]!] = `${cur[2]} ${cur[3]!.trim()}`
    if (!line.startsWith('| ')) continue
    const c = rowCells(line)
    const c0 = c[0] ?? ''
    const id = c0.match(/^([A-Z]*\d{2})[a-z]?$/)?.[1]
    if (section === 'Level' && /^[a-z]+$/.test(c0)) levels[c0] = c[1] ?? ''
    if (section === 'Completed' && id) {
      // a split topic (04a, 04b, 04c) shows its weakest part
      const conf = c[3] as State
      if (!state[id] || state[id] === 'scr' || (RANK[conf] ?? 0) > (RANK[state[id]] ?? 0)) state[id] = conf
    }
    if (section === 'Scratched' && id && !state[id]) state[id] = 'scr'
  }

  const tracks: Track[] = []
  const names: Record<string, string> = {}
  for (const [name, text] of Object.entries(curricula)) {
    const own: Section[] = [], spring: Section[] = []
    let sec: Section | undefined
    for (const line of text.split(/\r?\n/)) {
      if (line.startsWith('## Track ')) {
        sec = { name: line.replace(/^## Track /, ''), ids: [] }
        ;(name === 'java' && SPRING.test(line) ? spring : own).push(sec)
        continue
      }
      if (line.startsWith('## ')) { sec = undefined; continue }
      const row = line.match(/^\| ([A-Z]*\d{2})[a-z]? \| ([^|★☆]*)/)
      const id = row?.[1]
      if (sec && id && !sec.ids.includes(id)) { sec.ids.push(id); names[id] = row?.[2]?.trim() ?? '' }
    }
    tracks.push({ name, sections: own.filter(s => s.ids.length) })
    if (spring.length) tracks.push({ name: 'spring', sections: spring })
  }

  for (const t of tracks) {
    t.level = levels[t.name]
    const ids = t.sections.flatMap(s => s.ids)
    const fromCurrent = current[t.name]
    const first = ids.find(i => !RANK[state[i] ?? ''])
    t.next = fromCurrent && ids.includes(fromCurrent.split(' ')[0]!)
      ? fromCurrent
      : first && `${first} ${names[first]}`.trim()
  }
  return tracks.filter(t => t.level || t.sections.some(s => s.ids.some(i => state[i])))
    .map(t => ({ ...t, sections: t.sections.map(s => ({ ...s, ids: s.ids.map(i => `${i}:${state[i] ?? 'none'}`) })) }))
}

// The installers link ~/.claude/skills/learning-progress to this folder, so follow the link
// back to the repo: <repo>/adapters/claude/progress-mod.
async function repoOf($: EngineInterface): Promise<string> {
  const real = (await $.fs.stat($.plugin.root, { resolve: true }).catch(() => undefined))?.realPath ?? $.plugin.root
  return real.replace(/[\\/]adapters[\\/]claude[\\/]progress-mod[\\/]?$/, '')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'progress', description: 'Show your learning progress in a side panel' })
    // open by itself only inside the learning repo; elsewhere /progress opens it
    const repo = await repoOf($)
    const cwd = (await $.session.cwd()).replace(/\\/g, '/').toLowerCase()
    if (cwd.startsWith(repo.replace(/\\/g, '/').toLowerCase())) void $.ui.open(OPEN)
    // pick up lessons that close while the pane is open
    $.clock.every(30_000, () => $.ui.invalidate('ui.render'))
    return next(e)
  })

  on('command.run', { command: 'progress' }, async $ => {
    await $.ui.open({ ...OPEN, focus: true, closeOnEscape: true })
    return { text: 'Learning progress opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const repo = await repoOf($)
    let tracks: Track[]
    try {
      const curricula: Record<string, string> = {}
      for (const d of await $.fs.list(`${repo}/core`)) {
        if (d.kind !== 'dir') continue
        const f = `${repo}/core/${d.name}/CURRICULUM.md`
        if (await $.fs.exists(f)) curricula[d.name] = await $.fs.read(f)
      }
      tracks = parse(await $.fs.read(`${repo}/state/PROGRESS.md`), curricula)
    } catch (err) {
      return <Text color={COLOR.shaky}>Cannot read the learning repo at {repo}: {String(err)}</Text>
    }

    return (
      <Box flexDirection="column">
        <Text dimColor>Every topic, coloured by how it went</Text>
        {tracks.map(t => {
          const all = t.sections.flatMap(s => s.ids)
          const done = all.filter(x => RANK[x.split(':')[1] ?? '']).length
          const scr = all.filter(x => x.endsWith(':scr')).length
          const nextId = t.next?.split(' ')[0]
          return (
            <Box flexDirection="column" marginTop={1}>
              <Box justifyContent="space-between">
                <Text bold>{t.name.toUpperCase()}</Text>
                <Text color="#d97757">{t.level ?? 'not assessed'}</Text>
              </Box>
              <Text>
                {t.sections.map(s => (
                  <Text>
                    {s.ids.map(x => {
                      const [id, st] = x.split(':') as [string, State]
                      return <Text color={COLOR[st]}>{id === nextId ? '▣' : '■'}</Text>
                    })}{' '}
                  </Text>
                ))}
              </Text>
              <Text dimColor>
                {done}/{all.length} done{scr ? ` · ${scr} scratched` : ''}{t.next ? ` · next ${t.next}` : ''}
              </Text>
            </Box>
          )
        })}
        <Box marginTop={1}>
          <Text>
            {(['solid', 'ok', 'shaky', 'scr', 'none'] as State[]).map(s => (
              <Text><Text color={COLOR[s]}>■</Text><Text dimColor> {s === 'scr' ? 'scratched' : s === 'none' ? 'not started' : s}  </Text></Text>
            ))}
            <Text dimColor>▣ next</Text>
          </Text>
        </Box>
      </Box>
    )
  })
}
