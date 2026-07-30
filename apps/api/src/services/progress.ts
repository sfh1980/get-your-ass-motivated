import type { HeatDay, ProgressStats } from "@gyam/shared";
import { prisma } from "../db.js";
import { addDays, formatDateOnly, todayUtc } from "../dates.js";

function dayPercent(total: number, completed: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export async function getProgressStats(userId: string): Promise<ProgressStats> {
  const today = todayUtc();
  const from = addDays(today, -119); // ~17 weeks for a denser heatmap

  const days = await prisma.taskDay.findMany({
    where: {
      userId,
      date: { gte: from, lte: today },
    },
    include: {
      tasks: { select: { status: true } },
    },
    orderBy: { date: "asc" },
  });

  const byDate = new Map<string, HeatDay>();
  for (const d of days) {
    const total = d.tasks.length;
    const completed = d.tasks.filter((t) => t.status === "completed").length;
    byDate.set(formatDateOnly(d.date), {
      date: formatDateOnly(d.date),
      total,
      completed,
      percent: dayPercent(total, completed),
    });
  }

  const heatmap: HeatDay[] = [];
  for (let i = 119; i >= 0; i--) {
    const date = formatDateOnly(addDays(today, -i));
    heatmap.push(byDate.get(date) ?? { date, total: 0, completed: 0, percent: 0 });
  }

  const last30 = heatmap.slice(-30);
  const last30WithTasks = last30.filter((d) => d.total > 0);
  const last30Percent =
    last30WithTasks.length === 0
      ? 0
      : Math.round(last30WithTasks.reduce((sum, d) => sum + d.percent, 0) / last30WithTasks.length);

  // Current streak: walk backward from today. Skip empty/incomplete today; require 100% on counted days.
  let currentStreak = 0;
  for (let i = 0; i < 400; i++) {
    const date = formatDateOnly(addDays(today, -i));
    const day = byDate.get(date);
    if (!day || day.total === 0) {
      if (i === 0) continue;
      break;
    }
    if (day.percent < 100) {
      if (i === 0) continue;
      break;
    }
    currentStreak += 1;
  }

  // Best streak over heatmap window
  let bestStreak = 0;
  let run = 0;
  for (const day of heatmap) {
    if (day.total > 0 && day.percent === 100) {
      run += 1;
      bestStreak = Math.max(bestStreak, run);
    } else if (day.total > 0) {
      run = 0;
    }
    // days with no tasks neither break nor extend
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    last30Percent,
    heatmap,
  };
}
