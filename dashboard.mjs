#!/usr/bin/env node
// Writes playground/dashboard-data.js: the data playground/dashboard.html draws (every topic of every
// track, progress, review dates, weak spots, summary cards and figures). The page itself never
// changes; a page opened from disk cannot read the markdown files, so this script reads them for it.
// The progress band's dashboard button runs it before opening the page. The output is not tracked.
//
// Usage:  node dashboard.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const read = p => fs.readFileSync(path.join(root, p), 'utf8')
const exists = p => fs.existsSync(path.join(root, p))
const cells = line => line.split('|').slice(1, -1).map(s => s.trim())
const ROW = /^\| [A-Z]?\d{2}[a-z]? \|/

// --- curricula: track -> sections -> topics, in row order
const tracks = fs.readdirSync(path.join(root, 'core'), { withFileTypes: true })
  .filter(d => d.isDirectory() && exists(`core/${d.name}/CURRICULUM.md`))
  .map(d => d.name)
  .sort((a, b) => (a === 'java' ? -1 : b === 'java' ? 1 : a.localeCompare(b)))
  .map(name => {
    const sections = []
    let cur
    for (const line of read(`core/${name}/CURRICULUM.md`).split(/\r?\n/)) {
      const h = line.match(/^## (Track .*|Lab-specific.*)$/)
      if (h) { cur = { title: h[1], topics: [] }; sections.push(cur); continue }
      if (line.startsWith('## ')) { cur = undefined; continue }
      const m = line.match(/^\| ([A-Z]?\d{2}) \|/)
      if (m && cur) {
        const [id, title, objective = ''] = cells(line)
        cur.topics.push({
          id,
          title: title.replace(/ [★☆]$/, ''),
          star: title.includes('★') ? 'core' : title.includes('☆') ? 'senior' : '',
          objective: objective.replace(/\s*\*Read:\*.*$/, '').trim().slice(0, 400),
        })
      }
    }
    return { name, sections: sections.filter(s => s.topics.length) }
  })

// --- state/PROGRESS.md: Completed and Scratched tables, Current lines, Focus queue
const progress = read('state/PROGRESS.md')
const table = heading => {
  const lines = progress.slice(Math.max(0, progress.indexOf(heading))).split(/\r?\n/).slice(1)
  const end = lines.findIndex(l => l.startsWith('## '))
  return lines.slice(0, end < 0 ? undefined : end).filter(l => ROW.test(l)).map(cells)
}
const completed = table('## Completed').map(([id, title, date, confidence, notes]) => ({ id, title, date, confidence, notes }))
const scratched = table('## Scratched').map(([id, title, date]) => ({ id, title, date }))
const current = {}
for (const m of progress.matchAll(/^\*\*(\w+)\*\* — (Topic: .*)$/gm)) current[m[1]] = m[2]
const focus = (progress.match(/^\*\*Focus\*\* — \w+: ([^.]*)\./m)?.[1] || '').split(/,\s*/).filter(Boolean)

// --- state/REVIEW.md
const review = read('state/REVIEW.md').split(/\r?\n/).filter(l => ROW.test(l)).map(cells)
  .map(([id, track, due, rung, last]) => ({ id, track, due, rung: Number(rung), last }))

// --- state/WEAK-SPOTS.md: one bullet each, its topic from the first "(id, date" parenthetical
const weak = []
for (const b of read('state/WEAK-SPOTS.md').split(/\r?\n(?=- \*\*)/)) {
  if (!b.startsWith('- **')) continue
  const label = b.match(/^- \*\*(.+?)\*\*/s)?.[1].replace(/\s+/g, ' ')
  const topic = b.match(/\(([A-Z]?\d{2}[a-z]?)[,)]/)?.[1]
  if (label && topic) weak.push({ topic, label, held: Number(b.match(/Held: (\d)\/2/)?.[1] || 0) })
}

// --- summary cards and cheat-sheet sections; figures (atlas first, then any folder)
const pg = path.join(root, 'playground')
const dirs = fs.readdirSync(pg, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
const summaries = {}
for (const d of dirs) {
  const id = d.match(/^([A-Z]?\d{2}[a-z]?)-/)?.[1]
  if (id && exists(`playground/${d}/SUMMARY.md`)) summaries[id] = { kind: 'summary', src: `${d}/SUMMARY.md`, md: read(`playground/${d}/SUMMARY.md`) }
}
for (const d of dirs.filter(d => d.startsWith('scratch-') && exists(`playground/${d}/CHEATSHEET.md`))) {
  for (const part of read(`playground/${d}/CHEATSHEET.md`).split(/\r?\n(?=## )/)) {
    const id = part.match(/^## ([A-Z]?\d{2}[a-z]?) — /)?.[1]
    if (id && !summaries[id]) summaries[id] = { kind: 'cheat sheet', src: `${d}/CHEATSHEET.md`, md: part }
  }
}
const figures = {}
for (const d of ['atlas', ...dirs.filter(d => d !== 'atlas')]) {
  for (const f of fs.readdirSync(path.join(pg, d))) {
    const id = f.match(/^([A-Z]?\d{2}[a-z]?)-figure\.html$/)?.[1] ?? (f === 'figure.html' ? d.match(/^([A-Z]?\d{2}[a-z]?)-/)?.[1] : undefined)
    if (id && !figures[id]) figures[id] = `${d}/${f}`
  }
}
// Every figure loads the dashboard's bridge (inert when opened alone). Stamped here so a new or rebuilt figure gets it too.
const BRIDGE = '<script src="../atlas/course-figure.js"></script>'
for (const f of Object.values(figures)) {
  const file = path.join(pg, f), html = fs.readFileSync(file, 'utf8')
  const end = html.lastIndexOf('</body>')
  if (end >= 0 && !html.includes(BRIDGE)) fs.writeFileSync(file, html.slice(0, end) + BRIDGE + html.slice(end))
}

const data = { generated: new Date().toISOString(), tracks, completed, scratched, current, focus, review, weak, summaries, figures }
fs.writeFileSync(path.join(pg, 'dashboard-data.js'),
  `// Written by dashboard.mjs. Not tracked: run \`node dashboard.mjs\` to refresh.\nwindow.DASHBOARD = ${JSON.stringify(data)};\n`)
const n = tracks.reduce((a, t) => a + t.sections.reduce((b, s) => b + s.topics.length, 0), 0)
console.log(`playground/dashboard-data.js: ${n} topics, ${completed.length} done, ${scratched.length} scratched, ${Object.keys(figures).length} figures`)
