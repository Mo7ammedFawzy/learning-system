# Interview bank — Java + Spring Boot

Questions for the interview drill (step 5), keyed to `core/java/CURRICULUM.md` topic numbers. Each entry is written as the
interviewer sees it:

- **Q** — the question as asked
- **Shallow** — the answer that sounds right, is technically true, and does not get the job
- **Passes** — what a strong candidate says
- **Then** — the follow-up, because the real signal is in the second question

Ask the questions first and wait for answers. Only then reveal Shallow/Passes/Then. Which question
opens, and whether a probe comes before the reveal, adapts to the learner — see step 5 in
`core/METHODOLOGY.md`. This file is a
starting set, not a ceiling — generate more in the same shape when a topic needs deeper drilling,
and add any question the user is asked in a real interview.

---

## 01 — Types and references

**Q.** Is Java pass-by-value or pass-by-reference?
- *Shallow:* "Pass-by-reference for objects, pass-by-value for primitives."
- *Passes:* Always pass-by-value. For objects the *reference* is copied by value — so mutating the
  object through it is visible to the caller, but reassigning the parameter is not.
- *Then:* "Write a `swap(a, b)` that works." (It cannot, for immutables — that is the point.)

**Q.** `Integer a = 127, b = 127; a == b`? And with 128?
- *Shallow:* "True, because they're equal."
- *Passes:* `true` then `false`. `Integer.valueOf` caches −128..127, so the small values are the same
  object. Above the cache, two distinct objects, and `==` compares references.
- *Then:* "So when is `==` on boxed types ever correct?" (Essentially never — use `equals`.)

## 02 — Strings

**Q.** Why is `String` immutable?
- *Shallow:* "So it's thread-safe" — or reciting "because it's `final`", which is a consequence, not a reason.
- *Passes:* Names what immutability buys: the pool can share one object across the whole JVM safely;
  the hash code can be cached, making strings cheap and stable `HashMap` keys; no synchronisation is
  ever needed; and a validated value (file path, class name, SQL fragment) cannot be changed between
  the check and the use.
- *Then:* "What would break in a `HashMap` if a key string were mutated after insertion?" (The entry
  is stored with the hash computed at `put` time, so the mutated key hashes elsewhere — the entry is
  unreachable by either the old or the new text.)

**Q.** `String a = "hi"; String b = new String("hi");` — how many objects, and what is `a == b`?
- *Shallow:* "One in the pool and one in the heap" — said as if the pool were outside the heap.
- *Passes:* Two `String` objects: the literal, interned when it is first resolved, plus the one `new`
  allocates. `a == b` is `false`; `a == b.intern()` is `true`. The pool has lived in the heap since
  Java 7, so heap-vs-pool is not the distinction — pooled-vs-not is.
- *Then:* "When is `==` on strings ever the correct thing to write?" (Only when identity is genuinely
  what you mean, which is almost never. `intern()` plus `==` is not a fix, it just relocates the bug.)

**Q.** A comparison written with `==` passes every unit test and fails in production. How?
- *Shallow:* "Strings should be compared with `equals`" — true, but it does not explain the asymmetry.
- *Passes:* The test passes a literal, which is the same pooled object as the constant, so `==` holds.
  Production input is built at runtime — parsed, concatenated, read from a request — so it is a
  different object with the same characters. Bonus signal: methods like `toLowerCase` and `trim`
  return `this` when there is nothing to change, so a literal can survive "normalisation" still
  pooled, which is what makes the green test so convincing.
- *Then:* "Which `final` variables are folded into the pool at compile time?" (Only constant
  variables: `final` **and** initialised with a constant expression. A method call or `new` on the
  right-hand side makes it a runtime value.)

**Q.** What does `String.intern()` do, and when would you use it?
- *Shallow:* "It puts the string in the pool so you can compare with `==`."
- *Passes:* It returns the canonical pooled instance for that text. Legitimate use is memory: a few
  distinct values repeated across millions of records. It is not a comparison strategy — correctness
  would then depend on every future caller remembering to intern.
- *Then:* "What is wrong with `synchronized (key.intern())` as a per-key lock?" (The pool is
  JVM-wide, so unrelated code — a library, the framework — that interns the same text takes the same
  monitor. Keep locks in a private map instead.)

**Q.** Is string concatenation with `+` slow in Java?
- *Shallow:* "Yes" — which commits you to rewriting `prefix + "-" + id` by hand, and the next thing
  on the screen will be exactly that line. "No, it is fine" is the same failure facing the other way.
