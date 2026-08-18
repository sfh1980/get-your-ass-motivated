# 15 — In-app PM dashboard (`/pm`)

**Updated:** 2026-08-17  
**Story:** S10 (Epic E2)  
**Why it exists:** GYAM is a PM practice lab (SoT P4), not only a task app. The living pack in this folder is the *source* of RAID/WBS/RACI. The **PM** screen is how Sean *uses* those artifacts the way a working PM uses a status dashboard — and how he studies them.

Nav: **Today · Progress · PM · Jobs · Review · Roadmap · Settings**

---

## Why we built it (decision)

After Sprint 3 close, Sean asked for:

1. Research of standard PM charts / tables / graphs.  
2. A **separate screen** with the most relevant ones, driven by codebase, `docs/pm`, and the **live application database**.  
3. Later: a **How this works** lesson on every block so the screen teaches, not just scores.

Accepted because it is P3–P4 evidence (sample project + practice lab) without gold-plating a portfolio website, Gantt-with-fake-dependencies, or EVM with no budget.

**Not in V1 ship order.** Explicit user request after V1; logged in the change log.

---

## What the screen is

A dark GYAM page (`apps/web/src/pages/PmPage.tsx`) that loads `GET /api/pm/dashboard` once per visit.

Each card has **How this works**. The modal (`apps/web/src/pm/pmLessons.ts`) always covers:

| Section | Intent |
|---------|--------|
| What it is | Layman definition |
| Purpose | Why a PM bothers |
| How project managers use it | Status meeting / steering / interview behavior |
| Need to know | Traps, vocabulary, integrity |
| On this GYAM screen | Live vs snapshot so the toy is not confused with the job |

The status-strip modal also walks each KPI (streak, last 30d, tasks, jobs, quota, rollover, reviews, milestones).

---

## Live vs snapshot (do not mix these up)

| Updates when you use GYAM (Postgres, no git) | Updates only when the snapshot is edited **and** a new image is deployed |
|-----------------------------------------------|--------------------------------------------------------------------------|
| Streak, last-30d %, tasks done/open | RAID scores / statuses / issue list |
| Burnup of completed tasks | WBS S1–S10 story statuses |
| Hours by subject (timer elapsed) | Standing RACI rows |
| Job funnel **counts** (no company names) | Sprint pill / window copy |
| Applies by week | Chart catalog Yes/No reasons |
| Completion heatmap | |
| Apply quota vs target | |
| Rollover / today blocked | |
| Sunday Review submitted weeks | |
| Roadmap milestones ticked | |

**Why a snapshot:** the Docker image does **not** copy `docs/pm` markdown. Parsing RAID from git at runtime on TrueNAS would be a lie unless those files are in the image. The snapshot lives in `apps/api/src/pm/governanceSnapshot.ts` (`GOVERNANCE_AS_OF`). Weekly RAID edits in `06-raid-log.md` do not move the `/pm` dots until that file is updated and Watchtower pulls a new `:homelab` image (no YAML Save for this — it is app code).

Daily dogfood does **not** require git. Governance labels on `/pm` do.

---

## What we render (honest data only)

| Visual | PM analog | GYAM data |
|--------|-----------|-----------|
| Status / KPI strip | RAG dashboard | Live streaks, quota, blockers |
| Burnup | Cumulative delivery | Completed tasks through today |
| Job funnel | Pipeline / Kanban counts | Job status counts |
| Hours by subject | Effort / resource view | Timer `elapsedMs` |
| Applies by week | Throughput / velocity analog | `appliedAt` by week |
| Heatmap | Cadence / reliability | Same window as Progress |
| P×I matrix | Risk matrix | Snapshot RAID P and I |
| RAID table | RAID log | Snapshot risks + issues |
| WBS table | Epic / story status | Snapshot S1–S10 |
| RACI table | Responsibility matrix | Snapshot standing rows |
| Milestones | Named checkpoints | Live `Milestone` rows |
| Sunday reviews | Retro cadence | Live `WeeklyReview` rows with content |
| Catalog | Tool selection log | Snapshot: used vs skipped |

Job **employer names stay on Jobs**. `/pm` never returns them (screenshot / public-repo hygiene).

---

## What we skipped (and why)

Gantt with predecessors, PERT/CPM, earned value (PV/EV/AC, SPI/CPI), resource histograms, SPC control charts, stakeholder power/interest maps.

GYAM has no task-dependency graph, no cost baseline, and a solo operator. Drawing those would be fiction. The catalog on `/pm` is the teaching list: recognize the chart in a PMO, refuse to fake it here.

No new chart library (CSS/SVG) — keep the image lean and the aesthetic GYAM-dark, not a generic dashboard kit.

---

## Code map

| Piece | Path |
|-------|------|
| Shared DTO | `packages/shared/src/index.ts` (`PmDashboardDto`) |
| Governance snapshot | `apps/api/src/pm/governanceSnapshot.ts` |
| Aggregations | `apps/api/src/services/pmDashboard.ts` |
| Route | `GET /api/pm/dashboard` (`apps/api/src/routes/pm.ts`) |
| Page | `apps/web/src/pages/PmPage.tsx` |
| Lessons | `apps/web/src/pm/pmLessons.ts` |
| Modal | `apps/web/src/components/PmHowModal.tsx` |
| Nav | `apps/web/src/components/AppShell.tsx` — label **PM**, path `/pm` |

---

## How to keep it honest

1. After a Sunday RAID/WBS/RACI/sprint edit, update `governanceSnapshot.ts` in the same change when you want `/pm` to match.  
2. Do not add EVM/Gantt “to look complete.”  
3. Recapture `gyam-pm.png` locally only (`e2e/portfolio-screenshots.spec.ts`); do not commit live PNGs.  
4. TrueNAS: commit + push → GHCR `:homelab` → Watchtower. Image pull only; no Custom App YAML Save for this feature.
