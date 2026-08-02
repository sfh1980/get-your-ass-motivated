# GYAM — Source of Truth

**App name:** GYAM (Get Your Ass Motivated)  
**Last updated:** 2026-07-28  
**Status:** Multi-purpose project in active use — V1 app shipped locally; sample software project + PM practice + portfolio staging live  
**Owner:** Sean Holmes (single-user first; template-ready)

This document is the primary product/architecture source of truth for GYAM.  
Supporting inputs (also part of truth, not exclusive):

- `Project_Management_Daily_Roadmap_Starting_2026-07-27.md` (roadmap seed template)
- `sean_holmes_resume_updated.docx` (skills, experience, portfolio framing)
- Discovery Q&A from Cursor planning chats
- Runtime activity logs produced by GYAM (for Cursor-assisted version planning)
- `docs/pm/` (living PM governance pack for GYAM-as-project)

When requirements conflict, prefer: **this file → latest explicit user decision in chat → roadmap seed → resume context**.

---

## 1. Purpose (multi-role project)

GYAM is **one repo that serves several deliberate purposes at once**. Do not collapse them into “just an app” or “just docs.”

| # | Purpose | What it means in practice |
|---|---------|---------------------------|
| **P1** | Personal career OS | Daily Today view, timers, rollover, jobs, correspondence archive, Sunday review — Sean’s execution system |
| **P2** | Roadmap engine | Seeds/edits the 12-month PM daily plan from first-use date; quotas and milestones |
| **P3** | Sample software project | Replaces throwaway Jira sandbox; Epic/Stories/Tasks + sprints live in `docs/pm` and the product itself |
| **P4** | PM practice lab | Hybrid Agile + predictive artifacts; Sean supervises Cursor agents as the delivery team (RACI) |
| **P5** | Portfolio evidence source | Real usage + screenshots/notes in `docs/pm/portfolio-export/` for a **separate** future portfolio website |
| **P6** | Homelab reference | TrueNAS SCALE Custom App (LAN Phase A) + Cloudflare Tunnel later (Phase B) — demonstrates ops fluency |
| **P7** | Template seed (later) | Schema/UX allows other users eventually; V1 remains Sean-first |

### Product behaviors (P1–P2)

1. Shows **today’s tasks** and tracks progress as the primary open experience.  
2. Seeds an editable plan from the Project Management Daily Roadmap.  
3. Enforces accountability (timers, keep-alive, rollover blocking, blunt nudges).  
4. Tracks job applications, study, networking, portfolio artifacts, and weekly retrospectives.  
5. Remains **homelab-local**, syncs across Sean’s devices.

### Project / career behaviors (P3–P7)

6. Is managed as a real software project under `docs/pm/` (charter, RAID, backlog, status).  
7. Stages portfolio grabs without building the public site inside this repo.  
8. Uses agent-team supervision as transferable Technical Project Coordinator practice.

**Explicit non-goals for this repo:** public portfolio website implementation; SMTP/email as a must-have notify channel; fake demo job data.

---

## 1.1 Project history (beginning → current)

| When | What happened |
|------|----------------|
| Discovery | Roadmap + resume + decisions → `GYAM_SOURCE_OF_TRUTH.md` |
| 2026-07-27 | Scaffold: auth, seed, Today, timer/rollover, progress, jobs, review, roadmap |
| 2026-07-27 | Settings: local OS notifications, optional SMTP hooks, export/import; `docs/homelab.md` |
| 2026-07-27 | Job file attach; validation hardening; Playwright edge suite **22/22** |
| 2026-07-27 | Locked: local notifications + **manual** correspondence archive (no email-must-have) |
| 2026-07-28 | GYAM = sample software project; `docs/pm` pack; agents = supervised team |
| 2026-07-28 | DB roadmap remapped (`db:remap-sample`); 8 portfolio screenshots captured |
| 2026-08-01 | Homelab docs retargeted: TrueNAS Phase A (LAN Custom App) first; Cloudflare/nginx = Phase B (mirror Yum4Less) |

**Current state (2026-08-01):** V1 local product ~complete; governance pack live; export screenshots staged; **TrueNAS Phase A runbook documented** (Dockerfile/GHCR/Prisma migrate still to build); dogfood / multi-week metrics still open; portfolio *site* not started (by design).

Detailed narrative: `docs/pm/00-multi-purpose-and-progress.md`.

---
## 2. Users & auth (V1)

