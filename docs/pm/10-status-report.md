# 10 — Status report

| Field | Value |
|-------|--------|
| Project | GYAM (multi-purpose: OS + sample project + PM lab + portfolio staging) |
| Report date | 2026-08-17 |
| Period | Sprint 3 close (window 2026-08-12 → 2026-08-18) |
| Overall | **Green** (sprint goal met; Today still blocked on 2026-08-13 Excel/Power BI) |
| Author | Sean Holmes (PM) |

## Executive summary

**Sprint 3 is closed.** Attachments persist after app restart (S8/T8.3). Sunday Review submitted for week ending 2026-08-16. Live Jobs are real; eight portfolio screenshots recaptured. Postgres dump proven. **S10** added after close: in-app **PM** dashboard (`/pm`) with live execution charts, a RAID/WBS snapshot, and **How this works** teaching modals (P4 practice lab). Harbor stays a separate Python project. Phase B parked. Remaining: commit/push so Watchtower can put `/pm` on LAN; clear 8/13 Excel/Power BI.

## Progress vs plan

| Area | % | Notes |
|------|---|--------|
| V1 ship order (product) | ~100% local/LAN | Phase B parked, not blocked |
| Sample-project language (DB + seed) | 100% | Harbor sitting titles not remapped yet |
| PM doc pack | Living | Sprint 3 closed; S10 + `15-in-app-pm-dashboard.md` |
| Portfolio export | ~70% | LAN recapture done; company names in Jobs PNG; metrics N/A |
| Dogfood | In use | Streak 4d / best 11d; blocked on 8/13 |
| Coach briefs / attachments | Done on LAN | I3 + T8.3 closed |
| Backup proof (R3) | Proven | Keep Aug 2 52K + Aug 17 120K dumps |

## Accomplishments this period (Sprint 3)

- Uploads persist after app restart (T8.3).  
- Sunday Review submitted (T6.3).  
- Live Jobs board is real; 8 screenshots recaptured.  
- Harbor boundary locked: taught from GYAM, not run from GYAM.  
- Dump TOC listed inside `gyam-postgres` (57 entries).  
- In-app **PM** dashboard (`/pm`, S10): live DB charts + RAID/WBS snapshot (no employer names); **How this works** lessons on every block. Write-up: `15-in-app-pm-dashboard.md`.  

## Plans next period

- Clear 2026-08-13 Excel/Power BI so Today unblocks.  
- Commit/push S10 so Watchtower can pull `/pm` (no YAML Save).  
- Keep weekly status/RAID; update `governanceSnapshot.ts` when `/pm` RAID/WBS should match markdown.  
- Do not start Tunnel, SMTP, or Harbor-in-GYAM.

## Risks / issues

- **R3** Watching — dump proven; downtime risk remains.  
- **R4** Watching — real company names in `gyam-jobs.png`.  
- **R1** Open — Sunday Review is change-control; two-repo rule.  
- **R2** Watching — lived week + heatmap; still blocked on 8/13.  
- **R8** Watching — Watchtower ≠ YAML volume Save.

## Decisions needed

None. Sprint 3 goal met.
