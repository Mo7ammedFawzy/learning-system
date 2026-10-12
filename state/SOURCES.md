# Sources — priority checklist

The PDFs in `sources/`, one row per numbered question, each mapped to a curriculum topic. Every row
here maps to the **java** track, so this file gates the next topic in that track only.

How this file sets the next topic and when a row is ticked is defined in `core/BOOTSTRAP.md`
(§3 *The next topic*, §5 *Close*). A new question goes in as a row with the topic it belongs to;
if no topic fits, add one to that track's `CURRICULUM.md` first. The PDF answers are shallow definitions —
the lesson teaches the mechanism, the PDF supplies the question.

## Java interview Question and Answers.pdf

| # | Question | Topic | Done |
|---|---|---|---|
| 1 | OOP — the four concepts | 05 | ✅ 05b, 2026-10-03 |
| 2 | Inheritance, association, composition, aggregation | 04 | ✅ 04b, 2026-09-29 |
| 3 | Overriding vs overloading (runtime vs compile time) | 05 | ✅ 05a, 2026-10-02 |
| 4 | Is Java pass-by-value? | 01 | ✅ 01, 2026-09-06 |
| 5 | Is Java purely object-oriented? | 01 | ✅ 01, 2026-09-06 |
| 6 | Wrapper classes, autoboxing and unboxing | 01 | ✅ 01, 2026-09-06 |
| 7 | Abstract class vs interface | 04 | ✅ 04a, 2026-09-27 |
| 8 | Collections — Set and List | 08 | ✅ 08a, 2026-10-07 |
| 9 | Map implementations | 08 | ✅ 08b, 2026-10-12 |
| 10 | HashMap vs HashSet vs Hashtable | 08 | ✅ 08b, 2026-10-12 |
| 11 | Immutable vs mutable classes, making a class immutable | 14 | ☐ |
| 12 | Error vs Exception, the hierarchy | 12 | ☐ |
| 13 | throw vs throws | 12 | ☐ |
| 14 | Catch block ordering | 12 | ☐ |
| 15 | Multithreading | 37 | ☐ |
| 16 | Deadlock — avoiding and detecting it | 38 | ☐ |
| 17 | transient, volatile, synchronized | 37 | ☐ |
| 18 | Memory leaks | 35 | ☐ |
| 19 | Garbage collector and the heap generations | 35 | ☐ |
| 20 | Java 8 — lambdas, streams (intermediate vs terminal) | 10 | ☐ |
| 21 | Reflection | 36 | ☐ |
| 22 | Big O notation | 08 | ✅ 08a, 2026-10-07 |
| 23 | SOLID principles | 42 | ☐ |
| 24 | static keyword; can static methods be overridden? | 06 | ✅ 06a, 2026-10-04 |
| 25 | Static initialisation blocks | 06 | ✅ 06a, 2026-10-04 |
| 26 | Can static methods be overridden? (hiding) | 05 | ✅ 05a, 2026-10-02 |
| 27 | Is String a data type? | 02 | ✅ 02a, 2026-09-21 |
| 28 | String vs StringBuffer vs StringBuilder | 02 | ✅ 02b, 2026-09-22 |
| 29 | Running code before `main` | 06 | ✅ 06a, 2026-10-04 |
| 30 | Varargs | 05 | ✅ 05b, 2026-10-03 |
| 31 | `static public void` instead of `public static void` | 06 | ✅ 06a, 2026-10-04 |
| 32 | Purpose of the default constructor | 04 | ✅ 04c, 2026-09-30 |
| 33 | Why constructors are not inherited | 04 | ✅ 04c, 2026-09-30 |
| 34 | What does a constructor return? | 04 | ✅ 04c, 2026-09-30 |
| 35 | Why constructors cannot be final, static or abstract | 04 | ✅ 04c, 2026-09-30 |
| 36 | `equals()` vs `==` for any object (02a covered Strings only) | 03 | ✅ 03a, 2026-09-23 |
| 37 | join(), sleep(), wait() | 37 | ☐ |
| 38 | Achieving thread safety | 38 | ☐ |
| 39 | Comparable vs Comparator | 09 | ☐ |
| 40 | map() vs flatMap() | 10 | ☐ |
| 41 | stream vs parallelStream | 10 | ☐ |
| 42 | Salting | 33 | ☐ |

