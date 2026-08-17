# 06 — RAID log

Living log. Update at least weekly. **P**robability / **I**mpact: 1–5.

**Reviewed:** 2026-08-17 (Sprint 3 closed: T8.3, Sunday Review, LAN shots, dump TOC).

## Risks

| ID | Risk | P | I | Score | Mitigation | Owner | Status |
|----|------|---|---|-------|------------|-------|--------|
| R1 | Scope creep (sidecars, email, portfolio site, Python-in-GYAM) | 4 | 4 | 16 | SoT ship order + scope-guard; change log or it did not happen; Sunday Review as change-control; two-repo rule (GYAM TypeScript / Harbor Python) | Sean | Open — weekly gate, not a feature |
| R2 | Stop dogfooding; docs become theater | 2 | 5 | 10 | Daily Today on TrueNAS LAN; blunt rollover | Sean | **Watching** — live Progress 2026-08-17: streak 4d, best 11d, last-30 avg 98%; Today blocked on 2026-08-13 Excel/Power BI |
| R3 | Homelab downtime loses trust in sync | 2 | 4 | 8 | Postgres volume backups; export JSON; TrueNAS datasets | Sean | **Watching** — dump proven 2026-08-17: `/mnt/appPool/GYAM/gyam-20260817.dump` (120K, CUSTOM, gzip, 57 TOC entries, PG 16.14). Keep Aug 2 52K dump. |
| R8 | TrueNAS Apps lifecycle desync if Watchtower recreates containers | 2 | 3 | 6 | Label **app only**; YAML volume/path changes need Custom App **Save** (Watchtower pulls images, does not attach datasets) | Homelab Deploy | Watching — T8.3 passed 2026-08-17 (PDF still on volume after app restart) |
| R4 | Secrets leak into portfolio screenshots | 1 | 5 | 5 | Sanitize checklist; live PNGs gitignored | Sean | **Watching** — GitHub should be app code only; next commit removes tracked screenshots |
| R5 | Agent output drifts from DoD / validation | 3 | 3 | 9 | Playwright gate; senior-auditor on big diffs | Sean | Open |
| R6 | Windows/port/Prisma friction slows delivery | 3 | 2 | 6 | Documented ports; kill/restart runbook | Sean | Watching |

## Assumptions

| ID | Assumption | Validated? | If wrong |
|----|------------|------------|----------|
| A1 | Homelab remains available for Postgres | Yes (TrueNAS Phase A LAN + local Compose) | SQLite fallback later — out of V1 |
| A2 | Agent team available when Sean works | Mostly | Manual coding; slow velocity |
| A3 | Portfolio site can be built later from exports | Yes (decision 2026-07-28) | Publish markdown-only interim |
| A4 | Manual correspondence archive is enough without IMAP | Yes (SoT lock) | Re-scope email later |
| A5 | LAN-only is enough; no GYAM public hostname | Yes (decision 2026-08-12) | Free later: hostname on existing `yum4less.com` zone, no new domain |

## Issues

| ID | Issue | Raised | Impact | Action | Status |
|----|-------|--------|--------|--------|--------|
| I1 | Existing DB seed still has old “Install Jira…” Week 1 tasks | 2026-07-28 | Confusing Today copy | Ran `db:remap-sample` (209 titles, milestones, RACI task) | **Resolved** 2026-07-28 |
| I2 | SMTP UI remains in Settings though email notify not must-have | 2026-07-28 | Product message drift | Dormant-label Settings card | **Resolved** 2026-08-12 |
| I3 | Task/job attachments fail on TrueNAS | 2026-08-12 | S8 blocked | Perms on live `/mnt/appPool/gyam/uploads` (app uid 1000). Proof 2026-08-16: `agile project mgmt.pdf` on task “GYAM backlog / agent-team check-in”; mount `gyam/uploads` → `/app/data/uploads`. | **Resolved** 2026-08-16 |
| I4 | Completed backlog tasks leave Today; Roadmap defaults to today-forward | 2026-08-16 | Hard to reopen notes/files after Done | Sean: Roadmap date range is enough; no catalog page / extra UX | **Accepted** 2026-08-16 (workaround; no app change) |

## Dependencies

| ID | Dependency | Needed by | Owner | Status |
|----|------------|-----------|-------|--------|
| D1 | Docker Postgres healthy | All API work | Sean | Met |
| D2 | SoT / seed language aligned | Roadmap credibility | Sean / seeder | **Met** 2026-07-28 |
| D3 | Screenshots for portfolio | Case study publish | Sean | **Met** (LAN recapture 2026-08-17); PIN field empty on login; Jobs has real company names — review before public git |
| D4 | Separate portfolio site repo | Public URL | Sean | Future |
| D5 | Yum4Less Cloudflare Tunnel first | GYAM Phase B HTTPS + `COOKIE_SECURE` | Sean | **Ready / parked** — Yum4Less live 2026-08-04; no GYAM tunnel (LAN-only, no extra domain) |
