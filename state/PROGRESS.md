# Progress

Maintained by the `/learn` skill. Read at the start of every session, updated after step 5.
Confidence is honest, not encouraging: `solid` / `ok` / `shaky`.

**Current is one line, not a log.** It names the topic and the step in progress, plus anything
needed to resume. Detail about what went wrong belongs in `state/WEAK-SPOTS.md` when the topic
closes.

**Keep progress lightweight.** Update it only when a lesson closes or a two-round re-test identifies
a weak spot. Record the next topic, confidence, and specific gap; do not turn each lesson into a
task log or require a real-world exercise or formal code review to mark it complete.
`./check.sh` caps this file at 150 lines.

## Current

One line per track; a lesson changes only its own track's line.

**java** — Topic: 10 — Streams and lambdas, part 10b: lazy pipelines, intermediate vs terminal, `map` vs `flatMap`, `stream` vs `parallelStream` (SOURCES rows 20, 40, 41). Step: not started. (06b — `final`, nested classes — 08c — `HashMap` resizing and load factor — and 09b — iteration and fail-fast iterators — have no source rows and wait behind the PDFs.)

**react** — Topic: R01 — JSX. Step: not started.

**delivery** — Topic: D01 — Images, containers and the Dockerfile. Step: not started. Install Docker Desktop first (not on this machine as of 2026-10-20).

**node** — Topic: N01 — The event loop and async code. Step: not started.

Last review: 2026-10-20 (placement quiz) · 2026-09-06 (topic 01).

## Level

Scale: `beginner` → `intermediate` → `advanced` → `senior`; a trailing `+` means close to the next.
Measured by a placement quiz, not claimed. Re-assess when a curriculum track (A, B, … ) closes.
`progress.ps1` prints this column; a track with no row is not assessed yet.

| Track | Level | Assessed | To reach the next level |
|---|---|---|---|
| java | beginner+ | 2026-10-20 | Exceptions, streams and `groupingBy`, `ConcurrentHashMap`, `volatile` vs atomic `count++` |
| spring | beginner | 2026-10-20 | Constructor injection, auto-configuration, `@Transactional` self-call, N+1, prototype-in-singleton |
| react | beginner | 2026-10-20 | `useEffect` dependencies, batching and updater functions, keys, memoisation, Context re-renders |

## Completed