## Spring interview Question and Answers.pdf

| # | Question | Topic | Done |
|---|---|---|---|
| 1 | IoC vs DI | 23 | ☐ |
| 2 | Injection types and their differences | 25 | ☐ |
| 3 | What is Spring Boot? | 30 | ☐ |
| 4 | Advantages of Spring Boot | 30 | ☐ |
| 5 | Spring Boot dependency management | 30 | ☐ |
| 6 | @Controller vs @RestController, @ResponseBody | 31 | ☐ |
| 7 | @Autowired vs @Inject | 25 | ☐ |
| 8 | Components (modules) of a Spring application | 23 | ☐ |
| 9 | IoC container types — BeanFactory vs ApplicationContext | 23 | ☐ |
| 10 | DispatcherServlet and the Spring MVC architecture | 46 | ☐ |
| 11 | Spring Boot auto-configuration | 30 | ☐ |
| 12 | Configuration types (XML, Java, annotation…) | 24 | ☐ |
| 13 | Bean scopes | 24 | ☐ |
| 14 | Spring profiles | 26 | ☐ |
| 15 | Interceptors, and why they are used | 46 | ☐ |
| 16 | AOP | 27 | ☐ |
| 17 | JWT | 33 | ☐ |

## SQL&JPA Interview Queuestions.pdf

| # | Question | Topic | Done |
|---|---|---|---|
| 1 | DELETE vs TRUNCATE vs DROP | 44 | ☐ |
| 2 | Hibernate ORM | 18 | ☐ |
| 3 | The three entity states | 19 | ☐ |
| 4 | JPQL | 20 | ☐ |
| 5 | JpaRepository vs CrudRepository | 20 | ☐ |
| 6 | N+1 and how to solve it | 22 | ☐ |

## DataBase.pdf

