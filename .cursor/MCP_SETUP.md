# GYAM MCP notes (project does not ship mcp.json)

This project relies on your **user-level** Cursor MCP servers in
`C:\Users\sfh19\.cursor\mcp.json`.

## Expected status right now

| Server | Status | Notes |
|--------|--------|-------|
| context7 | Enabled | OK without API key (optional key for higher limits) |
| playwright | Enabled | OK |
| github | Should work after reload | Docker stdio + User env `GITHUB_PERSONAL_ACCESS_TOKEN` |
| postgres | Intentionally not in global MCP | Add later when GYAM Postgres is running |

## Fix GitHub if still red

1. Confirm User env is set (PowerShell):

```powershell
[Environment]::GetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN','User').Length
```

Should print `40` (or similar), not blank.

2. Fully quit Cursor and reopen (User env is only picked up at launch).

3. Settings -> MCP -> refresh/toggle `github`.

4. Pull the image if needed:

```powershell
docker pull ghcr.io/github/github-mcp-server
```

5. If still red: open Output panel -> MCP Logs and check for auth errors.
   Create/regenerate a classic PAT (`ghp_...`) with `repo` scope at
   https://github.com/settings/tokens

## When GYAM Postgres exists

Add a **project-only** server named `gyam-postgres` in
`.cursor/mcp.json` (not the global `postgres` name), pointed at
`GYAM_DATABASE_URI`, so it does not break other projects.
