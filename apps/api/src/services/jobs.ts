import {
  DAILY_APPLY_QUOTA,
  JOB_STATUSES,
  WEEKLY_APPLY_QUOTA,
  type JobDto,
  type JobStatus,
  type JobsBoardResponse,
} from "@gyam/shared";
import { prisma } from "../db.js";
import { addDays, formatDateOnly, todayUtc, weekdayIndexMon0 } from "../dates.js";
import { logActivity } from "../activity.js";
import {
  absoluteAttachmentPath,
  ensureUploadsDir,
  removeAttachmentFile,
  safeAttachmentName,
} from "../uploads.js";
import { mimeForAttachment } from "../validation.js";
import path from "node:path";
import fs from "node:fs";

function toJobDto(job: {
  id: string;
  company: string;
  title: string;
  url: string | null;
  status: string;
  salary: string | null;
  contact: string | null;
  followUpDate: Date | null;
  resumeVersion: string | null;
  notes: string;
  emailSubject: string | null;
  emailBody: string | null;
  emailAttachmentName: string | null;
  emailAttachmentPath: string | null;
  emailAttachmentMime: string | null;
  emailAttachmentSize: number | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): JobDto {
  return {
    id: job.id,
    company: job.company,
    title: job.title,
    url: job.url,
    status: job.status as JobStatus,
    salary: job.salary,
    contact: job.contact,
    followUpDate: job.followUpDate ? formatDateOnly(job.followUpDate) : null,
    resumeVersion: job.resumeVersion,
    notes: job.notes,
    emailSubject: job.emailSubject,
    emailBody: job.emailBody,
    emailAttachmentName: job.emailAttachmentName,
    emailAttachmentMime: job.emailAttachmentMime,
    emailAttachmentSize: job.emailAttachmentSize,
    appliedAt: job.appliedAt ? formatDateOnly(job.appliedAt) : null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

function startOfWeekMonday(d: Date): Date {
  const dow = weekdayIndexMon0(d);
  return addDays(d, -dow);
}

export async function getJobsBoard(userId: string): Promise<JobsBoardResponse> {
  const jobs = await prisma.job.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
  });

  const byStatus = Object.fromEntries(JOB_STATUSES.map((s) => [s, 0])) as Record<JobStatus, number>;
  for (const j of jobs) {
    const status = j.status as JobStatus;
    if (byStatus[status] !== undefined) byStatus[status] += 1;
  }

  const today = todayUtc();
  const weekStart = startOfWeekMonday(today);
  const weekEnd = addDays(weekStart, 6);

  const appliedThisWeek = await prisma.job.findMany({
    where: {
      userId,
      appliedAt: { gte: weekStart, lte: weekEnd },
      status: { in: ["Applied", "Interview", "Accepted", "Rejected"] },
    },
    select: { appliedAt: true },
  });

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const weekday = weekdayIndexMon0(date);
    const target = DAILY_APPLY_QUOTA[weekday] ?? 0;
    const key = formatDateOnly(date);
    const applied = appliedThisWeek.filter((j) => j.appliedAt && formatDateOnly(j.appliedAt) === key).length;
    days.push({ date: key, weekday, target, applied });
  }

  const applied = appliedThisWeek.length;
  const remaining = Math.max(0, WEEKLY_APPLY_QUOTA - applied);
  const todayKey = formatDateOnly(today);
  const elapsedTarget = days
    .filter((d) => d.date <= todayKey)
    .reduce((sum, d) => sum + d.target, 0);

  return {
    jobs: jobs.map(toJobDto),
    byStatus,
    week: {
      start: formatDateOnly(weekStart),
      end: formatDateOnly(weekEnd),
      target: WEEKLY_APPLY_QUOTA,
      applied,
      remaining,
      days,
      onTrack: applied >= elapsedTarget,
    },
  };
}

export type JobInput = {
  company: string;
  title: string;
  url?: string | null;
  status?: JobStatus;
  salary?: string | null;
  contact?: string | null;
  followUpDate?: string | null;
  resumeVersion?: string | null;
  notes?: string;
  emailSubject?: string | null;
  emailBody?: string | null;
  appliedAt?: string | null;
};

