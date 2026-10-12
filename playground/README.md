# Playground

Scratch space for Learning Mode exercises. One directory per lesson, named by topic ID:
`07-generics/` in the Java track, `R13-useeffect/` in the React track.

Only `SUMMARY.md` cards, lesson figures and this file are committed — the `.gitignore` here ignores
everything else, so scratch code can be deleted freely.

Anything that is not a lesson (a comparison page, a diagram, a one-off experiment) goes in
`playground/_scratch/`. It is not tracked, so tell the learner that when you create a file there.

## Lesson figures

A figure is an optional extra, made only when the learner asks for one (asked for on 2026-10-12).
The lesson itself still happens in the console.

- **Keep it small, with a simple explanation**: two short legend keys and a caption of one or two
  sentences. The detail belongs in the lesson, not under the drawing.
- **Save it in the lesson directory**, never in `_scratch/`: `playground/<NN>-<topic>/figure.html`,
  with the script that builds it beside it as `figure.mjs`.
- **Commit and push it** once it builds and opens cleanly.

`09a-comparable-comparator/` is the first one.

## Where exercise code goes — Java

**Step-3 exercise code goes in the IDE's scratches, not here** (asked for on 2026-10-01), so it
opens and runs in the IDE with one click:

```
%APPDATA%\JetBrains\IntelliJIdea2026.2\scratches\learn\<NN>-<topic>\Main.java
```

The version in that path changes with the IDE — list `%APPDATA%\JetBrains\` and use the newest.
`SUMMARY.md` still goes here, in `playground/<NN>-<topic>/`, because it is tracked.

## Running code — Java

Verified on this machine: **JDK 25** at `C:\Program Files\Java\jdk-25.0.4.1`, with `java`, `javac`
and `jshell` all on PATH.

If the active lab profile targets an older Java release, compile the way that project would, so
practice code matches what it actually accepts. The gap matters only occasionally, but when it does
it matters a lot — code that compiles here may not compile there:

```powershell
javac --release 21 Main.java
```

The `nama-erp` lab targets Java 21. In codebase-free mode, use whatever the exercise specifies.

### Single file, no build

```powershell
java 07-generics\Main.java
```

Java runs a single `.java` source directly — no `javac` step, no classpath, no build file. This is
the default for exercises.

### Snippets

```powershell
jshell
```

Best for drilling small things: what `Integer.valueOf(127) == Integer.valueOf(127)` returns, how a
`Comparator` chain orders, what an unbounded wildcard will and will not accept.

```powershell
jshell --enable-preview   # only if an exercise explicitly needs a preview feature
```

### Several files

```powershell
cd 07-generics
javac --release 21 *.java && java Main
```

## What does not run here

Spring exercises. Standing up a Boot context in a scratch folder costs more setup than the lesson
returns, so Spring topics are taught as read-and-reason against real files from the active lab
instead — tracing injection, spotting a proxy problem, predicting a transaction boundary. The Java
under the framework is still drilled here as runnable code.

## React exercises

**Exercise code goes in one shared sandbox app, not in the lesson directory:**
`playground/react-sandbox/`, a Vite + React + TypeScript project. It is git-ignored. `SUMMARY.md`
still goes in `playground/R<NN>-<topic>/`.

Verified on this machine: **Node 24** and **npm 11** on PATH.

Create the sandbox once, on the first React lesson, if the directory does not exist:

```powershell
cd playground
npm create vite@latest react-sandbox -- --template react-ts
cd react-sandbox
npm install
```

Each exercise is one file, `src/lessons/R<NN>-<topic>.tsx`, with a default-exported component.
`src/App.tsx` renders the current one, so earlier exercises stay on disk and can be reopened:

```tsx
import Lesson from './lessons/R05-immutability'

export default function App() {
  return <Lesson />
}
```

Run it and leave it running; the page updates on save:

```powershell
cd playground\react-sandbox
npm run dev
```

Leave `<StrictMode>` in `src/main.tsx`. Its double render and double effect run are part of what
the lessons teach, and removing it hides the bugs the exercises are built to show.

Type errors are part of the exercise. `npm run build` runs the type checker over every lesson file.

### Library topics

Install a library in the sandbox when its topic is reached, not before:
`npm install zustand`, `@reduxjs/toolkit react-redux`, `@tanstack/react-query`, `react-router`.

### Next.js topics

Next.js is its own project. Create it when the first Next.js topic is reached, accepting the
recommended defaults:

```powershell
cd playground
npx create-next-app@latest next-sandbox
```

Each topic gets a route folder, `app/r<NN>-<topic>/page.tsx`. Run with `npm run dev`.
