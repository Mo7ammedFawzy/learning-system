# Jobs

What the job market asks for, mapped to the topics that close each gap. Built from the
improvement plan (`C:/Projects/personal/Improvement_Plan.md`, postings from Cairo/Giza and remote,
Oct 2026). Add a row for every posting worth applying to; postings scraped with the job-search
tool land in `C:/Projects/personal/ai-job-search/documents/postings/`.

This file does not reorder lessons. It answers two questions: **which topics make me hireable for
this role**, and **which gaps keep showing up**.

Status: ✅ on the CV with evidence · 🟡 learning or building · ❌ gap

## Demand

How many of the tracked postings ask for each skill. The delivery track is ordered by this.

| Skill | Postings | Topics | Practised in (`state/TASKS.md`) | Status |
|---|---|---|---|---|
| Docker / Docker Compose | 5 | D01–D04 | L01, L04, L09, E06 | ❌ |
| CI/CD (GitHub Actions) | 4 | D05, D06 | L05, L12, P01 | ❌ |
| PostgreSQL | 4 | 47, 48 | L02, L03 | ❌ |
| React | 3+ | R01–R41 | L07–L08 | 🟡 scratched R01–R12 |
| Kubernetes / OpenShift | 3 | D10 | L14 | ❌ |
| Cloud (AWS / Azure / GCP) | 3 | D09 | L13 | ❌ |
| Frontend testing (Vitest, Playwright, Cypress) | 2 | D07, D08 | L10, L11, P02, P03 | ❌ |
| AI coding tools | 3 | — | daily use | not a lesson: a CV line |
| Node.js (Express, NestJS) | 2 | N01–N08 | E01–E06 | ❌ |
| Flyway / Liquibase | 1 | 48 | L03 | ❌ |
| Keycloak / OAuth2 | 1 | 49 | L15 | ❌ |
| Vue + Spring Boot together | 2 | — | already the CV headline | ✅ |

## Postings

| Company | Asked for (beyond Vue / Java) | Topics | Notes |
|---|---|---|---|
| Advansys | Docker, Kubernetes / OpenShift | D01–D04, D10 | |
| Naseej | Docker, CI/CD, Kubernetes, PostgreSQL, cloud, Keycloak, Vue + Spring Boot | D01–D05, D09, D10, 47, 49 | Strong stack match |
| Etisalat | Docker, CI/CD, PostgreSQL, React, Node | D01–D05, 47, R track, N track | |
| Vertex Technologies (2 roles) | Docker, CI/CD, PostgreSQL, React, cloud, AI coding tools, Node; NestJS for the Medior role | D01–D05, D09, 47, R track, N track | |
| Ditech | Docker, CI/CD, dashboards and charts, Vue + Spring Boot | D01–D05 | Strong stack match |
| Istinara | Kubernetes, PostgreSQL, cloud, Flyway / Liquibase | D09, D10, 47, 48 | |
| KNOT | React, frontend testing | R track, D07, D08 | |
| Techsa | Frontend testing | D07, D08 | |
| FlairsTech | AI coding tools | — | |

## Adding a posting

One row: company, what it asks for beyond what the CV already shows, the topic IDs that cover it.
Then bump the counts in **Demand**. A skill that reaches 3 postings and has no topic gets one
added to the nearest track.
