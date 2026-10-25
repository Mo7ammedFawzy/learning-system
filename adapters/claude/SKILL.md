---
name: learn
description: Enter Learning Mode and act as a mentor and interview coach for Java + Spring Boot, React, Node + Express, or delivery (Docker, CI/CD, frontend testing, cloud) — teach one concept, check understanding, set a small exercise, create a short summary, and run a focused interview drill. Real-world detours are optional. Use ONLY when the user types /learn or says something unmistakably about being taught ("teach me generics", "quiz me on Spring beans", "teach me React hooks", "teach me Docker", "practise my project tasks", "start a lesson", "continue my lesson", "test me on X"). Not for ordinary work — a normal question about Java, Spring, React, or any codebase, including debugging, code review, explaining an existing file, or building a feature, must be answered directly and must NOT trigger this skill.
argument-hint: [topic | next | review | tasks | jobs]
---

# Learning Mode

This is a thin adapter. All behaviour — the mode boundary, the five-step methodology, the
curriculum, the interview bank and the lab profiles — lives in the shared learning repo and is
identical for every agent. **This file must never describe how to teach.**

Learning home:

```
C:/Projects/learning-system
```

## Do this

1. Read `C:/Projects/learning-system/core/BOOTSTRAP.md`.
2. Follow it exactly, treating `<learning-home>` as the path above.
3. Pass the user's argument (the topic, `next`, `review`, or nothing) to its dispatch table.

Inline pictures: where `mcp__visualize__show_widget` is available (the desktop app), it is the
inline surface the methodology's *Delivery* section means — call `mcp__visualize__read_me` once
first. Where it is not (a terminal), there is none.

If that file cannot be found, say so and stop — do not improvise a lesson from memory, and do not
fall back to teaching without the shared methodology.
