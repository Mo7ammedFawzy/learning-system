# Dashboard redesign: course layout

Rebuild `playground/dashboard.html` so it looks and works like an interactive course site
(reference: designed-to-scale.vercel.app), while keeping everything today's dashboard shows.
Vocabulary follows [GLOSSARY.md](../../GLOSSARY.md): topic, part, figure, frame, summary card.

Reference prototype: `playground/PROTOTYPE-dashboard-v2.html`, deleted once the real page landed
(see it with `git show 745ca23:playground/PROTOTYPE-dashboard-v2.html`; open it with `?tabs=B`).

## Decisions

| # | Decision |
|---|---|
| 1 | **Hybrid layout.** The course view is the home page; today's topic cell grid and study calendar move to a Progress tab |
| 2 | **Copy the measured look, not the reference site's code** (tokens below) |
| 3 | **One HTML file, no build step.** `dashboard.mjs` stays the only script and still writes `dashboard-data.js`; the progress band's dashboard button keeps opening the page from disk |
| 4 | **Words on the page:** topic, part, figure, frame, summary card. Never "lesson" for a menu item, never "step" for a figure screen |
| 5 | **Two tabs: Learn · Progress.** "Due for review" stays inside Progress, beside the calendar. (The prototype opens on A; use `?tabs=B`) |
| 6 | **Nested sidebar tree:** tracks → sections → topics, each folder showing done/total |
| 7 | **Stage content:** the topic's figure fills the stage; with no figure, its summary card does; with neither, a "not studied yet" state with the objective. The right panel holds id, title, objective, status, review date, parts, weak spots, and the summary card when the stage shows the figure |
| 8 | **On load:** open the last-opened topic (localStorage, wrapped in try/catch); fall back to the current topic of the focused track |
| 9 | **Figure frame, not new frames.** The stage shows each existing anatomy figure in the reference layout: crumb, title, chips, live metric tiles parsed from the figure's readout, the legend, and ◀ ▶ buttons that press the figure's own arrow keys. No new click-through frames are authored. The stage never scrolls. (◀ ▶ replaces the earlier "no Next/Back" decision) |
| 10 | **Figure colours.** Figures keep their drawings, re-coloured from the course palette (same-size parts share a colour, the base board stays paper) with dark 1.2px outlines. The styles ship inside the figures (a shared stylesheet in `playground/atlas/` or a kit theme), so they work from disk. A full redraw of topic 10 was tried and set aside |
| 11 | **Right panel fits without scrolling** (text clamped). "Read more" and "Open summary card" open a slide-in reader |
| 12 | **Topics with several figures** show one named button per part ("02a String pool vs heap") |
| 13 | **Figure side panels** (code listings, consoles, controls and notes beside a drawing) use the course look: a card, the current line as a green pop pill, pop buttons, notes as dark-bordered callouts. Long lines wrap, so nothing scrolls sideways. Known gap: figure 12's side panel (878px) is taller than the frame and scrolls vertically inside its card |
| 14 | **The right panel shows the figure's Arabic summary** (its `.ar-summary`, right-to-left, under "باختصار") instead of the English caption. The English caption moves to the Read more reader, after the Arabic |
| 15 | **Figure controls:** a small bar on the figure frame with − / + / reset; Ctrl+wheel zooms and dragging pans (CSS transform, no redraw). No rotate buttons: figures are flat SVG at a fixed isometric angle. A topic with no figure has no figure and no bar (decision 7) |
| 16 | **Search:** a Ctrl K palette (and a search box in the top bar) matching topic id, title, objective and summary-card text. It lists Recent topics first, then results grouped by section with done/total; ↑ ↓ move, Enter opens, Esc closes |
| 17 | **Popovers on figure parts only:** hovering a part shows its name and one sentence. Sidebar topics get no popover |
| 18 | **Part text is added over time:** new figures must give each part its text; existing figures get theirs when their topic comes up for review. A part without text shows no popover |
| — | Light only (no dark mode, no toggle), Arabic summary at the top of the page, `./check.sh` passes |

## Layout

- **Left sidebar, 248px:**
  - Learn / Progress tabs at the top.
  - The nested tree below them. Folders open with a `grid-template-rows: 0fr → 1fr` transition, `.34s cubic-bezier(.2,.7,.2,1)`.
  - A progress bar at the bottom.
- **Centre stage:** the open topic (decision 7), on a faint grid background.
- **Right panel:** the topic's details (decision 7).
- **Progress tab:** today's cell grid, study calendar and due list. Same model code, restyled.

## Look

| Token | Value |
|---|---|
| Palette | `--paper:#f4ebe0` `--card:#f7efe4` `--line:#ddd3c5` `--edge:#46413b` `--ink:#1d1b18` `--muted:#6f6961` `--green:#cfe3b2` `--violet:#e7ddf5` `--orange:#fcdcbd` `--mint:#dff0de` `--rust:#d0683a` |
| Fonts | JetBrains Mono for headings and ids, Inter for body text |
| Pop button / active tab | fill `#cfe3b2`, radius 8px, `box-shadow: inset 0 1px 0 #fff8, 1.5px 2.5px 0 #1d1b18`; on press, translate 1px 2px and drop the shadow |
| Card | radius 12px, border 1.2px `--line`, `box-shadow: inset 0 1px 0 #ffffffa6, 0 10px 22px -16px rgba(80,60,35,.35)` |
| Section folders | one colour each, cycling green, violet, orange, mint |

## Note for the build

Nothing is open. The prototype re-colours figures by injecting CSS into their iframes, which works only over http.
Decision 10 moves that stylesheet into the figures themselves.

## Done when

- [x] `playground/dashboard.html` shows the course layout with real data from `node dashboard.mjs`
- [x] Opened from disk (and from the band button), it renders with no console errors
- [x] Learn and Progress tabs both work; Progress keeps the cell grid, calendar and due list
- [x] The tree shows all tracks with done/total counts; folders open and close with the eased transition
- [x] The stage follows decision 7 for a topic with a figure, one with only a summary card, and one with neither
- [x] Figures show in the course colours when opened from disk; ◀ ▶ and the metric tiles follow the figure; the stage and right panel never scroll. Figures 02b, 04a, 05a and 21 have no arrow keys or buttons to step, so they show no ◀ ▶
- [x] A topic with several figures shows one named button per part
- [x] No figure scrolls sideways (all 27 checked at 1440×900); figure 12's side panel is the only one that scrolls vertically
- [x] The right panel shows the figure's Arabic summary; Read more shows the Arabic, then the English caption (figure 44 has no English caption)
- [x] − / + / reset, Ctrl+wheel and drag zoom and pan the figure; reset restores the fit
- [x] Ctrl K opens search; a word that only appears in a summary card finds its topic
- [x] Hovering a figure part with text shows its popover; a part without text shows none
- [x] Reloading reopens the last topic; on first visit (cleared storage) it opens the focused track's current topic
- [x] `./check.sh` passes
- [x] `playground/PROTOTYPE-dashboard-v2.html` is deleted once the real page lands
