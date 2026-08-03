import { prisma } from "../db.js";
import { formatDateOnly } from "../dates.js";
import { logActivity } from "../activity.js";
import { parseDateOnly } from "../dates.js";

export async function exportUserData(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const [taskDays, tasks, jobs, milestones, subjects, reviews, activities, taskAttachments] =
    await Promise.all([
      prisma.taskDay.findMany({ where: { userId }, orderBy: { date: "asc" } }),
      prisma.task.findMany({ where: { userId }, orderBy: [{ createdAt: "asc" }] }),
      prisma.job.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
      prisma.milestone.findMany({ where: { userId }, orderBy: { monthIndex: "asc" } }),
      prisma.subjectDuration.findMany({ where: { userId }, orderBy: { subject: "asc" } }),
      prisma.weeklyReview.findMany({ where: { userId }, orderBy: { weekStart: "asc" } }),
      prisma.activityEvent.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 2000,
      }),
      prisma.taskAttachment.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    ]);

  const dayById = new Map(taskDays.map((d) => [d.id, d]));
  const attachmentsByTask = new Map<string, typeof taskAttachments>();
  for (const a of taskAttachments) {
    const list = attachmentsByTask.get(a.taskId) ?? [];
    list.push(a);
    attachmentsByTask.set(a.taskId, list);
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    user: {
      username: user.username,
      startDate: formatDateOnly(user.startDate),
    },
    subjects: subjects.map((s) => ({
      subject: s.subject,
      suggestedMinutes: s.suggestedMinutes,
    })),
    milestones: milestones.map((m) => ({
      monthIndex: m.monthIndex,
      title: m.title,
      completed: m.completed,
      completedAt: m.completedAt?.toISOString() ?? null,
    })),
    reviews: reviews.map((r) => ({
      weekStart: formatDateOnly(r.weekStart),
      wins: r.wins,
      blockers: r.blockers,
      focus: r.focus,
      planNextWeek: r.planNextWeek,
    })),
    jobs: jobs.map((j) => ({
      company: j.company,
      title: j.title,
      url: j.url,
      status: j.status,
      salary: j.salary,
      contact: j.contact,
      followUpDate: j.followUpDate ? formatDateOnly(j.followUpDate) : null,
      resumeVersion: j.resumeVersion,
      notes: j.notes,
      emailSubject: j.emailSubject,
      emailBody: j.emailBody,
      emailAttachmentName: j.emailAttachmentName,
      emailAttachmentMime: j.emailAttachmentMime,
      emailAttachmentSize: j.emailAttachmentSize,
      appliedAt: j.appliedAt ? formatDateOnly(j.appliedAt) : null,
    })),
    tasks: tasks.map((t) => {
      const day = dayById.get(t.taskDayId);
      const atts = attachmentsByTask.get(t.id) ?? [];
      return {
        date: day ? formatDateOnly(day.date) : null,
        title: t.title,
        notes: t.notes,
        instructions: t.instructions,
        status: t.status,
        subject: t.subject,
        suggestedMinutes: t.suggestedMinutes,
        elapsedMs: t.elapsedMs,
        sortOrder: t.sortOrder,
        sourceWeek: t.sourceWeek,
        // Metadata only — binaries live on data/uploads; restore needs that volume.
        attachments: atts.map((a) => ({
          fileName: a.fileName,
          mimeType: a.mimeType,
          sizeBytes: a.sizeBytes,
          storedPath: a.storedPath,
          createdAt: a.createdAt.toISOString(),
        })),
      };
    }),
    activitySample: activities.map((a) => ({
      timestamp: a.timestamp.toISOString(),
      eventType: a.eventType,
      entityType: a.entityType,
      entityId: a.entityId,
      payload: a.payload,
      client: a.client,
    })),
  };
}

type ImportPayload = {
  version?: number;
  subjects?: Array<{ subject: string; suggestedMinutes: number }>;
  milestones?: Array<{ monthIndex: number; title?: string; completed: boolean }>;
  reviews?: Array<{
    weekStart: string;
    wins: string;
    blockers: string;
    focus: string;
    planNextWeek: string;
  }>;
  jobs?: Array<{
    company: string;
    title: string;
    url?: string | null;
    status?: string;
    salary?: string | null;
    contact?: string | null;
    followUpDate?: string | null;
    resumeVersion?: string | null;
    notes?: string;
    emailSubject?: string | null;
    emailBody?: string | null;
    appliedAt?: string | null;
  }>;
  tasks?: Array<{
    date: string | null;
    title: string;
    notes?: string;
    instructions?: string;
    status?: string;
    subject?: string | null;
    suggestedMinutes?: number | null;
    elapsedMs?: number;
    sortOrder?: number;
    sourceWeek?: number | null;
  }>;
};