| Decision | Detail |
|----------|--------|
| Audience | Sean only for V1 |
| Template future | Schema/UX should allow personalization for others later |
| Auth model | Internal `users` table: **userID (name)** + **PIN** |
| Email binding | Not required in V1; may map later if scaling |
| Accounts | Single-user in practice; table designed so more users can exist later |

PIN is stored hashed (never plaintext). Session after successful PIN unlock.

---

## 3. Platform & deployment

| Layer | Choice |
|-------|--------|
| Clients | Responsive web + PWA (mobile-friendly); desktop wrapper later, same API |
| Sync | Homelab server is source of truth; devices sync to it |
| “100% local” | Data stays on Sean’s infrastructure (not public SaaS) |
| **Phase A (now)** | TrueNAS SCALE **Custom App**: Postgres + single app container; **LAN only** (`http://<nas-ip>:4070`) |
| **Phase B (later)** | Cloudflare Tunnel → one HTTPS origin; optional nginx front door; `COOKIE_SECURE=true` |
| Runtime | Docker / Docker Compose locally; TrueNAS Apps YAML for production-like host |
| Database | PostgreSQL (unpublished on TrueNAS host) |
| Backups | `pg_dump` / dumps on `appPool` datasets |
| Theme | Dark mode |

Detail: `docs/homelab.md`. Pattern sibling: Yum4Less TrueNAS Custom App (LAN live; WAN not started).

---

## 4. V1 stack

| Area | Choice |
|------|--------|
| Primary language | **TypeScript** (React + Vite PWA + Node/Express-style API) |
| Why | One-week V1, UI-heavy product, Sean’s existing TS/React strength |
| Learning track | Optional **Python/C# sidecars** after core ships (terminology + practices) |

### Planned sidecars (post-core / V1.x)

| Sidecar | Likely language | Role |
|---------|-----------------|------|
| notifier | Python or C# | Optional later: Web Push fan-out (not SMTP-required) |
| keep-alive worker | Python or C# | Hourly still-working checks; auto-pause |
| job-watch | Python | RSS/Atom (hiringcafe first); dedupe → Wishlist |
| mail-ingest | Python | Optional later: IMAP / `.eml` parse → correspondence archive |
| activity-log analyst | Python | Summarize logs → next-version options for Cursor |
| export-backup | either | Nightly JSON/Markdown dump to NAS |

---

## 5. Core product behavior

### 5.1 Today & tasks

- Primary screen: **today’s tasks + progress**.
- Task actions: check off complete; **notes** (learned / questions); **Start** timer; **Pause** / resume; Done closes timer and checks off.
- Elapsed time **excludes** paused gaps.
- Hourly keep-alive prompt; **no response in 60 seconds → auto-pause**.
- Implementation preference: desktop/PWA + service worker (or native shell) for reliable background behavior.
- Suggested study duration via editable **subject → minutes** lookup table.
- Incomplete tasks **roll over**; **next day stays paused** until prior day is cleared.
- Unlimited rollover pressure: keep pushing until finished.
- Blunt catch-up prompt (approved):

> Yesterday isn’t done. Today stays paused. Finish the backlog or increase today’s load and catch up — you’re not getting any younger.

### 5.2 Roadmap seeding

- Built from the roadmap markdown, fully **editable**.
- **Start date = first day the user starts using the app** (not fixed to 2026-07-27).
- Remap original Week 1 tasks onto the user’s actual first 7 days.
- Then apply Weeks 2–52 standard routine pattern and monthly milestones.
- Milestones appear where they fit best (checklist / dashboard / calendar-style surfaces).

### 5.3 Modules (locate where most sensible)

Must exist in V1 placement:

- Daily checklist
- Weekly routine view
- Job application tracker + pipeline + quotas
- Study log / notes
- LinkedIn / networking log (manual)
- Portfolio artifacts tracking
- Guided Sunday retrospective
- Monthly milestones
- Streaks + completion % + heatmaps
- **Local notifications** (OS / in-app / PWA; Web Push optional later)
- **Job correspondence archive** (manual capture — paste + optional attach)
- Multi-device sync (via homelab)
- Export / import (CSV/JSON/Markdown)

### 5.3.1 Locked: notifications + employer archive (no email integration required)

**Decision (2026-07-27):** GYAM delivers the *outcomes* of “email notify + keep employer mail” **without** integrating email protocols as a V1 must-have.

| Outcome | V1 approach | Explicitly not required |
|---------|-------------|-------------------------|
| Nudge / accountability | **Local notifications** — in-app banners, OS Notification API, PWA; optional Web Push later | SMTP / Yahoo send, mailbox OAuth |
| Archive rejection / interview / offer mail | **Job correspondence archive** — manual paste of subject/body + optional file attach (`.eml`, PDF, screenshot); typed entries on the job | IMAP ingest, auto-filing inbox, OCR-as-primary |

