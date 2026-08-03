import { z } from "zod";
import { JOB_STATUSES, type JobStatus } from "@gyam/shared";
import { formatDateOnly, parseDateOnly } from "./dates.js";

export const usernameSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9._-]{2,64}$/, "Username must be 2-64 chars: letters, digits, . _ -");

export const pinSchema = z.string().regex(/^\d{4,8}$/, "PIN must be 4-8 digits");

/** Login: same shape as setup so bcrypt never sees huge strings. */
export const loginUsernameSchema = z.string().trim().min(1).max(64);
export const loginPinSchema = z.string().min(1).max(8).regex(/^\d{1,8}$/);

export const entityIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid id");

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((value) => {
    try {
      return formatDateOnly(parseDateOnly(value)) === value;
    } catch {
      return false;
    }
  }, "Invalid calendar date");

export const httpUrlSchema = z
  .string()
  .trim()
  .max(2000)
  .url()
  .refine((u) => /^https?:\/\//i.test(u), "URL must be http or https");

export const optionalHttpUrl = z
  .union([httpUrlSchema, z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const notesSchema = z.string().max(10_000);
export const emailBodySchema = z.string().max(50_000);
export const jobStatusSchema = z.enum(JOB_STATUSES as [JobStatus, ...JobStatus[]]);

export const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;
export const ATTACHMENT_ALLOWED_EXT = new Set([
  ".pdf",
  ".txt",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".xlsx",
  ".xls",
  ".csv",
  ".svg",
  ".drawio",
]);
export const ATTACHMENT_MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".csv": "text/csv",
  ".svg": "image/svg+xml",
  ".drawio": "application/vnd.jgraph.mxfile",
};

export function attachmentExtension(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const i = base.lastIndexOf(".");
  if (i < 0) return "";
  return base.slice(i).toLowerCase();
}

export function isAllowedAttachment(name: string): boolean {
  return ATTACHMENT_ALLOWED_EXT.has(attachmentExtension(name));
}

export function mimeForAttachment(name: string): string {
  return ATTACHMENT_MIME_BY_EXT[attachmentExtension(name)] ?? "application/octet-stream";
}

export const importPayloadSchema = z
  .object({
    version: z.number().int().min(1).max(10).optional(),
    subjects: z
      .array(
        z.object({
          subject: z.string().trim().min(1).max(100),
          suggestedMinutes: z.number().int().min(1).max(24 * 60),
        }),
      )
      .max(200)
      .optional(),
    milestones: z
      .array(
        z.object({
          monthIndex: z.number().int().min(1).max(24),
          title: z.string().trim().max(500).optional(),
          completed: z.boolean(),
        }),
      )
      .max(50)
      .optional(),
    reviews: z
      .array(
        z.object({
          weekStart: isoDateSchema,
          wins: notesSchema,
          blockers: notesSchema,
          focus: notesSchema,
          planNextWeek: notesSchema,
        }),
      )
      .max(200)
      .optional(),
    jobs: z
      .array(
        z.object({
          company: z.string().trim().min(1).max(200),
          title: z.string().trim().min(1).max(200),
          url: z.union([httpUrlSchema, z.null()]).optional(),
          status: jobStatusSchema.optional(),
          salary: z.string().trim().max(100).nullable().optional(),
          contact: z.string().trim().max(200).nullable().optional(),
          followUpDate: isoDateSchema.nullable().optional(),
          resumeVersion: z.string().trim().max(100).nullable().optional(),
          notes: notesSchema.optional(),
          emailSubject: z.string().max(500).nullable().optional(),
          emailBody: emailBodySchema.nullable().optional(),
          appliedAt: isoDateSchema.nullable().optional(),
        }),
      )
      .max(2000)
      .optional(),
    tasks: z
      .array(
        z.object({
          date: isoDateSchema.nullable(),
          title: z.string().trim().min(1).max(500),
          notes: notesSchema.optional(),
          instructions: notesSchema.optional(),
          status: z
            .enum(["pending", "in_progress", "paused", "completed", "skipped"])
            .optional(),
          subject: z.string().trim().max(100).nullable().optional(),
          suggestedMinutes: z.number().int().min(0).max(24 * 60).nullable().optional(),
          elapsedMs: z.number().int().min(0).max(1000 * 60 * 60 * 24 * 30).optional(),
          sortOrder: z.number().int().min(0).max(10_000).optional(),
          sourceWeek: z.number().int().min(1).max(52).nullable().optional(),
        }),
      )
      .max(20_000)
      .optional(),
  });
// Unknown keys (user, activitySample, exportedAt) are stripped by Zod.