| # | Topic | Date | Confidence | Notes |
|---|---|---|---|---|
| 01 | Types, values and references | 2026-09-01, reviewed 2026-09-06 | solid | Review closed four of five weak spots. Exercise and task both clean on first attempt, diagnosed from symptoms with no TODOs. |
| 02a | Strings — immutability, the pool, `==` vs `equals` | 2026-09-21 | ok | Exercise clean in one attempt. Drill: Q1 fully right with mechanism; Q2a answered the rule not the question; Q2b still ticked the blank final. |
| 02b | Strings — `StringBuilder` and loop concatenation | 2026-09-22 | ok | Spotted the disguised `new StringBuilder(sb)` bug unprompted and fixed it. But located the cost in allocation rather than copying, and left the headline `toCsv` case untouched after writing the identical fix one method below. |
| 03a | equals and hashCode — the contract, and how breaking it corrupts a `HashMap` | 2026-09-23 | shaky | Step 2 capped at two rounds. Needed a full Arabic step-by-step re-teach before step 3; Report B then took two wrong tries and two hints. Drill: Q1 right on `==` but opened with "`equals` compares values"; Q2 called `equals` without `hashCode` "not a bug". |
| 04a | Abstract class vs interface | 2026-09-27 | ok | Step 2 capped on `private` interface methods. Step 3: first put the counter in `FileSink`, corrected without a hint, then clean fix (abstract hooks, own field per class) with the right reason. Drill: Q1 right; Q2 listed state, constructors, visibility but missed `final` methods. |
| 04b | Composition over inheritance + OOP | 2026-09-29 | shaky | Step 2: Set size wrong, leaking getter called composition; two re-tests capped (GC reachability, "designed for extension"). Step 3: one level-1 hint, composition fix right first try, then closed two leaks (`public` field, `public final`). Why `ArrayList` skipped the limit: "return type boolean". Drill: Q2 passed with the right conditions. (Q1 on the four OOP concepts was drilled without being taught — not graded; SOURCES row 1 moved to 05.) |
| 04c | Constructors | 2026-09-30 | shaky | Mechanics good, articulation not. Step 2: Q1 called the hidden `super()` failure a "missing field", then passed the re-test with reasons. Step 3 clean first try, and did not add a no-arg constructor to the parent. Drill: both questions failed after one probe ("why not inherited", "what does a constructor return"). |
| 05a | Overriding vs overloading, static hiding | 2026-10-02 | ok | Step 2: Q1 and Q2 wrong, re-test A passed, re-test B output right but reason missed, Q3 right. Step 3: one level-1 hint, then all three reports fixed, with B moved onto the receiver rather than `instanceof`; `equals(Object)` cast without a type check. Drill: both passed with the mechanism (declared type, compile time), no probe needed. Never said the word "hiding". |
| 05b | Dynamic dispatch, the four OOP concepts, varargs | 2026-10-03 | ok | Dispatch and encapsulation landed, varargs resolution did not. Step 2: one of three right; re-tests on dispatch and encapsulation passed with reasons, varargs capped. Step 3: all three reports fixed first try, no hints, validation shared by constructor and setter; `@Override` left off. Drill: Q1 passed after one probe; Q2 failed, answer flipped when the declarations were swapped. |
| 06a | `static` and class initialisation | 2026-10-04 | ok | Step 2: one of three right (static vs instance access); both re-tests passed with reasons. Step 3: all three reports fixed first try, no hints, told "per class" from "per object" in both directions; dropped `private` from `Ticket.next`. Drill: both base answers passed, both probes failed (first use of the main class; said static binding happens at runtime). |
| 08a | List and Set, backing structure and Big O | 2026-10-07 | shaky | Sets landed, the headline list question did not. Step 2: Q1 wrong (`LinkedHashSet` read as `LinkedList`, `HashSet` order called known), re-test capped on "`contains` walks the links". Step 3: A and B first try, C after one level-1 hint, fixed by copying into an `ArrayList` rather than for-each. Drill: Q1 (`ArrayList` vs `LinkedList` middle insert) failed, still O(1) for `LinkedList` after the probe; Q2 passed (O(n²), `HashSet`, bucket reason), its *Then* got "slower" with no Big O. |
| 08b | Maps: `HashMap`, `LinkedHashMap`, `TreeMap`, `Hashtable` | 2026-10-12 | ok | Choosing a map landed, describing `Hashtable` did not. Step 2: order question right with reasons; worst-case costs swapped and "no map takes a `null` key", both re-tests passed with reasons. Step 3: all three reports fixed first try, no hints, each with the reason in a comment. Drill: Q2 (is `get` O(1)?) passed on the second asking with the tree reason; Q1 opened with "the difference is the Big O" and never said "synchronized", even when probed for it. Resizing and load factor not taught (08c). |
| 09a | `Comparable` vs `Comparator` | 2026-10-14 | shaky | Hands right, words wrong. Step 2: one of three (Comparator for `String` by length); `TreeSet` zero-means-duplicate and subtraction overflow both capped. Step 3: all three reports fixed first try, no hints (`thenComparing`, `Comparable` by name, `comparingInt`). Drill: lives-where and when-to-pick passed; the method names swapped in both questions and stayed swapped after both probes. Q2 got "no, size 1, returned 0" right. Iteration and fail-fast not taught (09b). |
| 10a | Lambdas, functional interfaces, method references | 2026-10-19 | shaky | The rule landed, the mechanism didn't. Step 3: A (plain loop instead of capturing `count`) and B (`String::startsWith` receiver order) fixed first try, with no *why* comments. C (`() -> EMPTY` shared list) needed the solution after hint 1. Drill: Q1 got "the lambda copies the value" but not the stack frame, and said a field is copied too. Q2 called a functional interface "an annotation" (corrected after a probe) and never reached why `equals` doesn't count. Streams not taught (10b), so SOURCES row 20 stays open. |

## Scratched

Fast batch pass only (`/scratch`): seen once, quizzed once, not practised. Still open for a full
lesson.

