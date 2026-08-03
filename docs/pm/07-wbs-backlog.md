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
- [x] T5.5a TrueNAS Phase A LAN Custom App (Dockerfile/GHCR/migrate + Install) — **Done** 2026-08-02
- [ ] T5.5b Homelab HTTPS / COOKIE_SECURE (Phase B / Tunnel) — blocked on Yum4Less Cloudflare  
- [x] T5.6a Portfolio screenshots (8 captured 2026-07-28)  
- [ ] T5.6b Case-study metrics + PII review — **pulled into Sprint 2 as S7**  

### Epic E2 — Multi-purpose governance (opened 2026-07-28)
As Sean (PM), I need GYAM to count as the sample software project and PM practice lab.  
**Status:** In progress (Sprint 2 focuses on cadence)

- [x] SoT multi-purpose roles (P1–P7; P8 Python CS dual-track)  
- [x] `docs/pm` pack + progress history  
- [x] Agent-team RACI  
- [x] DB remap sample-project language  
- [ ] Sustained weekly status/RAID for Month 2 milestone — **S6/S7 support; formal cadence in Sprint 2**

### Story S6 — Sustained dogfood week
As Sean, I need to run GYAM on TrueNAS for real workdays so the sample project has usage evidence, not theater.  
**Status:** Sprint 2  
**Epic:** E3  
**Acceptance:** ≥5 calendar days with meaningful Today use; friction notes captured; R2 mitigated this week.

Tasks:
- [ ] T6.1 Complete Today tasks (or honest rollover) on LAN app ≥5 days  
- [ ] T6.2 Log blockers/friction in GYAM Home or vault Inbox  
- [ ] T6.3 Sunday Review submitted in-app  

### Story S7 — Portfolio evidence safe to show
As Sean, I need screenshots and metrics I can put in a case study without leaking secrets.  
**Status:** Sprint 2 (was T5.6b)  
**Epic:** E3  
**Acceptance:** All 8 screenshots PII-reviewed; case-study metrics draft filled or N/A with reason.

Tasks:
- [ ] T7.1 Walk `docs/pm/portfolio-export/` sanitize checklist against screenshots  
- [ ] T7.2 Draft metrics (streak, jobs moved, sprint outcomes) in `portfolio-export/notes/`  
- [ ] T7.3 Tick D3 “review” in RAID when clear  

### Story S8 — Accept coach briefs & task attachments (ops)
As Sean, I need the shipped coach-brief and attachment features verified on the live LAN build I actually use.  
**Status:** Sprint 2  
**Epic:** E3  
**Acceptance:** Seeded task shows filled “How to do this”; one real PM file attached under Notes on TrueNAS; no secrets in attach path.

Tasks:
- [ ] T8.1 Smoke coach brief on a Week 1 / routine task  
- [ ] T8.2 Attach one spreadsheet or diagram to a PM task; download/delete works  
- [ ] T8.3 Confirm uploads volume persists across container recreate (spot-check)  

### Story S9 — Python CS dual-track hygiene
As Sean, I need the dual-track curriculum titles honest and maintainable without gold-plating the app.  
**Status:** Sprint 2  
**Epic:** E2 (P8)  
**Acceptance:** Curr weeks 11/13/17 portfolio names filled **or** parked with owner+date; lived Mon software hour uses Wk1A/B briefs as-is (no pairing change unless evidence demands it).

Tasks:
- [ ] T9.1 Pull names from enhanced curriculum doc into `14-python-cs-epic.md` + seed **or** park  
- [ ] T9.2 Complete Mon software hour(s) this sprint using coach briefs  
- [ ] T9.3 Note pacing feedback after Week 1A/1B pair for later decision  

### Epic E3 — Dogfood & portfolio evidence (opened 2026-08-03)
As Sean (PM/PO), I need real usage and sanitized evidence so Month 1–2 milestones are credible.  
**Status:** Sprint 2  

- S6 Dogfood week  
- S7 Portfolio PII + metrics  
- S8 Accept briefs/attachments on LAN  

## Mapping to “5 Stories / 10 Tasks”

S1–S5 are the five product stories. T1.1–T4.2 plus T5.1–T5.4 cover the original ten + quality gates (complete). E2 is the governance epic layered on after V1. **S6–S9** are Sprint 2+ stories for habit, evidence, and dual-track hygiene — not a reset of the original five.
