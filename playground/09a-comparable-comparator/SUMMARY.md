# 09a — Comparable vs Comparator

**Mental model:** sorting asks "which of these two comes first?" — `Comparable` answers from inside
the class (one natural order), `Comparator` answers from a separate object (any number of orders).

**Key rule:** negative → first argument first, zero → tie, positive → second first.

| | `Comparable<T>` | `Comparator<T>` |
|---|---|---|
| Method | `compareTo(T other)` | `compare(T a, T b)` |
| Lives in | the class being sorted | outside it |
| How many | one per class | unlimited |
| Needs the source | yes | no (`String`, library classes) |

**Classic trap:** a sorted collection treats zero as "the same element" and never calls `equals`.

```java
Set<String> s = new TreeSet<>(Comparator.comparingInt(String::length));
s.add("fig"); s.add("kiwi"); s.add("pea");   // 2 [fig, kiwi] — "pea" compares 0 with "fig", dropped
```

Fix: add a tie-breaker, `.thenComparing(...)`, until zero means truly equal.

**Interview answer (30 s):** `Comparable` is implemented by the class itself and defines its single
natural order through `compareTo`; `Comparator` is a separate object with `compare(a, b)`, so one
class can have many orders and I can sort classes I do not own. I use `Comparable` for the one
obvious order and a `Comparator` for everything else, built with `comparing` and `thenComparing`.
In a `TreeSet` or `TreeMap` the comparison, not `equals`, decides what a duplicate is.

**My mistake:** said a `TreeSet` keeps elements that compare as zero (twice) → zero means "already
here", the add is dropped. And read `x - y` on ±2 billion as zero, then as "won't sort" → the
difference overflows `int`, the sign flips, the order comes out reversed; use `Integer.compare`.
Then swapped the method names in the drill → `Comparable.compareTo(other)` takes one argument
(`this` is the other side); `Comparator.compare(a, b)` takes two (it is neither object). A `TreeSet`
with a comparator calls `comparator.compare`, never the element's `compareTo`.

**Source:** Javadoc of `java.lang.Comparable` — natural ordering *consistent with equals*.