function parseOptionalDate(value?: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export async function createJob(userId: string, input: JobInput) {
  const status = input.status ?? "Wishlist";
  let appliedAt = parseOptionalDate(input.appliedAt ?? null);
  if (!appliedAt && status !== "Wishlist") {
    appliedAt = todayUtc();
  }

  const job = await prisma.job.create({
    data: {
      userId,
      company: input.company,
      title: input.title,
      url: input.url ?? null,
      status,
      salary: input.salary ?? null,
      contact: input.contact ?? null,
      followUpDate: parseOptionalDate(input.followUpDate ?? null),
      resumeVersion: input.resumeVersion ?? null,
      notes: input.notes ?? "",
      emailSubject: input.emailSubject ?? null,
      emailBody: input.emailBody ?? null,
      appliedAt,
    },
  });

  await logActivity({
    userId,
    eventType: "job_status_changed",
    entityType: "job",
    entityId: job.id,
    payload: { status: job.status, company: job.company },
  });

  return toJobDto(job);
}

export async function updateJob(userId: string, jobId: string, input: Partial<JobInput>) {
  const existing = await prisma.job.findFirst({ where: { id: jobId, userId } });
  if (!existing) return null;

  const nextStatus = (input.status ?? existing.status) as JobStatus;
  let appliedAt = existing.appliedAt;
  if (input.appliedAt !== undefined) {
    appliedAt = parseOptionalDate(input.appliedAt);
  } else if (!appliedAt && nextStatus !== "Wishlist" && existing.status === "Wishlist") {
    appliedAt = todayUtc();
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      company: input.company ?? existing.company,
      title: input.title ?? existing.title,
      url: input.url === undefined ? existing.url : input.url,
      status: nextStatus,
      salary: input.salary === undefined ? existing.salary : input.salary,
      contact: input.contact === undefined ? existing.contact : input.contact,
      followUpDate:
        input.followUpDate === undefined ? existing.followUpDate : parseOptionalDate(input.followUpDate),
      resumeVersion: input.resumeVersion === undefined ? existing.resumeVersion : input.resumeVersion,
      notes: input.notes ?? existing.notes,
      emailSubject: input.emailSubject === undefined ? existing.emailSubject : input.emailSubject,
      emailBody: input.emailBody === undefined ? existing.emailBody : input.emailBody,
      appliedAt,
    },
  });

  if (existing.status !== job.status) {
    await logActivity({
      userId,
      eventType: "job_status_changed",
      entityType: "job",
      entityId: job.id,
      payload: { from: existing.status, to: job.status },
    });
  }

  return toJobDto(job);
}

export async function saveJobAttachment(
  userId: string,
  jobId: string,
  file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
) {
  const existing = await prisma.job.findFirst({ where: { id: jobId, userId } });
  if (!existing) return null;

  removeAttachmentFile(existing.emailAttachmentPath);

  const dir = ensureUploadsDir(userId, jobId);
  const name = safeAttachmentName(file.originalname);
  const abs = path.join(dir, name);
  fs.writeFileSync(abs, file.buffer);
  const relative = path.posix.join(userId, jobId, name);
  const mime = mimeForAttachment(name);

  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      emailAttachmentName: name,
      emailAttachmentPath: relative,
      emailAttachmentMime: mime,
      emailAttachmentSize: file.size,
    },
  });

  await logActivity({
    userId,
    eventType: "job_attachment_saved",
    entityType: "job",
    entityId: jobId,
    payload: { name, size: file.size, mime },
  });

  return toJobDto(job);
}

export async function getJobAttachment(userId: string, jobId: string) {
  const job = await prisma.job.findFirst({ where: { id: jobId, userId } });
  if (!job?.emailAttachmentPath || !job.emailAttachmentName) return null;
  const abs = absoluteAttachmentPath(job.emailAttachmentPath);
  if (!fs.existsSync(abs)) return null;
  return {
    abs,
    name: job.emailAttachmentName,
    mime: mimeForAttachment(job.emailAttachmentName),
  };
}

export async function clearJobAttachment(userId: string, jobId: string) {
  const existing = await prisma.job.findFirst({ where: { id: jobId, userId } });
  if (!existing) return null;
  removeAttachmentFile(existing.emailAttachmentPath);
  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      emailAttachmentName: null,
      emailAttachmentPath: null,
      emailAttachmentMime: null,
      emailAttachmentSize: null,
    },
  });
  return toJobDto(job);
}

export async function deleteJob(userId: string, jobId: string) {
  const existing = await prisma.job.findFirst({ where: { id: jobId, userId } });
  if (!existing) return false;
  removeAttachmentFile(existing.emailAttachmentPath);
  await prisma.job.delete({ where: { id: jobId } });
  return true;
}
