/**
 * One-shot remap: generic Monday/Saturday software titles → Python CS curriculum titles.
 * Idempotent — safe to re-run; skips tasks already at the target title.
 * Run from repo root: npm run db:remap-python-cs -w @gyam/api
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";
import { prisma } from "../db.js";
import { inferSubjectFromTitle } from "../roadmap/seed.js";
import {
  GENERIC_MONDAY_SOFTWARE,
  GENERIC_SATURDAY_DEEP_WORK,
  mondaySoftwareTitle,
  saturdayDeepWorkTitle,
} from "../roadmap/pythonCsCurriculum.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../../.env");
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });

function isMondayCandidate(title: string): boolean {
  return (
    title === GENERIC_MONDAY_SOFTWARE ||
    title.startsWith("Python CS Wk") ||
    title.startsWith("Python CS review:")
  );
}

function isSaturdayCandidate(title: string): boolean {
  return (
    title === GENERIC_SATURDAY_DEEP_WORK ||
    title.startsWith("Deep work (3 hrs) on GYAM") ||
    title.startsWith("Deep work (3 hrs): Python portfolio")
  );
}

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users — nothing to remap.");
    return;
  }

  let mondayUpdates = 0;
  let saturdayUpdates = 0;
  let skipped = 0;

  for (const user of users) {
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        sourceWeek: { gte: 2 },
        OR: [
          { title: GENERIC_MONDAY_SOFTWARE },
          { title: GENERIC_SATURDAY_DEEP_WORK },
          { title: { startsWith: "Python CS Wk" } },
          { title: { startsWith: "Python CS review:" } },
          { title: { startsWith: "Deep work (3 hrs) on GYAM" } },
          { title: { startsWith: "Deep work (3 hrs): Python portfolio" } },
        ],
      },
    });

    for (const task of tasks) {
      const week = task.sourceWeek;
      if (week == null || week < 2) {
        skipped += 1;
        continue;
      }

      let nextTitle: string | null = null;
      let kind: "monday" | "saturday" | null = null;

      if (isMondayCandidate(task.title)) {
        nextTitle = mondaySoftwareTitle(week);
        kind = "monday";
      } else if (isSaturdayCandidate(task.title)) {
        nextTitle = saturdayDeepWorkTitle(week);
        kind = "saturday";
      }

      if (nextTitle == null || kind == null) {
        skipped += 1;
        continue;
      }
      if (task.title === nextTitle) {
        skipped += 1;
        continue;
      }

      const inferred = inferSubjectFromTitle(nextTitle);
      await prisma.task.update({
        where: { id: task.id },
        data: {
          title: nextTitle,
          subject: inferred.subject,
          suggestedMinutes: inferred.suggestedMinutes,
        },
      });

      if (kind === "monday") mondayUpdates += 1;
      else saturdayUpdates += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        users: users.length,
        mondayUpdates,
        saturdayUpdates,
        skipped,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
