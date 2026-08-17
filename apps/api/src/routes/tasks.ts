import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../auth.js";
import {
  completeTask,
  deferTaskToTomorrow,
  getTodayForUser,
  pauseTask,
  startTask,
  updateTaskNotes,
} from "../services/tasks.js";
import {
  deleteTaskAttachment,
  getTaskAttachmentFile,
  saveTaskAttachment,
} from "../services/taskAttachments.js";
import { parseEntityId } from "../param.js";
import {
  ATTACHMENT_MAX_BYTES,
  isAllowedAttachment,
  mimeForAttachment,
  notesSchema,
} from "../validation.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

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

tasksRouter.get("/today", async (req: AuthedRequest, res) => {
  const today = await getTodayForUser(req.user!.id);
  res.json(today);
});

tasksRouter.post("/:id/start", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const result = await startTask(req.user!.id, id);
  if ("error" in result) {
    const status = result.error === "day_blocked" ? 409 : result.error === "not_found" ? 404 : 400;
    res.status(status).json(result);
    return;
  }
  res.json(result);
});

tasksRouter.post("/:id/pause", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const body = z.object({ reason: z.enum(["auto", "manual"]).optional() }).safeParse(req.body ?? {});
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }
  const auto = body.data.reason === "auto";
  const result = await pauseTask(req.user!.id, id, auto ? "auto" : "manual");
  if ("error" in result) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

tasksRouter.post("/:id/complete", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const body = z.object({ notes: notesSchema.optional() }).safeParse(req.body ?? {});
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }
  const result = await completeTask(req.user!.id, id, body.data.notes);
  if ("error" in result) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

tasksRouter.post("/:id/tomorrow", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const result = await deferTaskToTomorrow(req.user!.id, id);
  if ("error" in result) {
    const status = result.error === "not_found" ? 404 : 400;
    res.status(status).json(result);
    return;
  }
  res.json(result);
});

tasksRouter.patch("/:id/notes", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const body = z.object({ notes: notesSchema }).safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "notes required (max 10000 chars)" });
    return;
  }
  const result = await updateTaskNotes(req.user!.id, id, body.data.notes);
  if ("error" in result) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

tasksRouter.post(
  "/:id/attachments",
  (req: AuthedRequest, res, next) => {
    upload.single("file")(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        res
          .status(413)
          .json({ error: err.code === "LIMIT_FILE_SIZE" ? "File too large (max 5MB)" : err.message });
        return;
      }
      if (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
        return;
      }
      next();
    });
  },
  async (req: AuthedRequest, res) => {
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
    const attachment = await saveTaskAttachment(req.user!.id, id, {
      originalname: req.file.originalname,
      mimetype: mimeForAttachment(req.file.originalname),
      size: req.file.size,
      buffer: req.file.buffer,
    });
    if (!attachment) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.status(201).json({ attachment });
  },
);

tasksRouter.get("/:id/attachments/:attachmentId", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const attachmentId = parseEntityId(req.params.attachmentId, res);
  if (!attachmentId) return;
  const file = await getTaskAttachmentFile(req.user!.id, id, attachmentId);
  if (!file) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.setHeader("Content-Type", file.mime);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Disposition", `attachment; filename="${file.name.replace(/"/g, "")}"`);
  res.sendFile(file.abs);
});

tasksRouter.delete("/:id/attachments/:attachmentId", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const attachmentId = parseEntityId(req.params.attachmentId, res);
  if (!attachmentId) return;
  const ok = await deleteTaskAttachment(req.user!.id, id, attachmentId);
  if (!ok) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});
