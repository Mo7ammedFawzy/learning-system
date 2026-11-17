# Dashboard redesign: course layout

Rebuild `playground/dashboard.html` so it looks and works like an interactive course site
(reference: designed-to-scale.vercel.app), while keeping everything today's dashboard shows.
Vocabulary follows [GLOSSARY.md](../../GLOSSARY.md): topic, part, figure, frame, summary card.

Reference prototype: [playground/PROTOTYPE-dashboard-v2.html](../../playground/PROTOTYPE-dashboard-v2.html)
(open it with `?tabs=B&tracks=nested` to see the chosen variant).

## Decisions

| # | Decision |
|---|---|
| 1 | **Hybrid layout.** The course view is the home page; today's topic cell grid and study calendar move to a Progress tab |
| 2 | **Copy the measured look, not the reference site's code** (tokens below) |
| 3 | **One HTML file, no build step.** `dashboard.mjs` stays the only script and still writes `dashboard-data.js`; the progress band's dashboard button keeps opening the page from disk |
| 4 | **Words on the page:** topic, part, figure, frame, summary card. Never "lesson" for a menu item, never "step" for a figure screen |
| 5 | **Two tabs: Learn · Progress.** "Due for review" stays inside Progress, beside the calendar |
| 6 | **Nested sidebar tree:** tracks → sections → topics, each folder showing done/total |
| 7 | **Stage content:** the topic's figure fills the stage; with no figure, its summary card does; with neither, a "not studied yet" state with the objective. The right panel holds id, title, objective, status, review date, parts, weak spots, and the summary card when the stage shows the figure |
| 8 | **On load:** open the last-opened topic (localStorage, wrapped in try/catch); fall back to the current topic of the focused track |
| 9 | **No frames** (Next/Back inside figures) in this redesign. Figures are shown as they are |
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

## Open question

**Should figures be re-coloured to the course palette?** The prototype does this by injecting CSS into
each figure's iframe. Browsers block that when the page is opened from disk, so it conflicts with
decision 3. The options:
- (a) Leave figures in their own look.
- (b) Re-colour them at build time: give the anatomy kit a course palette and rebuild the atlas figures.
- (c) Serve the dashboard over http instead of opening it from disk.

Decide before implementing the stage.

## Done when

- [ ] `playground/dashboard.html` shows the course layout with real data from `node dashboard.mjs`
- [ ] Opened from disk (and from the band button), it renders with no console errors
- [ ] Learn and Progress tabs both work; Progress keeps the cell grid, calendar and due list
- [ ] The tree shows all tracks with done/total counts; folders open and close with the eased transition
- [ ] The stage follows decision 7 for a topic with a figure, one with only a summary card, and one with neither
- [ ] Reloading reopens the last topic; on first visit (cleared storage) it opens the focused track's current topic
- [ ] `./check.sh` passes
- [ ] `playground/PROTOTYPE-dashboard-v2.html` is deleted once the real page lands
