# 00 — Multi-purpose project + progress (beginning → now)

**Updated:** 2026-08-12  
**Audience:** Sean (PM) + future portfolio readers (sanitized)

## Why this document exists

GYAM is not a single-purpose toy app. It is one repository that simultaneously serves as:

1. a **daily career operating system**,  
2. the **sample software project** on the PM roadmap,  
3. a **PM practice lab** (you managing an agent delivery team), and  
4. a **staging ground** for portfolio artifacts (site built separately later).

This file is the narrative bridge between those roles and the factual progress from day one to now.

---

## Multi-purpose map

| Purpose | Primary artifacts | “Done” looks like |
|---------|-------------------|-------------------|
| Career OS (use it) | Running app: Today, Jobs, Review… | Daily dogfood; real job/correspondence data |
| Roadmap engine | Seed + editable roadmap in DB | Remapped Week 1+ language; milestones current |
| Sample software project | Epic/Stories/Tasks in `07-wbs-backlog.md` | V1 stories Done; sprints logged |
| PM practice lab | Charter, RAID, RACI, status, DoD | Weekly RAID/status; agent assignments |
| Portfolio evidence | `portfolio-export/` | Screenshots + case study ready to copy |
| Homelab reference | `docs/homelab.md`, TrueNAS Phase A | LAN Custom App runbook; WAN Phase B deferred |
| Dual-track Python CS (P8) | `14-python-cs-epic.md`, seed + `db:remap-python-cs` | Specific Monday/Saturday titles by `sourceWeek` |
| Future template | Shared schema / multi-user-ready auth | Later — not V1 success criteria |

---

## Timeline: beginning → current state

### Phase A — Discovery & SoT (pre-code → 2026-07-27 morning)
- Career goal: Technical Project Coordinator / Google PM Certificate path.  
- Inputs: daily roadmap markdown, resume, Cursor discovery decisions.  
- Locked early: TypeScript stack, PIN auth, homelab Postgres, blunt accountability.

### Phase B — Sprint 0 / V1 build (2026-07-27)
Shipped in sequence (SoT ship order):

| Capability | Status |
|------------|--------|
| Auth (username + hashed PIN) + sessions | Done |
| Roadmap seed from first-use date | Done |
| Today + timer / pause / keep-alive / auto-pause | Done |
| Rollover blocking + blunt copy | Done |
| Notes | Done |
| Streaks / heatmap | Done |
| Jobs pipeline + weekly quotas | Done |
| Correspondence archive (paste + attach) | Done |
| Guided Sunday review | Done |
| Editable roadmap / milestones / subjects | Done |
| Local OS notifications + Settings | Done |
| Export / import JSON | Done |
| Homelab notes | **Done** — Phase A live on TrueNAS 2026-08-02 |
| Input validation hardening | Done |
| Playwright edge suite | Done — **22/22** |

**Scope decision (same day):** Drop email/SMTP **notifications** as must-have. Keep outcomes via **local notifications** + **manual** employer correspondence archive.

Optional SMTP code may remain dormant in Settings — product truth is “not required.”

### Phase C — Sample project + PM pack (2026-07-28)
- Declared GYAM = roadmap sample software project (not Jira sandbox).  
- Solo model: **Cursor subagents = supervised delivery team** (RACI).  
- Created full `docs/pm` pack (charter → lessons).  
- Remapped live DB (`db:remap-sample`: 209 titles, milestones, RACI task).  
- Captured **8** Playwright screenshots into `portfolio-export/screenshots/`.

### Phase D — Now (current)
| Area | State |
|------|--------|
| Product V1 (local + TrueNAS) | In daily use on LAN; coach briefs live; file attachments blocked until uploads dataset (I3) |
| Governance docs | Sprint 2 closed 2026-08-12; Sprint 3 = uploads mount + dump proof |
| Portfolio export | Screenshots captured; PIN review accepted; metrics N/A |
| Dogfood | **In use** on TrueNAS (S6) |
| Portfolio website | Explicitly **out of this repo** |
| Homelab HTTPS / COOKIE_SECURE | Phase B **parked** (LAN-only; no extra domain). Yum4Less Tunnel no longer blocks. |
| Homelab Phase A (LAN) | **Done** 2026-08-02 — `http://192.168.1.246:4070` |
| Python CS dual-track (P8) | Titles + briefs remapped; weeks 11/13/17 names **parked** until CS work starts |

---

## What “progress” means for each purpose

| Purpose | Progress signal |
|---------|-----------------|
| OS | Tasks completed in Today; streaks; jobs moved through pipeline |
| Sample project | S1–S5 Done; S6–S9 in Sprint 2; Playwright green; change log honest |
| PM practice | RAID/status updated; sprint goals met or descope’d |
| Portfolio | Export checklist advancing; no secrets in screenshots |

---

## Open work (not failures — next focus)

1. **I3 / S8:** create `appPool/GYAM/uploads`, mount `/app/data/uploads`, Save Custom App YAML, attach one file.  
2. Prove a Postgres dump on the pool (R3) — run on TrueNAS Shell.  
3. Optional T6.3: Sunday Review in-app if not already submitted.  
4. Phase B parked (LAN-only). Free later: hostname on `yum4less.com`, no new domain.  
5. Python CS weeks 11/13/17 names parked until curriculum is reached.

---

## Related docs

- Charter: `01-project-charter.md`  
- Backlog: `07-wbs-backlog.md`  
- Current sprint: `08-sprint-plan.md`  
- Status: `10-status-report.md`  
- Python CS epic: `14-python-cs-epic.md`  
- SoT multi-purpose table: `GYAM_SOURCE_OF_TRUTH.md` §1
