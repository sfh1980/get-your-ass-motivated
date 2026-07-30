import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import {
  clearSessionCookie,
  createSession,
  hashPin,
  requireAuth,
  setSessionCookie,
  verifyPin,
  type AuthedRequest,
} from "../auth.js";
import { todayUtc } from "../dates.js";
import { seedUserRoadmap } from "../roadmap/seedUser.js";
import { logActivity } from "../activity.js";
import { loginPinSchema, loginUsernameSchema, pinSchema, usernameSchema } from "../validation.js";

export const authRouter = Router();

authRouter.get("/status", async (_req, res) => {
  const count = await prisma.user.count();
  res.json({ needsSetup: count === 0, userCount: count });
});

authRouter.post("/setup", async (req, res) => {
  const existing = await prisma.user.count();
  if (existing > 0) {
    res.status(409).json({ error: "Already initialized" });
    return;
  }

  const body = z
    .object({
      username: usernameSchema,
      pin: pinSchema,
    })
    .safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }

  const startDate = todayUtc();
  const pinHash = await hashPin(body.data.pin);
  const user = await prisma.user.create({
    data: {
      username: body.data.username,
      pinHash,
      startDate,
    },
  });

  await seedUserRoadmap(user.id, startDate);

  const sessionDays = Number(process.env.SESSION_DAYS ?? 30);
  const { token, expiresAt } = await createSession(user.id, sessionDays);
  setSessionCookie(res, token, expiresAt);

  await logActivity({
    userId: user.id,
    eventType: "user_setup",
    entityType: "user",
    entityId: user.id,
    payload: { username: user.username, startDate: startDate.toISOString().slice(0, 10) },
  });

  res.status(201).json({
    user: {
      id: user.id,
      username: user.username,
      startDate: startDate.toISOString().slice(0, 10),
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const body = z
    .object({
      username: loginUsernameSchema,
      pin: loginPinSchema,
    })
    .safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ error: "Invalid credentials payload" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { username: body.data.username } });
  if (!user || !(await verifyPin(body.data.pin, user.pinHash))) {
    res.status(401).json({ error: "Invalid username or PIN" });
    return;
  }

  const sessionDays = Number(process.env.SESSION_DAYS ?? 30);
  const { token, expiresAt } = await createSession(user.id, sessionDays);
  setSessionCookie(res, token, expiresAt);

  await logActivity({
    userId: user.id,
    eventType: "user_login",
    entityType: "user",
    entityId: user.id,
  });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      startDate: user.startDate.toISOString().slice(0, 10),
    },
  });
});

authRouter.post("/logout", requireAuth, async (req: AuthedRequest, res) => {
  const token = req.cookies?.gyam_session as string | undefined;
  if (token) {
    const { hashToken } = await import("../auth.js");
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  res.json({
    user: {
      id: req.user!.id,
      username: req.user!.username,
      startDate: req.user!.startDate.toISOString().slice(0, 10),
    },
  });
});
