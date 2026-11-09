---
name: quiz
description: Enter Learning Mode for interview-style questions on Java + Spring Boot, React, Node + Express, or delivery (Docker, CI/CD, frontend testing, cloud) topics the user has already finished with learn or scratch — PDF interview questions and interview-bank questions first, one at a time, each answer moving the topic's review schedule. Use ONLY when the user explicitly invokes /quiz or $quiz, or unmistakably asks to be quizzed on what they already learned ("quiz me on what I've learned", "give me an interview question from my lessons"). Not for ordinary work — a normal question about Java, Spring, React, or any codebase must be answered directly and must NOT trigger this skill. For a new lesson use the learn skill instead.
---

# Learning Mode — quiz

This is a thin adapter. All behaviour — the mode boundary, the quiz rules, the curriculum and the
progress rules — lives in the shared learning repo and is identical for every agent. **This file
must never describe how to teach.**

Learning home:

```
C:/Projects/learning-system
```

## Do this

1. Read `C:/Projects/learning-system/core/BOOTSTRAP.md`.
2. Follow it exactly, treating `<learning-home>` as the path above.
3. Pass `quiz` followed by the user's argument (a track, a topic ID, or nothing) to its dispatch
   table.
4. Deliver the forms listed in `core/METHODOLOGY.md` § *Delivery* inline in the chat as Markdown
   tables, fenced code blocks, and ASCII sketches. Lessons stay in the console — no HTML artifact.

If that file cannot be found, say so and stop — do not improvise questions from memory, and do not
fall back to quizzing without the shared methodology.
