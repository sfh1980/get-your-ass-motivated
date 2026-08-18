import type { CatalogItemDto, RaciRowDto, RaidRiskDto, WbsStoryDto } from "@gyam/shared";

/** Keep in sync with docs/pm (RAID, WBS, RACI, sprint plan). Image does not ship markdown. */
export const GOVERNANCE_AS_OF = "2026-08-17";

export const PM_CATALOG: CatalogItemDto[] = [
  { name: "RAG status / KPI strip", used: true, why: "Sprint health + live streaks, quota, blockers" },
  { name: "WBS / story table", used: true, why: "Sample-project backlog S1–S9 from docs/pm/07" },
  { name: "RACI matrix", used: true, why: "Standing work-package RACI from docs/pm/04" },
  { name: "RAID log + P×I matrix", used: true, why: "Risks plotted; issues listed from docs/pm/06" },
  { name: "Burndown / burnup", used: true, why: "Cumulative completed tasks from this database" },
  { name: "Completion heatmap", used: true, why: "Daily % already on Progress; reused here" },
  { name: "Kanban / funnel", used: true, why: "Job status counts (no employer names on this screen)" },
  { name: "Quota vs actual", used: true, why: "Weekly apply target from Jobs service" },
  { name: "Milestone checklist", used: true, why: "Roadmap milestones in Postgres" },
  { name: "Review cadence", used: true, why: "Sunday Review rows submitted in DB" },
  { name: "Hours by subject", used: true, why: "Timer elapsedMs rolled up by task.subject" },
  { name: "Gantt (dependencies)", used: false, why: "Tasks are date-seeded; no predecessor graph" },
  { name: "PERT / CPM network", used: false, why: "No critical-path data" },
  { name: "Earned value (PV/EV/AC)", used: false, why: "No cost baseline" },
  { name: "Resource histogram", used: false, why: "Solo user; no capacity pool" },
  { name: "Control / SPC charts", used: false, why: "Not a manufacturing process" },
  { name: "Stakeholder power/interest", used: false, why: "Single stakeholder (Sean); register stays in docs" },
];

export const RAID_RISKS: RaidRiskDto[] = [
  { id: "R1", title: "Scope creep", probability: 4, impact: 4, score: 16, status: "Open" },
  { id: "R2", title: "Stop dogfooding", probability: 2, impact: 5, score: 10, status: "Watching" },
  { id: "R3", title: "Homelab downtime", probability: 2, impact: 4, score: 8, status: "Watching" },
  { id: "R5", title: "Agent output drifts from DoD", probability: 3, impact: 3, score: 9, status: "Open" },
  { id: "R8", title: "Watchtower vs YAML desync", probability: 2, impact: 3, score: 6, status: "Watching" },
  { id: "R6", title: "Windows/port/Prisma friction", probability: 3, impact: 2, score: 6, status: "Watching" },
  { id: "R4", title: "Secrets in portfolio shots", probability: 1, impact: 5, score: 5, status: "Watching" },
];

export const RAID_ISSUES: Array<{ id: string; title: string; status: string }> = [
  { id: "I1", title: "Old Week 1 seed titles", status: "Resolved" },
  { id: "I2", title: "SMTP UI vs SoT", status: "Resolved" },
  { id: "I3", title: "TrueNAS attachments", status: "Resolved" },
  { id: "I4", title: "Completed-task catalog", status: "Accepted" },
];

export const WBS_STORIES: WbsStoryDto[] = [
  { id: "S1", title: "Authenticated Today experience", status: "Done" },
  { id: "S2", title: "Timer & accountability", status: "Done" },
  { id: "S3", title: "Jobs & correspondence archive", status: "Done" },
  { id: "S4", title: "Progress, review, editable roadmap", status: "Done" },
  { id: "S5", title: "Notify, sync, backup, quality", status: "Done (follow-ons parked)" },
  { id: "S6", title: "Sustained dogfood week", status: "Done" },
  { id: "S7", title: "Portfolio evidence safe to show", status: "Partial" },
  { id: "S8", title: "Accept briefs & attachments on LAN", status: "Done" },
  { id: "S9", title: "Python CS dual-track hygiene", status: "Parked" },
  { id: "S10", title: "In-app PM dashboard", status: "Done" },
];

export const RACI_ROWS: RaciRowDto[] = [
  { work: "Product decisions / SoT", sean: "A/R", primary: "C" },
  { work: "V1 feature implementation", sean: "A", primary: "R" },
  { work: "Scope creep control", sean: "A", primary: "I" },
  { work: "Roadmap seed / remap", sean: "A", primary: "C" },
  { work: "Homelab / deploy docs", sean: "A", primary: "C" },
  { work: "PM docs maintenance", sean: "A/R", primary: "C" },
  { work: "In-app PM dashboard (/pm)", sean: "A", primary: "R" },
  { work: "Test / Playwright gate", sean: "A", primary: "R" },
];

export const SPRINT = {
  name: "Sprint 3",
  status: "Closed",
  window: "Closed 2026-08-17 — attachments persist, Review in, dump proven",
};
