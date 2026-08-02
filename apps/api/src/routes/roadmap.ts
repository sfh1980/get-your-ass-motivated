import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../auth.js";
import {
  createRoadmapTask,
  deleteRoadmapTask,
  getRoadmap,
  toggleMilestone,
  updateRoadmapTask,
  updateSubjectDuration,
} from "../services/roadmap.js";
import { paramString, parseEntityId } from "../param.js";
import { isoDateSchema, notesSchema } from "../validation.js";

export const roadmapRouter = Router();
roadmapRouter.use(requireAuth);

roadmapRouter.get("/", async (req: AuthedRequest, res) => {
  const fromRaw = typeof req.query.from === "string" ? req.query.from : undefined;
  const toRaw = typeof req.query.to === "string" ? req.query.to : undefined;
  if (fromRaw) {
    const from = isoDateSchema.safeParse(fromRaw);
    if (!from.success) {
      res.status(400).json({ error: "Invalid from date" });
      return;
    }
  }
  if (toRaw) {
    const to = isoDateSchema.safeParse(toRaw);
    if (!to.success) {
      res.status(400).json({ error: "Invalid to date" });
      return;
    }
  }
  const roadmap = await getRoadmap(req.user!.id, fromRaw, toRaw);
  res.json(roadmap);
});

roadmapRouter.patch("/tasks/:id", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const parsed = z
    .object({
      title: z.string().trim().min(1).max(500).optional(),
      notes: notesSchema.optional(),
      subject: z.string().trim().max(100).nullable().optional(),
      suggestedMinutes: z.number().int().min(0).max(24 * 60).nullable().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const task = await updateRoadmapTask(req.user!.id, id, parsed.data);
  if (!task) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ task });
});

roadmapRouter.post("/tasks", async (req: AuthedRequest, res) => {
  const parsed = z
    .object({
      date: isoDateSchema,
      title: z.string().trim().min(1).max(500),
      subject: z.string().trim().max(100).nullable().optional(),
      suggestedMinutes: z.number().int().min(0).max(24 * 60).nullable().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const task = await createRoadmapTask(req.user!.id, parsed.data);
  res.status(201).json({ task });
});

roadmapRouter.delete("/tasks/:id", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const ok = await deleteRoadmapTask(req.user!.id, id);
  if (!ok) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

roadmapRouter.patch("/milestones/:id", async (req: AuthedRequest, res) => {
  const id = parseEntityId(req.params.id, res);
  if (!id) return;
  const parsed = z.object({ completed: z.boolean() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "completed boolean required" });
    return;
  }
  const milestone = await toggleMilestone(req.user!.id, id, parsed.data.completed);
  if (!milestone) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ milestone });
});

roadmapRouter.put("/subjects/:subject", async (req: AuthedRequest, res) => {
  const parsed = z.object({ suggestedMinutes: z.number().int().min(1).max(24 * 60) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "suggestedMinutes required" });
    return;
  }
  const subject = z
    .string()
    .trim()
    .min(1)
    .max(100)
    .safeParse(decodeURIComponent(paramString(req.params.subject) ?? ""));
  if (!subject.success) {
    res.status(400).json({ error: "Invalid subject" });
    return;
  }
  const row = await updateSubjectDuration(req.user!.id, subject.data, parsed.data.suggestedMinutes);
  res.json({ subject: row });
});
