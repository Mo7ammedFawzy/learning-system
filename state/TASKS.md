# Project tasks

Real changes to real projects that turn a finished lesson into evidence on the CV. A lesson
teaches the concept in `playground/`; the task applies it to a project afterwards. Each task names
the topics it needs, what "done" looks like, and the CV line it earns.

A task is **unlocked** when every topic it needs is under Completed or Scratched in
`state/PROGRESS.md`. Tick `[x]` and add the date when it is done. `state/JOBS.md` says which
postings each task answers.

| Project | Path | Role |
|---|---|---|
| **Library Management System** | `C:/Projects/personal/library-management-system` | **Main target.** Spring Boot API + Vue admin today (SQL Server, JWT). Gets Docker, PostgreSQL, tests, CI, the React rewrite and the cloud deploy |
| eCommerce | `C:/Projects/personal/eCommerce/backend/node` | Practice for the node track: Express 5 + TypeScript + Mongoose + JWT |
| Portfolio | `C:/Projects/personal/portfolio` | Vue + Vite on Vercel. First, smallest CI and tests; shows the new skills last |

---

## Library Management System

| ID | Task | Needs | Done when | CV line | Done |
|---|---|---|---|---|---|
| L01 | Dockerfile for the Spring Boot API, secrets out of the repo | D01, D03 | Multi-stage image on a JRE, runs as non-root; `jwt.secret` and DB credentials read from env vars and removed from `application.properties` (the committed secret is rotated) | — | [ ] |
| L02 | Run on PostgreSQL | 47 | A `postgres` Spring profile; the app starts and all tests pass against PostgreSQL | Databases: SQL Server, PostgreSQL | [ ] |
| L03 | Flyway migrations | 48 | `ddl-auto` is `validate`; the schema comes from `V1__…sql` onward; a fresh database builds from migrations alone | Schema migrations with Flyway | [ ] |
| L04 | Compose stack: API + PostgreSQL | D02 | `docker compose up` on a clean machine gives a working API; DB data in a named volume; API waits on a DB healthcheck | Containerized with Docker Compose | [ ] |
| L05 | GitHub Actions: backend | D05 | `mvn test` on every push and PR, Maven cache, red PRs cannot merge; badge in the README | CI pipeline with GitHub Actions | [ ] |
| L06 | Backend test coverage you can quote | 15 | Service-layer tests for borrowing rules and auth; JaCoCo report in CI; the real number written down | `__` REST endpoints, `__%` service-layer coverage | [ ] |
| L07 | React + TypeScript admin: shell, auth, routing | R39, R32 | New `frontend-react/` app: login against the existing API, protected routes, layout, one list page | Vue.js (primary), React, TypeScript | [ ] |
| L08 | React admin: data and the remaining pages | R40, R31 | Books, members, borrowings with TanStack Query, mutations with invalidation, one optimistic update; feature parity with the Vue app; deployed live | Built a React + TypeScript admin against the Spring Boot API | [ ] |
| L09 | React admin in the compose stack | D04 | Nginx image with SPA fallback and `/api` proxy; `docker compose up` gives the whole system on one port | — | [ ] |
| L10 | Frontend unit and component tests | D07 | Vitest + Testing Library on the React admin: forms, a table filter, an auth guard, HTTP mocked at the network boundary | Frontend tests with Vitest | [ ] |
| L11 | Playwright E2E in CI | D08 | Login, search/filter, borrow and return; runs headless in Actions against the compose stack; traces kept on failure | Playwright E2E tests run in CI | [ ] |
| L12 | Images to GHCR | D06 | CI builds and pushes API and frontend images tagged by commit SHA after the tests pass | — | [ ] |
| L13 | Deploy to AWS | D09 | API on EC2, PostgreSQL on RDS, frontend on S3 + CloudFront; live URL in the README; note what it costs | Deployed to AWS (EC2, RDS, S3) | [ ] |
| L14 | ☆ Run the stack on `kind` | D10 | Deployments, Services, a ConfigMap and a Secret; the app works through a port-forward | Kubernetes basics | [ ] |
| L15 | ☆ Keycloak login | 49 | Keycloak in compose; the API is an OAuth2 resource server; roles from Keycloak map to authorities | OAuth2 / Keycloak | [ ] |

## eCommerce — Node API

| ID | Task | Needs | Done when | CV line | Done |
|---|---|---|---|---|---|
| E01 | Strict TypeScript and a clean build | N02 | `strict: true` with no `any` escapes; `npm run build` then `npm start` runs the compiled output | — | [ ] |
| E02 | Routing and middleware order reviewed | N03 | Routers per resource; auth applied where it should be and nowhere it should not; no hanging routes | — | [ ] |
| E03 | Validation and one error contract | N04 | zod schemas on every body and query; one error handler, one response shape, no stack traces in production | — | [ ] |
| E04 | Auth hardened | N05, N07 | bcrypt cost set deliberately; JWT expiry; rate limit on login; CORS allow-list; env validated at startup | — | [ ] |
| E05 | API tests | N08 | Vitest + Supertest on auth and products, including the failure paths, against a test database | — | [ ] |
| E06 | Docker + CI | D01, D02, D05 | API + MongoDB in compose; tests run in Actions | Node.js / Express / TypeScript API, containerized, tested in CI | [ ] |

## Portfolio

| ID | Task | Needs | Done when | CV line | Done |
|---|---|---|---|---|---|
| P01 | CI: typecheck and build | D05 | Actions runs `vue-tsc` and `vite build` on every push; badge in the README | — | [ ] |
| P02 | A few component tests | D07 | Vitest + Vue Test Utils on two or three components | — | [ ] |
| P03 | Playwright smoke test | D08 | The home page loads and the main navigation works, in CI | — | [ ] |
| P04 | Show the new skills | L05, L08, L13 done | Skills and project cards updated with what is now real: Docker, CI, PostgreSQL, React, AWS | — | [ ] |
