# Case study outline — GYAM (draft)

**Updated:** 2026-07-28

## Title
GYAM: A Multi-Purpose PM Career OS and Sample Software Project

## Overview
- **Problem:** Career roadmap lived in markdown; weak accountability; no unified jobs/correspondence tracker; no real sample project for PM evidence.
- **Solution:** Homelab TypeScript full-stack PWA + Postgres that is simultaneously (1) daily OS, (2) sample software project, (3) PM practice lab with an agent delivery team, (4) portfolio artifact staging.
- **Duration:** Started 2026-07-27; V1 local soft-complete same day; governance + screenshots 2026-07-28; ongoing dogfood.

## Role
- Project manager / product owner / primary stakeholder.
- Supervised a Cursor **agent team** (scope guard, roadmap, homelab, specialists) via RACI — solo human, managed delivery.

## Challenge
- Deliver V1 fast without gold-plating (email protocols, sidecars, portfolio site-in-app).
- Keep multiple purposes clear so the project “counts” for roadmap + interviews.

## Approach
- Source of Truth with locked ship order and multi-purpose table (P1–P7).
- Hybrid Agile weekly sprints + predictive docs (charter, RAID, status).
- Local notifications + manual correspondence archive (outcomes without IMAP/SMTP).
- Automated Playwright edge tests (22/22) + portfolio screenshot capture.

## Outcomes (update with live metrics)
- V1 local feature set largely complete (auth → Today → jobs → roadmap → notify/export/validation).
- Playwright edge suite: **22/22** passed (2026-07-27).
- PM pack under `docs/pm`; sample-project language remapped in DB.
- Portfolio screenshots: **8** staged under `portfolio-export/screenshots/`.
- _(Add: days dogfooded, jobs tracked, streak, etc.)_

## Artifacts to attach on portfolio site
- Screenshots: login, today, today-mobile, progress, jobs, review, roadmap, settings  
- Charter, RAID excerpt, sprint plan, status report, multi-purpose progress doc  
- Architecture / homelab note (`docs/homelab.md`)  
- “What I did as PM” bullets: scope decisions, agent supervision, RAID, DoD/Playwright gate
