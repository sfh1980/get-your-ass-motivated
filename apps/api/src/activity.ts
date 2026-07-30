import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const activityDir = path.resolve(__dirname, "../../../../logs/activity");

export async function logActivity(input: {
  userId?: string | null;
  eventType: string;
  entityType?: string | null;
  entityId?: string | null;
  payload?: Prisma.InputJsonValue;
  client?: string;
}) {
  const timestamp = new Date();
  const row = await prisma.activityEvent.create({
    data: {
      userId: input.userId ?? null,
      eventType: input.eventType,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      payload: input.payload ?? undefined,
      client: input.client ?? "web",
      timestamp,
    },
  });

  const day = timestamp.toISOString().slice(0, 10);
  const line = JSON.stringify({
    timestamp: timestamp.toISOString(),
    userId: input.userId ?? null,
    eventType: input.eventType,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    payload: input.payload ?? null,
    client: input.client ?? "web",
  });

  try {
    await fs.mkdir(activityDir, { recursive: true });
    await fs.appendFile(path.join(activityDir, `${day}.jsonl`), `${line}\n`, "utf8");
  } catch {
    // DB event is source of truth if file write fails
  }

  return row;
}
