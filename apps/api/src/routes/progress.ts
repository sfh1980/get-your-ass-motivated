import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../auth.js";
import { getProgressStats } from "../services/progress.js";

export const progressRouter = Router();
progressRouter.use(requireAuth);

progressRouter.get("/", async (req: AuthedRequest, res) => {
  const stats = await getProgressStats(req.user!.id);
  res.json(stats);
});
