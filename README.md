# Learning System

A mentoring and interview-coaching system, shared across coding agents, with one track per
technology: **Java + Spring Boot** and **React** (taught by contrast with Vue, from the official
docs). One methodology, one curriculum per track, one progress file — usable from Claude Code, OpenCode and Codex, with
real codebases plugged in as optional "labs".

Independent of any company codebase: delete `labs/` and the system still works.

## Using it

```
/learn                 show where you are in each track, and resume the latest
/learn generics        jump to a topic by name or ID
/learn react           resume the React track (any track: its folder name under core/)
/learn react hooks     jump to a topic inside a named track
/learn next            advance to the next uncompleted topic
/learn review          re-test only the things you were shaky on
```

Works the same from every agent. Also triggered by unmistakable phrasings — "teach me X", "quiz me
on X", "start a lesson". A normal question ("why is this service throwing?") does **not** trigger
it; see `core/MODE-BOUNDARY.md`.

## The five steps

Each concept runs the same loop, one step per message, **20–30 minutes end to end**:

1. Teach one concept — ~5 min
2. Check understanding — 2–3 questions, ~5 min
3. Practice — a small exercise, checked on the spot, ~10 min. **No solution until you attempt it**
4. Summary card — `playground/<NN>-<topic>/SUMMARY.md`, the thing you revise from, ~2 min
5. Interview drill — 1–2 focused questions with the shallow answer, the passing answer, and the follow-up

Strict mode is on: hints escalate in three levels, and the answer appears only after an attempt or
an explicit "show me". Saying "show me" is not cheating — it is the mode working as configured.

## Where a lesson is read

In the terminal. A step is delivered in the console and answered in the console — tables, fenced
snippets and small ASCII sketches rather than paragraphs, because a step cannot be scrolled back to.

Two things are files rather than messages: step 3's exercise code in the directory
`playground/README.md` names, because it runs, and the step-4 summary card in
`SUMMARY.md`, because it is what you revise from offline.

Two rules keep the budget honest. A wrong answer is re-taught and re-tested **once**; if it fails
again it becomes a weak spot for a later `review` instead of eating the lesson. And real-codebase
extracts and production-shaped tasks are **optional** — a lesson adds one only when the concept
genuinely looks different at production scale, or you ask for it.

## Layout

```
core/            the shared source of truth — agent-neutral, codebase-neutral
  BOOTSTRAP.md     session-start protocol and dispatch (the entry point)
  MODE-BOUNDARY.md Work Mode vs Learning Mode
  METHODOLOGY.md   the five steps, their gates and budget, the hint ladder
  java/            the Java + Spring Boot track
    CURRICULUM.md    46 topics, Java before any framework
    INTERVIEW-BANK.md questions with shallow / passing / follow-up answers
  react/           the React track — topic IDs R01…, each linked to its official docs page
    CURRICULUM.md    41 topics: core, hooks, TypeScript, patterns, libraries, Next.js, build
    INTERVIEW-BANK.md
labs/            optional pluggable codebase profiles (INDEX, TEMPLATE, one file per codebase)
state/PROGRESS.md your progress per track
state/WEAK-SPOTS.md named misconceptions, re-tested one per warm-up
state/LEARNER.md  what you already know — lessons build on it instead of re-teaching it
playground/      your summary cards; its README names where exercise code goes
adapters/        thin per-agent entry points — pointers only
```

## Architecture in one rule

**Methodology lives in exactly one place.** `core/` never names an agent or a company codebase.
Agent-specific plumbing lives in `adapters/`; codebase-specific facts live in `labs/`. Every agent
reads the same `core/`, which is why they cannot drift apart. Project rules follow the same shape:
`AGENTS.md` is the one rule file, and `CLAUDE.md` only imports it.

`./check.sh` enforces it, along with the consistency of topic IDs, interview banks and paths. The
installer wires it in as a pre-commit hook.

## Install

Get this repo onto the machine, then run the installer from inside it:

```powershell
.\install.ps1          # Windows PowerShell
```
```bash
./install.sh           # Git Bash / macOS / Linux
```

It detects where the repo lives, writes the adapters into the global agent config directories with
that path substituted, verifies they resolve, and reports whether `java`, `node`, `claude`, `opencode`
and `codex` are present. Re-run it any time you move the repo. `--uninstall` / `-Uninstall` removes the
adapters and touches nothing else.

**Requirements:** Claude Code, OpenCode and/or Codex, plus a JDK 21+ for the Java exercises
(`java`, `javac`, `jshell`) and Node.js 20+ for the React ones. Nothing else — the system is plain markdown.

The adapters are pointers back to this repo, so keep the repo where you installed it from.
Details and manual steps: `adapters/README.md`.

## Labs

A lab is a real codebase a lesson can draw on for its optional real-world detour. `labs/INDEX.md`
maps a working directory to a profile; if none matches, lessons run in **codebase-free mode** with
self-contained examples, and say so. Add one by copying `labs/TEMPLATE.md`.

Currently: `nama-erp` (Java 21 / Spring Boot 3.5 / Hibernate 6 ERP monorepo at `C:\Projects\8080`),
serving the Java track. The React track has no lab and runs codebase-free.

## Maintenance

- Progress is written after step 5. Grade honestly — a `solid` on a topic you fumbled makes the file
  worthless.
- If a path in a lab profile has drifted, the lesson finds a current example and fixes the entry
  rather than quoting stale code.
- To reset: empty `state/PROGRESS.md` back to "not started" and delete `playground/*`.
