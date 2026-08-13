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

## Sprint 3 — Uploads volume + backup proof (current)

| Field | Value |
|-------|--------|
| Window | **2026-08-12 → 2026-08-18** |
| Goal | Attachments persist on TrueNAS; one proven Postgres dump; keep using Today |
| Stories | **S8** (I3), R3 dump check |
| Sean | Create `GYAM/uploads` dataset; Save Custom App YAML; attach one file; run `pg_dump` on NAS Shell |
| Agents | Docs/YAML already in repo; no new product features |
| Risks watched | **I3**, **R3**, **R1** |
| Explicitly out | Phase B Tunnel; Python CS names; SMTP enablement |

### Sprint 3 backlog (pull)

1. [ ] Create child dataset `appPool/GYAM/uploads`; `chown 1000:1000`  
2. [ ] Add volume `/mnt/appPool/GYAM/uploads:/app/data/uploads` in live Custom App YAML; **Save** (Watchtower will not do this)  
3. [ ] Attach one allowed file on LAN; confirm it lands on the dataset  
4. [ ] `ls -lh /mnt/appPool/GYAM/gyam-*.dump` then dump if missing  
5. [ ] Sunday status/RAID  

## Next sprint (draft ideas — not committed)

- Continue Month-2 weekly status streak  
- Phase B only if Sean wants a free hostname on `yum4less.com`  
- Python CS names when curriculum is reached  