| # | Topic | Date | Quiz |
|---|---|---|---|
| R01 | JSX | 2026-10-10 | Partial: found two of three (single root, statement in braces), missed `class` |
| R02 | Components and props | 2026-10-10 | Miss: no prediction, and the proposed fix mutated the prop then set the same object |
| R03 | State with `useState` | 2026-10-10 | Miss: answered for the clicked counter, not the second one |
| R04 | The render model | 2026-10-10 | Partial: screen value right with the snapshot reason, log value never given |
| R05 | Updating state: immutability and batching | 2026-10-10 | Miss: "I don't know" on `setTodos(todos.sort(f))`; updater queue right |
| R06 | Events and controlled inputs | 2026-10-10 | Partial: `onClick={save()}` right with the fix, the input half not answered |
| R07 | Lists, keys and conditional rendering | 2026-10-10 | Miss: "I don't know" on `key={index}` |
| R08 | Purity and Strict Mode | 2026-10-10 | Miss: "I don't know" on module-level vs local mutation |
| R09 | Structuring and lifting state | 2026-10-10 | Miss: saw `remove` skips the total, but gave the correct total (20) not the shown one (30), and fixed it with another setter |
| R10 | `useReducer` | 2026-10-10 | Miss: "I don't know" on two dispatches then a log |
| R11 | Context | 2026-10-10 | Miss: said a consumer reading only `theme` does not re-render when `user` changes |
| R12 | Refs | 2026-10-10 | Miss: "I don't know" on a ref shown in JSX |
| 23 | IoC and dependency injection | 2026-10-15 | — |
| 24 | Beans: definition, scopes, lifecycle | 2026-10-15 | — |
| 25 | Injection styles | 2026-10-15 | — |
| 26 | Configuration and properties | 2026-10-15 | — |
| 31 | REST controllers | 2026-10-15 | — |
| 32 | Error handling | 2026-10-15 | — |

## Notes to self

- **Teaching language: English + light Egyptian Arabic.** Arabic for the room — and more Arabic
  than feels natural in English prose. Framing, encouragement, corrections and the nudge at the end
  of a step go in light Egyptian dialect: "خلينا نشوف", "واضح كده؟", "برافو",
  "غلط، وهقولك ليه".
  **Technical content stays English**: code, terms (reference, heap, proxy, bean, erasure), the
  step-1 explanation, and the reasoning for *why* something breaks. That is the exact vocabulary
  needed in the interview itself, so it never gets translated.
  Rule of thumb: **Arabic for the room, English for the material.**

- **Never mix Arabic and English in the same line.** A line is either pure Arabic — a short
  standalone phrase, with no English words, no `code`, no backticks, no trailing English
  punctuation — or pure English. Mixed right-to-left lines get visually scrambled in the terminal:
  words and punctuation jump to the wrong end and the sentence becomes unreadable. If a thought
  needs an English term or a code token, write that whole thought in English.

- **A sentence worth memorising is given twice** — the English line, then the Arabic line directly
  underneath it, never on the same line:

  ```
  A HashMap never searches — hashCode picks the bucket, equals picks the entry.
  ‫الهاش ماب مابيدورش، الهاش كود بيختار المكان والإيكوالز بيختار العنصر.‬
  ```

  The Arabic half is transliterated where a term has no natural translation, so the line stays pure
  Arabic. The English half is where the exact terms live — the Arabic is the memory hook, not the
  source of truth.

- **Scratch is information only: no quiz.** Asked for on 2026-10-10, after two batches where the
  quiz came back mostly "I don't know": "just tell me the info in a good way". The goal is to get
  productive on a real React project quickly. Teach the batch, write the cheat sheet, record the
  rows under Scratched with `—` in the Quiz column, and stop. Questions belong to `/learn`.

- **Keep lessons to 20–30 minutes.** Requested on 2026-09-16: five steps, no mandatory real-world
  task, no formal code-review step, and no drilling one detail past two rounds. If a concept will
  not fit, split it into two lessons rather than overrunning.

- **The real-world detour is the exception, not the routine.** Take it only when it clears the bar
  in `core/METHODOLOGY.md`. When it is taken, a lab extract is *illustration* only — a task is never
  modelled on the lab codebase, no lab domain names, no lab-flavoured tickets. Write a
  self-contained task in a neutral domain instead (asked for on 2026-09-01).

- **Symptom-driven exercises land better than TODO-driven ones.** Both in the 01 review and in 02a,
  the starter gave bug reports and no TODOs — the learner had to work out which method each symptom
  came from, and got them all in one attempt. Use that shape.

- **The summary card is step 4, and it is not optional.** Requested on 2026-09-06 so there is
  something to study from between sessions.

- **The interview PDFs in `sources/` take priority.** Added on 2026-09-23 — the learner wants them
  finished first. `state/SOURCES.md` maps every question to a topic and decides what comes next.
  **The PDF also decides the lesson content, not only the topic** (asked for on 2026-09-24). Before
  step 2, open the mapped question in the PDF (`pdftotext -layout`) and build steps 2 and 5 from
  what it actually asks and claims. Anything beyond the PDF is a follow-up, never the core.
