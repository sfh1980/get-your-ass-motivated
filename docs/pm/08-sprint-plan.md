# 08 — Sprint plan (hybrid Agile)

## Rules

| Rule | Choice |
|------|--------|
| Length | 1 week (Mon → Sun), aligned to GYAM Sunday review |
| Methodology | Hybrid: Agile sprints for build; predictive docs for governance |
| Team | Sean (PM/PO) + Cursor agent team (see RACI) |
| Board | This file + GYAM Today/Roadmap (no Jira required) |
| Commit | Only stories that meet Definition of Done |

## Sprint goal template

> **Goal:** _one sentence outcome_  
> **Stories:** _IDs from backlog_  
> **Agent assignments:** _who does what_  
> **Risks watched:** _RAID IDs_

---

## Sprint 0 — Foundation (completed)

- **Goal:** V1 local app usable (auth → Today → jobs → roadmap → notify/export).  
- **Outcome:** Feature sequence largely shipped; Playwright 22/22 edge suite green (2026-07-27).  

## Sprint 1 — PM pack + dogfood (closed 2026-08-03)

| Field | Value |
|-------|--------|
| Window | 2026-07-28 → 2026-08-03 |
| Goal | Lock GYAM as multi-purpose sample project; living PM docs; portfolio staging; begin dogfood |
| Stories | S5 follow-ons; Epic E2 governance |
| Outcome | Docs/pm pack + remap + 8 screenshots + Phase A live + Python CS dual-track + coach briefs/attachments shipped. Dogfood streak and portfolio metrics/PII **carried to Sprint 2**. |

### Sprint 1 backlog (final)

1. [x] Create `docs/pm` charter → lessons pack  
2. [x] Update seed + roadmap markdown (GYAM = sample project)  
3. [x] Remap DB Week 1+ language (`db:remap-sample`) — I1 resolved  
4. [ ] Dogfood Today ≥5 days — **carry**  
5. [x] Portfolio screenshots (8 via Playwright)  
6. [x] Multi-purpose + progress documentation (SoT §1 + `00-…`)  
7. [ ] PII-review screenshots + case-study metrics — **carry**  
8. [ ] Sunday status/RAID refresh — **carry** (partially done via Home/Obsidian; `10-status` refreshed 2026-08-03 — keep weekly)  
9. [x] Homelab Phase A (beyond original draft) — Done 2026-08-02  
10. [x] Python CS dual-track + coach briefs + task attachments (emergent scope, accepted)

---

## Sprint 2 — Living cadence + evidence (closed 2026-08-12)

| Field | Value |
|-------|--------|
| Window | **2026-08-04 → 2026-08-10** (docs closed 2026-08-12) |
| Goal | Prove Month-2 hybrid Agile: daily dogfood on TrueNAS, weekly status/RAID, and portfolio evidence that is safe to show |
| Stories | **S6, S7, S8, S9** (see `07-wbs-backlog.md`) |
| Outcome | **S6 Done** (Sean using LAN app). **S7 Partial** (PIN accepted; metrics N/A). **S8 Blocked** on I3 uploads dataset. **S9 Parked** until CS work. I2 dormant SMTP in this close-out commit. D5 Ready/parked (no GYAM tunnel). |

### Sprint 2 backlog (final)

1. [x] **S6** — Dogfood TrueNAS Today (Sean accepted 2026-08-12)  
2. [x] **S7** — PIN/PII accepted; metrics N/A  
3. [ ] **S8** — **Carry** — blocked on uploads dataset (I3)  
4. [x] **S9** — Parked until Sean reaches CS work  
5. [x] Update `10-status-report.md` + `06-raid-log.md` (2026-08-12)  
6. [x] Change-log scope: Phase B parked; I2 dormant; I3 opened  

### Exit / Sprint DoD checklist

- [x] Sprint goal met or descope’d in change log  
- [x] Status report dated this sprint  
- [x] RAID reviewed  
- [x] ≥1 portfolio-export artifact improved (PII notes and/or metrics)  

## Sprint 3 — Uploads volume + backup proof (closed 2026-08-17)

| Field | Value |
|-------|--------|
| Window | **2026-08-12 → 2026-08-18** (closed 2026-08-17) |
| Goal | Attachments persist on TrueNAS; one proven Postgres dump; keep using Today |
| Stories | **S8 Done**; S7 recapture done; R3 dump **proven** |
| Outcome | I3/T8.3 closed; Sunday Review in; LAN screenshots recaptured; `gyam-20260817.dump` listed (57 TOC entries). Phase B and Harbor remap stayed parked. |
| Risks watched | **R1** (standing); **R3** watching (dump proven) |
| Explicitly out | Phase B Tunnel; Harbor sitting-name remap; SMTP enablement |

### Sprint 3 backlog (final)

1. [x] `chown 1000:1000` on `/mnt/appPool/gyam/uploads`; confirm inspect mount; attach one allowed file — PDF on LAN 2026-08-16 (I3 resolved)  
2. [x] Keep both pool paths until inspect: live = `gyam`, dumps = `GYAM`  
3. [x] List TOC of `gyam-20260817.dump` — CUSTOM gzip, 57 TOC entries, PG 16.14, created 2026-08-17 16:49:23 UTC  
4. [x] Sunday Review in-app — submitted for week ending 2026-08-16 (T6.3)  
5. [x] Recapture portfolio screenshots against live LAN — 2026-08-17; User ID **Sean**; real Jobs (61 Applied / 3 Interview / 27 Rejected)  
6. [x] I4 choice: keep Roadmap (set From date back); no catalog page  
7. [x] T8.3 — app restarted 2026-08-17; PDF still in UI and on the volume  

## Next sprint (draft ideas — not committed)

- Clear 2026-08-13 Excel/Power BI so Today unblocks  
- Review Jobs PNG before public git  
- Continue Month-2 weekly status streak  
- Phase B only if Sean wants a free hostname on `yum4less.com`  
- Harbor sitting titles when sitting 1 starts (S9) — do not fold Harbor into GYAM  
