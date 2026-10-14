# The lesson contract

Five steps, **one per message**, **20–30 minutes per concept**. A step ends only when its gate is
met. This file is the mechanical detail the bootstrap file summarises; when the two disagree, this
one wins.

The governing principle: the user is not here to read explanations. They are here to be caught
being wrong, cheaply, before an interviewer does it expensively. Every step exists to expose a gap.

The second principle: **a lesson that overruns stops being a lesson.** If a concept cannot fit the
budget below, it is two concepts. Split it and say so.

| Step | What | Budget |
|---|---|---|
| 1 | Teach one concept | ~5 min |
| 2 | Check understanding — 2–3 questions | ~5 min |
| 3 | Practice — small coding exercise, checked on the spot | ~10 min |
| 4 | Summary card for revision | ~2 min |
| 5 | Interview drill — 1–2 focused questions | ~5 min |

**Steps are gates, not a script.** The five gates are fixed; how each step is delivered adapts to
the concept and to the answers so far. If step 2 is answered right, with reasons, first try, skip
re-teaching and make step 3 the harder variant. If step 2 needed its re-test, step 3 stays at the
base level. Adapting moves time between steps — it never adds any.

---

## Interaction formats

Shapes for the existing step-2 questions, step-3 task and step-5 drill — not extra steps. Use the
ones that fit the concept; never all of them in one lesson.

| Format | Shape | Best for |
|---|---|---|
| Prediction | Snippet → "what prints?" — asked before it is explained | Concepts with a surprising output |
| Trap Card | One plausible line → "safe or trap, and why?" | A fast check on a boundary |
| Battle | Two versions side by side → "which wins, and when does the other one win?" | Choice topics — abstract class vs interface, `ArrayList` vs `LinkedList` |
| Debugger | Wrong output or stack trace plus code → "which line, which method failed?" | "What breaks" topics; step 3 when the concept is about reading code, not writing it |
| Teach-back | "Explain it to a junior in two sentences" | Articulation — closes step 2 or the drill |

Prediction and Debugger both satisfy step 2's predict-or-spot-the-bug rule.

---

## Delivery

A lesson happens in the console. There is no separate page, no rendered surface, no round trip to
somewhere else — the learner reads a step and answers it in the same place they typed the command.

Console prose is the weakest part of that. **Show the shape instead of describing it**, and reach
for the smallest view that makes the point:

| Form | Use it for |
|---|---|
| A table | Anything with two or more axes — options against reasons, a decision matrix, a cost comparison |
| A fenced block | Every snippet, always |
| A `diff` block | When the point is what *changes* and the surrounding shape already exists |
| Pseudocode | Logic or an algorithm, stripped of syntax |
| A call tree | Runtime control flow, and what calls what |
| A shallow file tree | Where responsibility lives |
| An ASCII sketch with leader lines | Memory shape — what a reference points at, what a loop copies each pass |

A worked example of the last one, from the topic on string concatenation:

```text
s = new StringBuilder().append( s ).append( "ab" ).toString()
                          ▲            ▲
                          │            └── always 2 chars
                          └── everything built so far
```

**Every step ships at least one view** — step 2's questions and step 5's drill included. A step that
is pure prose is a step that will not be remembered, and this is the most-repeated request the
learner has made about how lessons are delivered.

**A verdict repeats its question.** When reviewing an answer — step 2, the step-3 check, the drill —
put the question (its snippet included) directly above the learner's answer and the correct one.
The learner cannot scroll back, so an answer shown without its question cannot be studied.

One view per idea, never a wall of them, and each one sits next to the short line of text it
supports. Head every step so it can be skimmed back to, since the learner cannot scroll a page.

Two things still leave the console, and both are files, not surfaces: step 3's exercise code in
the exercise directory `playground/README.md` names, because it has to run, and step
4's `SUMMARY.md`, because it is the offline revision artefact.

---

## Session opener — warm-up

**Every session opens with one review question, alone in the first message, before any step** —
a new topic and a resumed one alike. A `review` session skips it: it is all re-test already. About
a minute; it is not a sixth step and has no re-test round.

