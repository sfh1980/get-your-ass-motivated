# Portfolio export staging

The **portfolio website is a separate future project**. This folder stages grabs from GYAM’s multi-purpose role as **portfolio evidence source** (SoT purpose P5).

GYAM itself is also the career OS, sample software project, and PM practice lab — see `docs/pm/00-multi-purpose-and-progress.md`.

## Folders

| Path | Put here |
|------|----------|
| `screenshots/` | PNG/WebP of Today, Jobs, Progress, Review, Roadmap, Settings (no PIN, no real emails, blur companies if needed) |
| `notes/` | Case-study drafts, STAR stories, sprint demo scripts, interview talking points |
| `sanitized-docs/` | Copies of PM docs with secrets removed (optional; or link to redacted exports) |

## Grab checklist (before site import)

- [x] Screenshots captured via Playwright (`e2e/portfolio-screenshots.spec.ts`, 2026-07-28): login, today, today-mobile, progress, jobs, review, roadmap, settings  
- [ ] Review screenshots for PII (blur companies / email paste if needed)  
- [ ] Case study outline (`notes/case-study-outline.md`) — draft exists; fill metrics  
- [ ] Charter + one status report + RAID excerpt (sanitized)  
- [ ] Backlog screenshot or markdown excerpt showing Epic/5 Stories/10 Tasks  
- [ ] Metrics: streaks, applications count, sprint outcomes (real numbers only)  
- [ ] Architecture one-pager note (stack: React/Vite, Express, Prisma/Postgres, homelab)  
- [ ] Explicit “what I did as PM” bullet list (supervised agent team, scope control, RAID)

## Suggested case-study sections (for the future site)

1. Overview — what GYAM is; stakes (career OS)  
2. Role — Sean as PM/PO/IC supervisor of agent team  
3. Challenge — accountability + scope control without SaaS  
4. Approach — hybrid Agile + SoT + agent RACI  
5. Outcomes — V1 shipped locally; Playwright; living docs  
6. Artifacts — link/embed from this pack  

## Do not export

- `.env`, PIN, session cookies, SMTP passwords  
- Raw employer email bodies with PII unless redacted  
- Internal agent transcripts with secrets
