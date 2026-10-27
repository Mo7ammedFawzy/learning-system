import type { EngineInterface, Register } from 'claude-code'

// The learning-progress band above the prompt, one powerline row: the focus track's level on a
// beginner -> senior ladder, its gate topics to the next level with the next one marked, then every
// track's lessons and scratches.
// Everything is read from the repo this mod sits in (adapters/claude/progress-mod -> ../../..),
// on every draw, so it is never out of date with state/PROGRESS.md.

type State = 'solid' | 'ok' | 'shaky' | 'scr' | 'none'
type Section = { name: string; ids: string[] }
// scr: on the Scratched list, even when a lesson part outranks it in `state` (10a shaky, 10 scratched)
type Gate = { id: string; name: string; state: State; scr: boolean }
type Track = { name: string; level?: string; next?: string; last?: string; sections: Section[]; gate: Gate[] }

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
  const gates: Record<string, string[]> = {}
  const current: Record<string, string> = {}
  const last: Record<string, string> = {}
  const scratched = new Set<string>()
  let section = ''
  for (const line of progress.split(/\r?\n/)) {
    if (line.startsWith('## ')) { section = line.slice(3).trim(); continue }
    const cur = line.match(/^\*\*(\w+)\*\* — Topic: ([A-Z]*\d{2})[a-z]? — ([^,.:(]+)/)
    if (cur) current[cur[1]!] = `${cur[2]} ${cur[3]!.trim()}`
    if (!line.startsWith('| ')) continue
    const c = rowCells(line)
    const c0 = c[0] ?? ''
    const id = c0.match(/^([A-Z]*\d{2})[a-z]?$/)?.[1]
    if (section === 'Level' && /^[a-z]+$/.test(c0)) { levels[c0] = c[1] ?? ''; gates[c0] = c[3]?.match(/[A-Z]*\d{2}/g) ?? [] }
    // newest date on a Completed or Scratched row ("2026-09-01, reviewed 2026-09-06" counts the review)
    const date = (c[2]?.match(/\d{4}-\d{2}-\d{2}/g) ?? []).sort().at(-1)
    if (id && date && (section === 'Completed' || section === 'Scratched') && date > (last[id] ?? '')) last[id] = date
    if (section === 'Completed' && id) {
      // a split topic (04a, 04b, 04c) shows its weakest part
      const conf = c[3] as State
      if (!state[id] || state[id] === 'scr' || (RANK[conf] ?? 0) > (RANK[state[id]] ?? 0)) state[id] = conf
    }
    if (section === 'Scratched' && id) { scratched.add(id); if (!state[id]) state[id] = 'scr' }
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
    tracks.push({ name, sections: own.filter(s => s.ids.length), gate: [] })
    if (spring.length) tracks.push({ name: 'spring', sections: spring, gate: [] })
  }

  for (const t of tracks) {
    t.level = levels[t.name]
    // a gate topic can live in another track's curriculum (spring's N+1 is java's 22)
    t.gate = (gates[t.name] ?? []).map(id => ({ id, name: names[id] ?? '', state: state[id] ?? 'none', scr: scratched.has(id) }))
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
const SEG = { focus: "#3a2a24", gate: "#232a3e", track: "#303030" }

const counts = (t: Track) => {
  const all = t.sections.flatMap(s => s.ids)
  return {
    n: all.length,
    done: all.filter(x => RANK[x.split(':')[1] ?? '']).length,
    scr: all.filter(x => x.endsWith(':scr')).length,
  }
}

/** Does this gate topic count as closed on the way to the next level? */
export function passes(g: Gate): boolean {
  // strict: a shaky lesson or a scratch does not unlock a level
  return g.state === 'solid' || g.state === 'ok'
}

/** "Concurrent collections, atomics, ThreadLocal" -> "Concurrent collections" */
const short = (name: string) => name.split(/,| and |:/)[0]!.trim()

/** The track studied most recently; the first one when none has a date. */
export const focus = (tracks: Track[]) =>
  tracks.reduce<Track | undefined>((a, t) => (!a || (t.last ?? '') > (a.last ?? '') ? t : a), undefined)

// Redraw now, and every 30 s to pick up lessons that close while the session is open. Called from
// the first prompt too: a desktop session can admit this mod after session.start fired, and then
// nothing redrew the band until the second message.
let isTicking = false
function tick($: EngineInterface) {
  if (!isTicking) $.clock.every(30_000, () => $.ui.invalidate('ui.render'))
  isTicking = true
  $.ui.invalidate('ui.render')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => { tick($); return next(e) })
  on('prompt.submit', async ($, e, next) => { tick($); return next(e) })

  // Only inside the learning repo; elsewhere it would be noise above every chat.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const repo = await repoOf($)
    if (e.props.hasSurvey || !(await inRepo($, repo))) return next(e)
    const tracks = await load($, repo).catch(() => undefined)
    const f = tracks && focus(tracks)
    if (!tracks || !f) return next(e)
    const { Text } = $.ui.resolve(e)
    const c = counts(f)
    const at = LEVELS.indexOf(f.level ?? '')
    const nextGate = f.gate.find(g => !passes(g))
    const seg = (bg: string, body: unknown) => <Text backgroundColor={bg}> {body} </Text>

    // one powerline row: [track ladder level] [road to the next level] [focus counts] [other tracks]
    return (
      <Text wrap="truncate">
        {seg(SEG.focus, <Text>
          <Text bold>{f.name} </Text>
          {LEVELS.map((_, i) => <Text color={i < at ? COLOR.solid : i === at ? ACCENT : COLOR.none}>{i === at ? '●' : '━'}</Text>)}
          {f.level ? <Text color={ACCENT}> {SHORT[f.level] ?? f.level}</Text> : <Text dimColor> not assessed</Text>}
        </Text>)}
        {f.gate.length && LEVELS[at + 1] ? seg(SEG.gate, <Text>
          <Text dimColor>→{SHORT[LEVELS[at + 1]!]} </Text>
          {/* a scratch is shown half-filled but never counted: it does not unlock a level */}
          {f.gate.map(g => <Text color={passes(g) ? COLOR.solid : g.scr ? COLOR.scr : COLOR.none}>{passes(g) ? '■' : g.scr ? '◧' : '▢'}</Text>)}
          <Text dimColor> {f.gate.filter(passes).length}/{f.gate.length}</Text>
          {f.gate.map(g => g === nextGate
            ? <Text><Text color={ACCENT}> ▶ </Text><Text>{g.id} {short(g.name)}</Text></Text>
            : <Text dimColor>{g === f.gate[0] ? ' ' : ' · '}{g.id} {short(g.name)}</Text>)}
        </Text>) : f.next ? seg(SEG.gate, <Text><Text color={ACCENT}>▶ </Text>{f.next}</Text>) : ''}
        {tracks.map(t => {
          const k = counts(t), isFocus = t === f
          return (
            <Text>
              <Text> </Text>
              {seg(SEG.track, <Text>
                {isFocus ? '' : <Text dimColor>{t.name} </Text>}
                <Text color={COLOR.solid}>{k.done}</Text><Text dimColor>/{k.n}</Text>
                {k.scr ? <Text color={COLOR.scr}> ◌{k.scr}</Text> : ''}
                {t.level && !isFocus ? <Text dimColor> {SHORT[t.level] ?? t.level}</Text> : ''}
              </Text>)}
            </Text>
          )
        })}
      </Text>
    )
  })
}
