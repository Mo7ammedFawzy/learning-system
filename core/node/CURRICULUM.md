# Curriculum — Node.js + Express + TypeScript backends

**ID prefix: `N`.** Topics are `N01`, `N02`, …; the prefix keeps them apart from every other
track's numbers in `state/PROGRESS.md` and in `playground/` directory names.

Taught **by contrast with Spring Boot**, which `state/LEARNER.md` and the java track record. Each
row carries a *From Spring:* note naming the equivalent the lesson opens from. Spend the time on
the difference: there is no container, no proxy and no thread per request, so things Spring does
for you are code you write, or a library you choose.

Bedrock: **one thread running an event loop**. Almost every Node interview question, from "why is
this endpoint slow for everyone" to "why did this error crash the server", bottoms out in what
blocks that loop and where a rejected promise goes. Teach that first and follow questions down to it.

All code in this track is **TypeScript**, compiled with `strict` on.

Work top to bottom — **row order, not number order**.

Legend: **★** asked in almost every Node interview · **☆** asked at senior level

## Primary references

| Source | Covers |
|---|---|
| [nodejs.org/docs](https://nodejs.org/docs/latest/api/) and [nodejs.org/learn](https://nodejs.org/en/learn) | N01, N02 |
| [expressjs.com](https://expressjs.com/) — written against Express 5 | N03, N04 |
| [mongoosejs.com](https://mongoosejs.com/docs/) | N06 |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | N02, all code |

Each row ends with *Read:* and the exact page for that topic: the step-1 reading, cited by the lesson.

---

## Track NA — The runtime

| # | Topic | Objective |
|---|---|---|
| N01 | The event loop and async code ★ | One JS thread, the libuv pool behind it, and the phases of the loop; microtasks (promises) vs macrotasks (timers, I/O); why a CPU-heavy loop in one request stalls every other request; `async`/`await` as promise syntax; `Promise.all` vs awaiting in a loop. *From Spring:* a thread per request, where a slow request blocks only its own thread. *Read:* [The Node.js event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [Don't block the event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop) |
| N02 | Modules, TypeScript and the build ★ | CommonJS vs ES modules and why mixing them fails, `"type"` in `package.json`, `tsconfig` essentials (`strict`, `module`, `outDir`), running TS in development vs compiling for production, `dependencies` vs `devDependencies`, the lockfile. *From Spring:* Maven, the classpath, `javac`. *Read:* [Node.js — modules: packages](https://nodejs.org/docs/latest/api/packages.html), [TSConfig reference](https://www.typescriptlang.org/tsconfig/) |

## Track NB — Express

| # | Topic | Objective |
|---|---|---|
| N03 | Routing and middleware ★ | An Express app is a list of `(req, res, next)` functions run in order; routers, path and query params, `express.json()`; why middleware order matters (auth after the route is no auth); a request that never calls `res` or `next` hangs. *From Spring:* `@RestController` mappings plus servlet filters and interceptors, ordered for you. *Read:* [Express — routing](https://expressjs.com/en/guide/routing.html), [Using middleware](https://expressjs.com/en/guide/using-middleware.html) |
| N04 | Errors and validation ★ | The four-argument error handler; Express 5 forwards rejected promises from handlers, Express 4 did not; an error contract for responses; validating `req.body` at the boundary with a schema (zod) and inferring the TS type from it, because TypeScript types vanish at run time; `unhandledRejection` and why the process should exit. *From Spring:* `@ControllerAdvice` and Bean Validation. *Prereq: N03.* *Read:* [Express — error handling](https://expressjs.com/en/guide/error-handling.html), [Zod — basics](https://zod.dev/basics) |
| N05 | Authentication with bcrypt and JWT ★ | Hashing with a cost factor, never encrypting passwords; issuing and verifying a JWT in middleware; what a JWT does not give you (revocation); access vs refresh tokens; cookie vs `Authorization` header and the XSS/CSRF trade-off. *From Spring:* the Spring Security filter chain and `PasswordEncoder`. *Prereq: N03.* *Read:* [Introduction to JWT](https://jwt.io/introduction), [OWASP — password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |

## Track NC — Data, config and tests

| # | Topic | Objective |
|---|---|---|
| N06 | MongoDB with Mongoose ★ | Documents vs rows, schemas and models, embedding vs referencing and `populate`, indexes, `lean()`, validation in the schema vs at the boundary, the N+1 of populate in a loop. *From Spring:* JPA entities, relationships and fetch strategy. *Read:* [Mongoose — schemas](https://mongoosejs.com/docs/guide.html), [Mongoose — populate](https://mongoosejs.com/docs/populate.html) |
| N07 | Configuration and production hardening ☆ | Environment variables and validating them at startup, `NODE_ENV`, CORS configured to an allow-list, security headers (helmet), rate limiting a login route, structured logging, graceful shutdown on `SIGTERM`. *From Spring:* `application.properties`, profiles and Actuator. *Read:* [Express — security best practices](https://expressjs.com/en/advanced/best-practice-security.html), [Express — performance in production](https://expressjs.com/en/advanced/best-practice-performance.html) |
| N08 | Testing an API with Vitest and Supertest ★ | Exporting the app separately from `listen` so tests can call it; Supertest requests against the app in memory; a real test database vs mocking the model; testing the error contract and auth, not only the happy path. *From Spring:* `MockMvc` and `@SpringBootTest`. *Prereq: N04.* *Read:* [Vitest — getting started](https://vitest.dev/guide/), [Supertest](https://github.com/forwardemail/supertest) |
