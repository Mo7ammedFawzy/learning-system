import { expect, test } from 'claude-code/testing'

import { focus, parse } from './register.tsx'

const PROGRESS = `# Progress
## Current
**java** — Topic: 10 — Streams and lambdas, part 10b: lazy. Step: not started.
**react** — Topic: R01 — JSX. Step: not started.
## Level
| Track | Level | Assessed | To reach the next level |
|---|---|---|---|
| java | beginner+ | 2026-10-20 | x |
| spring | beginner | 2026-10-20 | x |
## Completed
| # | Topic | Date | Confidence | Notes |
|---|---|---|---|---|
| 01 | Types | 2026-09-01 | solid | n |
| 04a | Abstract | 2026-09-27 | ok | n |
| 04b | Composition | 2026-09-29 | shaky | n |
## Scratched
| # | Topic | Date | Quiz |
|---|---|---|---|
| R01 | JSX | 2026-10-10 | Partial |
| 23 | IoC | 2026-10-15 | — |
`

const JAVA = `## Track A — Java core
| 01 | Types ★ | x |
| 04 | OOP | x |
| 10 | Streams | x |
## Track F — Spring core
| 23 | IoC | x |
| 24 | Beans | x |
## Lab-specific bonus track
| 99 | Not a topic | x |
`
const REACT = `## Track RA — Core
| R01 | JSX | x |
| R02 | Props | x |
`
const NODE = `## Track NA — Runtime
| N01 | Event loop | x |
`

test('parse: states, levels, next topic, spring split, untouched tracks hidden', async () => {
  const tracks = parse(PROGRESS, { java: JAVA, react: REACT, node: NODE })
  const by = Object.fromEntries(tracks.map(t => [t.name, t]))

  expect(tracks.map(t => t.name)).toEqual(['java', 'spring', 'react'])
  expect(by.java?.level).toBe('beginner+')
  expect(by.java?.sections[0]?.ids).toEqual(['01:solid', '04:shaky', '10:none'])
  expect(by.java?.next).toBe('10 Streams')
  expect(by.spring?.sections[0]?.ids).toEqual(['23:scr', '24:none'])
  expect(by.spring?.next).toBe('23 IoC')
  expect(by.react?.level).toBe(undefined)
  expect(by.react?.next).toBe('R01 JSX')
  // the band's focus is the track studied most recently: spring's 23 (2026-10-15) beats react's R01
  expect(by.java?.last).toBe('2026-09-29')
  expect(focus(tracks)?.name).toBe('spring')
})
