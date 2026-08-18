import {
  DAILY_APPLY_QUOTA,
  JOB_STATUSES,
  WEEKLY_APPLY_QUOTA,
  type JobStatus,
  type NamedCount,
  type PmDashboardDto,
  type SeriesPoint,
} from "@gyam/shared";
import { prisma } from "../db.js";
import { addDays, formatDateOnly, todayUtc, weekdayIndexMon0 } from "../dates.js";
import { getProgressStats } from "./progress.js";
import { getIncompletePriorDates } from "./tasks.js";
import {
  GOVERNANCE_AS_OF,
  PM_CATALOG,
  RACI_ROWS,
  RAID_ISSUES,
  RAID_RISKS,
  SPRINT,
  WBS_STORIES,
} from "../pm/governanceSnapshot.js";

function startOfWeekMonday(d: Date): Date {
  return addDays(d, -weekdayIndexMon0(d));
}

function subjectLabel(subject: string | null): string {
  const trimmed = subject?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Unspecified";
}

export async function getPmDashboard(userId: string): Promise<PmDashboardDto> {
  const today = todayUtc();
  const weekStart = startOfWeekMonday(today);
  const weekEnd = addDays(weekStart, 6);

  const [progress, incompletePrior, tasks, jobs, reviews, milestones] = await Promise.all([
    getProgressStats(userId),
    getIncompletePriorDates(userId, today),
    prisma.task.findMany({
      where: { userId },
      select: {
        status: true,
        subject: true,
        elapsedMs: true,
        taskDay: { select: { date: true } },
      },
    }),
    prisma.job.findMany({
      where: { userId },
      select: { status: true, appliedAt: true },
    }),
    prisma.weeklyReview.findMany({
      where: { userId },
      select: { weekStart: true, wins: true, blockers: true, focus: true, planNextWeek: true },
      orderBy: { weekStart: "asc" },
    }),
    prisma.milestone.findMany({
      where: { userId },
      orderBy: { monthIndex: "asc" },
    }),
  ]);

  const tasksCompleted = tasks.filter((t) => t.status === "completed").length;
  const tasksOpen = tasks.length - tasksCompleted;

  const taskStatusMap = new Map<string, number>();
  const hoursMap = new Map<string, { count: number; minutes: number }>();
  for (const t of tasks) {
    taskStatusMap.set(t.status, (taskStatusMap.get(t.status) ?? 0) + 1);
    const name = subjectLabel(t.subject);
    const prev = hoursMap.get(name) ?? { count: 0, minutes: 0 };
    prev.count += 1;
    prev.minutes += Math.round(t.elapsedMs / 60000);
    hoursMap.set(name, prev);
  }

  const taskStatus: NamedCount[] = [...taskStatusMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const hoursBySubject: NamedCount[] = [...hoursMap.entries()]
    .map(([name, v]) => ({ name, count: v.count, minutes: v.minutes }))
    .filter((row) => (row.minutes ?? 0) > 0)
    .sort((a, b) => (b.minutes ?? 0) - (a.minutes ?? 0));

  const completedByDate = new Map<string, number>();
  for (const t of tasks) {
    if (t.status !== "completed") continue;
    const key = formatDateOnly(t.taskDay.date);
    completedByDate.set(key, (completedByDate.get(key) ?? 0) + 1);
  }

  const firstDate =
    tasks.length === 0
      ? today
      : tasks.reduce((min, t) => (t.taskDay.date < min ? t.taskDay.date : min), tasks[0]!.taskDay.date);
  const burnup: SeriesPoint[] = [];
  let cumulative = 0;
  for (let d = firstDate; d <= today; d = addDays(d, 1)) {
    const key = formatDateOnly(d);
    cumulative += completedByDate.get(key) ?? 0;
    burnup.push({ date: key, value: cumulative });
  }

  const jobsByStatus = Object.fromEntries(JOB_STATUSES.map((s) => [s, 0])) as Record<JobStatus, number>;
  const jobsByWeekMap = new Map<string, number>();
  for (const j of jobs) {
    const status = j.status as JobStatus;
    if (jobsByStatus[status] !== undefined) jobsByStatus[status] += 1;
    if (!j.appliedAt) continue;
    if (!["Applied", "Interview", "Accepted", "Rejected"].includes(j.status)) continue;
    const monday = formatDateOnly(startOfWeekMonday(j.appliedAt));
    jobsByWeekMap.set(monday, (jobsByWeekMap.get(monday) ?? 0) + 1);
  }

  const jobsByWeek: SeriesPoint[] = [...jobsByWeekMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  const appliedThisWeek = jobs.filter((j) => {
    if (!j.appliedAt) return false;
    if (j.appliedAt < weekStart || j.appliedAt > weekEnd) return false;
    return ["Applied", "Interview", "Accepted", "Rejected"].includes(j.status);
  }).length;
  const todayKey = formatDateOnly(today);
  let elapsedTarget = 0;
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    if (formatDateOnly(date) > todayKey) break;
    elapsedTarget += DAILY_APPLY_QUOTA[weekdayIndexMon0(date)] ?? 0;
  }

  const reviewRows = reviews.map((r) => {
    const submitted = [r.wins, r.blockers, r.focus, r.planNextWeek].some((field) => field.trim().length > 0);
    return { weekStart: formatDateOnly(r.weekStart), submitted };
  });

  return {
    generatedAt: new Date().toISOString(),
    catalog: PM_CATALOG,
    kpis: {
      currentStreak: progress.currentStreak,
      bestStreak: progress.bestStreak,
      last30Percent: progress.last30Percent,
      tasksCompleted,
      tasksOpen,
      jobsTotal: jobs.length,
      jobsApplied: jobsByStatus.Applied,
      jobsInterview: jobsByStatus.Interview,
      reviewsSubmitted: reviewRows.filter((r) => r.submitted).length,
      milestonesDone: milestones.filter((m) => m.completed).length,
      milestonesTotal: milestones.length,
      incompletePriorDays: incompletePrior.length,
      todayBlocked: incompletePrior.length > 0,
    },
    burnup,
    dailyCompletion: progress.heatmap.map((d) => ({
      date: d.date,
      percent: d.percent,
      total: d.total,
    })),
    hoursBySubject,
    taskStatus,
    jobsByStatus,
    jobsByWeek,
    quota: {
      target: WEEKLY_APPLY_QUOTA,
      applied: appliedThisWeek,
      remaining: Math.max(0, WEEKLY_APPLY_QUOTA - appliedThisWeek),
      onTrack: appliedThisWeek >= elapsedTarget,
      weekStart: formatDateOnly(weekStart),
      weekEnd: formatDateOnly(weekEnd),
    },
    milestones: milestones.map((m) => ({
      id: m.id,
      monthIndex: m.monthIndex,
      title: m.title,
      completed: m.completed,
      completedAt: m.completedAt ? m.completedAt.toISOString() : null,
    })),
    reviews: reviewRows,
    raid: {
      asOf: GOVERNANCE_AS_OF,
      risks: RAID_RISKS,
      issues: RAID_ISSUES,
    },
    wbs: WBS_STORIES,
    raci: RACI_ROWS,
    sprint: SPRINT,
  };
}
