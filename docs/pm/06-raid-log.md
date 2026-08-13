# 06 — RAID log

Living log. Update at least weekly. **P**robability / **I**mpact: 1–5.

**Reviewed:** 2026-08-12 (Sean decisions in chat).

## Risks

| ID | Risk | P | I | Score | Mitigation | Owner | Status |
|----|------|---|---|-------|------------|-------|--------|
| R1 | Scope creep (sidecars, email, portfolio site inside app) | 4 | 4 | 16 | SoT + scope-guard agent; change log | Sean | Open |
| R2 | Stop dogfooding; docs become theater | 2 | 5 | 10 | Daily Today on TrueNAS LAN; blunt rollover | Sean | **Watching** — Sean using live app 2026-08-12 |
| R3 | Homelab downtime loses trust in sync | 2 | 4 | 8 | Postgres volume backups; export JSON; TrueNAS datasets | Sean | Open — dump not verified from workstation (SSH refused) |
| R8 | TrueNAS Apps lifecycle desync if Watchtower recreates containers | 2 | 3 | 6 | SHA pin rollback; label **app only**; YAML volume changes need Custom App Save (Watchtower does not attach datasets) | Homelab Deploy | Watching — Watchtower used for image pulls |
| R4 | Secrets leak into portfolio screenshots | 1 | 5 | 5 | Sanitize checklist in portfolio-export | Sean | **Watching** — Sean: no saved PIN in shots; PNGs not in working tree to re-inspect |
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
| I3 | Task/job attachments fail on TrueNAS — uploads dataset not mounted | 2026-08-12 | S8 blocked; files would be ephemeral | Create `appPool/GYAM/uploads`, chown 1000:1000, bind `/app/data/uploads`, Save Custom App YAML | Open |

## Dependencies

| ID | Dependency | Needed by | Owner | Status |
|----|------------|-----------|-------|--------|
| D1 | Docker Postgres healthy | All API work | Sean | Met |
| D2 | SoT / seed language aligned | Roadmap credibility | Sean / seeder | **Met** 2026-07-28 |
| D3 | Screenshots for portfolio | Case study publish | Sean | **Met** (capture); PIN review accepted 2026-08-12; metrics still N/A |
| D4 | Separate portfolio site repo | Public URL | Sean | Future |
| D5 | Yum4Less Cloudflare Tunnel first | GYAM Phase B HTTPS + `COOKIE_SECURE` | Sean | **Ready / parked** — Yum4Less live 2026-08-04; no GYAM tunnel (LAN-only, no extra domain) |
