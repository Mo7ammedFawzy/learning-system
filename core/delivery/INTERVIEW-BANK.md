# Interview bank — Delivery

Questions for the interview drill (step 5), keyed to `core/delivery/CURRICULUM.md` topic IDs. Each
entry is written as the interviewer sees it:

- **Q** — the question as asked
- **Shallow** — the answer that sounds right, is technically true, and does not get the job
- **Passes** — what a strong candidate says
- **Then** — the follow-up, because the real signal is in the second question

Ask the questions first and wait for answers. Only then reveal Shallow/Passes/Then. This file is a
starting set, not a ceiling — generate more in the same shape when a topic needs it, and add any
question the learner is asked in a real interview.

A recurring Shallow here is the **"it works on my machine" answer**: a description of the happy
path with no idea what happens on a clean machine, after a restart, or when one service is slow.

---

## D01 — Images, containers and the Dockerfile

**Q.** What is the difference between an image and a container?
- *Shallow:* "A container is a running image."
- *Passes:* An image is a read-only stack of layers plus metadata. A container is a process started
  from it, with a thin writable layer on top that is lost when the container is removed. Many
  containers can run from one image.
- *Then:* "Is a container a virtual machine?" (No: it shares the host kernel; it is an isolated
  process using namespaces and cgroups. That is why it starts in milliseconds.)

**Q.** Your Spring Boot image rebuilds everything, including dependencies, on every code change. Why?
- *Shallow:* "Docker is slow."
- *Passes:* Each instruction is a cached layer, and a changed layer invalidates every layer after
  it. `COPY . .` before `mvn package` means any source change re-downloads dependencies. Copy
  `pom.xml` first, resolve dependencies, then copy `src`.
- *Then:* "And why is the final image 600 MB?" (It ships the JDK and Maven. A multi-stage build
  compiles in one stage and copies only the jar onto a JRE image.)

## D02 — Docker Compose

**Q.** The API container cannot reach the database at `localhost:5432`. Why?
- *Shallow:* "The port isn't exposed."
- *Passes:* Inside a container, `localhost` is that container. Compose puts services on a shared
  network where each one is reachable by its service name, so the URL is `db:5432`.
