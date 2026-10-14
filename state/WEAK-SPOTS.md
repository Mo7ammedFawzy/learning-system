# Weak spots to revisit

Named misconceptions, split out of `state/PROGRESS.md` so session start stays cheap. Read only at
the session-opener warm-up, in a `review` session, and at close — never at session start.

**Line format** (new entries; older ones without `Held` count as `0/2`):
`- **<misconception label>** (topic, date). Why it is wrong. Re-test: <framing>. Held: n/2`
Each lesson's warm-up re-tests one entry; two holds in a row closes it.


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

- **"A sorted set keeps elements that compare as zero". Two rounds, capped in 09a step 2**
  (09a, 2026-10-13). `TreeSet` with `CASE_INSENSITIVE_ORDER` and three spellings of "java" answered
  size 3; re-test with `comparingInt(String::length)` and `fig`/`kiwi`/`pea` answered `3 fig pea
  kiwi`, ties "kept in insertion order". Named `compare` as the deciding method both times and did
  not apply its zero: a `TreeSet`/`TreeMap` never calls `equals`, zero means "already here" and the
  add is dropped (`2 [fig, kiwi]`). Insertion-order ties are `List.sort` stability, not a set.
  Re-test: hand over a `TreeSet` with a one-key comparator and ask for the size. Held: 0/2
- **Subtraction comparator: overflow not seen. Two rounds, capped in 09a step 2** (09a,
  2026-10-13). `x.balance() - y.balance()` on ±2 billion: first said the comparator returns 0, then
  on the re-test "it won't sort", with no list and no sign though both were asked for. The
  difference (±4 billion) does not fit an `int`, wraps, and comes back with the opposite sign, so
  the sort runs and gives the reverse order. Fix is `Integer.compare(x, y)`; first offered
  `comparingInt(Account::id)` on a `String` key. Re-test: ask for the sign of `x - y` at the two
  extremes. Held: 0/2
- **`compareTo` and `compare` swapped** (09a, 2026-10-14). Drill: gave `Comparable` the method
  `compare` and `Comparator` the method `compareTo(o1, o2)`; probed with the blank in
  `implements Comparable<Product>`, wrote `compare(Product other)`. Then said a `TreeSet` built on
  `comparingInt` called `compareTo`, on a record that implements nothing. Wrote both correctly in
  the step-3 code, so the gap is naming, which is what the interviewer hears. `Comparable` →
  `compareTo(T other)`, one argument, because `this` is the other side. `Comparator` →
  `compare(T a, T b)`, two, because it is neither object. Re-test flat: "a `TreeSet` with a
  comparator: which method does it call, on which object?" Held: 0/2

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

