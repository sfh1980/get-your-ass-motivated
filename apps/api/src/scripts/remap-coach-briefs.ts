/**
 * One-shot remap: fill empty Task.instructions from coach brief library.
 * Skips non-empty instructions so manual Roadmap edits survive.
 * Run from repo root: npm run db:remap-coach-briefs -w @gyam/api
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";
import { prisma } from "../db.js";
import { instructionsForTitle } from "../roadmap/coachBriefs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../../.env");
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users — nothing to remap.");
    return;
  }

  let updated = 0;
  let skippedEmptyBrief = 0;
  let skippedAlreadySet = 0;

  for (const user of users) {
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, instructions: true },
    });

    for (const task of tasks) {
      if (task.instructions.trim() !== "") {
        skippedAlreadySet += 1;
        continue;
      }
      const brief = instructionsForTitle(task.title);
      if (!brief) {
        skippedEmptyBrief += 1;
        continue;
      }
      await prisma.task.update({
        where: { id: task.id },
        data: { instructions: brief },
      });
      updated += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        users: users.length,
        updated,
        skippedAlreadySet,
        skippedEmptyBrief,
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
