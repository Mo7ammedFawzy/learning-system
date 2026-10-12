# 08b — Maps: the backing structure decides order, cost and null

**Mental model:** A map's backing structure decides everything else: order, cost, and what it does
with `null`.

**Key rule:** `hashCode` picks the bucket, `equals` picks the entry — except in a `TreeMap`, which
calls neither and uses only `compareTo` / the comparator.

| | Backing | Order | `get`/`put` | `null` key | Synchronized |
|---|---|---|---|---|---|
| `HashMap` | buckets; a bucket of 8+ becomes a red-black tree | none promised | O(1) avg, O(log n) worst | one | no |
| `LinkedHashMap` | `HashMap` + linked list through entries | insertion | O(1) avg | one | no |
| `TreeMap` | red-black tree | sorted by key | O(log n) | no | no |
| `Hashtable` | buckets, always chains | none promised | O(1) avg, O(n) worst | no (nor `null` values) | every method |

`HashSet` is a `HashMap` that uses only the keys.

**Classic trap:**

```java
Map<String, Integer> t = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
t.put("Java", 1);  t.put("java", 2);      // size 1, {Java=2}
```

The comparator returned 0, so they are the same key — `equals` was never asked.

**Interview answer (30 s):** `HashMap` is a hash table: O(1) on average, no order, one `null` key,
not thread-safe; since Java 8 a long bucket becomes a tree, so the worst case is O(log n).
`LinkedHashMap` adds insertion order at the same cost. `TreeMap` is a red-black tree: sorted keys,
O(log n), no `null` key. `Hashtable` is the legacy synchronized one, no nulls at all; for
concurrency use `ConcurrentHashMap` instead. `HashSet` is a `HashMap` of keys only.

**My mistake:**
- Swapped the worst cases (`HashMap` O(n), `Hashtable` O(log n)) → only `HashMap` treeifies a
  bucket; `Hashtable` stays a chain, so it is the O(n) one.
- Said no map accepts a `null` key → `HashMap` and `LinkedHashMap` take one (`null` hashes to
  bucket 0); `TreeMap` and `Hashtable` throw `NullPointerException`.
- Drill: opened "the difference is the Big O" and never said "synchronized" → `HashMap` and
  `Hashtable` cost the same on average; the difference is that every `Hashtable` method is
  `synchronized`, and it takes no `null`.
- Warm-up: named `equals` for a lookup that died in `hashCode` → a method that never ran cannot be
  the one that failed.

**Source:** Java SE API, class Javadoc of `java.util.HashMap`.
