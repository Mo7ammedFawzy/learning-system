# 10a — Lambdas, functional interfaces, method references

**Mental model:** a lambda is the body of the one abstract method of a functional interface. The
target type decides which method it is and what its parameters mean.

**Key rule:** a lambda can read a local only if that local is *effectively final*, meaning it is
never reassigned. It captures the value, not the variable.

| Method reference | Same as | Example |
|---|---|---|
| `Type::staticMethod` | `(a) -> Type.staticMethod(a)` | `Integer::parseInt` |
| `obj::method` | `(a) -> obj.method(a)` | `System.out::println` |
| `Type::instanceMethod` | `(a, b) -> a.method(b)` (first arg is the receiver) | `String::startsWith` |
| `Type::new` | `() -> new Type()` | `ArrayList::new` |

**Classic trap:** a `Supplier` that hands back one shared object.

```java
static final List<Book> EMPTY = new ArrayList<>();
Supplier<List<Book>> cart = () -> EMPTY;     // every get() returns the SAME list
Supplier<List<Book>> fixed = ArrayList::new; // new runs inside, so each get() builds a fresh list
```

**Interview answer (30 s):** a functional interface has exactly one abstract method, and a lambda
or method reference is a short way to implement it. The compiler uses the target type to infer the
parameter types. Captured locals must be effectively final because the lambda copies their value
and may run later, on another thread. Mutable state belongs in a field or a return value, not in a
reassigned local.

**My mistake:** forgot that `Comparable` uses `compareTo(T other)` (one arg, `this` is the left
side) for the third time, and said `String::compare`. Also, in R2 I flagged the loop line instead
of the line where the lambda reads `total`, and gave no fix (fix: copy it into a never-reassigned
local). Exercise C: had `() -> EMPTY` return a shared list → `ArrayList::new` makes a new one on
each call.

**Source:** JLS §15.27 (lambda expressions), §15.13 (method references); the `java.util.function` Javadoc.
