import { CATCH_UP_PROMPT, type TodayResponse, type TodayTaskDto } from "@gyam/shared";
import { prisma } from "../db.js";
import { formatDateOnly, todayUtc } from "../dates.js";
import { logActivity } from "../activity.js";
import { toAttachmentDto } from "./taskAttachments.js";

function liveElapsedMs(task: { elapsedMs: number; activeStartedAt: Date | null; status: string }): number {
  if (task.status === "in_progress" && task.activeStartedAt) {
    return task.elapsedMs + Math.max(0, Date.now() - task.activeStartedAt.getTime());
  }
  return task.elapsedMs;
}

function toTodayTaskDto(t: {
  id: string;
  title: string;
  notes: string;
  instructions: string;
  status: string;
  subject: string | null;
  suggestedMinutes: number | null;
  elapsedMs: number;
  sortOrder: number;
  activeStartedAt: Date | null;
  attachments?: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: Date;
  }>;
}): TodayTaskDto {
  return {
    id: t.id,
    title: t.title,
    notes: t.notes,
    instructions: t.instructions,
    status: t.status as TodayTaskDto["status"],
    subject: t.subject,
    suggestedMinutes: t.suggestedMinutes,
    elapsedMs: liveElapsedMs(t),
    sortOrder: t.sortOrder,
    activeStartedAt: t.activeStartedAt ? t.activeStartedAt.toISOString() : null,
    attachments: (t.attachments ?? []).map(toAttachmentDto),
  };
}

export async function getIncompletePriorDates(userId: string, beforeDate: Date): Promise<Date[]> {
  const days = await prisma.taskDay.findMany({
    where: {
      userId,
      date: { lt: beforeDate },
      tasks: { some: { status: { not: "completed" } } },
    },
    orderBy: { date: "asc" },
    select: { date: true },
  });
  return days.map((d) => d.date);
}

export async function getTodayForUser(userId: string): Promise<TodayResponse> {
  const date = todayUtc();
  const incompletePriorDates = await getIncompletePriorDates(userId, date);
  const blocked = incompletePriorDates.length > 0;

  let taskDay = await prisma.taskDay.findUnique({
    where: { userId_date: { userId, date } },
    include: {
      tasks: {
        orderBy: { sortOrder: "asc" },
        include: { attachments: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  const backlogRows = blocked
    ? await prisma.task.findMany({
        where: {
          userId,
          status: { not: "completed" },
          taskDay: { date: { lt: date } },
        },
        orderBy: [{ taskDay: { date: "asc" } }, { sortOrder: "asc" }],
        include: { attachments: { orderBy: { createdAt: "asc" } } },
      })
    : [];

  const backlogTasks: TodayTaskDto[] = backlogRows.map(toTodayTaskDto);

  if (!taskDay) {
    // No seeded day (beyond plan or gap) - return empty unblocked/blocked shell
    return {
      date: formatDateOnly(date),
      blocked,
      blockReason: blocked ? CATCH_UP_PROMPT : null,
      incompletePriorDates: incompletePriorDates.map(formatDateOnly),
      progressPercent: 0,
      tasks: [],
      backlogTasks,
    };
  }

  if (taskDay.blocked !== blocked) {
    taskDay = await prisma.taskDay.update({
      where: { id: taskDay.id },
      data: { blocked },
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
          include: { attachments: { orderBy: { createdAt: "asc" } } },
        },
      },
    });
  }

  const tasks: TodayTaskDto[] = taskDay.tasks.map(toTodayTaskDto);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return {
    date: formatDateOnly(date),
    blocked,
    blockReason: blocked ? CATCH_UP_PROMPT : null,
    incompletePriorDates: incompletePriorDates.map(formatDateOnly),
    progressPercent,
    tasks,
    backlogTasks,
  };
}

export async function assertTaskOwned(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { taskDay: true },
  });
  if (!task) return null;
  return task;
}

export async function startTask(userId: string, taskId: string) {
  const today = await getTodayForUser(userId);
  const task = await assertTaskOwned(userId, taskId);
  if (!task) return { error: "not_found" } as const;

  const taskDate = formatDateOnly(task.taskDay.date);
  const isToday = taskDate === today.date;
  const isBacklog = today.incompletePriorDates.includes(taskDate);

  if (today.blocked && isToday) {
    return { error: "day_blocked", message: CATCH_UP_PROMPT } as const;
  }
  if (!isToday && !isBacklog) {
    return { error: "not_today" } as const;
  }

  // Pause any other in-progress tasks for this user today
  const inProgress = await prisma.task.findMany({
    where: { userId, status: "in_progress", taskDayId: task.taskDayId },
  });
  for (const other of inProgress) {
    if (other.id === task.id) continue;
    const add = other.activeStartedAt ? Math.max(0, Date.now() - other.activeStartedAt.getTime()) : 0;
    await prisma.task.update({
      where: { id: other.id },
      data: {
        status: "paused",
        elapsedMs: other.elapsedMs + add,
        activeStartedAt: null,
      },
    });
    await logActivity({
      userId,
      eventType: "task_paused",
      entityType: "task",
      entityId: other.id,
      payload: { reason: "switched_task" },
    });
  }

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: "in_progress",
      activeStartedAt: new Date(),
    },
  });

  await logActivity({
    userId,
    eventType: "task_started",
    entityType: "task",
    entityId: task.id,
  });

  return { task: updated } as const;
}

export async function pauseTask(userId: string, taskId: string, reason = "manual") {
  const task = await assertTaskOwned(userId, taskId);
  if (!task) return { error: "not_found" } as const;
  if (task.status !== "in_progress") {
    return { task } as const;
  }

  const add = task.activeStartedAt ? Math.max(0, Date.now() - task.activeStartedAt.getTime()) : 0;
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: "paused",
      elapsedMs: task.elapsedMs + add,
      activeStartedAt: null,
    },
  });

  await logActivity({
    userId,
    eventType: reason === "auto" ? "task_auto_paused" : "task_paused",
    entityType: "task",
    entityId: task.id,
    payload: { reason },
  });

  return { task: updated } as const;
}

export async function completeTask(userId: string, taskId: string, notes?: string) {
  const today = await getTodayForUser(userId);
  // Allow completing prior-day tasks even when today is blocked
  const task = await assertTaskOwned(userId, taskId);
  if (!task) return { error: "not_found" } as const;

  let elapsedMs = task.elapsedMs;
  if (task.status === "in_progress" && task.activeStartedAt) {
    elapsedMs += Math.max(0, Date.now() - task.activeStartedAt.getTime());
  }

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: "completed",
      elapsedMs,
      activeStartedAt: null,
      notes: notes ?? task.notes,
    },
  });

  await logActivity({
    userId,
    eventType: "task_completed",
    entityType: "task",
    entityId: task.id,
    payload: { elapsedMs },
  });

  // If this day is now fully complete, clear completedAt
  const remaining = await prisma.task.count({
    where: { taskDayId: task.taskDayId, status: { not: "completed" } },
  });
  if (remaining === 0) {
    await prisma.taskDay.update({
      where: { id: task.taskDayId },
      data: { completedAt: new Date(), blocked: false },
    });
  }

  if (today.blocked) {
    await logActivity({
      userId,
      eventType: "day_blocked",
      entityType: "day",
      entityId: today.date,
      payload: { incompletePriorDates: today.incompletePriorDates },
    });
  }

  return { task: updated } as const;
}

export async function updateTaskNotes(userId: string, taskId: string, notes: string) {
  const task = await assertTaskOwned(userId, taskId);
  if (!task) return { error: "not_found" } as const;
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { notes },
  });
  return { task: updated } as const;
}
