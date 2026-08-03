# 14 — Python CS epic (dual-track roadmap)

**Updated:** 2026-08-03  
**Vault mirror:** Obsidian `Projects/GYAM/GYAM Python Integration Roadmap.md`  
**Curriculum source (external):** `python_cs_foundations_24week_enhanced.md`  
**Glossary (external):** `python_dictionary_of_terms.md`

**TrueNAS (2026-08-03):** `db:remap-coach-briefs` updated **1035** task instructions on the live LAN DB.

## Purpose

Give the existing Monday **"1 hr software (Python/C#)"** slot and alternating Saturday deep-work blocks **specific Python CS content**, paced across ~12 months.

**Non-goal:** Do not put Python runtime into the GYAM TypeScript app. This is a **planning / Today-task layer** only (same as other roadmap tasks).

## Pacing

One curriculum “week” spans **two roadmap weeks** (limited Monday hour + alternating Saturdays):

| Segment | Roadmap week in the pair | Monday focus |
|---------|--------------------------|--------------|
| **Week A** | First of pair (`sourceWeek` even: 2, 4, …) | Concepts + start of practice |
| **Week B** | Second of pair (`sourceWeek` odd: 3, 5, …) | Finish practice + interview algorithm (when listed) |

**Formula:** Curriculum week **N** → roadmap weeks **2N** and **2N+1** (for N = 1…24 → roadmap weeks 2–49).

Weeks **50–52:** Monday = spaced-repetition review (algorithms + glossary). Saturdays return to GYAM deep work.

## Saturday alternation

- **Even** `sourceWeek` → Deep work on **GYAM / portfolio-export**
- **Odd** `sourceWeek` → Deep work on **Python portfolio** project for that curriculum week

## Pairing table

| Curr Wk | Roadmap Wks | Monday topic / Interview Algorithm | Saturday portfolio (odd weeks) |
|--------:|:------------|:-----------------------------------|:-------------------------------|
| 1 | 2–3 | Basics / type conversion — FizzBuzz | foundations warm-up |
| 2 | 4–5 | Control flow — Valid Parentheses | control-flow kata set |
| 3 | 6–7 | Loops — Two Sum | loop drills |
| 4 | 8–9 | Functions — Reverse String | function library |
| 5 | 10–11 | Lists & Strings — Palindrome Checker | string utilities |
| 6 | 12–13 | Debugging & Testing — Find Max in Array | test/debug practice |
| — | — | **Part 1 Review Test** (self-check at end of pair) | — |
| 7 | 14–15 | Lists vs Dicts + OOP intro — Contains Duplicate | OOP intro mini-project |
| 8 | 16–17 | Searching + OOP methods — Binary Search | search demos |
| 9 | 18–19 | Sorting + OOP attributes — Selection Sort | sort visualizer sketch |
| 10 | 20–21 | Efficient sorting — Merge/Quick sort | sort comparison notes |
| 11 | 22–23 | Stacks & Queues | **(TBD curr wk 11)** |
| 12 | 24–25 | Big O deep dive | Big-O cheat sheet |
| 13 | 26–27 | Brute force vs efficient | **(TBD curr wk 13)** |
| 14 | 28–29 | Review week | Part 2 review notes |
| — | — | **Part 2 Review Test** | — |
| 15 | 30–31 | Linked lists | linked-list drills |
| 16 | 32–33 | Recursion | recursion practice |
| 17 | 34–35 | Trees | **(TBD curr wk 17)** |
| 18 | 36–37 | Graphs | graph traversal notes |
| 19 | 38–39 | Weighted graphs / Dijkstra | pathfinding sketch |
| 20 | 40–41 | Review + DP/greedy intro — Climbing Stairs | DP intro drills |
| — | — | **Part 3 Review Test** | — |
| 21 | 42–43 | File I/O — CSV Parser | CSV toolkit |
| 22 | 44–45 | Libraries & APIs | API client practice |
| 23 | 46–47 | Combining everything / system design | mini system-design writeup |
| 24 | 48–49 | **Capstone** | Capstone build |

## Implementation in GYAM

| Piece | Location |
|-------|----------|
| Seed titles (new installs) | `apps/api/src/roadmap/seed.ts` + `pythonCsCurriculum.ts` |
| Coach briefs (Why / Do this / Done when) | `apps/api/src/roadmap/coachBriefs.ts`; column `Task.instructions` |
| Live DB remap (titles) | `npm run db:remap-python-cs -w @gyam/api` |
| Live DB remap (briefs) | `npm run db:remap-coach-briefs -w @gyam/api` |
| Subject | Titles infer to **Software practice** (60m) or **Deep work** (180m) |

## Open items

1. Fill real portfolio project names for curriculum weeks **11, 13, 17** (placeholders in seed/docs).
2. Confirm 2-roadmap-weeks-per-curriculum-week pacing after a few lived weeks; compress/stretch if needed.
