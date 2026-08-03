import fs from "node:fs";
import path from "node:path";
import type { TaskAttachmentDto } from "@gyam/shared";
import { prisma } from "../db.js";
import { logActivity } from "../activity.js";
import { mimeForAttachment } from "../validation.js";
import {
  absoluteAttachmentPath,
  ensureUploadsDir,
  removeAttachmentFile,
  safeAttachmentName,
} from "../uploads.js";

export function toAttachmentDto(row: {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
}): TaskAttachmentDto {
  return {
    id: row.id,
    fileName: row.fileName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listTaskAttachments(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) return null;
  const rows = await prisma.taskAttachment.findMany({
    where: { taskId, userId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toAttachmentDto);
}

export async function saveTaskAttachment(
  userId: string,
  taskId: string,
  file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) return null;

  const dir = ensureUploadsDir("tasks", userId, taskId);
  let name = safeAttachmentName(file.originalname);
  let abs = path.join(dir, name);
  if (fs.existsSync(abs)) {
    const ext = path.extname(name);
    const stem = path.basename(name, ext);
    name = safeAttachmentName(`${stem}-${Date.now()}${ext}`);
    abs = path.join(dir, name);
  }
  fs.writeFileSync(abs, file.buffer);
  const relative = path.posix.join("tasks", userId, taskId, name);
  const mime = mimeForAttachment(name);

  const row = await prisma.taskAttachment.create({
    data: {
      taskId,
      userId,
      fileName: name,
      storedPath: relative,
      mimeType: mime,
      sizeBytes: file.size,
    },
  });

  await logActivity({
    userId,
    eventType: "task_attachment_saved",
    entityType: "task",
    entityId: taskId,
    payload: { attachmentId: row.id, name, size: file.size, mime },
  });

  return toAttachmentDto(row);
}

export async function getTaskAttachmentFile(userId: string, taskId: string, attachmentId: string) {
  const row = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId, userId },
  });
  if (!row) return null;
  const abs = absoluteAttachmentPath(row.storedPath);
  if (!fs.existsSync(abs)) return null;
  return {
    abs,
    name: row.fileName,
    mime: row.mimeType || mimeForAttachment(row.fileName),
  };
}

export async function deleteTaskAttachment(userId: string, taskId: string, attachmentId: string) {
  const row = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId, userId },
  });
  if (!row) return false;
  removeAttachmentFile(row.storedPath);
  await prisma.taskAttachment.delete({ where: { id: row.id } });
  await logActivity({
    userId,
    eventType: "task_attachment_deleted",
    entityType: "task",
    entityId: taskId,
    payload: { attachmentId },
  });
  return true;
}

/** Remove all attachment files for a task (DB rows cascade separately). */
export async function removeAllTaskAttachmentFiles(userId: string, taskId: string) {
  const rows = await prisma.taskAttachment.findMany({
    where: { taskId, userId },
    select: { storedPath: true },
  });
  for (const row of rows) {
    removeAttachmentFile(row.storedPath);
  }
  // Best-effort remove empty task dir
  try {
    const dir = absoluteAttachmentPath(path.posix.join("tasks", userId, taskId));
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  } catch {
    // ignore
  }
}
