/**
 * Coach briefs for roadmap task titles (Why / Do this / Done when).
 * Used by seed + db:remap-coach-briefs. Unknown titles return "".
 */
import { PYTHON_CS_WEEKS } from "./pythonCsCurriculum.js";

function brief(why: string, steps: string[], doneWhen: string): string {
  const numbered = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `Why\n${why}\n\nDo this\n${numbered}\n\nDone when\n${doneWhen}`;
}

const EXACT: Record<string, string> = {
  // —— Week 1 ——
  "Create a dedicated job search folder.": brief(
    "Give every application artifact one home so nothing lives only in Downloads.",
    [
      "Create a folder (local or cloud) named for this job search year/role track.",
      "Add subfolders you will actually use: Applications, Resume versions, Correspondence, Portfolio exports.",
      "Put a shortcut or path note somewhere you open daily (desktop, GYAM notes, or Obsidian).",
    ],
    "The folder exists and you know exactly where today’s applications and resumes go.",
  ),

  "Create a GitHub repository named Project-Management-Portfolio.": brief(
    "Public evidence of PM practice needs a durable home; GYAM’s docs/pm pack can feed it later.",
    [
      "On GitHub, create a repo named Project-Management-Portfolio (public or private is your call for now).",
      "Add a short README: purpose = PM portfolio staging from GYAM, not the public website yet.",
      "Star/bookmark the repo URL in your job-search folder.",
    ],
    "The empty (or README-only) repo exists and you can open it in one click.",
  ),

  'Update LinkedIn headline to "Aspiring Technical Project Coordinator | Google Project Management Certificate".':
    brief(
      "Recruiters scan headlines first; align yours with the role you are targeting.",
      [
        "Open LinkedIn → Profile → Headline.",
        'Set headline to: Aspiring Technical Project Coordinator | Google Project Management Certificate (or a tight variant you own).',
        "Save and view your profile as public to confirm it reads cleanly.",
      ],
      "Headline is live and matches the PM / Technical Project Coordinator positioning.",
    ),

  "Spend 30 minutes reading PMBOK or Agile notes.": brief(
    "Daily PM study compounds; keep it timed and specific.",
    [
      "Pick one source: PMBOK notes, Google PM Certificate materials, or Agile basics.",
      "Set a 30-minute timer in GYAM; read actively (highlight or jot 2–3 takeaways in task Notes).",
      "Stop at 30 minutes — depth beats marathon cramming.",
    ],
    "Thirty minutes logged and at least one concrete takeaway written in Notes.",
  ),

  "Treat GYAM as the sample software project (this repo).": brief(
    "Your roadmap’s “sample project” is this codebase — not a throwaway Jira sandbox.",
    [
      "Skim docs/pm/00-multi-purpose-and-progress.md (roles P1–P8).",
      "Say out loud (or write one sentence): GYAM = career OS + sample project + PM lab + portfolio staging.",
      "Do not start a separate fake project for PM artifacts.",
    ],
    "You can explain in one sentence what GYAM is for without calling it “just an app.”",
  ),

  "Maintain Epic, 5 Stories, and 10 Tasks in docs/pm backlog.": brief(
    "Backlog hygiene is the Tuesday PM ceremony — truth in docs/pm/07-wbs-backlog.md.",
    [
      "Open docs/pm/07-wbs-backlog.md.",
      "Walk Epic E1 and Stories S1–S5: statuses still honest? (Done stays Done.)",
      "Check open follow-ons (Phase B tunnel, case-study metrics, weekly RAID/status, Python CS epic).",
      "Optionally pull 1–3 next tasks into docs/pm/08-sprint-plan.md or a short note.",
      "If you changed anything material, add one line to docs/pm/11-change-log.md.",
    ],
    "Backlog matches reality and you know the next 1–3 pieces of work — not ten new fake tickets.",
  ),

  "Confirm agent-team RACI (Cursor subagents as supervised delivery team).": brief(
    "You are the PM; Cursor agents are the delivery team. RACI makes that supervision transferable.",
    [
      "Open docs/pm/04-raci.md and read the matrix once.",
      "Confirm the loop still matches how you work: goal → assign agent → review vs SoT/DoD → accept/rework → RAID/status.",
      "Spot-check one upcoming ask (roadmap, deploy, scope) and name who is R vs A.",
      "Edit a cell if reality differs; leave it if the matrix is still right.",
    ],
    "You have re-read and endorsed the RACI (edited if wrong) — not redrawn it from scratch.",
  ),

  "Document GYAM with a Project Charter (docs/pm).": brief(
    "A charter is the one-page “why / what / success” hiring managers expect to see.",
    [
      "Open docs/pm/01-project-charter.md.",
      "Verify purpose, success criteria, and out-of-scope still match SoT (including local notify, no SMTP must-have).",
      "Update dates/status if Phase A / dogfood reality drifted.",
      "Note one line in change log if you edited substance.",
    ],
    "Charter is current enough that a stranger could understand GYAM’s intent in two minutes.",
  ),

  "Maintain Stakeholder Register and RAID/Risk Register under docs/pm.": brief(
    "Stakeholders and RAID are living PM artifacts — weekly touch beats perfect prose.",
    [
      "Open docs/pm/02-stakeholder-register.md: anyone missing (agents, homelab, future hiring managers)?",
      "Open docs/pm/06-raid-log.md: close stale issues; add new risks/blockers (e.g. Phase B blocked on Yum4Less).",
      "Keep entries short and dated.",
    ],
    "Both files reflect this week’s reality; at least one RAID row was reviewed or updated.",
  ),

  "Practice sprint planning against the GYAM backlog (1 hour).": brief(
    "Sprint planning for a solo + agent team means a written goal and pulled work — not a meeting theater.",
    [
      "Open docs/pm/08-sprint-plan.md and docs/pm/07-wbs-backlog.md.",
      "Write or refresh this sprint’s goal (1–2 sentences).",
      "Pull a small, finishable set of stories/tasks; descope explicitly what will wait.",
      "Spend up to 1 hour; stop when the plan is honest, not when every box is filled.",
    ],
    "Sprint plan has a clear goal and a pulled backlog you could execute with agents next week.",
  ),

  "Apply to 2 Project Coordinator jobs.": brief(
    "Applications are a quota, not a mood. Target roles that match your headline.",
    [
      "Find 2 Project Coordinator / related roles (prefer quality fit over spray).",
      "Tailor resume/headline lightly; submit through the employer flow.",
      "Log both in GYAM Jobs (Applied) with company, title, URL, date.",
    ],
    "Two applications submitted and logged in the Jobs board.",
  ),

  "Study Excel (Pivot Tables, XLOOKUP) for 2 hours.": brief(
    "Excel fluency shows up in coordinator interviews and ops work.",
    [
      "Block ~2 hours; pick Pivot Tables and/or XLOOKUP drills (course, docs, or a real sheet).",
      "Practice on a real or sample dataset — not only watching videos.",
      "Jot one technique you could demo in an interview into Notes.",
    ],
    "Two hours practiced with at least one concrete skill you can explain.",
  ),

  "Walk/exercise.": brief(
    "Physical reset is on the roadmap on purpose — burnout kills job-search consistency.",
    [
      "Leave the desk for a walk, workout, or stretch block.",
      "No phone doomscroll substitute — move.",
    ],
    "You actually moved; mark Done without inventing a metrics spreadsheet.",
  ),

  "Weekly review.": brief(
    "Close the loop on the week before planning the next.",
    [
      "Open GYAM Review (or docs/pm/10-status-report.md).",
      "Capture wins, blockers, and what slipped — blunt and short.",
      "Note one process fix for next week.",
    ],
    "A written weekly snapshot exists (GYAM Review and/or status doc).",
  ),

  "Plan next week.": brief(
    "Planning turns review into a schedule you will follow.",
    [
      "Look at next week’s Roadmap days in GYAM.",
      "Adjust titles/load if reality changed; protect Mon PM study + software hour.",
      "Pick the single most important outcome for the week.",
    ],
    "You know next week’s top outcome and the calendar is not a surprise.",
  ),

  // —— Standard routine ——
  "1 hr PM study": brief(
    "Steady PM literacy is the Monday study block.",
    [
      "Pick one chapter/topic (PMBOK, Agile, certificate notes).",
      "Study for ~60 minutes with GYAM timer.",
      "Write 1–3 takeaways in Notes.",
    ],
    "About an hour studied and takeaways captured.",
  ),

  "1 hr software (Python/C#)": brief(
    "Fallback software hour when a Python CS title is not remapped yet.",
    [
      "Prefer the Python CS curriculum brief if your Monday title starts with “Python CS Wk”.",
      "Otherwise: 60 minutes of deliberate practice in Python or C# (kata, tutorial, or small script).",
      "Log what you practiced in Notes.",
    ],
    "Sixty minutes of real practice completed.",
  ),

  "Apply to 3 jobs": brief(
    "Monday/Friday quota: three quality applications.",
    [
      "Identify 3 fitting roles.",
      "Submit applications; log each in GYAM Jobs as Applied.",
      "Update tracker fields (URL, resume version, follow-up if known).",
    ],
    "Three applications submitted and visible on the Jobs board.",
  ),

  "Apply to 2 jobs": brief(
    "Midweek quota: two applications without dropping quality.",
    [
      "Identify 2 fitting roles.",
      "Submit and log both in GYAM Jobs.",
    ],
    "Two applications submitted and logged.",
  ),

  "Update application tracker": brief(
    "Tracker hygiene prevents ghosted threads and double-applies.",
    [
      "Open GYAM Jobs.",
      "Move statuses that changed; add follow-up dates where needed.",
      "Fix missing URLs/companies from today’s applies.",
    ],
    "Board matches reality for everything you touched today.",
  ),

  "GYAM backlog / agent-team check-in": brief(
    "Tuesday standup substitute: what shipped, what’s blocked, who you will assign.",
    [
      "Skim docs/pm/07-wbs-backlog.md and open RAID items.",
      "Decide today’s agent assignments (or solo work) in one short note.",
      "Invoke the right Cursor agent only when you have a clear acceptance check.",
    ],
    "You know today’s delivery focus and whether an agent is R for it.",
  ),

  "Build one PM artifact": brief(
    "Ship one visible PM deliverable — charter tweak, RAID row, status, sprint plan, export note.",
    [
      "Pick one artifact under docs/pm/ (or portfolio-export notes).",
      "Improve or create it in a focused block.",
      "Commit or save; link it from status if material.",
    ],
    "One concrete PM file is better than it was this morning.",
  ),

  "Network with 2 people on LinkedIn": brief(
    "Weak ties matter; two thoughtful touches beat twenty likes.",
    [
      "Find 2 people (PMs, coordinators, alumni, hiring managers).",
      "Send a short, specific message or meaningful comment — no spam pitch.",
      "Log who and why in Notes if useful for follow-up.",
    ],
    "Two human touches sent — not just profile views.",
  ),

  "Software development on GYAM (2 hrs)": brief(
    "Dogfood and improve the sample project you manage.",
    [
      "Pick a small GYAM improvement aligned with SoT / backlog (bug, docs, UX friction).",
      "Work ~2 hours with a clear acceptance check.",
      "Leave the tree in a reviewable state (commit when you choose).",
    ],
    "Two hours of real GYAM work with a visible result.",
  ),

  "Read one PM chapter": brief(
    "Short midweek theory block.",
    [
      "Read one chapter or equivalent module.",
      "Capture a takeaway in Notes.",
    ],
    "Chapter finished and one takeaway written.",
  ),

  "Excel/Power BI (90 min)": brief(
    "Analytics literacy for coordinator roles.",
    [
      "Practice Excel or Power BI for ~90 minutes on a real skill (pivot, DAX intro, chart).",
      "Prefer hands-on over passive video.",
    ],
    "Ninety minutes practiced with one demo-able skill.",
  ),

  "Improve resume/portfolio export pack": brief(
    "Portfolio evidence lives in docs/pm/portfolio-export — keep it grab-ready.",
    [
      "Open docs/pm/portfolio-export/ and the grab checklist.",
      "Improve one thing: screenshot, sanitized doc, case-study outline, or resume bullet from GYAM metrics.",
      "No secrets in anything destined for public use.",
    ],
    "Export pack is one step closer to “copy into the portfolio site later.”",
  ),

  "Mock interview (30 min)": brief(
    "Rehearsal beats hoping you remember stories under pressure.",
    [
      "Pick one prompt (behavioral STAR or PM scenario).",
      "Answer out loud for ~30 minutes (record yourself or use a peer/AI interviewer).",
      "Note one weak answer to rewrite.",
    ],
    "Thirty minutes of spoken practice completed.",
  ),

  "Review Agile concepts": brief(
    "Keep Agile vocabulary sharp for interviews and your own sprints.",
    [
      "Review Scrum/Kanban basics: roles, ceremonies, backlog, DoD.",
      "Map each to your solo GYAM equivalent (see docs/pm/05-communication-plan.md).",
    ],
    "You can explain Agile ceremonies and your solo substitutes cleanly.",
  ),

  "Deep work (3 hrs) on GYAM or portfolio-export pack": brief(
    "Saturday deep work on the sample project or export pack (even roadmap weeks).",
    [
      "Choose GYAM code/docs OR portfolio-export — not both thinly.",
      "Block ~3 hours; define one outcome before you start.",
      "Stop with that outcome shipped or clearly parked.",
    ],
    "About three hours deep work with a named outcome achieved or explicitly deferred.",
  ),

  "Weekly retrospective (guided)": brief(
    "Sunday retro: what worked, what hurt, what changes.",
    [
      "Complete GYAM’s guided Sunday Review form.",
      "Optionally mirror one lesson into docs/pm/13-lessons-learned.md.",
      "Be blunt — sugarcoating wastes the ceremony.",
    ],
    "Guided review submitted with honest wins/blockers/focus.",
  ),

  "Organize notes": brief(
    "Clear the week’s clutter so next week starts clean.",
    [
      "File Cursor/Obsidian notes into the right Home note or Inbox.",
      "Delete or archive noise; keep decisions in Projects/GYAM Home or docs/pm.",
    ],
    "Notes are filed; you are not relying on chat scrollback as the system of record.",
  ),

  "Plan the coming week": brief(
    "Same as Week 1 planning — set the top outcome and protect key blocks.",
    [
      "Scan next week’s Roadmap in GYAM.",
      "Protect Mon study + software; pick the week’s #1 outcome.",
      "Adjust load if last week slipped.",
    ],
    "Next week’s top outcome is named and the calendar is intentional.",
  ),

  "Weekly retrospective (GYAM Review + `docs/pm` status)": brief(
    "Combo Sunday: product review plus PM status hygiene.",
    [
      "Complete GYAM Review.",
      "Update docs/pm/10-status-report.md (or equivalent) with this week’s facts.",
      "Touch RAID if anything new blocked you.",
    ],
    "Both personal review and PM status reflect the week.",
  ),
};

