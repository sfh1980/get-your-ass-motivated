# 01 — Project charter: GYAM

| Field | Value |
|-------|--------|
| Project name | GYAM — Get Your Ass Motivated |
| Version | 1.3 |
| Date | 2026-08-03 |
| Project manager | Sean Holmes |
| Sponsor | Sean Holmes (self-sponsored career project) |
| Start | 2026-07-27 (first-use / seed date) |
| V1 product | Soft-complete locally (2026-07-27); TrueNAS Phase A live |
| Current phase | Sprint 2 — living cadence, dogfood, portfolio evidence (S6–S9) |

## 1. Business case / why

Sean is pivoting toward **Technical Project Coordinator** roles (Google Project Management Certificate track). GYAM is a **multi-purpose** project:

1. Personal career OS (execute the 12-month roadmap with accountability).  
2. The **sample software project** (real codebase + Epic/Stories/Tasks — not a Jira sandbox).  
3. A PM practice lab (Sean supervises Cursor agents as the delivery team).  
4. Portfolio evidence staging (`docs/pm/portfolio-export/`) for a separate future site.  
5. Homelab / full-stack reference for interviews.

## 2. Objectives

1. ~~Ship usable V1 OS~~ → **Met** for local use (Today → jobs → roadmap → notify/export/validation/tests).  
2. Practice hybrid Agile + predictive PM docs on a real codebase → **In progress** (`docs/pm` live).  
3. Produce portfolio-ready artifacts → **In progress** (8 screenshots captured; case-study metrics TBD).  
4. Dogfood daily with real data → **Open** (habit formation).  
5. Keep purposes distinct — do not build the public portfolio website inside this repo → **Locked**.

## 3. In-scope deliverables

**Product (V1):** SoT §9 — largely delivered.  
**Governance:** This pack (`docs/pm`).  
**Portfolio staging:** Screenshots/notes/sanitized copies under `portfolio-export/`.

## 4. Out of scope (unless re-scoped)

SMTP/email as must-have notify channel; LinkedIn automation; PDF OCR as primary; hiringcafe watcher; deep Google Calendar; Tauri; **building the public portfolio website in this repo**.

## 5. High-level milestones

| Milestone | Intent | Status |
|-----------|--------|--------|
| M0 Scaffold | Auth, seed, Today | **Done** 2026-07-27 |
| M1 V1 feature complete | SoT ship order local | **Done** (soft) 2026-07-27 |
| M2 PM pack live | Living docs + sample-project lock | **Done** init 2026-07-28 |
| M3 Portfolio-ready | Export grab-ready for separate site | **In progress** (screenshots yes) |
| M4a Homelab LAN | TrueNAS Custom App Phase A (db+app, LAN `:4070`) | **Done** 2026-08-02 |
| M4b Homelab HTTPS | Cloudflare Tunnel + cookie secure (after Yum4Less CF) | Open (blocked) |

## 6. Success criteria

- [x] Playwright edge suite green (22/22, 2026-07-27).  
- [x] Living PM pack initialized; roadmap DB remapped to GYAM sample-project language.  
- [x] Portfolio screenshots staged (8 files, 2026-07-28).  
- [ ] Daily use of GYAM Today for ≥2 consecutive weeks.  
- [ ] Job pipeline + correspondence reflect real applications.  
- [ ] RAID + status updated weekly for ≥4 weeks.  
- [ ] `portfolio-export/` grab checklist complete (PII-reviewed + metrics).

## 7. Budget / resources

- Cost: existing homelab; no paid SaaS required for V1.  
- Time: roadmap routine blocks.  
- Team: Sean + Cursor agent team (see RACI).

## 8. Assumptions & constraints

- Single human operator; agents execute under Sean’s supervision.  
- Data stays on homelab.  
- TypeScript stack locked for V1.  
- Multi-purpose does **not** mean infinite scope — SoT + change log govern cuts.

## 9. Authorization

Sean Holmes authorizes GYAM as the multi-purpose career OS + sample software project and accepts PM accountability for scope, quality, and timeline trade-offs.

**Sign-off:** Sean Holmes — 2026-07-28 (v1.2)