- *Passes:* Answers "where?". A single expression compiles to one builder and copies each character
  once — already optimal, leave it. A loop is one expression *per iteration*, so each pass re-copies
  the accumulated string: `n²/2` character copies instead of `n`. That is when the builder is
  hoisted out of the loop. On Java 9+ `+` lowers to `invokedynamic`/`StringConcatFactory` rather
  than a literal `StringBuilder`, but the shape is unchanged.
- *Then:* "How many iterations before you would care?" (Thousands. n=1,000 is ~1.5 MB of copying,
  under a millisecond; n=100,000 is ~15 GB. Scale n, not the timer.)

**Q.** A colleague "fixes" a slow report with
`sb = new StringBuilder(sb).append(row).append("
");` inside the loop. Is it fixed?
- *Shallow:* "Yes, it uses `StringBuilder` now." Also shallow in the other direction: "no, because
  it allocates an object every iteration" — allocation is cheap and is not the problem.
- *Passes:* Not fixed — the same bug in a `StringBuilder` costume. `new StringBuilder(sb)` **copies
  the entire buffer** into a fresh one before appending, so every iteration still pays for everything
  before it. The point of `StringBuilder` is not the type, it is that **one** buffer survives the
  loop. Drop the reassignment.
- *Then:* "Any reason to pre-size it?" (Yes — `new StringBuilder(expected)` skips the doubling
  reallocations when the output size can be estimated. Default capacity is 16.)

## 03 — equals and hashCode

**Q.** Why must `equals` and `hashCode` be overridden together?
- *Shallow:* "Because it's the convention / good practice."
- *Passes:* Hash-based collections locate by bucket first. Two objects equal by `equals` but with
  different hash codes land in different buckets, so `map.get(key)` misses a key that is present.
  The object becomes unfindable in a `HashMap` and duplicable in a `HashSet`.
- *Then:* "What happens if you mutate a field used in `hashCode` after inserting into a `HashSet`?"
  (The object is lost — it hashes to a bucket it is not in.)

**Q.** `instanceof` or `getClass()` in `equals`?
- *Shallow:* "`instanceof`, it's cleaner."
- *Passes:* `instanceof` permits subclasses and can break symmetry (`a.equals(b)` true,
  `b.equals(a)` false); `getClass()` guarantees symmetry but breaks Liskov substitution. The real
  answer is to make the class `final`, or use composition, and cite Bloch's item on it.
- *Then:* "Which does `AbstractList` use, and why can it get away with it?"

## 05 — Polymorphism and dispatch

**Q.** Can a static method be overridden?
- *Shallow:* "No, because static belongs to the class" — true, and it does not explain why
  `parentRef.staticMethod()` on a subclass object runs the parent's version.
- *Passes:* No, it is *hidden*. A static call is bound by the compiler to the declared type of the
  reference and is never dispatched, so the object's real class is not consulted at all.
- *Then:* "What happens if you put `@Override` on the subclass's static method?" (Compile error —
  there is nothing to override. Same if an instance method tries to override a static one.)

**Q.** `print(Object)` and `print(String)` both exist. `Object o = "hi"; print(o);` — which runs?
- *Shallow:* "`print(String)`, because it's really a String" — or the bare definition "overloading
  is compile time" with no prediction.
- *Passes:* `print(Object)`. The compiler chooses among overloads from the *declared* type of the
  argument and writes that choice into the bytecode; the runtime type of the argument is never used.
- *Then:* "How do you make the behaviour follow the runtime type?" (Move it into an instance method
  overridden on the receiver — or cast, which only moves the decision to whoever writes the cast.)

**Q.** What are the four OOP concepts?
- *Shallow:* Four names, with encapsulation defined as "private fields with getters and setters".
- *Passes:* Encapsulation: state is private and the class enforces its own rules on every change.
  Abstraction: callers see what, not how. Inheritance: a subclass reuses a parent. Polymorphism: one
  call site runs different bodies, because the JVM picks an overridden method from the object's
  actual class at runtime.
- *Then:* "Is a class with a private field and a plain `setX` encapsulated?" (No — an unchecked
  setter is a public field with extra typing. The class must guard the invariant.)

**Q.** `log(String...)` and `log(String, String)` both exist. Which does `log("x", "y")` run?
- *Shallow:* "The varargs one, it matches first" — or anything that depends on declaration order.
- *Passes:* `log(String, String)`. Resolution runs in three phases and stops at the first that finds
  a match: exact or widening, then boxing, then varargs. Varargs is the last resort, and the order
  of the methods in the file is irrelevant. A varargs parameter is an array the compiler builds.
- *Then:* "What is `Arrays.asList(new int[]{1, 2, 3}).size()`?" (1 — an `int[]` is one object, so it
  becomes a single element of a `List<int[]>`.)

