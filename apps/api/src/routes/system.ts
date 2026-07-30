import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../auth.js";
import { getNotifyStatus, sendEmail } from "../services/notify.js";
import { getDueFollowUps, sendFollowUpDigest } from "../services/reminders.js";
import { exportUserData, importUserData } from "../services/backup.js";
import { logActivity } from "../activity.js";
import { importPayloadSchema } from "../validation.js";

export const systemRouter = Router();
systemRouter.use(requireAuth);

systemRouter.get("/notify/status", async (_req, res) => {
  res.json(getNotifyStatus());
});

systemRouter.post("/notify/test-email", async (req: AuthedRequest, res) => {
  const result = await sendEmail({
    userId: req.user!.id,
    subject: "GYAM test email",
    text: "If you received this, SMTP is working for GYAM notifications.",
  });
  if (!result.ok) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

systemRouter.get("/reminders/follow-ups", async (req: AuthedRequest, res) => {
  const due = await getDueFollowUps(req.user!.id);
  res.json({ due });
});

systemRouter.post("/reminders/follow-ups/email", async (req: AuthedRequest, res) => {
  const result = await sendFollowUpDigest(req.user!.id);
  if (!result.ok) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

systemRouter.get("/export", async (req: AuthedRequest, res) => {
  const data = await exportUserData(req.user!.id);
  await logActivity({
    userId: req.user!.id,
    eventType: "export_ran",
    entityType: "user",
    entityId: req.user!.id,
  });
  res.json(data);
});

systemRouter.post("/import", async (req: AuthedRequest, res) => {
  const parsed = importPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid import payload", details: parsed.error.flatten() });
    return;
  }
  const result = await importUserData(req.user!.id, parsed.data);
  res.json({ ok: true, result });
});
