# Case study outline — GYAM (draft)

**Updated:** 2026-08-17

## Title
GYAM: A Multi-Purpose PM Career OS and Sample Software Project

## Overview
- **Problem:** Career roadmap lived in markdown; weak accountability; no unified jobs/correspondence tracker; no real sample project for PM evidence.
- **Solution:** Homelab TypeScript full-stack PWA + Postgres that is simultaneously (1) daily OS, (2) sample software project, (3) PM practice lab with an agent delivery team **and an in-app `/pm` dashboard with teaching modals**, (4) portfolio artifact staging.
- **Duration:** Started 2026-07-27; V1 local soft-complete same day; governance + screenshots 2026-07-28; Sprint 3 closed 2026-08-17; S10 `/pm` same day.

## Role
- Project manager / product owner / primary stakeholder.
- Supervised a Cursor **agent team** (scope guard, roadmap, homelab, specialists) via RACI — solo human, managed delivery.

## Challenge
- Deliver V1 fast without gold-plating (email protocols, sidecars, portfolio site-in-app).
- Keep multiple purposes clear so the project “counts” for roadmap + interviews.

## Approach
- Source of Truth with locked ship order and multi-purpose table (P1–P7).
- Hybrid Agile weekly sprints + predictive docs (charter, RAID, status).  
- In-app **PM** tab: live burnup/funnel/heatmap from Postgres; RAID/WBS as a deployed snapshot; **How this works** on every widget so the product trains the PM, not only the user. Honest skip of Gantt/EVM/PERT (no fake data).  
- Local notifications + manual correspondence archive (outcomes without IMAP/SMTP).
- Automated Playwright edge tests (22/22) + portfolio screenshot capture.

## Outcomes (update with live metrics)
- V1 local feature set largely complete (auth → Today → jobs → roadmap → notify/export/validation).
- Playwright edge suite: **22/22** passed (2026-07-27).
- PM pack under `docs/pm`; sample-project language remapped in DB.  
- In-app PM dashboard (`/pm`, S10) + lesson modals; write-up `docs/pm/15-in-app-pm-dashboard.md`.  
- Portfolio screenshots: recaptured on LAN 2026-08-17 (**local only**, not GitHub).
- _(Metrics N/A 2026-08-12 — fill streak / jobs moved / sprint outcomes when numbers are real and worth showing.)_

## Artifacts to attach on portfolio site
- Screenshots: login, today, today-mobile, progress, pm, jobs, review, roadmap, settings (pm/jobs local-only if they show live data)  
- Charter, RAID excerpt, sprint plan, status report, multi-purpose progress doc  
- Architecture / homelab note (`docs/homelab.md` — TrueNAS Phase A)  
- “What I did as PM” bullets: scope decisions, agent supervision, RAID, DoD/Playwright gate, in-app dashboard with teaching layer instead of fake EVM/Gantt
