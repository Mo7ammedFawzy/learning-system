# Curriculum — Java + Spring Boot to interview strength

**ID prefix: none.** Topics are bare numbers, `01`, `02`, …

Ordered **Java first**: the language before any framework, because Spring questions in interviews
bottom out in Java, and a candidate strong in Java can reason about a framework they have not
memorised. The reverse is not true.

After the language come the things a working developer touches daily — testing, then SQL and
persistence, then Spring. The JVM and concurrency deep-dive sits late by design: it is the hardest
material here and the weakest prerequisite for everything else, so it should not gate progress
through the rest.

Work top to bottom by default — **row order, not number order**: topics added later take the next
free number but sit in the row where they belong. Jumping is allowed — `/learn <topic>` goes straight there — but if a
topic's prerequisites are unmet the lesson says so first. Where this ordering deliberately places a
topic ahead of something it leans on, the row carries an explicit *prereq* note.

Codebase anchors for each topic live in the active lab profile, if there is one. Where a topic has
existing repo documentation, it is named here and becomes the assigned reading for step 1.

Legend: **★** asked in almost every interview · **☆** asked at senior level

---

## Track A — Java core

| # | Topic | Objective |
|---|---|---|
| 01 | Types, values and references ★ | Primitives vs references, what `=` copies, pass-by-value for object references, autoboxing and the integer cache |
| 02 | Strings ★ | Immutability and why, the string pool, `==` vs `equals`, `StringBuilder`, when concatenation in a loop actually costs |
| 03 | equals and hashCode ★ | The contract in full, why breaking it silently corrupts a `HashMap`, inheritance and symmetry, `instanceof` vs `getClass()` |

## Track B — OOP and collections

| # | Topic | Objective |
|---|---|---|
| 04 | Classes, interfaces, abstraction ★ | Abstract class vs interface, default and static interface methods, when a base class earns its place, composition over inheritance, constructors — the default one, why they are not inherited, why they cannot be `final`, `static` or `abstract` |
| 05 | Polymorphism and dispatch | Overriding vs overloading, dynamic dispatch, why overload resolution is a compile-time decision, covariant returns |
| 06 | Access, static, final | Encapsulation, static initialisation order, `final` on fields/params/classes, static nested vs inner classes and the hidden outer reference |
| 07 | Generics and erasure ★ | Type parameters, bounded types, PECS and wildcards, what erasure removes, why you cannot create a generic array, bridge methods |
| 08 | Collections ★ | The `List`/`Set`/`Map`/`Queue` landscape, `ArrayList` vs `LinkedList` for real, `HashMap` internals and resizing, `TreeMap` ordering, choosing under pressure |
| 09 | Iteration, Comparable, Comparator | Sorting contracts, comparator chaining, `ConcurrentModificationException` and fail-fast iterators |

## Track C — Modern Java

| # | Topic | Objective |
|---|---|---|
| 10 | Streams and lambdas ★ | Lazy pipelines, intermediate vs terminal, `Collectors` including `groupingBy`, functional interfaces, method references, where streams are the wrong tool |
| 11 | Optional and null discipline ★ | The intended use, the anti-patterns (`isPresent`/`get`, `Optional` fields and parameters), and how this repo does it instead with `ObjectChecker` |
| 12 | Exceptions ★ | Checked vs unchecked and the design argument, custom hierarchies, try-with-resources and `AutoCloseable`, suppressed exceptions, swallowing as a defect |
| 13 | Records, sealed types, pattern matching ☆ | Modern Java data modelling, exhaustive switch, when a record is right and when it is not |
| 14 | Immutability and defensive copying ☆ | Building genuinely immutable types, why it buys thread safety for free, and what it costs |

## Track D — Testing

| # | Topic | Objective |
|---|---|---|
| 15 | Testing ★ | JUnit 5, Mockito, what is worth mocking, unit vs slice vs `@SpringBootTest`, judging the real coverage of whatever codebase the lab profile points at, and what its gaps cost. *Prereq: 30 for the slice and `@SpringBootTest` half; the JUnit and Mockito half needs nothing earlier* |

## Track E — SQL and persistence

