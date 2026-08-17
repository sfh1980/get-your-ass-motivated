# 14 — Python CS epic (dual-track roadmap)

**Updated:** 2026-08-17  
**Vault book:** Obsidian `Projects/Harbor/` (start at `Harbor Home`)  
**Vault mirror (old pairing table):** `Projects/GYAM/GYAM Python Integration Roadmap.md`  
**Curriculum source (external, extra reference only):** `C:\Users\sfh19\Documents\DOCUMENTATION\Python CS-Lite Course`  
**Harbor code (separate repo/folder):** `C:\Users\sfh19\Projects\Harbor`

**TrueNAS (2026-08-03):** `db:remap-coach-briefs` updated **1035** task instructions on the live LAN DB.

## Purpose

Give the existing Monday **"1 hr software (Python/C#)"** slot and alternating Saturday deep-work blocks **specific Harbor sitting content**, paced across ~12 months.

## Boundary (locked 2026-08-17)

- **Harbor** is the through-line Python app (Library of Things + drop-off desk). Interview katas stay in Harbor’s `Katas Home`, optional, never inside Harbor.
- **GYAM teaches Harbor** — Today/roadmap titles + coach briefs only. Same as any other roadmap task.
- **GYAM does not run Harbor.** No Python runtime, no Harbor UI, no `desk.py` in this repo.
- Live seed titles still say `Python CS Wk…` until S9 remap. Do not remap until sitting 1 starts.

## Pacing

One Harbor sitting spans **two roadmap weeks** (limited Monday hour + alternating Saturdays). Harbor itself is sitting-based, not a 24-week clock — GYAM’s calendar is a schedule of opportunity; rollover handles overrun.

| Segment | Roadmap week in the pair | Monday focus |
|---------|--------------------------|--------------|
| **Week A** | First of pair (`sourceWeek` even: 2, 4, …) | Start the sitting (Obsidian note → `desk.py`) |
| **Week B** | Second of pair (`sourceWeek` odd: 3, 5, …) | Finish the sitting; optional kata |

**Formula:** Sitting **N** → roadmap weeks **2N** and **2N+1** (for N = 1…24 → roadmap weeks 2–49).

Weeks **50–52:** Monday = spaced-repetition review. Saturdays return to GYAM deep work.

## Saturday alternation

- **Even** `sourceWeek` → Deep work on **GYAM / portfolio-export**
- **Odd** `sourceWeek` → Continue **Harbor** (not a new weekly throwaway app)

## Pairing table (crosswalk)

Old curriculum week numbers = Harbor sitting numbers. Seed titles are unchanged until remap.

| Sitting | Roadmap Wks | Harbor sitting | Optional kata |
|--------:|:------------|:---------------|:--------------|
| 1 | 2–3 | First loan | FizzBuzz |
| 2 | 4–5 | Who can borrow | Valid Parentheses |
| 3 | 6–7 | The front desk menu | Two Sum |
| 4 | 8–9 | Fee helpers | Reverse String |
| 5 | 10–11 | The catalog as text | Palindrome |
| 6 | 12–13 | Don't crash | Find Max in Array |
| 7 | 14–15 | Items and members | Contains Duplicate |
| 8 | 16–17 | Find it | Binary Search |
| 9 | 18–19 | Put it in order | Selection Sort |
| 10 | 20–21 | Kinds of things | Merge/Quick sort |
| 11 | 22–23 | Holds and undo | — |
| 12 | 24–25 | Fees that vary | — |
| 13 | 26–27 | Faster lookups | — |
| 14 | 28–29 | Harbor v1 | — |
| 15 | 30–31 | Item history | — |
| 16 | 32–33 | Nested shelves | — |
| 17 | 34–35 | Categories and yes-no | — |
| 18 | 36–37 | Also borrowed | — |
| 19 | 38–39 | Drop-off routes | Dijkstra |
| 20 | 40–41 | Watch it work | Climbing Stairs |
| 21 | 42–43 | Save the desk | CSV Parser |
| 22 | 44–45 | Weather and reports | — |
| 23 | 46–47 | Split the shop | — |
| 24 | 48–49 | Harbor v2 | — |

## Implementation in GYAM

| Piece | Location |
|-------|----------|
| Seed titles (new installs) | `apps/api/src/roadmap/seed.ts` + `pythonCsCurriculum.ts` (still `Python CS Wk…` until S9) |
| Coach briefs (Why / Do this / Done when) | `apps/api/src/roadmap/coachBriefs.ts`; column `Task.instructions` |
| Live DB remap (titles) | `npm run db:remap-python-cs -w @gyam/api` — **do not run** until sitting 1 |
| Live DB remap (briefs) | `npm run db:remap-coach-briefs -w @gyam/api` |
| Subject | Titles infer to **Software practice** (60m) or **Deep work** (180m) |

## Open items

1. Remap live titles/briefs to Harbor sitting names — **when sitting 1 starts** (not before). Steps: update `pythonCsCurriculum.ts` titles to `Harbor sitting N: …`; point coach briefs at Obsidian sitting notes; run `db:remap-python-cs` then `db:remap-coach-briefs` against live TrueNAS after image bump. Katas stay optional in briefs, never in Saturday titles.
2. Confirm 2-roadmap-weeks-per-sitting pacing after a few lived sittings; compress/stretch if needed.
