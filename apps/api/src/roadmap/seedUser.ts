import { prisma } from "../db.js";
import { addDays, toDateOnly } from "../dates.js";
import { buildSeedPlan } from "./seed.js";
import { instructionsForTitle } from "./coachBriefs.js";
import { logActivity } from "../activity.js";

export async function seedUserRoadmap(userId: string, startDate: Date) {
  const start = toDateOnly(startDate);
  const plan = buildSeedPlan(start);

  // Subject defaults
  for (const s of plan.subjects) {
    await prisma.subjectDuration.upsert({
      where: { userId_subject: { userId, subject: s.subject } },
      create: { userId, subject: s.subject, suggestedMinutes: s.suggestedMinutes },
      update: { suggestedMinutes: s.suggestedMinutes },
    });
  }

  // Milestones
  for (const m of plan.milestones) {
    await prisma.milestone.create({
      data: {
        userId,
        monthIndex: m.monthIndex,
        title: m.title,
      },
    });
  }

  // Group tasks by dayOffset -> TaskDay + Tasks
  const byDay = new Map<number, typeof plan.tasks>();
  for (const t of plan.tasks) {
    const list = byDay.get(t.dayOffset) ?? [];
    list.push(t);
    byDay.set(t.dayOffset, list);
  }

  for (const [dayOffset, dayTasks] of byDay) {
    const date = addDays(start, dayOffset);
    const taskDay = await prisma.taskDay.create({
      data: {
        userId,
        date,
        blocked: false,
      },
    });

    await prisma.task.createMany({
      data: dayTasks.map((t) => ({
        userId,
        taskDayId: taskDay.id,
        title: t.title,
        subject: t.subject,
        suggestedMinutes: t.suggestedMinutes,
        sortOrder: t.sortOrder,
        sourceWeek: t.sourceWeek,
        status: "pending",
        notes: "",
        instructions: instructionsForTitle(t.title),
        elapsedMs: 0,
      })),
    });
  }

  await logActivity({
    userId,
    eventType: "roadmap_seeded",
    entityType: "user",
    entityId: userId,
    payload: {
      startDate: start.toISOString().slice(0, 10),
      taskCount: plan.tasks.length,
      milestoneCount: plan.milestones.length,
    },
  });
}