## 06 — Access, static, final

**Q.** How do you run code before `main`, and when exactly does it run?
- *Shallow:* "A static block, it runs when the class is loaded."
- *Passes:* A static block or a static field initialiser. They run at class *initialisation*, which
  the JVM does once, on the first active use — `new`, a static method call, a non-constant static
  field access, or being the class the launcher starts. Loading alone runs nothing.
- *Then:* "Two static fields and a static block: in what order?" (Defaults first, then textual
  order, top to bottom — so a singleton built on line 1 sees the default of a field on line 2.)

**Q.** Does reading a `static final` field initialise its class?
- *Shallow:* "Yes, any static access does."
- *Passes:* Not if it is a constant variable — a `static final` primitive or `String` initialised in
  its declarator with a constant expression. The compiler inlines the value into the caller, so the
  class is never touched. A blank `static final` assigned in a static block is not one.
- *Then:* "What does inlining cost you?" (Change the constant, recompile only the library, and
  clients keep the old value.)

## 07 — Generics

**Q.** What is type erasure, and what does it cost you?
- *Shallow:* "The compiler removes the generic types at runtime."
- *Passes:* Type parameters are erased to their bound (`Object` if unbounded) after compile-time
  checking. Consequences: no `new T[]`, no `instanceof List<String>`, no overloading on
  `List<String>` vs `List<Integer>` (same erasure), and unchecked-cast warnings when going the other
  way. Bridge methods are synthesised to preserve polymorphism.
- *Then:* "Then how does `Collections.emptyList()` return the right type?" (Inference at the call
  site; the object itself is untyped.)

**Q.** Explain PECS.
- *Shallow:* "Producer extends, consumer super."
- *Passes:* The mnemonic *plus* why: `? extends T` lets you read `T` but not write (the actual type
  could be narrower); `? super T` lets you write `T` but reads come back as `Object`. So a parameter
  you only read from is `extends`, one you only write into is `super`.
- *Then:* "Why is `Collections.copy(dest, src)` declared `List<? super T> dest, List<? extends T> src`?"

## 08 — Collections

**Q.** How does `HashMap` work internally?
- *Shallow:* "It uses hashing to store key-value pairs."
- *Passes:* Array of buckets; `hash(key)` spread and masked to an index; collisions chain in a
  linked list that becomes a red-black tree past a threshold (8, with capacity ≥ 64); resizes at
  load factor 0.75 by doubling and rehashing. Get is O(1) amortised, O(log n) in a treeified bucket.
- *Then:* "What happens with a deliberately bad `hashCode` returning a constant?" (Everything in one
  bucket — degrades to O(log n) after treeification, and was O(n) before Java 8. A DoS vector.)

**Q.** `ArrayList` or `LinkedList`?
- *Shallow:* "`LinkedList` for lots of insertions, `ArrayList` for random access."
- *Passes:* Almost always `ArrayList`. `LinkedList`'s theoretical O(1) insert requires you to
  already hold the node; reaching it is O(n), and its cache locality is terrible, so it loses in
  practice at nearly every size. `LinkedList` is defensible mainly as a `Deque`.
- *Then:* "When did you last legitimately use a `LinkedList`?"

## 09 — Iteration, Comparable, Comparator

**Q.** What is the difference between `Comparable` and `Comparator`?
- *Shallow:* "`Comparable` has `compareTo`, `Comparator` has `compare`."
- *Passes:* `Comparable` is implemented by the class itself and defines its one natural order;
  `Comparator` is a separate object, so a class can have many orders and you can order a class you
  do not own. Natural order for the single obvious ordering, a `Comparator` (`comparing`,
  `thenComparing`) for every other one.
- *Then:* "You need `String`s sorted by length — which one, and why not the other?" (`Comparator`:
  `String` already has its natural order and is not yours to edit.)

**Q.** Can a `TreeSet` ordered by price hold two different products with the same price?
- *Shallow:* "Yes, they are different objects, `equals` is false."
- *Passes:* No. A `TreeSet` never calls `equals`; a comparison of zero means "already present" and
  the second add is dropped silently. The ordering must be consistent with `equals`, so add a
  tie-breaker with `thenComparing` until zero means truly equal.
- *Then:* "Why is `(a, b) -> a.price() - b.price()` a bug?" (The difference can overflow `int` and
  flip sign; use `Integer.compare` or `comparingInt`.)

## 10 — Streams

