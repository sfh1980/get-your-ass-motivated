import type {
  MilestoneDto,
  RoadmapDayDto,
  RoadmapResponse,
  RoadmapTaskDto,
  SubjectDurationDto,
  TaskStatus,
} from "@gyam/shared";
import { prisma } from "../db.js";
import { addDays, formatDateOnly, parseDateOnly, todayUtc } from "../dates.js";
import { logActivity } from "../activity.js";

function toTaskDto(task: {
  id: string;
  title: string;
  notes: string;
  status: string;
  subject: string | null;
  suggestedMinutes: number | null;
  sortOrder: number;
  sourceWeek: number | null;
  taskDay: { date: Date };
}): RoadmapTaskDto {
  return {
    id: task.id,
    date: formatDateOnly(task.taskDay.date),
    title: task.title,
    notes: task.notes,
    status: task.status as TaskStatus,
    subject: task.subject,
    suggestedMinutes: task.suggestedMinutes,
    sortOrder: task.sortOrder,
    sourceWeek: task.sourceWeek,
  };
}

export async function getRoadmap(userId: string, fromIso?: string, toIso?: string): Promise<RoadmapResponse> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const from = fromIso ? parseDateOnly(fromIso) : todayUtc();
  const to = toIso ? parseDateOnly(toIso) : addDays(from, 13);

  const daysRaw = await prisma.taskDay.findMany({
    where: { userId, date: { gte: from, lte: to } },
    include: { tasks: { orderBy: { sortOrder: "asc" } } },
    orderBy: { date: "asc" },
  });

  const days: RoadmapDayDto[] = daysRaw.map((d) => ({
    date: formatDateOnly(d.date),
    sourceWeek: d.tasks[0]?.sourceWeek ?? null,
    tasks: d.tasks.map((t) =>
      toTaskDto({
        ...t,
        taskDay: { date: d.date },
      }),
    ),
  }));

  const milestones = await prisma.milestone.findMany({
    where: { userId },
    orderBy: { monthIndex: "asc" },
  });

  const subjects = await prisma.subjectDuration.findMany({
    where: { userId },
    orderBy: { subject: "asc" },
  });

  return {
    startDate: formatDateOnly(user.startDate),
    from: formatDateOnly(from),
    to: formatDateOnly(to),
    days,
    milestones: milestones.map(
      (m): MilestoneDto => ({
        id: m.id,
        monthIndex: m.monthIndex,
        title: m.title,
        completed: m.completed,
        completedAt: m.completedAt ? m.completedAt.toISOString() : null,
      }),
    ),
    subjects: subjects.map(
      (s): SubjectDurationDto => ({
        id: s.id,
        subject: s.subject,
        suggestedMinutes: s.suggestedMinutes,
      }),
    ),
  };
}

export async function updateRoadmapTask(
  userId: string,
  taskId: string,
  input: {
    title?: string;
    notes?: string;
    subject?: string | null;
    suggestedMinutes?: number | null;
    sortOrder?: number;
  },
) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { taskDay: true },
  });
  if (!existing) return null;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: input.title ?? existing.title,
      notes: input.notes ?? existing.notes,
      subject: input.subject === undefined ? existing.subject : input.subject,
      suggestedMinutes:
        input.suggestedMinutes === undefined ? existing.suggestedMinutes : input.suggestedMinutes,
      sortOrder: input.sortOrder ?? existing.sortOrder,
    },
    include: { taskDay: true },
  });

  await logActivity({
    userId,
    eventType: "roadmap_task_updated",
    entityType: "task",
    entityId: task.id,
  });

  return toTaskDto(task);
}

export async function createRoadmapTask(
  userId: string,
  input: { date: string; title: string; subject?: string | null; suggestedMinutes?: number | null },
) {
  const date = parseDateOnly(input.date);
  let day = await prisma.taskDay.findUnique({ where: { userId_date: { userId, date } } });
  if (!day) {
    day = await prisma.taskDay.create({ data: { userId, date } });
  }
  const maxSort = await prisma.task.aggregate({
    where: { taskDayId: day.id },
    _max: { sortOrder: true },
  });
  const task = await prisma.task.create({
    data: {
      userId,
      taskDayId: day.id,
      title: input.title,
      subject: input.subject ?? null,
      suggestedMinutes: input.suggestedMinutes ?? null,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      status: "pending",
      notes: "",
    },
    include: { taskDay: true },
  });

  await logActivity({
    userId,
    eventType: "roadmap_task_created",
    entityType: "task",
    entityId: task.id,
    payload: { date: input.date },
  });

  return toTaskDto(task);
}

export async function deleteRoadmapTask(userId: string, taskId: string) {
  const existing = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!existing) return false;
  await prisma.task.delete({ where: { id: taskId } });
  await logActivity({
    userId,
    eventType: "roadmap_task_deleted",
    entityType: "task",
    entityId: taskId,
  });
  return true;
}

export async function toggleMilestone(userId: string, milestoneId: string, completed: boolean) {
  const existing = await prisma.milestone.findFirst({ where: { id: milestoneId, userId } });
  if (!existing) return null;
  const m = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });
  return {
    id: m.id,
    monthIndex: m.monthIndex,
    title: m.title,
    completed: m.completed,
    completedAt: m.completedAt ? m.completedAt.toISOString() : null,
  } satisfies MilestoneDto;
}

export async function updateSubjectDuration(userId: string, subject: string, suggestedMinutes: number) {
  const row = await prisma.subjectDuration.upsert({
    where: { userId_subject: { userId, subject } },
    create: { userId, subject, suggestedMinutes },
    update: { suggestedMinutes },
  });
  return {
    id: row.id,
    subject: row.subject,
    suggestedMinutes: row.suggestedMinutes,
  } satisfies SubjectDurationDto;
}
