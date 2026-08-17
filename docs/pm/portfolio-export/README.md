# Portfolio export staging

The **portfolio website is a separate future project**. This folder stages grabs from GYAM’s multi-purpose role as **portfolio evidence source** (SoT purpose P5).

GYAM itself is also the career OS, sample software project, and PM practice lab — see `docs/pm/00-multi-purpose-and-progress.md`.

## Folders

| Path | Put here |
|------|----------|
| `screenshots/` | **Local only** (gitignored). Capture on LAN for your own case-study staging. Do not commit — Jobs/Today shots are live database data. |
| `notes/` | Case-study drafts, STAR stories, sprint demo scripts, interview talking points |
| `sanitized-docs/` | Copies of PM docs with secrets removed (optional; or link to redacted exports) |

## Grab checklist (before site import)

- [x] Screenshots captured via Playwright (`e2e/portfolio-screenshots.spec.ts`, 2026-07-28): login, today, today-mobile, progress, jobs, review, roadmap, settings  
- [x] Recapture against live LAN 2026-08-17 (local files only; **not** in git). User **Sean**. Jobs are real. Login PIN field empty.  
- [x] Case study metrics — **N/A** until usage numbers are worth publishing (`notes/case-study-outline.md`)  
- [ ] Charter + one status report + RAID excerpt (sanitized)  
- [ ] Backlog screenshot or markdown excerpt showing Epic/5 Stories/10 Tasks  
- [ ] Metrics: streaks, applications count, sprint outcomes (real numbers only)  
- [ ] Architecture one-pager note (stack: React/Vite, Express, Prisma/Postgres, TrueNAS SCALE Phase A)  
- [ ] Explicit “what I did as PM” bullet list (supervised agent team, scope control, RAID)

## Suggested case-study sections (for the future site)

1. Overview — what GYAM is; stakes (career OS)  
2. Role — Sean as PM/PO/IC supervisor of agent team  
3. Challenge — accountability + scope control without SaaS  
4. Approach — hybrid Agile + SoT + agent RACI  
5. Outcomes — V1 shipped locally; Playwright; living docs  
6. Artifacts — link/embed from this pack  

## Do not export / do not commit to GitHub

- `.env`, PIN, session cookies, SMTP passwords  
- Live screenshots of Jobs/Today/Progress (real applications, notes, dump-derived UI)  
- Postgres dumps (`*.dump`) and JSON exports  
- Raw employer email bodies with PII unless redacted  
- Internal agent transcripts with secrets