- *Then:* "It starts, then crashes because the database isn't ready. Fix?" (`depends_on` alone
  waits for the container to start, not to be ready. Add a healthcheck to `db` and
  `condition: service_healthy`, and keep the app's own retry.)

**Q.** Where does your database data live, and what happens on `docker compose down`?
- *Shallow:* "In the container."
- *Passes:* In a named volume, which survives `down`; only `down -v` deletes it. Without a volume
  the data is in the container's writable layer and disappears when the container is removed.
- *Then:* "Named volume vs bind mount?" (Docker manages a named volume; a bind mount maps a host
  path. Bind mounts suit live-reloading source in development, named volumes suit data.)

## D03 — A Spring Boot API in a container

**Q.** How does the same image run against a local database and a production one?
- *Shallow:* "Two `application.properties` files baked into two images."
- *Passes:* One image, config from outside: environment variables override properties through
  relaxed binding (`SPRING_DATASOURCE_URL`), and a profile selects per-environment defaults. The
  image never contains environment-specific values.
- *Then:* "Where does the JWT secret go?" (Never in the repo or the image. An environment variable
  or a secret store, injected at run time; if one was ever committed, rotate it, because git
  history keeps it.)

**Q.** The container is killed with no error after a few minutes under load. What do you check?
- *Shallow:* "Increase the heap."
- *Passes:* An out-of-memory kill by the container limit, not a Java `OutOfMemoryError`. The JVM
  sizes its heap from the container limit, but heap is not total memory: metaspace, thread stacks
  and direct buffers come on top. Check `docker inspect` for `OOMKilled`, then size with
  `-XX:MaxRAMPercentage`.
- *Then:* "How does the orchestrator know the app is up?" (A health endpoint, such as
  Actuator's `/actuator/health`, used by the healthcheck.)

## D04 — A single-page app behind Nginx

**Q.** The app works from the home page, but refreshing on `/books/5` gives a 404. Why?
- *Shallow:* "The route is wrong."
- *Passes:* Client-side routes exist only in JavaScript. On a refresh the browser asks the server
  for `/books/5`, and there is no such file. Nginx needs `try_files $uri $uri/ /index.html` so
  unknown paths serve the app, which then routes.
- *Then:* "Why proxy `/api` through the same Nginx?" (One origin for the browser, so no CORS, and
  the backend is not exposed directly.)

**Q.** You set `VITE_API_URL` on the container and the app ignores it. Why?
- *Shallow:* "The variable name is wrong."
- *Passes:* Vite replaces `import.meta.env` values at **build** time. The built files are static,
  so a runtime environment variable changes nothing. Use a relative `/api` path behind the proxy, or
  pass a build argument.
- *Then:* "What ends up in the bundle?" (Every `VITE_` value, readable by anyone. No secrets.)

## D05 — GitHub Actions

**Q.** Walk me through your CI pipeline.
- *Shallow:* "It runs the tests on push."
- *Passes:* The trigger, then jobs on fresh runners: check out the code, set up the JDK and Node
  with dependency caches, run backend tests, build and test the frontend, build the images. A pull
  request cannot merge while it is red. Each job starts clean, so anything shared moves through
  artifacts.
- *Then:* "Integration tests need a database. How?" (A service container in the job, or
  Testcontainers; never a shared remote database.)

**Q.** How are secrets handled in a workflow?
- *Shallow:* "In the YAML file."
- *Passes:* Repository or environment secrets, read as `${{ secrets.NAME }}` and masked in logs.
  Workflows triggered from a fork do not receive them, so an outsider's PR cannot read them.
  `GITHUB_TOKEN` is issued per run, scoped by `permissions:`.
- *Then:* "Why set `permissions:` explicitly?" (Least privilege: a compromised step can only do
  what the token allows.)

## D06 — Building and publishing images

**Q.** How do you tag the images CI builds?
- *Shallow:* "`latest`."
- *Passes:* By commit SHA, which is unique and traceable to the code, plus a moving tag like
  `latest` or `main` for convenience. A deploy pins the SHA, so a rollback is redeploying the
  previous one.
- *Then:* "Continuous delivery vs continuous deployment?" (Delivery: every green build is
  releasable and a person presses deploy. Deployment: every green build goes out automatically.)

## D07 — Unit and component tests with Vitest

**Q.** What do you test in a component, and how do you find elements?
- *Shallow:* "Each function, found by CSS class."
- *Passes:* Behaviour the user sees: what renders for given props or data, and what changes after
  an interaction. Find elements by role, label or text, the way a user or screen reader would, so
  a refactor that keeps the behaviour does not break the test.
- *Then:* "The component fetches data. Do you mock `fetch`, the API module, or the server?"
  (Mock at the network boundary, e.g. with MSW, so the component's own data code is exercised.)

**Q.** Unit, component, E2E: how many of each?
- *Shallow:* "As many E2E as possible, they test everything."
- *Passes:* Many fast unit and component tests, few slow E2E tests on critical flows. E2E is
  realistic but slow and flaky to maintain; unit tests are fast but blind to wiring.
- *Then:* "Is 100% coverage the goal?" (No: coverage shows what ran, not what was checked.)

## D08 — End-to-end tests with Playwright

**Q.** Your E2E test passes locally and fails in CI one run out of five. What do you do?
- *Shallow:* "Add a `waitForTimeout`."
- *Passes:* A fixed sleep hides the race and slows everything. Use locators and web-first
  assertions that auto-wait (`await expect(locator).toBeVisible()`). Open the trace from the failed
  CI run to see the real order of events. Check test isolation: shared data between tests is the
  other common cause.
- *Then:* "Every test logs in through the UI and the suite is slow. Fix?" (Log in once in a setup
  project, save the storage state, reuse it.)

## D09 — AWS basics for one application

**Q.** How did you deploy the application on AWS?
- *Shallow:* A list of services with no reasons.
- *Passes:* What ran where and why: the API on EC2 behind a security group that opens only the
  needed ports, the database on RDS in a private subnet reachable only from the API's security
  group, the frontend on S3 behind CloudFront. Credentials through an IAM role on the instance, not
  keys in a file.
- *Then:* "Why not run PostgreSQL on the same EC2 instance?" (You can; RDS buys backups, patching
  and failover, at a cost.)

## D10 — Kubernetes basics

**Q.** What does a Deployment give you that a Pod does not?
- *Shallow:* "It deploys the pod."
- *Passes:* A pod is one disposable instance; nothing restarts it elsewhere if its node dies. A
  Deployment declares desired state (this image, three replicas), and a controller keeps reconciling
  to it: it replaces failed pods and does rolling updates. A Service gives the changing pods one
  stable address.
- *Then:* "Readiness vs liveness probe?" (Readiness: send traffic yet? Liveness: restart it? A
  liveness probe on a slow dependency causes restart loops.)
