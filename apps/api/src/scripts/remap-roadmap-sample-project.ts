/**
 * One-shot remap: existing DB roadmap language → GYAM as sample project.
 * Run from repo root: npm run db:remap-sample -w @gyam/api
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";
import { prisma } from "../db.js";
import { inferSubjectFromTitle } from "../roadmap/seed.js";
import { instructionsForTitle } from "../roadmap/coachBriefs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../../.env");
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });

const TITLE_MAP: Record<string, string> = {
  "Install Jira (free) and create a sample software project.":
    "Treat GYAM as the sample software project (this repo).",
  "Create an Epic, 5 Stories, and 10 Tasks.":
    "Maintain Epic, 5 Stories, and 10 Tasks in docs/pm backlog.",
  "Document one previous personal project (Project Charter).":
    "Document GYAM with a Project Charter (docs/pm).",
  "Create a Stakeholder Register and Risk Register.":
    "Maintain Stakeholder Register and RAID/Risk Register under docs/pm.",
  "Learn Jira boards and sprint planning (1 hour).":
    "Practice sprint planning against the GYAM backlog (1 hour).",
  "Jira/Confluence practice": "GYAM backlog / agent-team check-in",
  "Software development project (2 hrs)": "Software development on GYAM (2 hrs)",
  "Improve resume/portfolio": "Improve resume/portfolio export pack",
  "Deep work (3 hrs) on portfolio or volunteer project":
    "Deep work (3 hrs) on GYAM or portfolio-export pack",
};

const MILESTONE_MAP: Record<number, string> = {
  1: "Complete PM portfolio foundation (GYAM + docs/pm pack).",
  2: "Run GYAM under hybrid Agile with living PM docs.",
  3: "Finish three documented projects (GYAM as primary case study).",
  6: "Polish interview stories using GYAM metrics and artifacts.",
  7: "Continue applying, networking, and expanding portfolio site (Months 7-12).",
};

const AGENT_RACI_TITLE =
  "Confirm agent-team RACI (Cursor subagents as supervised delivery team).";

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users — nothing to remap.");
    return;
  }

  let titleUpdates = 0;
  let milestoneUpdates = 0;
  let subjectsUpserted = 0;
  let raciAdded = 0;

  for (const user of users) {
    await prisma.subjectDuration.upsert({
      where: { userId_subject: { userId: user.id, subject: "GYAM / PM docs" } },
      create: { userId: user.id, subject: "GYAM / PM docs", suggestedMinutes: 60 },
      update: { suggestedMinutes: 60 },
    });
    subjectsUpserted += 1;

    const jiraSubject = await prisma.subjectDuration.findUnique({
      where: { userId_subject: { userId: user.id, subject: "Jira/Confluence" } },
    });
    if (jiraSubject) {
      await prisma.task.updateMany({
        where: { userId: user.id, subject: "Jira/Confluence" },
        data: { subject: "GYAM / PM docs" },
      });
      await prisma.subjectDuration.delete({ where: { id: jiraSubject.id } });
    }

    for (const [from, to] of Object.entries(TITLE_MAP)) {
      const matching = await prisma.task.findMany({
        where: { userId: user.id, title: from },
      });
      for (const task of matching) {
        const inferred = inferSubjectFromTitle(to);
        await prisma.task.update({
          where: { id: task.id },
          data: {
            title: to,
            subject: inferred.subject,
            suggestedMinutes: inferred.suggestedMinutes,
          },
        });
        titleUpdates += 1;
      }
    }

    for (const [monthIndex, title] of Object.entries(MILESTONE_MAP)) {
      const m = await prisma.milestone.findFirst({
        where: { userId: user.id, monthIndex: Number(monthIndex) },
      });
      if (m && m.title !== title) {
        await prisma.milestone.update({ where: { id: m.id }, data: { title } });
        milestoneUpdates += 1;
      }
    }

    // Add missing agent-team RACI task on the same day as the GYAM sample-project task
    const sample = await prisma.task.findFirst({
      where: {
        userId: user.id,
        title: "Treat GYAM as the sample software project (this repo).",
      },
      include: { taskDay: true },
    });
    if (sample) {
      const existingRaci = await prisma.task.findFirst({
        where: { userId: user.id, title: AGENT_RACI_TITLE },
      });
      if (!existingRaci) {
        const maxSort = await prisma.task.aggregate({
          where: { taskDayId: sample.taskDayId },
          _max: { sortOrder: true },
        });
        const inferred = inferSubjectFromTitle(AGENT_RACI_TITLE);
        await prisma.task.create({
          data: {
            userId: user.id,
            taskDayId: sample.taskDayId,
            title: AGENT_RACI_TITLE,
            subject: inferred.subject,
            suggestedMinutes: inferred.suggestedMinutes,
            sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
            sourceWeek: sample.sourceWeek ?? 1,
            status: "pending",
            notes: "",
            instructions: instructionsForTitle(AGENT_RACI_TITLE),
          },
        });
        raciAdded += 1;
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        users: users.length,
        titleUpdates,
        milestoneUpdates,
        subjectsUpserted,
        raciAdded,
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
