# 06 — RAID log

Living log. Update at least weekly. **P**robability / **I**mpact: 1–5.

## Risks

| ID | Risk | P | I | Score | Mitigation | Owner | Status |
|----|------|---|---|-------|------------|-------|--------|
| R1 | Scope creep (sidecars, email, portfolio site inside app) | 4 | 4 | 16 | SoT + scope-guard agent; change log | Sean | Open |
| R2 | Stop dogfooding; docs become theater | 3 | 5 | 15 | Daily Today habit; blunt rollover | Sean | Open |
| R3 | Homelab downtime loses trust in sync | 2 | 4 | 8 | Postgres volume backups; export JSON | Sean | Open |
| R4 | Secrets leak into portfolio screenshots | 2 | 5 | 10 | Sanitize checklist in portfolio-export | Sean | Open |
| R5 | Agent output drifts from DoD / validation | 3 | 3 | 9 | Playwright gate; senior-auditor on big diffs | Sean | Open |
| R6 | Windows/port/Prisma friction slows delivery | 3 | 2 | 6 | Documented ports; kill/restart runbook | Sean | Watching |

## Assumptions

| ID | Assumption | Validated? | If wrong |
|----|------------|------------|----------|
| A1 | Homelab remains available for Postgres | Yes (local) | SQLite fallback later — out of V1 |
| A2 | Agent team available when Sean works | Mostly | Manual coding; slow velocity |
| A3 | Portfolio site can be built later from exports | Yes (decision 2026-07-28) | Publish markdown-only interim |
| A4 | Manual correspondence archive is enough without IMAP | Yes (SoT lock) | Re-scope email later |

## Issues

| ID | Issue | Raised | Impact | Action | Status |
|----|-------|--------|--------|--------|--------|
| I1 | Existing DB seed still has old “Install Jira…” Week 1 tasks | 2026-07-28 | Confusing Today copy | Ran `db:remap-sample` (209 titles, milestones, RACI task) | **Resolved** 2026-07-28 |
| I2 | SMTP UI remains in Settings though email notify not must-have | 2026-07-28 | Product message drift | Label optional/dormant or hide later | Open |

## Dependencies

| ID | Dependency | Needed by | Owner | Status |
|----|------------|-----------|-------|--------|
| D1 | Docker Postgres healthy | All API work | Sean | Met |
| D2 | SoT / seed language aligned | Roadmap credibility | Sean / seeder | **Met** 2026-07-28 |
| D3 | Screenshots for portfolio | Case study publish | Sean | **Met** (capture); review open |
| D4 | Separate portfolio site repo | Public URL | Sean | Future |
