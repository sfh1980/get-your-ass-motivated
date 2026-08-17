# 13 — Lessons learned

Append entries anytime; review on Sundays.

| Date | Context | Lesson | Action |
|------|---------|--------|--------|
| 2026-07-27 | Email discussion | Wanted notify + archive outcomes, not SMTP/IMAP | Locked local notify + manual correspondence |
| 2026-07-27 | Validation | Zod refine().max broke API boot | Put `.max()` before `.refine()` |
| 2026-07-27 | Playwright | Serial + brittle selectors hid suite failures | Independent tests; scope locators to card |
| 2026-07-28 | Sample project | Jira sandbox unnecessary for solo; agents can be the team | RACI + backlog in docs/pm |
| 2026-07-28 | Portfolio | Site separate; stage artifacts here first | `portfolio-export/` |
| 2026-07-28 | Remap | Old Jira seed text confused Today | `db:remap-sample` (209 updates) |
| 2026-08-12 | RAID close-out | Dogfood is ops not code; Watchtower does not attach volumes | I3 opened; YAML Save required for uploads |
| 2026-08-16 | TrueNAS uploads | App runs as uid 1000 (`node`), not Postgres 999; live path is lowercase `gyam` | `chown 1000:1000` on `/mnt/appPool/gyam/uploads`; do not retarget YAML at `GYAM` |
| 2026-08-16 | Completed backlog | Done on a rollover task removes it from Today; Roadmap default starts at today | Use Roadmap, set **From** back; no catalog page (I4 accepted) |
| 2026-08-17 | Watchtower vs YAML | Image pull ≠ volume change; T8.3 passed because uploads were already in the live YAML | Edit Custom App YAML and **Save** to add/change mounts; inspect to verify |
| 2026-08-17 | TrueNAS dump | Host has no `pg_restore`; `docker exec … > file` mangles dumps; `pg_restore -l -` cannot open `"-"` | Dump with `-f /tmp` + `docker cp`; list the same way (path inside container) |