| # | Topic | Objective |
|---|---|---|
| 16 | SQL fundamentals ★ | `SELECT` and the logical order of evaluation, the join types and what each does to row counts, `GROUP BY`/`HAVING` vs `WHERE`, subqueries vs joins, set operations, and three-valued logic — why `NULL = NULL` is not true and what that does to `NOT IN` |
| 44 | Schema design and DDL ★ | Keys and constraints (primary, foreign, unique, `NOT NULL`, `DEFAULT`), normalisation and when to denormalise, `CHAR` vs `VARCHAR`, auto-increment, `DELETE` vs `TRUNCATE` vs `DROP`, the SQL command families, OLTP vs OLAP |
| 45 | Advanced SQL and the classic query puzzles ★ | CTEs and recursive queries, temporary tables, window functions and `ROW_NUMBER`/`RANK`/`DENSE_RANK`, `CASE`, pivot, views, stored procedures vs functions, triggers, cursors, dynamic SQL and injection — then the puzzles interviewers set: Nth highest salary, duplicates, delete duplicates |
| 17 | Indexes, execution plans and isolation ★ | What an index is and what it costs on write, composite indexes and leftmost-prefix, why a function on an indexed column kills it, reading an execution plan, and the four isolation levels with the anomalies each permits, plus locking and database deadlocks |
| 47 | PostgreSQL for a SQL Server / MySQL developer ★ | What changes when the same JPA app moves to PostgreSQL: identity columns vs sequences, `text` vs `varchar`, `boolean`, `timestamptz`, case-folded identifiers, `ILIKE`, `LIMIT`/`OFFSET`, `RETURNING`, `jsonb`, and running one app against two databases with a Spring profile. *Read:* [PostgreSQL — data types](https://www.postgresql.org/docs/current/datatype.html) |
| 48 | Schema migrations with Flyway ★ | Why `ddl-auto=update` is not a production strategy, versioned vs repeatable migrations, the schema history table, baselining an existing database, what to do when a migration fails, Flyway vs Liquibase. *Prereq: 44, 47.* *Read:* [Spring Boot — database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html) |
| 18 | JPA and Hibernate mapping ★ | Reading: the active lab profile's persistence text, if it declares one. Entities, ids, relationships, the owning side, `@MappedSuperclass` |
| 19 | Persistence context and lazy loading ★ | Reading: same text, persistence-context sections. Entity states, the first-level cache, `LazyInitializationException`, dirty checking |
| 20 | Queries ★ | Reading: same text, query sections. JPQL/HQL, Criteria, native SQL, projections, pagination |
| 21 | Transactions ★ | Reading: same text, transaction sections. `@Transactional`, propagation, isolation, rollback rules, read-only, and the self-invocation trap again. *Prereq: 27 — self-invocation is a consequence of proxying, which is taught there* |
| 22 | Performance: N+1 and caching ☆ | Diagnosing N+1, fetch joins and entity graphs, first vs second level cache, when caching is the wrong answer |

## Track F — Spring core

| # | Topic | Objective |
|---|---|---|
| 23 | IoC and dependency injection ★ | What the container actually does, why inversion of control matters, the problem DI solves |
| 24 | Beans: definition, scopes, lifecycle ★ | `@Component`/`@Service`/`@Repository`, `@Configuration` plus `@Bean`, singleton vs prototype vs request, lifecycle callbacks and their ordering |
| 25 | Injection styles ★ | Constructor vs field vs setter and why constructor wins, `@Qualifier`, `@Primary`, resolving ambiguity, circular dependencies |
| 26 | Configuration and properties ★ | `@Value`, `@ConfigurationProperties`, profiles, property precedence, externalised config |
| 27 | AOP and proxies ★ | JDK dynamic proxies vs CGLIB, aspects and pointcuts, and **why self-invocation silently defeats `@Transactional` and `@Cacheable`** |
| 28 | Events and listeners ☆ | `ApplicationEvent`, listener registration, synchronous vs asynchronous publication |
| 29 | The container at startup ☆ | Refresh phases, `BeanPostProcessor`, `@Conditional`, what "the context failed to start" really means |

## Track G — Spring Boot and web

| # | Topic | Objective |
|---|---|---|
| 30 | Spring Boot auto-configuration ★ | What `@SpringBootApplication` unpacks to, starters, conditional configuration, how to see and override what Boot decided |
| 31 | REST controllers ★ | `@RestController`, mapping and binding, `@RequestBody`/`@PathVariable`/`@RequestParam`, status codes, content negotiation, DTOs vs entities |
| 46 | The Spring MVC request pipeline ☆ | `DispatcherServlet`, handler mapping and adapters, view resolution, interceptors vs servlet filters and where each runs |
| 32 | Error handling ★ | `@ControllerAdvice`, `@ExceptionHandler`, designing an error contract, what must never leak into a response |

## Track H — Security

| # | Topic | Objective |
|---|---|---|
| 33 | Spring Security basics ☆ | The filter chain, authentication vs authorisation, method security, common misconfigurations, JWT and stateless auth, password hashing and salting |
| 49 | OAuth2 resource server and Keycloak ☆ | A hand-rolled JWT vs an identity provider, the OAuth2 roles (client, resource server, authorization server), validating a JWT against a JWKS endpoint, mapping Keycloak roles to authorities, the authorization code flow with PKCE for a SPA. *Prereq: 33.* *Read:* [Spring Security — OAuth2 resource server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html) |

## Track I — JVM, memory and concurrency

| # | Topic | Objective |
|---|---|---|
| 34 | JVM memory model ★ | Heap, stack, metaspace, what lives where, `OutOfMemoryError` vs `StackOverflowError`, reading a stack trace properly |
| 35 | Garbage collection ★ | Generational collection, what makes an object unreachable, why finalizers are gone, GC pauses as a production symptom |
| 36 | Class loading ☆ | Loaders and delegation, static init timing, `NoClassDefFoundError` vs `ClassNotFoundException`, reflection and what it costs |
| 37 | Threads and the Java Memory Model ★ | Reading: the active lab profile's concurrency text, if it declares one. Visibility, happens-before, volatile vs synchronized, instruction reordering |
| 38 | Synchronisation and locks ★ | `synchronized` mechanics, `ReentrantLock`, deadlock and how to prove one from a thread dump, race conditions |
| 39 | Executors and async ★ | Reading: same text, executor sections. Thread pools and sizing, correct shutdown, `CompletableFuture` composition, rejection policies |
| 40 | Concurrent collections, atomics, ThreadLocal ☆ | Reading: same text, concurrent-collection sections. `ConcurrentHashMap` vs a synchronised map, CAS and atomics, `ThreadLocal` leaks in a pooled server |

## Track J — System design and engineering judgement

| # | Topic | Objective |
|---|---|---|
| 41 | Design patterns in real code ☆ | Factory, builder, strategy, template method, observer — each identified in this codebase rather than in a textbook |
| 42 | SOLID and review judgement ☆ | The principles as review arguments, plus the coding standards declared by the active lab profile |
| 43 | System design for Java interviews ☆ | Layering, transaction boundaries, idempotency, API versioning — the questions that follow "tell me about a system you built" |

---

## Lab-specific bonus track

Not interview material. When a lab profile is active it may declare its own topics — the
architecture, conventions and generated-code rules of that particular codebase. Read them from the
profile's own "Bonus track" heading. In codebase-free mode there are none.
