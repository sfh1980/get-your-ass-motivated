import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "./db.js";

const SESSION_COOKIE = "gyam_session";

export function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 12);
}

export function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return bcrypt.compare(pin, pinHash);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string, days = 30) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { userId, tokenHash, expiresAt },
  });
  return { token, expiresAt };
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    expires: expiresAt,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export type AuthedRequest = Request & {
  user?: { id: string; username: string; startDate: Date };
};

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    }
    clearSessionCookie(res);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = {
    id: session.user.id,
    username: session.user.username,
    startDate: session.user.startDate,
  };
  next();
}

export { SESSION_COOKIE };
