# Curriculum — Delivery: containers, CI/CD, frontend testing, cloud

**ID prefix: `D`.** Topics are `D01`, `D02`, …; the prefix keeps them apart from every other
track's numbers in `state/PROGRESS.md` and in `playground/` directory names.

This track covers what gets an application **from a laptop to a running, tested deployment**:
images, compose stacks, pipelines, the tests those pipelines run, and the first cloud services.
It assumes the learner already writes the application code (a Spring Boot API and a single-page
frontend) and teaches what goes around it.

Bedrock: a container is a **Linux process** with its own filesystem view and limits, not a small
virtual machine; a pipeline is **a script run on a clean machine**. Questions about Compose,
Kubernetes or GitHub Actions bottom out there. Follow them down.

Work top to bottom — **row order, not number order**. The order follows how often job postings ask
for each item: Docker and CI first, cloud and Kubernetes last.

Legend: **★** asked in almost every interview that lists the topic · **☆** asked at senior level

## Primary references

| Source | Covers |
|---|---|
| [docs.docker.com](https://docs.docker.com/) | Track DA |
| [docs.github.com — Actions](https://docs.github.com/en/actions) | Track DB |
| [vitest.dev](https://vitest.dev/), [testing-library.com](https://testing-library.com/), [playwright.dev](https://playwright.dev/) | Track DC |
| [docs.aws.amazon.com](https://docs.aws.amazon.com/), [kubernetes.io](https://kubernetes.io/docs/) | Track DD |

Each row ends with *Read:* and the exact page for that topic: the step-1 reading, cited by the lesson.
When the mentor's memory disagrees with the page, the page wins.

---

## Track DA — Containers

| # | Topic | Objective |
|---|---|---|
| D01 | Images, containers and the Dockerfile ★ | Image vs container, layers and the build cache (why `COPY pom.xml` comes before `COPY src`), `CMD` vs `ENTRYPOINT`, `EXPOSE` is documentation, `.dockerignore`, multi-stage builds that ship a JRE and not a JDK, running as non-root. *Read:* [Docker overview](https://docs.docker.com/get-started/docker-overview/), [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [Build cache](https://docs.docker.com/build/cache/) |
| D02 | Docker Compose ★ | Services, the default network and service-name DNS (why `localhost` inside a container is the container), named volumes vs bind mounts, `env_file`, `depends_on` with a healthcheck vs without, rebuilding one service. *Prereq: D01.* *Read:* [Compose overview](https://docs.docker.com/compose/), [Networking in Compose](https://docs.docker.com/compose/how-tos/networking/) |
| D03 | A Spring Boot API in a container ★ | Config through environment variables (relaxed binding: `SPRING_DATASOURCE_URL`), profiles per environment, secrets kept out of the image and the repo, layered jars, JVM memory inside a container limit, a health endpoint for the healthcheck. *Prereq: D01.* *Read:* [Spring Boot — Dockerfiles](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html), [Externalized configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) |
| D04 | A single-page app behind Nginx ★ | Build stage with Node, serve stage with Nginx; the SPA fallback (`try_files … /index.html`) and why a refresh on `/books/5` 404s without it; proxying `/api` to the backend service so the browser sees one origin and CORS disappears; build-time vs runtime environment variables in Vite. *Prereq: D02.* *Read:* [Vite — static deploy](https://vite.dev/guide/static-deploy), [Nginx `try_files`](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files) |

## Track DB — CI/CD

| # | Topic | Objective |
|---|---|---|
| D05 | GitHub Actions ★ | Workflow, job, step, runner; triggers (`push`, `pull_request`); jobs run in parallel on clean machines, so artifacts and caches move state between them; caching Maven and npm; service containers for a database in tests; secrets and why they are not passed to fork PRs; the status badge. *Read:* [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Caching dependencies](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) |
| D06 | Building and publishing images ☆ | Building images in CI, tagging by commit SHA vs `latest`, pushing to GitHub Container Registry with `GITHUB_TOKEN`, what "continuous delivery" vs "continuous deployment" means, a deploy job gated on the tests. *Prereq: D01, D05.* *Read:* [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) |

## Track DC — Frontend testing

| # | Topic | Objective |
|---|---|---|
| D07 | Unit and component tests with Vitest ★ | The test pyramid for a frontend; Vitest with jsdom; testing a component through what the user sees (roles, labels, text) rather than its internals; user events; mocking the HTTP layer instead of the component; testing a store or hook on its own. The React variant uses Testing Library, the Vue variant Vue Test Utils. *Read:* [Vitest — getting started](https://vitest.dev/guide/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| D08 | End-to-end tests with Playwright ★ | What only an E2E test catches; locators by role, auto-waiting and why `sleep` is a defect; one login done once and reused; seeding test data; running headless in CI against a compose stack; traces for a failure that only happens in CI. *Prereq: D05.* *Read:* [Playwright — intro](https://playwright.dev/docs/intro), [Playwright — CI](https://playwright.dev/docs/ci-intro) |

## Track DD — Cloud and orchestration

| # | Topic | Objective |
|---|---|---|
| D09 | AWS basics for one application ★ | EC2 (an instance, a security group, an SSH key), RDS (a managed database, why it lives in a private subnet), S3 + CloudFront for a static frontend, IAM users vs roles, what costs money while idle. Only claim what was actually deployed. *Read:* [What is Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html), [What is Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html), [S3 static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) |
| D10 | Kubernetes basics ☆ | Pod, Deployment, Service, ConfigMap, Secret; desired state and the control loop; what a Deployment adds over a pod; readiness vs liveness probes; moving a compose stack to a local `kind` cluster. *Prereq: D02.* *Read:* [Kubernetes overview](https://kubernetes.io/docs/concepts/overview/), [kind quick start](https://kind.sigs.k8s.io/docs/user/quick-start/) |