function d(iso?: string | null) {
  if (!iso) return null;
  return parseDateOnly(iso);
}

export async function importUserData(userId: string, payload: ImportPayload) {
  let subjects = 0;
  let milestones = 0;
  let reviews = 0;
  let jobs = 0;
  let tasks = 0;

  for (const s of payload.subjects ?? []) {
    await prisma.subjectDuration.upsert({
      where: { userId_subject: { userId, subject: s.subject } },
      create: { userId, subject: s.subject, suggestedMinutes: s.suggestedMinutes },
      update: { suggestedMinutes: s.suggestedMinutes },
    });
    subjects += 1;
  }

  for (const m of payload.milestones ?? []) {
    const existing = await prisma.milestone.findFirst({
      where: { userId, monthIndex: m.monthIndex },
    });
    if (existing) {
      await prisma.milestone.update({
        where: { id: existing.id },
        data: {
          completed: m.completed,
          completedAt: m.completed ? new Date() : null,
          title: m.title ?? existing.title,
        },
      });
      milestones += 1;
    }
  }

  for (const r of payload.reviews ?? []) {
    const weekStart = parseDateOnly(r.weekStart);
    await prisma.weeklyReview.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      create: {
        userId,
        weekStart,
        wins: r.wins,
        blockers: r.blockers,
        focus: r.focus,
        planNextWeek: r.planNextWeek,
      },
      update: {
        wins: r.wins,
        blockers: r.blockers,
        focus: r.focus,
        planNextWeek: r.planNextWeek,
      },
    });
    reviews += 1;
  }

  for (const j of payload.jobs ?? []) {
    await prisma.job.create({
      data: {
        userId,
        company: j.company,
        title: j.title,
        url: j.url ?? null,
        status: j.status ?? "Wishlist",
        salary: j.salary ?? null,
        contact: j.contact ?? null,
        followUpDate: d(j.followUpDate),
        resumeVersion: j.resumeVersion ?? null,
        notes: j.notes ?? "",
        emailSubject: j.emailSubject ?? null,
        emailBody: j.emailBody ?? null,
        appliedAt: d(j.appliedAt),
      },
    });
    jobs += 1;
  }

  for (const t of payload.tasks ?? []) {
    if (!t.date) continue;
    const date = parseDateOnly(t.date);
    let day = await prisma.taskDay.findUnique({ where: { userId_date: { userId, date } } });
    if (!day) {
      day = await prisma.taskDay.create({ data: { userId, date } });
    }
    const existing = await prisma.task.findFirst({
      where: { userId, taskDayId: day.id, title: t.title },
    });
    if (existing) {
      await prisma.task.update({
        where: { id: existing.id },
        data: {
          notes: t.notes ?? existing.notes,
          instructions: t.instructions ?? existing.instructions,
          status: t.status ?? existing.status,
          subject: t.subject === undefined ? existing.subject : t.subject,
          suggestedMinutes:
            t.suggestedMinutes === undefined ? existing.suggestedMinutes : t.suggestedMinutes,
          elapsedMs: t.elapsedMs ?? existing.elapsedMs,
        },
      });
    } else {
      await prisma.task.create({
        data: {
          userId,
          taskDayId: day.id,
          title: t.title,
          notes: t.notes ?? "",
          instructions: t.instructions ?? "",
          status: t.status ?? "pending",
          subject: t.subject ?? null,
          suggestedMinutes: t.suggestedMinutes ?? null,
          elapsedMs: t.elapsedMs ?? 0,
          sortOrder: t.sortOrder ?? 0,
          sourceWeek: t.sourceWeek ?? null,
        },
      });
    }
    tasks += 1;
  }

  await logActivity({
    userId,
    eventType: "import_ran",
    entityType: "user",
    entityId: userId,
    payload: { subjects, milestones, reviews, jobs, tasks },
  });

  return { subjects, milestones, reviews, jobs, tasks };
}
