import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../auth.js";
import {
  completeTask,
  getTodayForUser,
  pauseTask,
  startTask,
  updateTaskNotes,
} from "../services/tasks.js";
import { parseEntityId } from "../param.js";
import { notesSchema } from "../validation.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

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
