# Progress

Maintained by the `/learn` skill. Read at the start of every session, updated after step 5.
Confidence is honest, not encouraging: `solid` / `ok` / `shaky`.

**Current is one line, not a log.** It names the topic and the step in progress, plus anything
needed to resume. Detail about what went wrong belongs under **Weak spots to revisit** when the
topic closes.

**Keep progress lightweight.** Update it only when a lesson closes or a two-round re-test identifies
a weak spot. Record the next topic, confidence, and specific gap; do not turn each lesson into a
task log or require a real-world exercise or formal code review to mark it complete.

**Weak spot line format** (new entries; older ones without `Held` count as `0/2`):
`- **<misconception label>** (topic, date). Why it is wrong. Re-test: <framing>. Held: n/2`
Each lesson's warm-up re-tests one entry; two holds in a row closes it.

## Current

One line per track; a lesson changes only its own track's line.

**java** — Topic: 09 — Iteration, `Comparable`, `Comparator` (SOURCES row 39). Step: not started. (06b — `final`, nested classes — and 08c — `HashMap` resizing and load factor — have no source rows and wait behind the PDFs.)

**react** — Topic: R01 — JSX. Step: not started.

Last review: 2026-09-06 (topic 01).

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

## Weak spots to revisit

- **Defaults to a mutable copy when exposing a collection, to avoid the throw.** Twice now framed
  `UnsupportedOperationException` as a problem to prevent rather than the API refusing a bad caller.
  The safe default for a getter is `List.copyOf`. Re-test by asking for the *recommendation*, not
  the option list.
- **Shallow copy boundary.** `new ArrayList<>(orders)` protects the list, not the orders in it.
  Mutating an element is still visible to the caller. Never volunteered this.
- **Constant variable — the *declarator* condition. Three rounds now, still open.** The method-call
  half has landed (`p.toLowerCase()` and `String.valueOf("HI")` both correctly rejected in the 02a
  drill). The half that keeps failing is the third condition: a constant variable must be initialised
  **in its own declarator**. A blank `static final String t;` assigned in a static block is *not* one,
  and it was ticked as one. Re-test with blank finals specifically, not with method calls — and
  anchor it to the consequence: a constant variable's value is inlined into every class that reads it,
  so changing a library's `VERSION` and recompiling only the library leaves clients on the old value.
- **Answers the adjacent question, not the one asked. Three times now, across two lessons.**
  02a drill: asked *why the unit test is green and production red*, answered with the definition of
  `==` — which the question had explicitly ruled out. 02b step 2: asked why `a + b + c + d` is not
  quadratic, answered "it's literal concatenation" — there are no literals in it. 02b drill: asked
  the flat *"is `+` slow?"*, answered "yes of course" and then described the loop case, which is a
  different question; "yes" commits to rewriting `prefix + "-" + id` by hand. The fact is known
  every time; the question on the table is not the one answered. Re-test with deliberately flat or
  inverted framings — "why does the *wrong* case work?", "is X slow?" — never "what's wrong with
  this?", which hands over the frame.
- **Locates cost in allocation rather than copying.** Both 02b drill answers explained the quadratic
  blowup as "it creates new objects in the heap". Allocation in Java is a bump-pointer in the TLAB and
  the objects die young — 20,000 of them is nothing. The cost is `append(accumulator)` **copying**
  every character built so far, every pass: ~400 million char copies at n=10,000. Re-test by asking
  for the cost of a loop in *characters*, and refuse "objects" as the unit.

- **Cannot produce a count when a count is asked for.** 02b step 2 and its re-test both asked for
  total characters copied across four iterations. First answer was the four resulting strings, second
  was a bare "4". The mechanism was written correctly one question earlier, so this is not a
  knowledge gap — the arithmetic does not come out under a direct request. Two rounds, capped.
  Re-test with a small n and demand the per-iteration line, not the total.

- **Names the wrong method as the one that failed. Two rounds, capped in 03a step 2.** Asked why
  `map.get(t)` returns null after a hashed field was mutated, answered "equals is wrong" twice —
  `equals` is never reached there, the hash sends the probe to an empty bucket. And the mirror case,
  `get(new Tag("java"))`, was called a hit both times: right bucket, but the stored key now disagrees,
  so `equals` is what fails. Re-test by handing a failing lookup and asking **which of the two methods
  was the one that failed, and whether the other one even ran** — never "what's wrong with this?".
  Related: a bucket was described as a slot holding one entry (`HashSet` of two equal-hash items
  answered as size 1). That half closed on the re-test.
  08a warm-up (2026-10-05): held.
  08b warm-up (2026-10-11): not held. Row B right (`equals` fails, same hash). Row A opened with
  "equals, both fail" and then said `equals` won't run: mechanism known, wrong method named
  first. Held: 1/2