SMTP/email-send hooks that already exist in code are **optional / dormant**, not a must-ship product requirement. Do not block V1 or V1.1 on configuring Yahoo or any mail provider.

### 5.4 Sunday review

Guided form (wins, blockers, focus, plan next week) — not free-form only.

### 5.5 Motivation / UX tone

Cross between **strict coach** and **professional PM tool**.  
Incomplete days nudge. Streaks and % heatmaps on. Blunt messaging OK.

---

## 6. Job search (V1)

### Pipeline columns

`Wishlist | Applied | Interview | Accepted | Rejected`

### Fields

Company, title, URL, date applied, status, salary, contact, follow-up date, resume version, notes, **correspondence archive** entries.

### Quotas & reminders

- Track weekly application quotas from routine (e.g. Mon 3 / Wed 2 / Fri 3).
- Reminders for follow-ups and interview prep via **local notifications** / in-app (not email-must-have).

### Job correspondence archive (V1 — locked)

Manual capture of employer communications (rejection, interview, acceptance, etc.):

- **Primary:** copy/paste subject/body into the job; confirm / tag type when useful.
- **Optional:** attach file as proof (PDF, `.eml`, image, etc.).
- **Not V1 primary:** brittle PDF OCR as the main parser; inbox sync.
- **Later (optional):** IMAP / `.eml` ingest sidecar — never a blocker for the archive outcome.

### Integrations posture (V1 → later)

| Integration | V1 | Later |
|-------------|----|-------|
| Employer mail archive | Manual paste + optional attach on job | Optional IMAP / `.eml` ingest |
| Outbound / notify email (SMTP) | **Not a must-have**; local notify instead | Optional if explicitly re-scoped |
| GitHub | Links / manual portfolio hooks | Deeper commit/proof hooks |
| LinkedIn | **Manual** log / paste | API only if clearly worth it |
| Save job posting | Universal URL + notes (any board) | Browser share/bookmarklet |
| hiringcafe.com | Prefer before LinkedIn/Indeed watchers | RSS/job-watch sidecar |
| Google Calendar | Pixel-available; optional when useful | Calendar blocks for study/interviews |
| Jira / Confluence / Power BI | Practice targets linked from tasks | Light exports if needed |

---

## 7. Data, privacy, export

- Homelab-local persistence (Postgres).
- Export/import required (JSON/Markdown/CSV as practical).
- Roadmap markdown remains a **seed input**, not the only source of truth.
- No public fake demo mode; portfolio shows real architecture + screenshots of real usage (sanitize secrets if sharing publicly).

---

## 8. Activity logs (Cursor feedback loop)

GYAM should log user/system activity in a durable, readable form so Cursor can:

1. Observe usage patterns, failures, and incomplete streaks.
2. Propose next-version options.
3. Ask targeted questions before expanding scope.

**Log contract (initial):**

- Location: e.g. `logs/activity/` (and/or DB `activity_events` table mirrored to files for agents).
- Format: JSON Lines (one event per line) and/or daily Markdown summaries.
- Minimum fields: `timestamp`, `userId`, `eventType`, `entityType`, `entityId`, `payload`, `client` (web/pwa/desktop).
- Example event types: `task_started`, `task_paused`, `task_auto_paused`, `task_completed`, `day_blocked`, `job_status_changed`, `quota_missed`, `review_submitted`, `export_ran`, `notification_sent`, `notification_acked`.

---

## 9. V1 priority order (must-ship sequence)

1. Today tasks + timer/pause/hourly auto-pause  
2. Rollover blocking  
3. Notes  
4. Streaks / heatmaps  
5. Job pipeline + quotas  
6. Job correspondence archive (manual paste + optional attach)  
7. Guided Sunday review  
8. Editable roadmap  
9. Local notifications (OS / in-app; Web Push optional polish)  
10. Multi-device sync (homelab)  
11. Export/import  

~~Email notifications (SMTP / Yahoo)~~ — **removed as must-have** (2026-07-27). Optional later only if re-scoped.

### Explicitly after V1 unless scope is cut elsewhere

- SMTP / mailbox OAuth / “GYAM sends or reads email”  
- Deep LinkedIn automation  
- Robust PDF OCR parsing  
- hiringcafe watcher sidecar (design OK; ship after core)  
- Full Google Calendar depth  
- Tauri/desktop wrapper polish  

