import { addDays, weekdayIndexMon0 } from "../dates.js";

export type SeedTask = {
  dayOffset: number;
  title: string;
  subject: string | null;
  suggestedMinutes: number | null;
  sortOrder: number;
  sourceWeek: number;
};

export type SeedMilestone = {
  monthIndex: number;
  title: string;
};

const WEEK1: Array<{ dayOffset: number; titles: string[] }> = [
  {
    dayOffset: 0,
    titles: [
      "Create a dedicated job search folder.",
      "Create a GitHub repository named Project-Management-Portfolio.",
      'Update LinkedIn headline to "Aspiring Technical Project Coordinator | Google Project Management Certificate".',
      "Spend 30 minutes reading PMBOK or Agile notes.",
    ],
  },
  {
    dayOffset: 1,
    titles: [
      "Treat GYAM as the sample software project (this repo).",
      "Maintain Epic, 5 Stories, and 10 Tasks in docs/pm backlog.",
      "Confirm agent-team RACI (Cursor subagents as supervised delivery team).",
    ],
  },
  {
    dayOffset: 2,
    titles: ["Document GYAM with a Project Charter (docs/pm)."],
  },
  {
    dayOffset: 3,
    titles: ["Maintain Stakeholder Register and RAID/Risk Register under docs/pm."],
  },
  {
    dayOffset: 4,
    titles: [
      "Practice sprint planning against the GYAM backlog (1 hour).",
      "Apply to 2 Project Coordinator jobs.",
    ],
  },
  {
    dayOffset: 5,
    titles: [
      "Study Excel (Pivot Tables, XLOOKUP) for 2 hours.",
      "Walk/exercise.",
    ],
  },
  {
    dayOffset: 6,
    titles: ["Weekly review.", "Plan next week."],
  },
];

const ROUTINE: Record<number, string[]> = {
  0: [
    "1 hr PM study",
    "1 hr software (Python/C#)",
    "Apply to 3 jobs",
    "Update application tracker",
  ],
  1: [
    "GYAM backlog / agent-team check-in",
    "Build one PM artifact",
    "Network with 2 people on LinkedIn",
  ],
  2: [
    "Software development on GYAM (2 hrs)",
    "Read one PM chapter",
    "Apply to 2 jobs",
  ],
  3: [
    "Excel/Power BI (90 min)",
    "Improve resume/portfolio export pack",
    "Apply to 2 jobs",
  ],
  4: [
    "Mock interview (30 min)",
    "Review Agile concepts",
    "Apply to 3 jobs",
  ],
  5: ["Deep work (3 hrs) on GYAM or portfolio-export pack"],
  6: [
    "Weekly retrospective (guided)",
    "Organize notes",
    "Plan the coming week",
  ],
};

const MILESTONES: SeedMilestone[] = [
  { monthIndex: 1, title: "Complete PM portfolio foundation (GYAM + docs/pm pack)." },
  { monthIndex: 2, title: "Run GYAM under hybrid Agile with living PM docs." },
  { monthIndex: 3, title: "Finish three documented projects (GYAM as primary case study)." },
  { monthIndex: 4, title: "Volunteer or contribute to a real project." },
  { monthIndex: 5, title: "Learn Power BI." },
  { monthIndex: 6, title: "Polish interview stories using GYAM metrics and artifacts." },
  { monthIndex: 7, title: "Continue applying, networking, and expanding portfolio site (Months 7-12)." },
];

const DEFAULT_SUBJECTS: Array<{ subject: string; suggestedMinutes: number }> = [
  { subject: "PM study", suggestedMinutes: 60 },
  { subject: "Software practice", suggestedMinutes: 60 },
  { subject: "GYAM / PM docs", suggestedMinutes: 60 },
  { subject: "Excel/Power BI", suggestedMinutes: 90 },
  { subject: "Job applications", suggestedMinutes: 45 },
  { subject: "Networking", suggestedMinutes: 30 },
  { subject: "Interview prep", suggestedMinutes: 30 },
  { subject: "Deep work", suggestedMinutes: 180 },
  { subject: "Weekly review", suggestedMinutes: 45 },
  { subject: "Exercise", suggestedMinutes: 30 },
];

