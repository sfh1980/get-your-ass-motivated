import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../auth.js";
import { getPmDashboard } from "../services/pmDashboard.js";

export const pmRouter = Router();
pmRouter.use(requireAuth);

pmRouter.get("/dashboard", async (req: AuthedRequest, res) => {
  const dashboard = await getPmDashboard(req.user!.id);
  res.json(dashboard);
});