- **Calls a broken `equals`/`hashCode` contract "not a bug". 03a drill.** Asked flat "is overriding
  `equals` without `hashCode` a bug?", answered "not a bug, it creates mini buckets", framing a
  correctness failure as a storage detail. It is a bug: equal objects get different identity hashes,
  so a `HashSet` keeps duplicates and `map.get(equalKey)` returns `null`. This happened one step
  after fixing exactly that in `Sku`. Same pattern as the flat "is `+` slow?" in 02b. Re-test flat.
  08a warm-up (2026-10-07): held. Said yes, size 2, different identity hashes so `equals` never
  runs, and gave the fix. Held: 1/2
- **"`equals` compares values" as a blanket rule. 03a drill.** `Object.equals` is `==`. It compares
  values only when the class overrides it. The follow-up "depends on Point's equals" rescued it, but
  the opening line is the one an interviewer writes down.
- **Renaming a hashed key: did not reach remove-then-put unaided. 03a step 3.** First renamed to the
  same name, then `put` the new key and left the old entry orphaned. Needed hints on left-to-right
  argument evaluation, and that a fresh equal key finds the stored entry.

- **`private` interface methods: read as `default`. Two rounds, capped in 04a step 2.** Knew Java 9
  added `private` methods, yet said `(b)` compiles "but I don't know why", then on the re-test called
  `private String wrap(...)` "a default method" and said an implementor can call it. It cannot:
  `private` is visible only inside the interface body; it exists so defaults share a helper without
  leaking it into every implementor's API. Re-test by asking who can call a given interface member.
  Diamond fix syntax closed on the re-test (`A.super.who()` inside the override).
  04a drill: now knows `private` exists and breaks "all methods are public"; "who can call it" was not re-tested.

- **Abstract class vs interface: missed `final` as a reason. 04a drill.** Listed state, constructors
  and visibility, but not that an abstract class can make a template method `final`; an interface
  `default` can always be overridden, so the interface cannot lock its algorithm. Re-test by asking
  how to stop an implementor from overriding `export()`.
  04c warm-up: said `final` (right), but also offered `private`/`static`, which break a public
  template method. Gave the interface reason as "only signatures" rather than "`final` is not allowed
  on an interface method, so a `default` can always be overridden".
  05a warm-up: failed again, offered `static`/`private` and gave "interface methods are public" as
  the reason. Held: 0/2

- **Constructors not inherited: gave the consequence as the reason. 04c drill.** Said "because they
  can't be overridden". That follows from not being inherited; it is not why. If `Employee(String)`
  were inherited, `new Manager("Sara")` would build a `Manager` whose own fields (`reports`) nobody
  initialised. Each class must initialise its own part. "I don't know" after the probe. Re-test by
  asking what an object built through an inherited parent constructor would look like. Held: 0/2
- **"A constructor returns the new instance". 04c drill.** A constructor returns nothing, not even
  `void`. It runs on an object `new` already allocated, and `new` returns the reference. This was
  drawn in step 1. It also answered part two of the question instead of part one (see the
  adjacent-question entry). Re-test flat: "what does a constructor return?" Held: 0/2

- **Reachability: did not answer whether a leaked part is GC-eligible. Two rounds, capped in 04b step 2.**
  `Engine e = new Car().getEngine();` then asked if the `Engine` can be collected, answered "idk".
  It cannot: `e` still references it. The `Car` is collectable and the `Engine` is not, which is
  why a getter turns composition into aggregation. The fix half was right (defensive copy
  `return new Engine(engine)`). Also first said a leaking getter was still composition because
  `new` happened inside. Re-test by asking which object outlives which.
- **Inheritance: is-a is not enough. Two rounds, capped in 04b step 2.** Gave only "use it when
  is-a holds", then "I don't know" for the second condition. `CountingSet extends HashSet` is a
  valid is-a and still counts double. The missing condition is that the parent is **designed and
  documented for extension** (it says which methods call which, as `AbstractList` does), or that
  you own it. Re-test flat: "`X` is a `Y`, so should `X extends Y`?"

- **Wrong reason for a bypassed override. 04b step 3.** Said `ArrayList.addAll` skipped the `add`
  override because of "a different method with return type boolean". It copies the array with
  `System.arraycopy` and never calls `add`. Self-use goes either way (`HashSet` calls it).
- **`final` read as protection. 04b step 3.** Fixed a leaking `public` field by adding `final`.
  `final` freezes the reference, not the object; `cart.list.addAll(...)` still worked.

