import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../auth.js";
import { getWeeklyReview, upsertWeeklyReview } from "../services/reviews.js";
import { isoDateSchema, notesSchema } from "../validation.js";

export const reviewsRouter = Router();
reviewsRouter.use(requireAuth);

reviewsRouter.get("/weekly", async (req: AuthedRequest, res) => {
  const weekStartRaw = typeof req.query.weekStart === "string" ? req.query.weekStart : undefined;
  if (weekStartRaw) {
    const weekStart = isoDateSchema.safeParse(weekStartRaw);
    if (!weekStart.success) {
      res.status(400).json({ error: "Invalid weekStart" });
      return;
    }
  }
  const review = await getWeeklyReview(req.user!.id, weekStartRaw);
  res.json(review);
});

reviewsRouter.put("/weekly", async (req: AuthedRequest, res) => {
  const parsed = z
    .object({
      weekStart: isoDateSchema.optional(),
      wins: notesSchema,
      blockers: notesSchema,
      focus: notesSchema,
      planNextWeek: notesSchema,
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const review = await upsertWeeklyReview(req.user!.id, parsed.data);
  res.json(review);
});
