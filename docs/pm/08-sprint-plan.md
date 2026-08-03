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

## Sprint 2 — Living cadence + evidence (current)

| Field | Value |
|-------|--------|
| Window | **2026-08-04 → 2026-08-10** |
| Goal | Prove Month-2 hybrid Agile: daily dogfood on TrueNAS, weekly status/RAID, and portfolio evidence that is safe to show |
| Stories | **S6, S7, S8, S9** (see `07-wbs-backlog.md`) |
| Epics | **E2** (governance cadence) + **E3** (dogfood & portfolio evidence) |
| Sean | Dogfood Today; Sunday Review; status/RAID; PII pass on screenshots |
| Agents | Docs/status edits as assigned; Scope Guard if any new feature urge appears |
| Risks watched | **R2** (dogfood abandonment), **R4** (screenshot secrets), **R1** (scope creep) |
| Explicitly out | Phase B Cloudflare (**T5.5b** — blocked on Yum4Less); new product features unless blocking dogfood |

### Sprint goal (committed)

> **Goal:** By Sunday 2026-08-10, GYAM has ≥5 dogfood days on the live LAN app, an updated status + RAID, and portfolio screenshots cleared for PII with draft case-study metrics.  
> **Stories:** S6, S7, S8, S9  
> **Agent assignments:** Sean = R for dogfood/PII; primary agent = R for doc/status updates when briefed; Scope Guard = C before any new build  
> **Risks watched:** R2, R4, R1  

### Sprint 2 backlog (pull)

1. [ ] **S6** — Dogfood TrueNAS Today ≥5 calendar days; note friction in GYAM Home or `Inbox/`  
2. [ ] **S7** — PII-review 8 screenshots; fill case-study metrics draft (`T5.6b`)  
3. [ ] **S8** — Accept coach briefs + attachments on live LAN (smoke: expand How to do this; attach one PM artifact)  
4. [ ] **S9** — Python CS dual-track hygiene: fill curr weeks 11/13/17 portfolio names **or** explicitly park with date; live Week 1A/1B without changing pairing yet  
5. [ ] Update `10-status-report.md` + `06-raid-log.md` (Sunday)  
6. [ ] Change-log any scope drift  

### Exit / Sprint DoD checklist

- [ ] Sprint goal met or descope’d in change log  
- [ ] Status report dated this sprint  
- [ ] RAID reviewed  
- [ ] ≥1 portfolio-export artifact improved (PII notes and/or metrics)  

## Next sprint (draft ideas — not committed)

- Start Month-2 weekly status streak (week 2 of 4+)  
- Optional I2: dormant-label SMTP in Settings  
- Phase B only if Yum4Less Cloudflare unblocks  
- Compress/stretch Python CS pacing after 2+ lived curriculum weeks  
