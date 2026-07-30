import type { WeeklyReviewDto } from "@gyam/shared";
import { prisma } from "../db.js";
import { addDays, formatDateOnly, todayUtc, weekdayIndexMon0 } from "../dates.js";
import { logActivity } from "../activity.js";

function weekStartMonday(d: Date) {
  return addDays(d, -weekdayIndexMon0(d));
}

export async function getWeeklyReview(userId: string, weekStartIso?: string): Promise<WeeklyReviewDto> {
  const weekStart = weekStartIso
    ? addDays(
        (() => {
          const [y, m, d] = weekStartIso.split("-").map(Number);
          return new Date(Date.UTC(y, m - 1, d));
        })(),
        0,
      )
    : weekStartMonday(todayUtc());
  const weekEnd = addDays(weekStart, 6);

  const existing = await prisma.weeklyReview.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  if (!existing) {
    return {
      id: null,
      weekStart: formatDateOnly(weekStart),
      weekEnd: formatDateOnly(weekEnd),
      wins: "",
      blockers: "",
      focus: "",
      planNextWeek: "",
      submitted: false,
      updatedAt: null,
    };
  }

  return {
    id: existing.id,
    weekStart: formatDateOnly(existing.weekStart),
    weekEnd: formatDateOnly(weekEnd),
    wins: existing.wins,
    blockers: existing.blockers,
    focus: existing.focus,
    planNextWeek: existing.planNextWeek,
    submitted: true,
    updatedAt: existing.updatedAt.toISOString(),
  };
}

export async function upsertWeeklyReview(
  userId: string,
  input: { weekStart?: string; wins: string; blockers: string; focus: string; planNextWeek: string },
) {
  const weekStart = input.weekStart
    ? (() => {
        const [y, m, d] = input.weekStart.split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
      })()
    : weekStartMonday(todayUtc());

  const review = await prisma.weeklyReview.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: {
      userId,
      weekStart,
      wins: input.wins,
      blockers: input.blockers,
      focus: input.focus,
      planNextWeek: input.planNextWeek,
    },
    update: {
      wins: input.wins,
      blockers: input.blockers,
      focus: input.focus,
      planNextWeek: input.planNextWeek,
    },
  });

  await logActivity({
    userId,
    eventType: "review_submitted",
    entityType: "weekly_review",
    entityId: review.id,
    payload: { weekStart: formatDateOnly(weekStart) },
  });

  // Mark Sunday retrospective-ish tasks complete when review is submitted
  const sunday = addDays(weekStart, 6);
  const day = await prisma.taskDay.findUnique({
    where: { userId_date: { userId, date: sunday } },
    include: { tasks: true },
  });
  if (day) {
    for (const t of day.tasks) {
      const title = t.title.toLowerCase();
      if (
        t.status !== "completed" &&
        (title.includes("retrospective") || title.includes("weekly review") || title.includes("plan the coming week") || title.includes("plan next week"))
      ) {
        await prisma.task.update({
          where: { id: t.id },
          data: { status: "completed", activeStartedAt: null },
        });
      }
    }
    const remaining = await prisma.task.count({
      where: { taskDayId: day.id, status: { not: "completed" } },
    });
    if (remaining === 0) {
      await prisma.taskDay.update({
        where: { id: day.id },
        data: { completedAt: new Date(), blocked: false },
      });
    }
  }

  return getWeeklyReview(userId, formatDateOnly(weekStart));
}