function pythonCsWeekA(currWeek: number, topic: string): string {
  return brief(
    `Curriculum week ${currWeek} (Week A): learn concepts for “${topic}” and start practice — not the interview algorithm yet.`,
    [
      `Study the core ideas for: ${topic}.`,
      "Use a Python REPL or a small .py file; type examples yourself.",
      "Start the practice drills from your curriculum notes; stop before the full interview algo if time runs out.",
      "Write questions or gotchas in GYAM Notes.",
    ],
    `You understand the basics of ${topic} and have started practice — FizzBuzz/other algo waits for Week B if listed.`,
  );
}

function pythonCsWeekB(currWeek: number, topic: string, algorithm: string | null): string {
  const algoStep = algorithm
    ? `Attempt the interview algorithm: ${algorithm} (timed if possible; talk through your approach).`
    : "Finish remaining practice drills for this curriculum week.";
  return brief(
    `Curriculum week ${currWeek} (Week B): finish practice${algorithm ? ` and attempt ${algorithm}` : ""}.`,
    [
      `Quickly review ${topic}.`,
      "Finish any incomplete practice from Week A.",
      algoStep,
      "Note what broke and what you would do differently.",
    ],
    algorithm
      ? `Practice finished and you attempted ${algorithm} (correct or with a clear learning note).`
      : "Practice for this curriculum week is finished.",
  );
}

