# 07 — WBS / product backlog (Epic · Stories · Tasks)

This satisfies the roadmap “sample software project: Epic, 5 Stories, 10 Tasks” using **GYAM**, not Jira.

## Epic E1 — GYAM V1 Career OS

Deliver a usable homelab-hosted PM-career operating system with accountability, jobs tracking, and portfolio-ready governance.

### Story S1 — Authenticated Today experience
As Sean, I need PIN login and today’s tasks so I can execute the roadmap daily.  
**Status:** Done (V1)

Tasks:
1. T1.1 Users table + hashed PIN + session cookie  
2. T1.2 Roadmap seed from first-use date  
3. T1.3 Today view with progress  

### Story S2 — Timer & accountability
As Sean, I need start/pause/keep-alive/auto-pause and rollover blocking so incomplete days hurt.  
**Status:** Done (V1)

Tasks:
4. T2.1 Timer elapsed excluding pauses  
5. T2.2 Hourly keep-alive + 60s auto-pause  
6. T2.3 Rollover block + blunt copy  

### Story S3 — Jobs & correspondence archive
As Sean, I need a pipeline and manual employer-mail archive (paste/attach) without email integration.  
**Status:** Done (V1 core); polish optional

Tasks:
7. T3.1 Pipeline + weekly quotas  
8. T3.2 Paste subject/body + optional attach allowlist  

### Story S4 — Progress, review, editable roadmap
As Sean, I need streaks/heatmap, Sunday review, and editable plan/milestones.  
**Status:** Done (V1)

Tasks:
9. T4.1 Streaks + heatmap  
10. T4.2 Guided Sunday review + roadmap editor  

### Story S5 — Local notify, sync, backup, quality
As Sean, I need local notifications, export/import, validation, and automated edge tests.  
**Status:** Done for V1 gates; portfolio/ops follow-ons open

Tasks:
- [x] T5.1 OS / in-app notifications  
- [x] T5.2 Export/import JSON  
- [x] T5.3 Input validation hardening  
- [x] T5.4 Playwright edge suite (22/22)  
- [ ] T5.5 Homelab HTTPS / COOKIE_SECURE (ops)  
- [x] T5.6a Portfolio screenshots (8 captured 2026-07-28)  
- [ ] T5.6b Case-study metrics + PII review  

### Epic E2 — Multi-purpose governance (opened 2026-07-28)
As Sean (PM), I need GYAM to count as the sample software project and PM practice lab.  
**Status:** In progress

- [x] SoT multi-purpose roles (P1–P7)  
- [x] `docs/pm` pack + progress history  
- [x] Agent-team RACI  
- [x] DB remap sample-project language  
- [ ] Sustained weekly status/RAID for Month 2 milestone  

## Mapping to “5 Stories / 10 Tasks”

S1–S5 are the five product stories. T1.1–T4.2 plus T5.1–T5.4 cover the original ten + quality gates (complete). E2 is the governance epic layered on after V1.