---

## 10. Week build plan

| Window | Focus |
|--------|--------|
| Day 1–2 | Scaffold, Docker Compose, PIN user table, seed roadmap from first-use date, Today view |
| Day 2–3 | Timer + pause + hourly keep-alive + notes + rollover + blunt nudge |
| Day 3–4 | Streaks/heatmap; job pipeline + quotas; correspondence archive (paste/attach) |
| Day 4–5 | Sunday guided review; editable roadmap; export/import |
| Day 5–7 | Local notify polish (optional Web Push); PWA polish; activity logging; homelab notes (TrueNAS Phase A); portfolio README |

---

## 11. Portfolio framing (from resume)

Sean Holmes — Mechanicsville, VA — `sfh1980@yahoo.com` — LinkedIn / GitHub present.

Narrative GYAM supports:

- Long ops/help-desk foundation (Wells Fargo) → full-stack (Coding Dojo, Maxx Potential, RAA) → **PM career operating system**.
- Homelab fluency (TrueNAS SCALE Custom Apps, Docker, Cloudflare Tunnel later) matches GYAM hosting story.
- Target path from roadmap: Aspiring Technical Project Coordinator + Google PM Certificate track.
- Include GYAM in PM portfolio with charter/risk-style docs as the app itself encourages.

Do **not** invent fake job pipeline data for demos.

---

## 12. Catch-up / accountability copy bank

**Day blocked:**  
Yesterday isn’t done. Today stays paused. Finish the backlog or increase today’s load and catch up — you’re not getting any younger.

Additional blunt variants may be added later; keep professional-strict, not cartoonish.

---

## 13. Open items to decide at build time

Per user preference: when a development fork appears, present options then; do not invent hard constraints early.

Known upcoming discussions:

- Correspondence archive UX: multiple entries per job + types (Rejection / Interview / Offer / Other) vs single paste fields  
- Web Push VAPID + HTTPS quirks (optional; after Phase B origin exists)
- Phase A ship blockers: Dockerfile + GHCR publish + Prisma baseline migrate + TrueNAS pull PAT  
- hiringcafe feed/API shape for job-watch sidecar  
- Whether first launch creates the single user interactively or via seed env  
- Revisit SMTP only if Sean explicitly re-scopes notify-via-email  
- When to start the separate portfolio website (after `portfolio-export/` is filled)  
- Optional employer-facing Jira familiarity later (not required for GYAM delivery)  

---

## 14. Cursor workspace notes

- Project automation lives under `.cursor/` (rules, hooks, agents). See `AGENTS.md`.
- User-level Cursor rules/hooks/agents still apply (e.g. README onboarding, check-readme hook).
- Activity logs path reserved: `logs/activity/`.
- README: follow user README-onboarding rule — gather/confirm docs context before drafting (enough context now exists to offer a README after V1 scaffold).

---

## Change log

| Date | Change |
|------|--------|
| 2026-07-27 | Initial source of truth created from roadmap + resume + discovery decisions |
| 2026-07-27 | Added project `.cursor` rules/hooks/agents + `AGENTS.md` + `logs/activity/` |
| 2026-07-27 | Removed `stop` checklist hook (was looping follow-ups into chat) |
| 2026-07-27 | Project MCP: Context7, GitHub remote, Playwright, Postgres MCP Pro (restricted) |
| 2026-07-27 | V1 Day1-2 scaffold live; added Progress streaks/heatmap + Jobs pipeline/quotas |
| 2026-07-27 | Added guided Sunday review + editable roadmap/milestones/subjects |
| 2026-07-27 | OS notifications + Settings; SMTP notify hooks; export/import JSON; docs/homelab.md |
| 2026-07-27 | Job email optional file attach; COOKIE_SECURE env; ports restarted + retested |
| 2026-07-27 | Hardened input validation: http(s) URLs, import schema, attachment allowlist, calendar dates, login PIN bounds |
| 2026-07-27 | Locked: local notifications + job correspondence archive (manual); dropped email/SMTP notifications as V1 must-have |
| 2026-07-28 | GYAM = sample software project; docs/pm pack + portfolio-export; agent team RACI; Jira not required for solo |
| 2026-07-28 | DB remap sample-project language; Playwright portfolio screenshots (8) |
| 2026-07-28 | Documented multi-purpose roles (P1–P7) + progress history in SoT and docs/pm |
| 2026-08-01 | Homelab: TrueNAS Phase A (LAN Custom App) primary; Cloudflare/nginx Phase B deferred; docs + vault aligned with Yum4Less pattern |
