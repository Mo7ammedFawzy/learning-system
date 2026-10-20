# Interview bank — Node.js + Express + TypeScript

Questions for the interview drill (step 5), keyed to `core/node/CURRICULUM.md` topic IDs. Each
entry is written as the interviewer sees it:

- **Q** — the question as asked
- **Shallow** — the answer that sounds right, is technically true, and does not get the job
- **Passes** — what a strong candidate says
- **Then** — the follow-up, because the real signal is in the second question

Ask the questions first and wait for answers. Only then reveal Shallow/Passes/Then. This file is a
starting set, not a ceiling — generate more in the same shape when a topic needs it.

A recurring Shallow here is the **"Spring answer"**: true of a thread-per-request server and false of
Node. Name it when it appears.

---

## N01 — The event loop and async code

**Q.** Node is single-threaded. How does it handle thousands of concurrent requests?
- *Shallow:* "It's asynchronous."
- *Passes:* JavaScript runs on one thread, but I/O is handed to the operating system or the libuv
  thread pool. While a request waits on the database, the loop runs other callbacks. It scales
  for I/O-bound work and not for CPU-bound work.
- *Then:* "One endpoint hashes a large file synchronously. What happens to the others?" (They all
  wait: the loop is blocked. Move it to a worker thread, or make it async.)

**Q.** What does this print? `setTimeout(() => log('a'), 0); Promise.resolve().then(() => log('b')); log('c')`
- *Shallow:* "a, b, c."
- *Passes:* `c`, `b`, `a`. Synchronous code first; then the microtask queue (promise callbacks)
  drains completely; then the timer, a macrotask, runs on a later loop turn.
- *Then:* "You `await` three independent API calls in a row. Problem?" (They run one after another;
  `Promise.all` runs them concurrently.)

## N02 — Modules, TypeScript and the build

**Q.** You get `require is not defined in ES module scope`. Why?
- *Shallow:* "A missing package."
- *Passes:* `package.json` has `"type": "module"` (or the file is `.mjs`), so Node treats it as an
  ES module, where `require` does not exist. Use `import`, or keep the project CommonJS; the
  `module` setting in `tsconfig` must match.
- *Then:* "Do you run `ts-node` in production?" (No: compile with `tsc` and run the JavaScript.
  Type checking belongs in the build and CI, not at startup.)

## N03 — Routing and middleware

**Q.** What is middleware in Express, and why does order matter?
- *Shallow:* "Functions that run before the route."
- *Passes:* Every handler is middleware: `(req, res, next)`, run in registration order. Each one
  either ends the response or calls `next()`. An auth middleware registered after a route never
  runs for it; `express.json()` registered after the routes leaves `req.body` undefined.
- *Then:* "A request hangs forever with no error. Cause?" (A middleware that neither responds nor
  calls `next()`.)

## N04 — Errors and validation

**Q.** An `async` route handler throws. What happens in Express 4, and in Express 5?
- *Shallow:* "The error handler catches it."
- *Passes:* In Express 4 the rejected promise is not seen by Express: no error handler runs, and
  the request hangs or the process logs an unhandled rejection. Express 5 forwards it to the
  error-handling middleware automatically.
- *Then:* "How does Express know a middleware is an error handler?" (It has four parameters,
  `(err, req, res, next)`.)

**Q.** The body is typed as `CreateProductDto`. Is it validated?
- *Shallow:* "Yes, TypeScript checks it."
- *Passes:* No. Types are erased at compile time; `req.body` is whatever the client sent. Validate
  it at run time with a schema (zod) and derive the TypeScript type from that schema, so there is
  one source of truth.
- *Then:* "What must an error response never contain?" (Stack traces, SQL or query details,
  internal IDs.)

## N05 — Authentication with bcrypt and JWT

**Q.** How do you store passwords?
- *Shallow:* "Encrypted."
- *Passes:* Hashed with a slow, salted algorithm such as bcrypt, with a cost factor tuned to take
  around 100 ms. Encryption is reversible; hashing is not. The salt makes identical passwords hash
  differently and defeats precomputed tables.
- *Then:* "A user logs out. Is their JWT still valid?" (Yes, until it expires; a stateless token
  cannot be revoked without a denylist or short lifetimes plus refresh tokens.)

## N06 — MongoDB with Mongoose

**Q.** Embed or reference: an order and its line items, a product and its reviews?
- *Shallow:* "Always reference, like SQL."
- *Passes:* Embed what is read together and bounded: line items belong to one order. Reference what
  grows without bound or is shared: reviews can number thousands, and a document has a 16 MB
  limit.
- *Then:* "A list page calls `populate` and is slow. Why?" (Missing index on the referenced field,
  populating in a loop, or returning full Mongoose documents where `lean()` would do.)

## N07 — Configuration and production hardening

**Q.** What do you do before running an Express API in production?
- *Shallow:* "Set `NODE_ENV=production`."
- *Passes:* That, plus: config from environment variables validated at startup, so the app fails
  fast; CORS restricted to known origins; security headers; rate limiting on auth routes; no stack
  traces in responses; structured logs; graceful shutdown on `SIGTERM` that stops accepting
  connections and drains in-flight requests.
- *Then:* "Why does graceful shutdown matter in a container?" (The orchestrator sends `SIGTERM`,
  then kills the process; without a handler, in-flight requests are cut off.)

## N08 — Testing an API with Vitest and Supertest

**Q.** How do you test an Express endpoint?
- *Shallow:* "Start the server and call it with Postman."
- *Passes:* Export the `app` without calling `listen`, then Supertest sends real HTTP requests to it
  in memory and asserts status, body and headers. Cover the failure paths: invalid body, missing or
  expired token, not found.
- *Then:* "Real database or mocks?" (A real, disposable test database catches query and index
  bugs that mocks hide; mock only third-party services.)
