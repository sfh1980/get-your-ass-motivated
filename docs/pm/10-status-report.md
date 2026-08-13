# 10 — Status report

| Field | Value |
|-------|--------|
| Project | GYAM (multi-purpose: OS + sample project + PM lab + portfolio staging) |
| Report date | 2026-08-12 |
| Period | Sprint 2 close (window was 2026-08-04 → 2026-08-10) |
| Overall | **Yellow** (app in daily use; attachments volume missing on TrueNAS) |
| Author | Sean Holmes (PM) |

## Executive summary

Sean is dogfooding GYAM on TrueNAS LAN (`http://192.168.1.246:4070`, health OK 2026-08-12). Sprint 2 stories: S6 done; S7 PIN/PII accepted (metrics N/A); S8 blocked on uploads dataset (I3); S9 parked until Python CS work starts. I2 SMTP Settings labeled dormant. Phase B parked (LAN-only; no extra domain). Watchtower will pick up the app image after this push; **it will not attach the uploads volume** — that needs a Custom App YAML Save.

## Progress vs plan

| Area | % | Notes |
|------|---|--------|
| V1 ship order (product) | ~100% local/LAN | Phase B parked, not blocked |
| Sample-project language (DB + seed) | 100% | Remaps current on TrueNAS |
| PM doc pack | Living | RAID/status refreshed 2026-08-12 |
| Portfolio export | ~50% | Capture done; PIN review accepted; metrics N/A |
| Dogfood | In use | S6 accepted by Sean |
| Coach briefs / attachments | Briefs live; files blocked | I3 uploads dataset |

## Accomplishments this period (Sprint 2)

- Daily use on TrueNAS (S6).  
- PIN/PII: Sean confirmed screenshots do not expose a saved PIN (S7 partial).  
- Python CS names parked until curriculum is reached (S9).  
- Phase B parked; D5 no longer “blocked on Yum4Less.”  
- I2 dormant SMTP copy (this commit).  

## Plans next period (Sprint 3)

- **I3 / S8:** create `appPool/GYAM/uploads`, mount `/app/data/uploads`, chown 1000:1000, Save Custom App YAML, attach one real file.  
- Prove a `pg_dump` on the pool (R3) — run on TrueNAS Shell; workstation SSH refused.  
- Keep weekly status/RAID. Do not start Tunnel or Python CS names.

## Risks / issues

- **I3** uploads not mounted — primary ops blocker.  
- **R3** dump not verified from this workstation.  
- **R1** still standing — no sidecars / no public GYAM site.  
- **R2** Watching (in use).  

## Decisions needed

None blocking product. Sean must Save Custom App YAML after creating the uploads dataset (Watchtower will not do that).