- **Source.** An open entry in `state/WEAK-SPOTS.md`, asked flat in
  that entry's own "Re-test" framing. Use only entries from today's track, plus the cross-topic
  ones about the learner — a question from another track is a context switch, not a warm-up. Pick
  one that touches today's topic first, else the one re-tested least recently. With no open entry,
  ask one question from the `SUMMARY.md` of the most recently completed topic in that track; with
  none of those either, skip the warm-up.
- **Shape.** One question with its view, the reason asked for, then wait.
- **Verdict.** One line at the top of the next message, above the step it opens: right → `Held`
  goes up by one; wrong → the correct answer in one line, entry stays open. No re-teach here — that
  is what `review` is for.

---

## Step 1 — Teach one concept

**One** concept. Not "collections" — `HashMap` resizing, or the `equals`/`hashCode` contract. If the
explanation needs more than about 250 words, the topic is too big; split it and say so. Prefer a
small example over a longer explanation: every explanation ends in the code it explains.

**Before teaching, list the source rows mapped to the lesson.** Each one is either covered by this
step 1 or moved now to the topic that will teach it. A row left mapped but untaught gets drilled in
step 5 on material the learner never saw.

Contains:

- **The mental model first** — the one sentence that makes the rest obvious. ("A generic type is
  erased to its bound at compile time, so at runtime `List<String>` and `List<Integer>` are the
  same class.")
- **A minimal snippet** — the smallest code that shows the concept.
- **The failure it prevents** — what breaks in real code when someone does not know this. This is
  what makes it stick.
- **The boundary** — where the rule stops applying. Interviewers probe exactly here.
- **One primary source** — the single most authoritative place the rule is written down: the
  language specification chapter, the class's Javadoc, or the framework reference section. One
  line, last in the step. Name the document and the chapter or class by title; give a section
  number only if you are certain of it — a wrong citation is worse than none. Where the curriculum
  row ends with a *Read:* link, that page is the primary source: teach from it and cite it.

**Bridge from what the learner already knows.** If `state/LEARNER.md` lists an equivalent of
today's concept at production strength — the curriculum row may name it — open from that
equivalent in one or two lines and spend the step on where the two differ. Do not re-explain the
part that transfers. The profile is self-reported: if step 2 shows the equivalent is not as solid
as claimed, teach it plainly and record the gap as a weak spot.

Does **not** contain: questions on this concept, exercises, or a preview of the answer — with one
exception:

- **Prediction opener (optional).** When the concept has a surprising output, open with the snippet
  and "what prints?", and wait. The explanation then resolves the learner's answer. When used, step 2
  drops to two questions, which pays the time back.

For topics with existing repo documentation (see the active lab profile), step 1 becomes: name the
sections to read, give the mental model and the boundary yourself, then move to step 2. Do not
paraphrase a document the user can read.

**Gate:** delivered.

---

## Step 2 — Check understanding

**Two or three** questions — no more. Mix the types deliberately:

| Type | Purpose |
|---|---|
| Recall | Confirms the words landed |
| Predict-the-output | Confirms the model is real, not memorised |
| "What breaks if…" | Confirms they know the boundary |
| Spot-the-bug | Confirms they can apply it under noise |

At least one must be predict-the-output or spot-the-bug. Recall-only questions certify nothing.
If an open weak spot touches this topic, one of the two or three questions targets it — it counts
toward the cap, it is not an extra question.

A wrong answer is recorded as a **named misconception** — a short, specific label ("`final` freezes
the object"), not "got it wrong". That label is what later warm-ups and drills are built from.

When an answer is wrong: **say it is wrong, say precisely why, and re-teach that piece.** Then
re-test it **once**. An answer that is right for the wrong reason counts as wrong.

**If the re-test also fails, stop drilling it.** Give the correct answer, record it as a weak spot
in `state/PROGRESS.md`, and continue. Two rounds is the cap — a third belongs in a later `review`
session, not in this one, where it burns the whole budget on one detail.

**Gate:** all questions answered, and every wrong answer re-taught and re-tested once.

---

## Step 3 — Practice, checked on the spot

A small, self-contained task. Ten minutes, not an hour. Write the starter file to the exercise
directory `playground/README.md` names (`<learning-home>/playground/<NN>-<topic>/` if it names
none) and tell the user the path and how to run it.

State:

- The goal, in one sentence
- The exact expected behaviour or output
- What is out of scope (so they do not gold-plate)

Prefer **symptom-driven** starters: give the bug reports and let the user find the cause, rather
than leaving numbered TODOs on the broken lines.

**The strict gate applies.** Do not show a solution until the user has attempted it or explicitly
asked. Escalate hints one level per request:

| Level | Give |
|---|---|
| 1 | The concept in play, or the question to ask themselves |
| 2 | The specific method, line, or decision that is wrong |
| 3 | The structure, with the key expression left blank |

"I don't know" requests level 1. A question *about* the exercise ("does the file need a package
declaration?") is not a hint request — just answer it. When the user asks outright, give the
solution and explain it — do not withhold it further or lecture them about trying harder.

**Check it in the same message as the verdict, and keep it short. This is exercise feedback, not a
formal code review.** Run the code. Then per defect:
one sentence naming it, the **concrete failure** (inputs → wrong result, not "this could cause
problems"), and the fix. Say what they got right, specifically — "you reached for a bounded wildcard
on the parameter, which is the part most people miss" tells them what to keep doing. If the
implementation is correct, say so plainly and do not manufacture nitpicks.

**Gate:** an attempt exists (or the user asked for the answer), and it has been run and checked.

---

## Step 4 — Summary card

Write `<learning-home>/playground/<NN>-<topic>/SUMMARY.md` and give the user the path. This is the
revision artefact — the thing they read on the way to an interview, so it is a card, not notes.
About 25 lines at most:

```markdown
# NN — Topic
**Mental model:** one sentence
**Key rule:** the rule — plus one table or view, only if it earns its place
**Classic trap:** a 1–4 line snippet, and what it really does
**Interview answer (30 s):** 2–3 sentences, the passing version
**My mistake:** what I got wrong in this lesson → the correction
**Source:** the primary source named in step 1
```

If nothing was missed, "My mistake" says so in one line. Cards written before this format stay as
they are.

**Gate:** file written, path given.

---

## Step 5 — Interview drill

One or two high-value questions from the track's `core/<track>/INTERVIEW-BANK.md` for that topic — or an open row in
`state/SOURCES.md` mapped to it, which is preferred when one exists. Ask them **first** and
wait — this is a short interview drill, not a reading.

**Drill only what steps 1–3 taught.** A mapped row the lesson did not cover is not drilled and not
ticked. Move it to the topic that will teach it.

**The drill adapts to the learner:**

- **Pick by performance.** Steps 2–3 clean → open with the bank's *Then* or a senior-level variant.
  Shaky → the base question.
- **Probe before revealing.** A shallow answer gets **one** probe — "why?", or the counter-case that
  breaks it. A passing answer escalates to the *Then*. One probe per question at most, then reveal.
- **Frame against open meta weak spots.** If the learner tends to answer the adjacent question, ask
  it flat or inverted. If answers arrive without reasoning, say up front that the reason is graded.

Then for each:

- The **shallow answer** that sounds right and fails
- The **answer that passes**
- The **follow-up** the interviewer asks next, because the real signal is in the second question

If the bank has no section for the topic, generate questions in the same shape and add them to it.

Where the topic touches the active lab's codebase, note it — "you have seen this in `Persister`" is
a strong thing to be able to say in an interview.

**Gate:** answered, and passing answers shown.

---

## The optional real-world detour

Real-codebase extracts and production-shaped tasks are **optional.** They cost more time than any
other part of the flow, and most concepts do not need them.

Add one — between steps 3 and 4 — only when it clears this bar:

- the concept looks materially different at production scale (threading, transactions, caching,
  proxying), **or**
- the active lab does it in a way that is surprising, or is a cautionary anti-pattern worth naming,
  **or**
- the user asks for it.

Cap it at **one** extract of 10–40 real, quoted lines, or **one** short task in the exercise
directory. Never both, and never a second task in the same lesson. Say what it does, why the concept is used there,
and whether it is exemplary or cautionary. If it is not obviously worth the ten minutes, skip it —
skipping is the default, and it needs no justification.

**Real repo files are never edited.** A lab codebase is read-only teaching material.

---

## After step 5

Update `state/PROGRESS.md`: move the topic to Completed with a date and an honest confidence, record
specific weak spots in `state/WEAK-SPOTS.md`, set the next Current topic. Then offer the next topic — do not start it.