| # | Question | Topic | Done |
|---|---|---|---|
| 1 | What is SQL? | 16 | ☐ |
| 2 | What is a database? | 44 | ☐ |
| 3 | Types of SQL commands (DDL, DML, DCL, TCL) | 44 | ☐ |
| 4 | Primary key | 44 | ☐ |
| 5 | Foreign key | 44 | ☐ |
| 6 | Unique key | 44 | ☐ |
| 7 | Primary key vs unique key | 44 | ☐ |
| 8 | NOT NULL constraint | 44 | ☐ |
| 9 | DEFAULT constraint | 44 | ☐ |
| 10 | DELETE vs TRUNCATE vs DROP | 44 | ☐ |
| 11 | WHERE vs HAVING | 16 | ☐ |
| 12 | Joins | 16 | ☐ |
| 13 | INNER JOIN | 16 | ☐ |
| 14 | LEFT JOIN | 16 | ☐ |
| 15 | RIGHT JOIN | 16 | ☐ |
| 16 | FULL JOIN | 16 | ☐ |
| 17 | Self join | 16 | ☐ |
| 18 | Cross join | 16 | ☐ |
| 19 | UNION and UNION ALL | 16 | ☐ |
| 20 | UNION vs UNION ALL | 16 | ☐ |
| 21 | Normalization | 44 | ☐ |
| 22 | Denormalization | 44 | ☐ |
| 23 | CHAR vs VARCHAR | 44 | ☐ |
| 24 | SQL vs MySQL | 16 | ☐ |
| 25 | Auto increment | 44 | ☐ |
| 26 | Subquery | 16 | ☐ |
| 27 | Nested query | 16 | ☐ |
| 28 | Correlated subquery | 16 | ☐ |
| 29 | GROUP BY | 16 | ☐ |
| 30 | GROUP BY vs ORDER BY | 16 | ☐ |
| 31 | LIMIT | 16 | ☐ |
| 32 | Second highest salary | 45 | ☐ |
| 33 | Finding duplicate records | 45 | ☐ |
| 34 | CTE | 45 | ☐ |
| 35 | Temporary tables | 45 | ☐ |
| 36 | Window functions | 45 | ☐ |
| 37 | ROW_NUMBER vs RANK vs DENSE_RANK | 45 | ☐ |
| 38 | CASE | 45 | ☐ |
| 39 | COALESCE | 16 | ☐ |
| 40 | NVL | 16 | ☐ |
| 41 | Indexing | 17 | ☐ |
| 42 | Clustered index | 17 | ☐ |
| 43 | Non-clustered index | 17 | ☐ |
| 44 | Clustered vs non-clustered | 17 | ☐ |
| 45 | Views | 45 | ☐ |
| 46 | View vs table | 45 | ☐ |
| 47 | Stored procedures | 45 | ☐ |
| 48 | Function vs stored procedure | 45 | ☐ |
| 49 | Triggers | 45 | ☐ |
| 50 | Cursors | 45 | ☐ |
| 51 | ACID | 17 | ☐ |
| 52 | Transactions | 17 | ☐ |
| 53 | COMMIT vs ROLLBACK | 17 | ☐ |
| 54 | SAVEPOINT | 17 | ☐ |
| 55 | IN vs EXISTS | 16 | ☐ |
| 56 | DELETE vs TRUNCATE | 44 | ☐ |
| 57 | Index fragmentation | 17 | ☐ |
| 58 | RANK vs DENSE_RANK | 45 | ☐ |
| 59 | Common records from two tables | 16 | ☐ |
| 60 | UNION vs JOIN | 16 | ☐ |
| 61 | Pivot | 45 | ☐ |
| 62 | Case sensitivity (collation) | 44 | ☐ |
| 63 | Nth highest salary | 45 | ☐ |
| 64 | Top 3 salaries | 45 | ☐ |
| 65 | DROP vs DELETE vs TRUNCATE | 44 | ☐ |
| 66 | Age from date of birth | 45 | ☐ |
| 67 | Recursive queries | 45 | ☐ |
| 68 | Temporary table vs CTE | 45 | ☐ |
| 69 | Odd and even rows | 45 | ☐ |
| 70 | JSON in SQL | 45 | ☐ |
| 71 | XML in SQL | 45 | ☐ |
| 72 | Handling NULL | 16 | ☐ |
| 73 | Dynamic SQL | 45 | ☐ |
| 74 | Percentages | 45 | ☐ |
| 75 | Employees earning more than their manager | 16 | ☐ |
| 76 | Duplicate emails | 16 | ☐ |
| 77 | Highest salary per department | 16 | ☐ |
| 78 | Employees who joined in the last 3 months | 16 | ☐ |
| 79 | First 5 records | 16 | ☐ |
| 80 | Employee count per department | 16 | ☐ |
| 81 | Last 3 records | 45 | ☐ |
| 82 | Employees without a manager | 16 | ☐ |
| 83 | First name starting with 'A' | 16 | ☐ |
| 84 | Alternate rows | 45 | ☐ |
| 85 | Swapping two columns | 44 | ☐ |
| 86 | Duplicates with their count | 16 | ☐ |
| 87 | Highest salary without MAX() | 45 | ☐ |
| 88 | Common records without JOIN | 16 | ☐ |
| 89 | Deleting duplicate records | 45 | ☐ |
| 90 | Department with the most employees | 16 | ☐ |
| 91 | Optimising SQL queries | 17 | ☐ |
| 92 | Query execution plan | 17 | ☐ |
| 93 | Improving query performance | 17 | ☐ |
| 94 | Indexing | 17 | ☐ |
| 95 | Table partitioning | 17 | ☐ |
| 96 | Avoiding deadlocks | 17 | ☐ |
| 97 | EXISTS | 16 | ☐ |
| 98 | Query optimisation | 17 | ☐ |
| 99 | Stored procedure vs function | 45 | ☐ |
| 100 | OLTP vs OLAP | 44 | ☐ |
