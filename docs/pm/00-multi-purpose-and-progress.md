# 00 — Multi-purpose project + progress (beginning → now)

**Updated:** 2026-08-03  
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
| Product V1 (local + TrueNAS) | ~complete; coach briefs + task attachments shipped 2026-08-03 |
| Governance docs | Sprint 1 closed; Sprint 2 current (S6–S9, E3) |
| Portfolio export | Screenshots in; case-study outline draft; PII/metrics TBD (S8) |
| Dogfood streak | Sprint 2 focus — needs sustained daily use on TrueNAS |
| Portfolio website | Explicitly **out of this repo** until export pack is “grab-ready” |
| Homelab HTTPS / COOKIE_SECURE | Phase B — **blocked** until Yum4Less Cloudflare is done; then add GYAM |
| Homelab Phase A (LAN) | **Done** 2026-08-02 — `http://192.168.1.246:4070` |
| Python CS dual-track (P8) | Titles + coach briefs remapped on TrueNAS (1035 briefs); fill 11/13/17 names |

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

1. Sprint 2: dogfood ≥5 days on TrueNAS; Sunday status/RAID (S6–S7).  
2. PII-review screenshots + case-study metrics (S8).  
3. Accept coach briefs + attachments as usable for PM practice (S9).  
4. Optional: dormant-label SMTP UI (I2).  
5. Homelab Phase B HTTPS only after Yum4Less Cloudflare (RM4b). Phase A **Done**.  
6. Start separate portfolio site only after export pack is grab-ready.  
7. Fill Python portfolio names for curr weeks 11/13/17; confirm `db:remap-python-cs` on TrueNAS if titles still generic.

---

## Related docs

- Charter: `01-project-charter.md`  
- Backlog: `07-wbs-backlog.md`  
- Current sprint: `08-sprint-plan.md`  
- Status: `10-status-report.md`  
- Python CS epic: `14-python-cs-epic.md`  
- SoT multi-purpose table: `GYAM_SOURCE_OF_TRUTH.md` §1
