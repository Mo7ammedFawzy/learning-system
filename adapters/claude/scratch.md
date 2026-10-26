---
name: scratch
description: Enter Learning Mode for a fast batch pass over several Java + Spring Boot, React, Node + Express, or delivery (Docker, CI/CD, frontend testing, cloud) topics at once — the important part of each topic back to back, then one short quiz and a cheat sheet. No exercise and no step-by-step gates. Use ONLY when the user types /scratch or unmistakably asks for a crash course or quick overview of an area ("give me a crash course on collections", "scratch the Spring core section"). Not for ordinary work — a normal question about Java, Spring, React, or any codebase must be answered directly and must NOT trigger this skill. For a full lesson on one concept use the learn skill instead.
argument-hint: [section | topic IDs | range]
---

# Learning Mode — scratch pass

This is a thin adapter. All behaviour — the mode boundary, the scratch contract, the curriculum and
the progress rules — lives in the shared learning repo and is identical for every agent. **This
file must never describe how to teach.**

Learning home:

```
C:/Projects/learning-system
```

## Do this

1. Read `C:/Projects/learning-system/core/BOOTSTRAP.md`.
2. Follow it exactly, treating `<learning-home>` as the path above.
3. Pass `scratch` followed by the user's argument (a section, topic IDs, a range, or nothing) to
   its dispatch table.

Inline pictures: where `mcp__visualize__show_widget` is available (the desktop app), it is the
inline surface the methodology's *Delivery* section means — call `mcp__visualize__read_me` once
first. Where it is not (a terminal), there is none.

Detailed figure: the `anatomy` skill is the tool the scratch contract's close means — invoke it
only after the learner says yes to the offer.

If that file cannot be found, say so and stop — do not improvise a lesson from memory, and do not
fall back to teaching without the shared methodology.
