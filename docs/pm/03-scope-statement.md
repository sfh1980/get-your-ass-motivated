# 03 — Scope statement

## Product vision

A homelab-local **multi-purpose** system: Sean’s PM-career OS, the roadmap’s sample software project, a PM practice lab (agent-team supervision), and a staging ground for portfolio evidence — without hosting the public portfolio website in this repo.

## In scope

- V1 application per `GYAM_SOURCE_OF_TRUTH.md` §5 and §9.  
- Local notifications + job correspondence archive (manual).  
- Activity logging for Cursor-assisted planning.  
- Homelab Postgres + documented deploy path (`docs/homelab.md`: TrueNAS Phase A LAN; Cloudflare Phase B later).  
- `docs/pm` governance pack and `portfolio-export/` staging.  
- Explicit multi-purpose documentation (SoT §1; `docs/pm/00-…`).  
- In-app **PM** dashboard (`/pm`): live execution charts from Postgres, governance snapshot from `docs/pm`, **How this works** lesson modals (`15-in-app-pm-dashboard.md`). Accepted after V1 (S10), not a ship-order reshuffle.

## Out of scope

- Public portfolio website implementation (separate future project).  
- Multi-tenant SaaS; paid email as required path.  
- Full PMO tool replacement (Jira/Confluence) inside the app. The `/pm` screen is a **practice dashboard**, not Jira.  
- Fake Gantt / EVM / PERT charts (no dependency graph, no cost baseline).  
- Post-V1 integrations in SoT until explicitly pulled in.

## Constraints

- Solo human + agent team.  
- Windows/homelab environment.  
- No fake job/demo data.  
- PIN auth only for V1.

## Acceptance (scope complete for V1 product)

All locked SoT ship-order items usable locally; validation + Playwright edge suite documented green; PM pack initialized and weekly maintenance begun.
