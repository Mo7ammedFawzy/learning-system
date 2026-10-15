# Learning System — Business Overview

## What it is
A personal mentoring and interview-coaching program, run by the AI coding assistant a developer already works with. It teaches one technology at a time, in short lessons, and keeps an honest record of what the learner has really mastered. The aim is to be caught being wrong cheaply in practice, before an interviewer catches it. It works the same in each supported assistant (Claude Code, OpenCode, Codex), and it works with or without a real company codebase to draw examples from.

## Users & roles
| Role | Who | Can do | Can't do |
|---|---|---|---|
| Learner | The developer preparing for interviews (one person) | Start, resume or jump to a lesson; ask for a fast overview; ask for a review of weak spots; ask for hints or the answer; ask normal work questions at any time | Get an exercise solution before attempting it, unless they ask for it outright |
| Mentor | The AI assistant, once a lesson has started | Teach, quiz, check exercises, write summary cards, record progress and weak spots | Start teaching unless asked; change real project code during a lesson; edit the learner's self-description; mark a topic done that was only half-taught |
| Maintainer | The learner, outside lessons | Edit the curricula, add a technology track, add or remove a real codebase as an example source | — |

## Core concepts
- **Track** — one technology to learn. Today: a backend track (Java + Spring Boot) and a frontend track (React, taught by contrast with Vue, which the learner already knows).
- **Topic** — one concept in a track's ordered curriculum. Large topics are split into lettered parts (for example 02a, 02b).
- **Lesson** — five steps on one topic, 20–30 minutes in total.
- **Scratch session** — a fast pass over 3–6 topics at once. An overview only; it never counts as completing a topic.
- **Summary card** — a one-page revision note written at the end of each lesson.
- **Weak spot** — a named, specific misconception (not just "got it wrong"), re-tested in later sessions.
- **Warm-up** — one re-test question that opens every session.
- **Confidence** — the honest grade given when a topic closes: solid, ok or shaky.
- **Priority sources** — the learner's interview-prep question sets. Each question is mapped to a topic, and they decide what comes next in the backend track.
- **Lab** — a real codebase the mentor may quote from for an optional real-world example. Read-only.
- **Work Mode / Learning Mode** — Work Mode (normal help) is the default. Learning Mode starts only on an explicit request.

## Main flows
### Taking a lesson
1. The learner asks to learn (by command, or "teach me X", "quiz me on X").
2. The mentor shows where each track stands, then resumes or proposes the next topic.
3. Warm-up: one question on an open weak spot.
4. Step 1, teach: one concept, its mental model, a small example, what breaks without it, and one authoritative source.
5. Step 2, check: 2–3 questions, at least one "predict the result" or "spot the bug".
6. Step 3, practice: a small exercise, run and checked right away.
7. Step 4, summary card: written for later revision.
8. Step 5, interview drill: 1–2 questions, showing the shallow answer, the passing answer and the likely follow-up.
9. The mentor records the result, the confidence and any weak spots, then offers the next topic without starting it.

### Fast overview (scratch)
1. The learner asks for a crash course on an area.
2. The mentor covers each topic in one short block: the idea, the classic trap, the 30-second interview answer.
3. A cheat sheet is written, and the topics are marked "scratched".

### Review
1. The learner asks for a review, of all weak spots or of one completed topic.
2. The mentor re-tests without re-teaching. A weak spot closes after it holds twice in a row.

### Asking a normal question mid-lesson
1. The mentor answers it directly, like in normal work, then offers to return to the lesson.

## Business rules
- One step per message. A step ends only when its goal is met.
- Budget: about 5 / 5 / 10 / 2 / 5 minutes per step. A topic that doesn't fit is split into two.
- A wrong answer is re-taught and re-tested once. If it fails again, it becomes a weak spot. There is no third round.
- An answer that is right for the wrong reason counts as wrong.
- No exercise solution before an attempt. Hints go up in three levels. An outright request for the answer is honoured.
- A topic is complete only after all five steps. Scratched topics are tracked separately.
- Confidence must be honest. "Solid" on a fumbled topic is not allowed.
- While any priority-source question is still open in a track, the next topic is the first one that answers such a question.
- When two or more topics have closed since the last review, the mentor suggests a review once. It is a reminder, not a gate.
- Real-world detours are optional and rare: at most one short extract or one task, never both. Real codebases are never edited.
- Only the drill questions that the lesson actually taught can be ticked off in the priority sources.
- Learner preferences on record: lessons mix English (technical content) with light Egyptian Arabic (encouragement), never in the same line. Scratch sessions skip the quiz. Exercises describe symptoms instead of listing to-dos.

## Pages / screens
There are no screens. Lessons happen in the learner's terminal chat. Two things are saved as files: exercise code, where it can be run, and summary cards and cheat sheets for revision. A progress bar per track shows topics completed against the total.

## Status
- **Done:** the method, both tracks' curricula and interview question banks, priority-source mapping, the scratch mode, support for three assistants, one real-codebase lab (backend track only).
- **In progress (backend track):** 7 of 46 topics complete (11 lessons including split parts). 22 of 165 priority-source questions ticked. Next up: Maps.
- **In progress (frontend track):** 0 of 41 topics complete, 12 scratched (overview only). Next up: JSX, as a full lesson.
- **Planned:** nothing written down beyond working through the curricula.

## Open questions
- Is this product only for its author, or meant for other learners too? Everything (progress, learner profile, preferences) assumes one person.
- Is there a target interview date or deadline that should set the pace?
- The frontend track has no real-codebase lab. Is one planned?
- The frontend track's interview prep has no priority-source question sets. Should it get some?
- Should scratched frontend topics get full lessons in order, or only the weakest ones first?
- The views folder for diagrams is empty. Is a visual output planned, given that lessons are terminal-only by design?