- **Static hiding explained as "not overridden". Two rounds, capped in 05a step 2.** First called an
  instance method calling a static one a compile error (the restriction runs the other way). On the
  re-test got the output (`prod`) but said the method "only exists in `Config`" while `TestConfig`
  declares its own `env()`. The reason is binding: the compiler turns `env()` inside `Config` into
  `Config.env()`, and a static call is never dispatched. Re-test by asking why the subclass's
  static method was *not* picked.
  05a drill (2026-10-02): asked in that framing, gave the binding reason unaided ("the compiler
  picks the declared type and ignores the actual object"). Not counted as a hold: same sitting as
  the hint table and the card. Did not use the word "hiding".
  05b warm-up: failed. Said `show()` is not overridden so `Config`'s body calls `Config`'s `env()`,
  with no mention of `static` or compile-time binding; then predicted `prod` for the instance
  version too.
  06a warm-up (2026-10-04): not held. Gave the rule's name ("static cannot be overridden") rather
  than the binding, but got the instance version right this time. 06a drill: said "declared type
  `A`" unaided, then on the probe said the choice is made "at runtime, I think" and still did not
  produce the word "hiding". Re-test: ask *when* the choice is made. Held: 0/2
- **`equals(Object)` that casts without a type check. 05a step 3** (05a, 2026-10-02). Wrote
  `Tag tag = (Tag) obj;` then a null check, so `new Tag("java").equals("java")` throws
  `ClassCastException` where the contract wants `false`. Also left `@Override` off `equals` while
  adding it to the other two fixes. Re-test: hand over an `equals` and ask what it returns for a
  `String` argument. Held: 0/2
- **`@Override` read as a marker for the reader. 05a step 2.** It is a compiler check: no overridden
  method, no compile. Closed on the re-test (said adding it to a static method is a compile error).

- **Overload resolution read as declaration order** (05b, 2026-10-03). Three misses: `f(5)` with
  `f(Integer)` and `f(int...)` answered "varargs, closest type"; `g(7)` right but because "an `int`
  is an object"; in the drill `log("x", "y")` answered varargs, then "two" once the declarations
  were swapped, and confirmed "first in the file". Order in the file never matters. The compiler
  runs three phases and stops at the first with a match: exact/widening, then boxing, then varargs.
  And `7` reaches `g(Object)` by boxing to `Integer`; a primitive is never an object. Re-test: swap
  two overloads and ask whether the output changes. Held: 0/2
- **`@Override` left off a real override. 05a and 05b step 3** (05b, 2026-10-03). Knows it is a
  compiler check, does not write it. Rename the parent method and the subclass method silently
  stops overriding. Re-test: hand over a subclass and ask what is missing. Held: 0/2
- **"A call inside a parent method stays in the parent". 05b step 2.** Predicted `prod` for an
  inherited `show()` calling an overridden instance `env()`. Unqualified `env()` is `this.env()`.
  Closed on the re-test and in the exercise.
- **"`private` plus getter and setter is encapsulation". 05b step 2.** Closed on the re-test, the
  exercise and the drill probe (said the setter needs a guard).

- **Class loading and initialisation treated as one thing** (06a, 2026-10-04). Drill probe: asked
  what the first use of `Main` is under `java Main`, answered with a different trigger (a
  non-constant static field read) and "first use means the class needs to load at runtime". The
  launcher initialises the main class before calling `main`; loading alone runs no static code.
  Also said "the compiler initialises statics" in step 2: the JVM does. Re-test flat: "a static
  block runs when the class is loaded — true?" Held: 0/2
- **"Static initialisation re-runs on every use". 06a step 2.** Predicted a second line for a
  second `new`, and `init` twice. Closed on the re-test and in the exercise.
- **"Reading a constant triggers initialisation". 06a step 2.** Closed on the re-test (`MAX`
  inlined, `MIN = Integer.parseInt("1")` not). The blank-final half of the constant-variable entry
  above was not re-tested in isolation.

- **"`LinkedList` inserts in the middle in O(1)"** (08a, 2026-10-07). Drill: answered O(1) for
  `linkedList.add(500_000, x)`, and again after a probe that drew the walk. The link itself is
  O(1), reaching the node is an O(n) walk, so the call is O(n). O(1) holds only at the two ends or
  at an iterator already standing there. Also gave O(1) for the `ArrayList` middle insert one line
  after writing that it is O(n); corrected on the probe. Re-test: ask what `add(i, x)` does
  *before* it links the node. Held: 0/2
- **Gives "slower" where a Big O is asked** (08a, 2026-10-07). Constant `hashCode`: said all keys
  share one bucket and it gets slower, no complexity. It is O(log n) once the bucket treeifies
  (O(n) before Java 8, or under 8 entries). Same family as the count entry above. Re-test: demand
  the O-term, refuse an adjective. Held: 0/2
  08b (2026-10-12): gave O-terms when asked, values swapped at first (see below), then O(log n)
  with the tree reason in the re-test and the drill. Same sitting, not counted as a hold.
- **`LinkedHashSet` read as a `LinkedList`; `HashSet` order called known** (08a, 2026-10-05, step
  2). "Linked" buys insertion order on a hash table, not list costs; `HashSet` promises no order.
  Not re-tested since. The capped "`contains` walks the links" closed in the drill ("searches the
  bucket, not the index"). Re-test: ask the cost of `contains` on a `LinkedHashSet`. Held: 0/2

- **`HashMap` vs `Hashtable`: never says "synchronized"** (08b, 2026-10-12). Drill: opened "the
  difference is the Big O", and said "I don't know how `Hashtable` stores". Probed directly for what
  `Hashtable` does on every method call that `HashMap` does not, answered storage and Big O again.
  The difference is that every `Hashtable` method is `synchronized` (and it takes no `null`); the
  average cost is the same O(1). Same family as the adjacent-question entry. Re-test flat: "why is
  `Hashtable` slower than `HashMap`?" Held: 0/2
- **Treeification given to `Hashtable`** (08b, 2026-10-12, step 2). Said `HashMap` is O(n) and
  `Hashtable` O(log n) under a constant `hashCode`. Only `HashMap` turns a long bucket into a tree.
  Closed on the re-test and stated unaided in the drill.
- **"No map accepts a `null` key". 08b step 2.** `HashMap` and `LinkedHashMap` take one. Closed on
  the re-test and in the exercise.

- **"Mutate it, then call the setter with it"** (R05/R02 scratch, 2026-10-10). Asked to predict a
  component that multiplies `item.price` in its body, proposed `item.price = …; setItem(item)` as
  the fix. Same reference, so React skips the render, and a child has no setter for a prop anyway.
  The fix is a calculation during render, or a callback prop and a copy in the parent. Re-test:
  hand over a mutate-then-set and ask whether the screen updates. Held: 0/2
  Practice task (2026-10-10, after the scratch): fixed sort, the prop mutation and the controlled
  input unaided, but the nested update took two attempts (`find` + `qty++` + same array, then
  `[...items]` with the object still shared) and then the solution. `map` + spread on the matching
  element was copied, not reached. Derived `status` also needed the solution.
- **Does not know `sort` mutates and returns the same array** (R05 scratch, 2026-10-10). "I don't
  know" on `setTodos(todos.sort(byDate))`. Same reference in, same reference out, no render; use
  `toSorted` or sort a copy. Re-test: ask which array methods are safe to pass straight to a
  setter (`map`/`filter` yes, `sort`/`reverse`/`push`/`splice` no). Held: 0/2
- **State per instance never stated** (R03 scratch, 2026-10-10). Two `<Counter />` side by side,
  asked what the *second* shows after three clicks on the first, answered that the counter
  increases three times. The second shows 0: each instance has its own state. Re-test: same
  snippet, ask for both numbers. Held: 0/2
- **Drops one half of a two-part question** (R01/R04/R06 scratch, 2026-10-10). Three times in one
  quiz: gave the screen value but not the log (`0`); explained `onClick={save()}` but not the
  input (`value` without `onChange` is read-only); found two JSX problems of three (`class`).
  Same family as the adjacent-question entry. Re-test: two-part questions, and refuse a one-part
  answer. Held: 0/2

- **Stores a derived value in state and syncs it by hand** (R09 scratch, 2026-10-10). Twice in one
  day: the cart's `status` string, then a `total` beside `items`, fixed by adding a second
  `setTotal` in `remove` rather than deleting the state. Anything computable from state is a plain
  expression in render, React's `computed`. Re-test: hand over two states and ask which one should
  not exist. Held: 0/2
- **"A context consumer re-renders only for the field it reads"** (R11 scratch, 2026-10-10). That is
  Vue's injected ref. A context consumer re-renders whenever the provided value changes, whatever
  it destructures. Re-test: one context with two fields, ask who re-renders. Held: 0/2

- **Answers arrive without reasoning.** Four times in 02a step 2, and again in the drill: Q2b asked
  for a reason for each of five items, including the unticked ones, and got one line. The gap is not
  knowledge — it is articulation, which is exactly what an interview grades. Always ask for the
  reason, and do not accept the answer alone.
- Closed on 2026-09-06: pass-by-value vs pass-by-reference; copy vs live view (the two axes now
  drive the choice); `Integer` cache; unboxing NPE and `getOrDefault`; rebinding a parameter.

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