**Q.** What does laziness mean in a stream pipeline?
- *Shallow:* "It doesn't evaluate until you need it."
- *Passes:* Intermediate operations only build the pipeline; nothing runs until a terminal operation.
  Then elements are pulled one at a time through the whole chain, which is why `filter` before `map`
  matters and why short-circuiting (`findFirst`, `anyMatch`, `limit`) can avoid touching most of the
  source.
- *Then:* "What does a stream with no terminal operation do?" (Nothing at all.)

**Q.** When should you *not* use a stream?
- *Shallow:* "When the collection is small."
- *Passes:* When you need to mutate the source, when you need an index, when checked exceptions are
  involved, when the loop needs to `break` in a way short-circuiting cannot express, and when the
  stream version is simply harder to read. Also: `parallelStream` on small or IO-bound work is
  usually slower and shares the common `ForkJoinPool`.
- *Then:* "What is wrong with a `forEach` that adds to an `ArrayList` in parallel?"

## 11 — Optional and null

**Q.** What is `Optional` for?
- *Shallow:* "To avoid `NullPointerException`."
- *Passes:* To make "possibly absent" explicit in a **return type**, so the caller cannot ignore it.
  It is not a general null replacement: not for fields (not serialisable, adds allocation), not for
  parameters (the caller can just pass null, and now you have two absent states).
- *Then:* "What is wrong with `if (o.isPresent()) return o.get();`?" (It is the null check with more
  ceremony — use `map`/`orElse`/`orElseThrow`.)

*Lab tie-in:* some codebases do not use `Optional` at all. If the active lab profile names a
house null-checking utility, teach that contrast here. Be ready to explain both, and why a large legacy codebase might rationally
choose a null-checking utility over retrofitting `Optional`.

## 12 — Exceptions

**Q.** Checked or unchecked for a new API?
- *Shallow:* "Unchecked, checked exceptions are bad."
- *Passes:* Checked when the caller can plausibly recover and you want to force the decision;
  unchecked for programming errors and unrecoverable conditions. Note the practical drift: modern
  APIs, streams and lambdas all push toward unchecked, and Spring converts SQL exceptions to an
  unchecked hierarchy deliberately.
- *Then:* "Why did Spring wrap `SQLException` in `DataAccessException`?"

**Q.** What does try-with-resources actually generate?
- *Shallow:* "It closes the resource automatically."
- *Passes:* A `finally` that calls `close()` in reverse declaration order, plus suppressed-exception
  handling — if the body throws and `close` also throws, the close exception is attached via
  `addSuppressed` rather than replacing the original. Hand-written `finally` blocks usually lose
  the original exception.
- *Then:* "Which one do you see in the stack trace, and where is the other?"

## 15 — Testing

**Q.** What is worth mocking?
- *Shallow:* "Everything the class depends on."
- *Passes:* Mock what is slow, non-deterministic, or outside your control — network, clock, external
  services. Do not mock value objects or the type under test, and be wary of mocking types you do
  not own, since the mock encodes your *belief* about their behaviour. Over-mocking produces tests
  that pass while production breaks.
- *Then:* "What is the difference between a stub and a mock, and which does an assertion belong on?"

**Q.** `@SpringBootTest` or a slice test?
- *Passes:* Slice (`@WebMvcTest`, `@DataJpaTest`) whenever it suffices — it boots a fraction of the
  context and runs in a fraction of the time. Reserve full `@SpringBootTest` for wiring and
  end-to-end checks. Note that context caching across test classes matters enormously, and that a
  `@MockBean` in one class fragments that cache.
- *Then:* "Why did adding one `@MockBean` make the whole suite slower?"

## 18–22 — SQL and persistence

**Q.** What is `LazyInitializationException` and how do you fix it?
- *Shallow:* "Make the relationship eager."
- *Passes:* A lazy proxy was touched after the persistence context closed — typically in a
  controller or a serialiser, outside the transaction. Fixes in order of preference: fetch what you
  need inside the transaction (fetch join or entity graph), or map to a DTO before returning.
  Switching to `EAGER` fixes the symptom and creates an N+1 everywhere else.
- *Then:* "Why is `open-session-in-view` a bad default?" (It hides the problem and holds a
  connection for the whole request.)

**Q.** Propagation `REQUIRED` vs `REQUIRES_NEW`?
- *Passes:* `REQUIRED` joins the caller's transaction, so a rollback anywhere rolls back everything.
  `REQUIRES_NEW` suspends it and starts an independent one — used for audit or logging writes that
  must survive the caller's rollback. It costs a second connection and can deadlock against the
  suspended transaction.
- *Then:* "Default rollback rule?" (Unchecked exceptions and `Error` roll back; **checked
  exceptions do not**, unless `rollbackFor` says so. This one catches nearly everybody.)

