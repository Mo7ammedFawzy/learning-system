#!/usr/bin/env node
// Moves rows of state/REVIEW.md by the ladder rules in core/BOOTSTRAP.md (pass, partial, miss)
// and core/SCRATCH.md (reread). Prints each moved row.
//
// Usage:  node review.mjs <reread|pass|partial|miss> <id>... [--date YYYY-MM-DD]
//         node review.mjs --test

import fs from 'node:fs'

const LADDER = [1, 3, 7, 21, 40]
const REREAD_CAP = 7

const addDays = (date, n) => new Date(Date.parse(date) + n * 864e5).toISOString().slice(0, 10)
const step = (rung, by) => LADDER[Math.max(0, Math.min(LADDER.length - 1, LADDER.indexOf(rung) + by))]

/** One row { rung, last } after `verb` on `today`; returns { rung, due, last }. */
export function move({ rung, last }, verb, today) {
  if (!LADDER.includes(rung)) throw new Error(`rung ${rung} is not on the ladder ${LADDER}`)
  let next
  if (verb === 'pass') next = step(rung, 1)
  else if (verb === 'partial') next = step(rung, -1)
  else if (verb === 'miss') next = 1
  else if (verb === 'reread') next = rung >= REREAD_CAP || last === today ? rung : Math.min(step(rung, 1), REREAD_CAP)
  else throw new Error(`unknown verb: ${verb}`)
  return { rung: next, due: addDays(today, verb === 'reread' ? 1 : next), last: today }
}

function test() {
  const eq = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} != ${JSON.stringify(b)}`) }
  const d = '2026-11-16'
  eq(move({ rung: 7, last: '' }, 'pass', d), { rung: 21, due: '2026-12-07', last: d })
  eq(move({ rung: 40, last: '' }, 'pass', d).rung, 40)
  eq(move({ rung: 7, last: '' }, 'partial', d), { rung: 3, due: '2026-11-19', last: d })
  eq(move({ rung: 1, last: '' }, 'partial', d).rung, 1)
  eq(move({ rung: 21, last: '' }, 'miss', d), { rung: 1, due: '2026-11-17', last: d })
  eq(move({ rung: 1, last: '2026-11-15' }, 'reread', d), { rung: 3, due: '2026-11-17', last: d })
  eq(move({ rung: 3, last: d }, 'reread', d).rung, 3)          // one climb per day
  eq(move({ rung: 7, last: '' }, 'reread', d).rung, 7)         // re-reads stop at 7
  eq(move({ rung: 21, last: '' }, 'reread', d).rung, 21)       // and never pull a row down
  console.log('review.mjs: ok')
}

const args = process.argv.slice(2)
if (args[0] === '--test') test()
else if (args.length) {
  const di = args.indexOf('--date')
  const today = di >= 0 ? args.splice(di, 2)[1] : new Date().toISOString().slice(0, 10)
  const [verb, ...ids] = args
  const file = new URL('./state/REVIEW.md', import.meta.url)
  const left = new Set(ids)
  const text = fs.readFileSync(file, 'utf8').split(/(\r?\n)/).map(line => {
    const c = line.split('|').map(s => s.trim())
    if (c.length !== 7 || !left.has(c[1])) return line
    left.delete(c[1])
    const r = move({ rung: Number(c[4]), last: c[5] }, verb, today)
    const row = `| ${c[1]} | ${c[2]} | ${r.due} | ${r.rung} | ${r.last} |`
    console.log(`${row}   (was rung ${c[4]})`)
    return row
  }).join('')
  if (left.size) { console.error(`not in state/REVIEW.md: ${[...left].join(' ')}`); process.exit(1) }
  fs.writeFileSync(file, text)
} else {
  console.error('usage: node review.mjs <reread|pass|partial|miss> <id>... [--date YYYY-MM-DD] | --test')
  process.exit(2)
}
