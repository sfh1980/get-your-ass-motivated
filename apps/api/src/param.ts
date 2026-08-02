import type { Response } from "express";
import { entityIdSchema } from "./validation.js";

/** Express 5 types `req.params.*` as `string | string[]`. */
export function parseEntityId(
  raw: string | string[] | undefined,
  res: Response,
): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  const parsed = entityIdSchema.safeParse(value);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return parsed.data;
}

export function paramString(raw: string | string[] | undefined): string | undefined {
  if (Array.isArray(raw)) return raw[0];
  return raw;
}
