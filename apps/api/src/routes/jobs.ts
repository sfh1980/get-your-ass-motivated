import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../auth.js";
import {
  clearJobAttachment,
  createJob,
  deleteJob,
  getJobAttachment,
  getJobsBoard,
  saveJobAttachment,
  updateJob,
} from "../services/jobs.js";
import { parseEntityId } from "../param.js";
import {
  ATTACHMENT_MAX_BYTES,
  emailBodySchema,
  isoDateSchema,
  isAllowedAttachment,
  jobStatusSchema,
  mimeForAttachment,
  notesSchema,
  optionalHttpUrl,
} from "../validation.js";

export const jobsRouter = Router();
jobsRouter.use(requireAuth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: ATTACHMENT_MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedAttachment(file.originalname)) {
      cb(new Error("Attachment type not allowed"));
      return;
    }
    cb(null, true);
  },
});

const jobBody = z.object({
  company: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  url: optionalHttpUrl,
  status: jobStatusSchema.optional(),
  salary: z.string().trim().max(100).optional().nullable(),
  contact: z.string().trim().max(200).optional().nullable(),
  followUpDate: isoDateSchema.optional().nullable(),
  resumeVersion: z.string().trim().max(100).optional().nullable(),
  notes: notesSchema.optional(),
  emailSubject: z.string().max(500).optional().nullable(),
  emailBody: emailBodySchema.optional().nullable(),
  appliedAt: isoDateSchema.optional().nullable(),
});

const jobPatch = jobBody.partial();

jobsRouter.get("/", async (req: AuthedRequest, res) => {
  const board = await getJobsBoard(req.user!.id);
  res.json(board);
});

jobsRouter.post("/", async (req: AuthedRequest, res) => {
  const parsed = jobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const job = await createJob(req.user!.id, parsed.data);
  res.status(201).json({ job });
});

jobsRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const parsed = jobPatch.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const job = await updateJob(req.user!.id, id, parsed.data);
  if (!job) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ job });
});

jobsRouter.post("/:id/attachment", (req: AuthedRequest, res, next) => {
  upload.single("file")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      res.status(413).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File too large (max 5MB)" : err.message });
      return;
    }
    if (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
      return;
    }
    next();
  });
}, async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  if (!req.file) {
    res.status(400).json({ error: "file required" });
    return;
  }
  if (!isAllowedAttachment(req.file.originalname)) {
    res.status(400).json({ error: "Attachment type not allowed" });
    return;
  }
  const job = await saveJobAttachment(req.user!.id, id, {
    originalname: req.file.originalname,
    mimetype: mimeForAttachment(req.file.originalname),
    size: req.file.size,
    buffer: req.file.buffer,
  });
  if (!job) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ job });
});

jobsRouter.get("/:id/attachment", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const file = await getJobAttachment(req.user!.id, id);
  if (!file) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.setHeader("Content-Type", file.mime);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.name.replace(/"/g, "")}"`,
  );
  res.sendFile(file.abs);
});

jobsRouter.delete("/:id/attachment", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const job = await clearJobAttachment(req.user!.id, id);
  if (!job) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ job });
});

jobsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const ok = await deleteJob(req.user!.id, id);
  if (!ok) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});
