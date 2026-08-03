# GYAM — PM documentation pack

**Project:** GYAM (Get Your Ass Motivated)  
**Updated:** 2026-08-03  

## What this folder is

Living project-management artifacts for a **multi-purpose** project:

| Role | See |
|------|-----|
| Career OS + roadmap product | Running app + SoT |
| Sample software project | `07-wbs-backlog.md`, sprints |
| PM practice (you + agent team) | RACI, RAID, status, DoD |
| Portfolio staging (site later) | [`portfolio-export/`](./portfolio-export/) |

**Start here for the story of progress:** [`00-multi-purpose-and-progress.md`](./00-multi-purpose-and-progress.md)

## How this works (solo + agent team)

You are the **sponsor, product owner, and project manager**. Cursor **subagents are the delivery team you supervise**. You assign work, review outputs, accept/reject scope, and keep RAID/status current — that *is* the PM practice.

**Jira:** Not required for solo + agent-team delivery. Epic/Story/Task thinking lives in `07-wbs-backlog.md`.

## Document index

| # | Doc | Purpose |
|---|-----|---------|
| 00 | [Multi-purpose + progress](./00-multi-purpose-and-progress.md) | Roles P1–P8; beginning → now |
| 01 | [Project charter](./01-project-charter.md) | Authorize GYAM; objectives; success criteria |
| 02 | [Stakeholder register](./02-stakeholder-register.md) | Who cares; influence/interest |
| 03 | [Scope statement](./03-scope-statement.md) | In / out of scope; constraints |
| 04 | [RACI](./04-raci.md) | You vs agent-team responsibilities |
| 05 | [Communication plan](./05-communication-plan.md) | Cadence for status, RAID, reviews |
| 06 | [RAID log](./06-raid-log.md) | Risks, assumptions, issues, dependencies |
| 07 | [WBS / backlog](./07-wbs-backlog.md) | Epic, stories, tasks |
| 08 | [Sprint plan](./08-sprint-plan.md) | Hybrid Agile; Sprint 1 closed; Sprint 2 current |
| 09 | [Definition of done](./09-definition-of-done.md) | Quality bar |
| 10 | [Status report](./10-status-report.md) | Latest executive-style status |
| 11 | [Change log](./11-change-log.md) | Scope / decision changes |
| 12 | [Milestone plan](./12-milestone-plan.md) | Roadmap months ↔ GYAM outcomes |
| 13 | [Lessons learned](./13-lessons-learned.md) | Continuous capture |
| 14 | [Python CS epic](./14-python-cs-epic.md) | Dual-track Monday/Saturday curriculum ↔ roadmap |
| — | [Portfolio export](./portfolio-export/README.md) | Screenshots, notes, grab checklist |

## Weekly operating loop

1. **Monday** — Confirm sprint goal; pull stories into Today via GYAM.  
2. **Daily** — Use GYAM Today/timer; supervise agent work; log RAID issues.  
3. **Tuesday** — Agent-team check-in; update one PM artifact.  
4. **Sunday** — GYAM Review + refresh status + RAID + lessons.  
5. **Sprint end** — Demo checklist; move stories Done; plan next sprint.

## Remap note

Live DB language was remapped 2026-07-28 via `npm run db:remap-sample -w @gyam/api` (RAID I1 resolved). New installs use updated seed automatically.

Python CS Monday/Saturday titles: seed via `pythonCsCurriculum.ts`; live remap with `npm run db:remap-python-cs -w @gyam/api` (see [14-python-cs-epic.md](./14-python-cs-epic.md)).

Coach briefs (`Task.instructions`): seed via `coachBriefs.ts`; live fill with `npm run db:remap-coach-briefs -w @gyam/api` (TrueNAS remapped **1035** briefs on 2026-08-03).
