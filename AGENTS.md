# GYAM — Agent guide

Project-local Cursor configuration lives under `.cursor/`.

## Source of truth

1. `GYAM_SOURCE_OF_TRUTH.md` (includes multi-purpose roles P1–P8 + history)
2. Latest explicit user decision in chat
3. `docs/pm/` (living PM pack — start at `docs/pm/00-multi-purpose-and-progress.md`; in-app dashboard: `docs/pm/15-in-app-pm-dashboard.md`)
4. `Project_Management_Daily_Roadmap_Starting_2026-07-27.md`
5. `sean_holmes_resume_updated.docx`
6. Runtime `logs/activity/`

## Multi-purpose reminder

GYAM is simultaneously: career OS, roadmap engine, sample software project, PM practice lab (Sean + agent team, in-app `/pm`), portfolio-export staging, homelab reference, and dual-track Python CS planning (P8). Do not gold-plate a portfolio *website* into this repo.
## Rules (`.cursor/rules/`)

| Rule | Scope |
|------|--------|
| `gyam-core.mdc` | Always — product non-negotiables + V1 order |
| `gyam-typescript.mdc` | `**/*.{ts,tsx}` |
| `gyam-activity-logs.mdc` | `logs/**/*` |
| `gyam-docker-homelab.mdc` | Compose / TrueNAS Custom App / deploy |
| `gyam-roadmap-seed.mdc` | Roadmap seed + remap |

## Hooks (`.cursor/hooks.json`)

| Event | Script | Behavior |
|-------|--------|----------|
| `sessionStart` | `hooks/session-context.ps1` | Injects SoT / roadmap / log context |
| `beforeShellExecution` | `hooks/guard-shell.ps1` | Asks before destructive/secret-risk commands |

(`stop` checklist hook removed — it was injecting follow-up messages into chat.)

## Project agents (`.cursor/agents/`)

| Agent | Use when |
|-------|----------|
| `gyam-activity-analyst` | Next-version planning from activity logs |
| `gyam-v1-scope-guard` | Before gold-plating or early integrations |
| `gyam-roadmap-seeder` | Seeding / remapping roadmap days |
| `gyam-homelab-deploy` | TrueNAS Phase A LAN, Compose, Cloudflare later, backups |

User-level agents (backend/frontend/database/testing/auditor/verifier) still apply globally.

## MCP (user-level)

| Server | Purpose |
|--------|---------|
| `context7` | Live library docs |
| `github` | PRs, issues, Actions (needs `GITHUB_PERSONAL_ACCESS_TOKEN`) |
| `playwright` | Browser E2E / UI verification |
| `postgres` | Restricted Postgres MCP via Docker (needs `GYAM_DATABASE_URI`) |
| `obsidian` | Vault PARA writes (`user-obsidian`) |

Setup steps: `.cursor/MCP_SETUP.md` (user-level MCP only; no project `mcp.json` by design).