**Q.** How do you detect and fix N+1?
- *Passes:* Turn on SQL logging or statistics and look for one query followed by *n*; it comes from
  lazy associations touched in a loop. Fix with a fetch join, an entity graph, or batch fetching —
  and verify by counting queries, not by eyeballing.
- *Then:* "What happens if you fetch-join two collections in one query?" (Cartesian product; use
  `distinct`, batching, or separate queries.)

## 23–27 — Spring core

**Q.** Constructor injection or field injection?
- *Shallow:* "Constructor injection, it's recommended."
- *Passes:* Constructor injection makes dependencies explicit and mandatory, allows `final` fields,
  makes the class instantiable in a plain unit test without a container, and surfaces circular
  dependencies at startup instead of hiding them. Field injection needs reflection to test and lets
  a class accumulate dependencies invisibly.
- *Then:* "What does Spring do with a circular dependency under constructor injection?" (Fails fast
  — and that is the feature.)

**Q.** Default bean scope, and when is it wrong?
- *Shallow:* "Singleton."
- *Passes:* Singleton per container. It is wrong the moment the bean holds mutable per-request
  state — that state is then shared across every thread. This is the most common Spring bug in
  interviews: an instance field on a `@Service`.
- *Then:* "How do you inject a prototype bean into a singleton correctly?" (`ObjectProvider`, lookup
  method, or scoped proxy — not plain injection, which resolves once.)

**Q.** Why does `@Transactional` sometimes do nothing?
- *Shallow:* "The method isn't public."
- *Passes:* Two reasons, and both are proxy consequences. Self-invocation: calling the annotated
  method from another method of the same class goes through `this`, not the proxy, so no advice
  runs. And non-public methods are not advised by the default proxy strategy. The fix is to move
  the method to another bean, self-inject, or use AspectJ weaving.
- *Then:* "JDK proxy or CGLIB — and which does Boot default to?" (CGLIB by default since Boot 2, so
  the class must be non-final with a usable constructor.)

## 30–32 — Spring Boot and web

**Q.** What does `@SpringBootApplication` do?
- *Shallow:* "It marks the main class."
- *Passes:* It composes `@Configuration`, `@ComponentScan` (from the annotated class's package
  down — which is why placement matters), and `@EnableAutoConfiguration`, which loads conditional
  configuration classes registered in `META-INF/spring/...AutoConfiguration.imports` and backs off
  wherever you have defined your own bean.
- *Then:* "How do you find out why a bean you expected is missing?" (The auto-configuration report:
  `--debug`, or the `ConditionEvaluationReport`.)

## 37–40 — Concurrency

**Q.** What does `volatile` guarantee, and what does it not?
- *Shallow:* "It makes the variable thread-safe."
- *Passes:* Visibility and ordering — a write is visible to subsequent reads, and it establishes
  happens-before. It does **not** give atomicity: `count++` is read-modify-write and still races.
  Use it for flags and for the double-checked-locking instance field.
- *Then:* "Make a thread-safe counter without `synchronized`." (`AtomicInteger`, CAS.)

**Q.** Why is double-checked locking broken without `volatile`?
- *Shallow:* "Because of caching."
- *Passes:* The constructor's writes can be reordered with the assignment of the reference, so
  another thread can observe a non-null but partially constructed object. `volatile` on the field
  forbids that reordering — correctly, only since the Java 5 memory model.
- *Then:* "What would you use instead in new code?" (Holder idiom, or an enum singleton.)

**Q.** How do you size a thread pool?
- *Shallow:* "Number of cores."
- *Passes:* CPU-bound: roughly cores + 1. IO-bound: cores × (1 + wait/service time) — much larger.
  Then the questions that matter more than the number: what queue, bounded or not, and what
  rejection policy. An unbounded queue turns backpressure into an `OutOfMemoryError`.
- *Then:* "What does `Executors.newFixedThreadPool` use for its queue?" (Unbounded `LinkedBlockingQueue`
  — which is why production code builds its own `ThreadPoolExecutor`.)

**Q.** How would you diagnose a deadlock in production?
- *Passes:* Thread dump (`jstack`, or `kill -3`); the JVM detects and prints Java-lock deadlocks
  explicitly. Look for threads `BLOCKED` on a monitor held by another blocked thread, in a cycle.
  Fix by imposing a global lock ordering, or by using `tryLock` with a timeout.
- *Then:* "Which deadlocks will a thread dump *not* find?" (Lock-ordering across `ReentrantLock`
  is found; database deadlocks and semaphore/latch cycles are not.)