function pythonCsPortfolio(currWeek: number, portfolioLabel: string): string {
  return brief(
    `Odd-week Saturday: Python portfolio deep work for curriculum week ${currWeek}.`,
    [
      `Work on: ${portfolioLabel.replace(/^Deep work \(3 hrs\): /, "")}.`,
      "Keep it small and shippable — a script, kata set, or notes you could show later.",
      "Block ~3 hours; store work outside GYAM app code (GYAM stays TypeScript).",
    ],
    "About three hours on the Python portfolio slice with a tangible artifact.",
  );
}

const REVIEW_BRIEF = brief(
  "Late-roadmap Monday: spaced repetition on algorithms and glossary terms.",
  [
    "Revisit weak algorithms and python_dictionary_of_terms (or your notes).",
    "Re-solve one prior kata without looking at the answer first.",
    "Log misses for next review.",
  ],
  "One review pass completed with misses noted.",
);

/**
 * Resolve coach brief for a task title. Empty string = no brief (user-created / unknown).
 */
export function instructionsForTitle(title: string): string {
  const exact = EXACT[title];
  if (exact) return exact;

  if (title === "Python CS review: spaced repetition (algorithms + glossary)") {
    return REVIEW_BRIEF;
  }

  const weekA = /^Python CS Wk(\d+)A:\s*(.+?)(?:\s*\(start practice\))?$/.exec(title);
  if (weekA) {
    const n = Number(weekA[1]);
    const entry = PYTHON_CS_WEEKS.find((w) => w.currWeek === n);
    const topic = entry?.topic ?? weekA[2].trim();
    return pythonCsWeekA(n, topic);
  }

  const weekB = /^Python CS Wk(\d+)B:\s*Finish practice(?:\s*\+\s*(.+))?$/.exec(title);
  if (weekB) {
    const n = Number(weekB[1]);
    const entry = PYTHON_CS_WEEKS.find((w) => w.currWeek === n);
    const algo = entry?.algorithm ?? (weekB[2]?.trim() || null);
    const topic = entry?.topic ?? "this week’s topic";
    return pythonCsWeekB(n, topic, algo);
  }

  if (title.startsWith("Deep work (3 hrs): Python portfolio")) {
    const curr =
      PYTHON_CS_WEEKS.find((w) => title.includes(w.portfolio.replace("Python portfolio: ", "")))
        ?.currWeek ?? 0;
    return pythonCsPortfolio(curr || 1, title);
  }

  // Remapped sample-project variants that may differ slightly
  if (title.includes("Maintain Epic") && title.includes("docs/pm")) {
    return EXACT["Maintain Epic, 5 Stories, and 10 Tasks in docs/pm backlog."];
  }
  if (title.includes("Confirm agent-team RACI")) {
    return EXACT["Confirm agent-team RACI (Cursor subagents as supervised delivery team)."];
  }

  return "";
}
