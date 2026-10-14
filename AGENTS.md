# Agent instructions for this repository

This repo is a **Learning System**: a mentoring and interview-coaching methodology, shared across
agents, with one **track** per technology — currently Java + Spring Boot (`core/java/`) and React
(`core/react/`). It contains no application code.

## Default behaviour

**Do not start teaching just because this repo is open.** Work Mode is still the default — if the
user asks you to edit a file, fix a typo, restructure the curriculum or explain something here,
just do it. Learning Mode is entered only as defined in `core/MODE-BOUNDARY.md`.

## When the user asks to learn

Read `core/BOOTSTRAP.md` and follow it exactly. `<learning-home>` is this repository's root.

## Layout

| Path | What it is |
|---|---|
| `core/` | The shared source of truth. Agent-neutral and codebase-neutral by contract |
| `core/BOOTSTRAP.md` | Session-start protocol and dispatch — the entry point |
| `core/MODE-BOUNDARY.md` | Work Mode vs Learning Mode |
| `core/METHODOLOGY.md` | The five steps, their gates and time budget, the strict-gate hint ladder |
| `core/SCRATCH.md` | The `/scratch` contract — a fast batch pass over several topics, one quiz at the end, no exercise |
| `core/<track>/CURRICULUM.md` | A track's topic list. Declares the track's topic-ID prefix (`java`: none, `react`: `R`) |
| `core/<track>/INTERVIEW-BANK.md` | Interview questions per topic of that track |
| `labs/` | Optional, pluggable real-codebase profiles. `labs/INDEX.md` maps a working directory to a profile; no match means codebase-free mode |
| `state/PROGRESS.md` | Learner state — one `Current` line per track |
| `state/WEAK-SPOTS.md` | Named misconceptions. Read at the warm-up and close only, not at session start |
| `state/LEARNER.md` | What the learner already knows, self-reported. Lessons bridge from it and never edit it |
| `state/SOURCES.md` | Priority checklist: every question in the `sources/` PDFs, mapped to a topic. Gates the `java` track only |
| `sources/` | Interview-prep PDFs the learner wants finished first |
| `playground/` | Summary cards per lesson (tracked). `playground/README.md` names where exercise code goes and how to run it |
| `adapters/` | Thin per-agent entry points — pointers only, never methodology |

## Two invariants

1. **`core/` names no agent and no company codebase.** Not "Claude", not "OpenCode", not "Codex",
   not a skill or a slash command, and no path into a real project. Everything specific to a
   codebase belongs in a `labs/` profile; everything specific to an agent belongs in `adapters/`.
   `./check.sh` enforces this.
2. **Methodology exists in exactly one place.** If you find yourself copying a rule from `core/`
   into an adapter, stop: the adapter is supposed to be a pointer, and duplication is how two agents
   start behaving differently.

## Commands

There is no build, no test suite and no application code — the system is plain markdown.

```bash
./check.sh                 # invariant 1, stale paths, topic IDs vs interview banks, installers. Runs on every commit
./check.sh --links         # the same, plus every documentation link resolves. Run after editing a curriculum
```

```powershell
.\install.ps1              # write adapters into the global agent config dirs (-Uninstall removes)
.\progress.ps1             # one progress bar per track, from the curricula and state/PROGRESS.md. The status line calls it
```
```bash
./install.sh               # same, Git Bash / macOS / Linux (--uninstall)
```

Re-run the installer after moving the repo — the adapters are absolute pointers back to it — and
after editing an adapter's description, since the installed copy is what an agent reads.

## Adding a track

Create `core/<name>/CURRICULUM.md` (declare an ID prefix no other track uses, and link the official
documentation each topic is taught from) and `core/<name>/INTERVIEW-BANK.md`, add a `Current` line
to `state/PROGRESS.md`, a run section to `playground/README.md`, and the technology's name to the
adapter descriptions (`learn` and `scratch`, for each agent). Nothing in the shared `core/` files changes.

## Arabic text output

Some clients do not set RTL paragraph direction (the Claude Code remote client is one), so Arabic
lines start from the left and embedded English/numbers land in the wrong place. Wrap **every** line
of Arabic output in RTL embedding controls — prefix `U+202B` (RLE), suffix `U+202C` (PDF):

```
‫الملف README.md موجود في المجلد core/ ويحتاج إلى 3 تعديلات.‬
```

`U+2067` (RLI) … `U+2069` (PDI) works equally well. Apply per line, not per block.
