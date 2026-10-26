# The scratch contract

A **scratch session** is a fast batch pass: several topics taught back to back, the important part
of each, one quiz at the end. It is an overview, not a lesson. For this session it replaces steps
1–5 of `core/METHODOLOGY.md`: there is no warm-up, no exercise, no hint ladder, no re-test and no
real-world detour.

Two rules from `core/METHODOLOGY.md` still apply: its *Delivery* section, and bridging from
`state/LEARNER.md` instead of re-teaching what the learner already knows.

A scratched topic is **not** a completed topic. It was seen once and quizzed once, never practised.

## 1. Pick the batch

The scope is whatever follows `scratch` in the argument, resolved inside the active track.

| Scope | Batch |
|---|---|
| a curriculum section heading or its theme (`Track B`, `collections`) | that section's rows |
| topic IDs or a range (`07 09`, `08-10`) | those rows |
| *(none)* | the next uncompleted rows, in the bootstrap's "next topic" order |

- The unit is a curriculum **row**, not the lettered sub-lessons a full lesson splits it into.
- A batch is **3–6 rows**. A larger scope is cut into batches: say so, name the batches, do the
  first.
- Skip rows already under **Completed** unless the learner named them.
- Order inside the batch: rows marked ★ and rows with an open `state/SOURCES.md` row go first.

Open with one line naming the batch, then teach. Do not ask for confirmation.

## 2. Teach — the whole batch in one turn

**First, where the agent can hand work to a background worker** and has a way to build a
**detailed figure** (a standalone, interactive page that shows a mental model as a real working
object, much slower to make than an inline picture): start one in the background for the batch's
hardest topic (the first ★ row, else the first row), then teach without waiting for it. It is
saved as `playground/scratch-<scope>/<id>-figure.html`. One figure per batch, never more. It is a
study aid for while the learner reads and for between sessions. It never replaces a block's inline
picture. Where there is no background worker, skip it: building the figure inline would delay the
teach turn by far more than the batch is worth.

One headed block per topic, about 120 words plus one view. Do not wait between blocks and ask
nothing inside them. Where the client can show a picture, the view is a picture of the topic's
mental model — the same rule as a lesson's step 1 — and the snippet stays a fenced block.

| Part | Size |
|---|---|
| Mental model | one sentence |
| Minimal snippet | the smallest code that shows it |
| Classic trap | the line that looks right and is not, and what it really does |
| Interview answer (30 s) | 2–3 sentences, the passing version |
| Source | the row's *Read:* link where it has one, else the primary source by title |

**When a topic does not fit the block, cut in this order:**

1. Sub-topics that are neither marked ★ nor asked in an open `state/SOURCES.md` row — reduce each
   to one "also exists" line (`TreeMap`: sorted, O(log n)), or drop it.
2. History, version notes and rarely used API.
3. The snippet — shrink it to the one line that shows the trap.
4. The mental model's supporting detail, down to its single sentence.

Never cut the classic trap or the interview answer. If those two alone do not fit, the row is too
big for a scratch block: split it into two blocks and say so.

## 3. Quiz — one message, then wait

Skip this section when the notes in `state/PROGRESS.md` say the learner wants scratch without a
quiz. The close then records `—` as the quiz result and adds no weak spots.

About one question per topic, **six at most**, numbered, each with its view. At least half are
predict-the-output or spot-the-bug; ask for the reason every time.

Answer with **one** verdict message. Each verdict repeats its question above the learner's answer
and the correct one. A wrong answer gets the correction in one or two lines and a named
misconception. No re-teach beyond that and no re-test: a miss is what a full lesson is for.

## 4. Close

- Write `<learning-home>/playground/scratch-<scope>/CHEATSHEET.md` and give the path: one entry of
  4–5 lines per topic (mental model, trap, interview answer), quiz misses marked.
- **Write nothing else to `state/`.** Running a pass does not mean the learner read it. Record the
  batch only when the learner says they finished it — in this session or a later one — and then
  do the steps below.
- In `state/PROGRESS.md`, add each row to **Scratched** with today's date and its quiz result, and
  add each miss to `state/WEAK-SPOTS.md` in that file's line format.
- Add each topic to `state/REVIEW.md` at rung 1, due tomorrow.
- Leave **Completed**, every **Current** line and `state/SOURCES.md` untouched.
- Run `progress.ps1 -Roadmap -Write`, so `state/ROADMAP.md` shows the batch as scratched.

Then offer the next batch, or a full lesson on the weakest topic. Start neither.

If a detailed figure was started in section 2 and has finished, give its path here and list it in
the cheat sheet. If it is still running, say so; give the path when it lands.