function inferSubject(title: string): { subject: string | null; suggestedMinutes: number | null } {
  const t = title.toLowerCase();
  if (t.includes("pmbok") || t.includes("agile") || t.includes("pm study") || t.includes("pm chapter")) {
    return { subject: "PM study", suggestedMinutes: 60 };
  }
  if (t.includes("python") || t.includes("c#") || t.includes("software")) {
    return { subject: "Software practice", suggestedMinutes: t.includes("2 hrs") ? 120 : 60 };
  }
  if (
    t.includes("jira") ||
    t.includes("confluence") ||
    t.includes("epic") ||
    t.includes("stakeholder") ||
    t.includes("risk") ||
    t.includes("charter") ||
    t.includes("docs/pm") ||
    t.includes("agent-team") ||
    t.includes("sprint planning") ||
    t.includes("gyam as the sample") ||
    t.includes("backlog")
  ) {
    return { subject: "GYAM / PM docs", suggestedMinutes: 60 };
  }
  if (t.includes("excel") || t.includes("power bi") || t.includes("xlookup")) {
    return { subject: "Excel/Power BI", suggestedMinutes: 90 };
  }
  if (t.includes("apply") || t.includes("application tracker") || t.includes("job")) {
    return { subject: "Job applications", suggestedMinutes: 45 };
  }
  if (t.includes("linkedin") || t.includes("network")) {
    return { subject: "Networking", suggestedMinutes: 30 };
  }
  if (t.includes("interview")) {
    return { subject: "Interview prep", suggestedMinutes: 30 };
  }
  if (t.includes("deep work") || t.includes("portfolio") || t.includes("volunteer")) {
    return { subject: "Deep work", suggestedMinutes: 180 };
  }
  if (t.includes("review") || t.includes("retrospective") || t.includes("plan next")) {
    return { subject: "Weekly review", suggestedMinutes: 45 };
  }
  if (t.includes("walk") || t.includes("exercise")) {
    return { subject: "Exercise", suggestedMinutes: 30 };
  }
  if (t.includes("30 minutes")) return { subject: "PM study", suggestedMinutes: 30 };
  if (t.includes("1 hour") || t.includes("1 hr")) return { subject: null, suggestedMinutes: 60 };
  return { subject: null, suggestedMinutes: null };
}

/** Generate first 52 weeks of tasks from startDate (Day 0 = first use day). */
export function buildSeedPlan(startDate: Date): {
  tasks: SeedTask[];
  milestones: SeedMilestone[];
  subjects: typeof DEFAULT_SUBJECTS;
} {
  const tasks: SeedTask[] = [];

  for (const day of WEEK1) {
    day.titles.forEach((title, idx) => {
      const inferred = inferSubject(title);
      tasks.push({
        dayOffset: day.dayOffset,
        title,
        subject: inferred.subject,
        suggestedMinutes: inferred.suggestedMinutes,
        sortOrder: idx,
        sourceWeek: 1,
      });
    });
  }

  // Weeks 2-52: 51 weeks * 7 days starting at dayOffset 7
  for (let week = 2; week <= 52; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const dayOffset = 7 + (week - 2) * 7 + dow;
      const date = addDays(startDate, dayOffset);
      const patternDow = weekdayIndexMon0(date);
      const titles = ROUTINE[patternDow] ?? [];
      titles.forEach((title, idx) => {
        const inferred = inferSubject(title);
        tasks.push({
          dayOffset,
          title,
          subject: inferred.subject,
          suggestedMinutes: inferred.suggestedMinutes,
          sortOrder: idx,
          sourceWeek: week,
        });
      });
    }
  }

  return { tasks, milestones: MILESTONES, subjects: DEFAULT_SUBJECTS };
}

export { inferSubject as inferSubjectFromTitle };
