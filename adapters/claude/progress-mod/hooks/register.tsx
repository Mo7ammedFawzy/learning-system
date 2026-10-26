import type { EngineInterface, Register } from 'claude-code'

// The learning-progress band above the prompt: the focus track's level on a beginner -> senior
// ladder and its next topic, its lessons and scratches as two meters, then every track in one row.
// Everything is read from the repo this mod sits in (adapters/claude/progress-mod -> ../../..),
// on every draw, so it is never out of date with state/PROGRESS.md.

type State = 'solid' | 'ok' | 'shaky' | 'scr' | 'none'
type Section = { name: string; ids: string[] }
type Track = { name: string; level?: string; next?: string; last?: string; sections: Section[] }

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
  const last: Record<string, string> = {}
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
    // newest date on a Completed or Scratched row ("2026-09-01, reviewed 2026-09-06" counts the review)
    const date = (c[2]?.match(/\d{4}-\d{2}-\d{2}/g) ?? []).sort().at(-1)
    if (id && date && (section === 'Completed' || section === 'Scratched') && date > (last[id] ?? '')) last[id] = date
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
    const fromCurrent = current[t.name]?.split(' ')[0]
    const nextId = fromCurrent && ids.includes(fromCurrent) ? fromCurrent : ids.find(i => !RANK[state[i] ?? ''])
    t.next = nextId && `${nextId} ${names[nextId]}`.trim()
    t.last = ids.map(i => last[i] ?? '').sort().at(-1) || undefined
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

const slash = (p: string) => p.replace(/\\/g, '/').toLowerCase()
async function inRepo($: EngineInterface, repo: string): Promise<boolean> {
  return slash(await $.session.cwd()).startsWith(slash(repo))
}

async function load($: EngineInterface, repo: string): Promise<Track[]> {
  const curricula: Record<string, string> = {}
  for (const d of await $.fs.list(`${repo}/core`)) {
    if (d.kind !== 'dir') continue
    const f = `${repo}/core/${d.name}/CURRICULUM.md`
    if (await $.fs.exists(f)) curricula[d.name] = await $.fs.read(f)
  }
  return parse(await $.fs.read(`${repo}/state/PROGRESS.md`), curricula)
}


const LEVELS = ['beginner', 'beginner+', 'intermediate', 'intermediate+', 'advanced', 'advanced+', 'senior']
const SHORT: Record<string, string> = {
  beginner: 'beg', 'beginner+': 'beg+', intermediate: 'int', 'intermediate+': 'int+', advanced: 'adv', 'advanced+': 'adv+', senior: 'sen',
}
const ACCENT = '#d97757'
const W = 14

const counts = (t: Track) => {
  const all = t.sections.flatMap(s => s.ids)
  return {
    n: all.length,
    done: all.filter(x => RANK[x.split(':')[1] ?? '']).length,
    scr: all.filter(x => x.endsWith(':scr')).length,
  }
}

/** The track studied most recently; the first one when none has a date. */
export const focus = (tracks: Track[]) =>
  tracks.reduce<Track | undefined>((a, t) => (!a || (t.last ?? '') > (a.last ?? '') ? t : a), undefined)

export const register: Register = on => {
  // pick up lessons that close while the session is open
  on('session.start', async ($, e, next) => {
    $.clock.every(30_000, () => $.ui.invalidate('ui.render'))
    return next(e)
  })

  // Only inside the learning repo; elsewhere it would be noise above every chat.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const repo = await repoOf($)
    if (e.props.hasSurvey || !(await inRepo($, repo))) return next(e)
    const tracks = await load($, repo).catch(() => undefined)
    const f = tracks && focus(tracks)
    if (!tracks || !f) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const c = counts(f)
    const at = LEVELS.indexOf(f.level ?? '')
    const meter = (k: number, color: string, ch: string) => {
      const full = Math.round(k * W / c.n)
      return <Text><Text color={color}>{ch.repeat(full)}</Text><Text color={COLOR.none}>{'░'.repeat(W - full)}</Text></Text>
    }

    return (
      <Box flexDirection="column">
        <Text wrap="truncate">
          <Text bold>{f.name}  </Text>
          <Text dimColor>beginner </Text>
          {LEVELS.map((_, i) => <Text color={i < at ? COLOR.solid : i === at ? ACCENT : COLOR.none}>{i === at ? '●' : '━'}</Text>)}
          <Text dimColor> senior  </Text>
          {f.level ? <Text color={ACCENT}>{f.level}</Text> : <Text dimColor>not assessed</Text>}
          {f.next ? <Text><Text color={ACCENT}>   ▶ </Text><Text>{f.next}</Text></Text> : ''}
        </Text>
        <Text wrap="truncate">
          <Text dimColor>lessons </Text>{meter(c.done, COLOR.solid, '█')}
          <Text dimColor> {c.done}/{c.n} {Math.round(c.done * 100 / c.n)}%    scratched </Text>{meter(c.scr, COLOR.scr, '▒')}
          <Text dimColor> {c.scr}/{c.n}</Text>
        </Text>
        <Text wrap="truncate">
          {tracks.map((t, i) => {
            const k = counts(t), isFocus = t === f
            return (
              <Text>
                {i ? <Text color={COLOR.none}> │ </Text> : ''}
                <Text bold={isFocus} dimColor={!isFocus}>{isFocus ? '▸' : ''}{t.name} </Text>
                <Text color={COLOR.solid}>{k.done}</Text><Text dimColor>/{k.n}</Text>
                {k.scr ? <Text color={COLOR.scr}> ◌{k.scr}</Text> : ''}
                {t.level ? <Text color={isFocus ? ACCENT : undefined} dimColor={!isFocus}> {SHORT[t.level] ?? t.level}</Text> : ''}
              </Text>
            )
          })}
        </Text>
      </Box>
    )
  })
}
