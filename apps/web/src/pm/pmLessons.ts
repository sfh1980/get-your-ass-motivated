export type PmLesson = {
  title: string;
  what: string;
  purpose: string;
  howUsed: string;
  know: string[];
  gyam: string;
  extra?: Array<{ heading: string; body: string }>;
};

export const PM_LESSONS = {
  overview: {
    title: "PM dashboard & sprint status",
    what: "A project dashboard is a one-screen snapshot of health: are we on plan, where is the pain, and what needs a decision this week. The pill in the corner is sprint status — a short label for the current timeboxed chunk of work (here: Sprint 3 Closed).",
    purpose: "Sponsors and the project manager should not have to hunt through tickets, chat, and spreadsheets to answer “how are we doing?” A dashboard turns scattered facts into a shared picture so conversations start from data, not vibes.",
    howUsed:
      "In a job you will usually present this weekly (status meeting or a written status report). You walk RAG (Red / Amber / Green), name the biggest risk, and ask for decisions. You do not read every chart out loud. You pick the two or three that change what people should do next.",
    know: [
      "Dashboards lie if the inputs lie. If RAID is stale or Done means “I started it,” the pretty screen is theater.",
      "A dashboard is not the plan. The plan lives in the WBS, schedule, and backlog. This is the scoreboard.",
      "Keep PII off dashboards you might screenshot. Funnel counts are enough; company names belong on the Jobs board.",
      "Status language: Green = on track, Amber = off track but recoverable, Red = need help or a scope cut. Do not paint Amber as Green to keep people comfortable.",
    ],
    gyam: "This header is live for “as of” dates on the snapshot, and the sprint pill is a baked-in label from the PM docs snapshot. Completing Today tasks does not auto-close a sprint. You still close sprints in docs/pm when you actually accept the work.",
  },
  kpis: {
    title: "KPI strip (the numbers across the top)",
    what: "KPIs (Key Performance Indicators) are a handful of numbers you check first. They are not a dump of every metric. They answer: are we shipping, are we stuck, and is the habit holding.",
    purpose: "Busy stakeholders skim. If the strip is Green and the risk matrix is quiet, they can move on. If Rollover is Blocked or quota is behind, that is the meeting.",
    howUsed:
      "Professionals pick KPIs that match the project’s success criteria, then freeze them for a while so trends mean something. Changing the scoreboard every week makes you look busy and teaches nothing. In status reviews you explain movement: “streak dropped because we skipped Thursday,” not just the number.",
    know: [
      "A KPI without a target is just a statistic. Quota has a target (8 applies/week). Streak’s target is “do not break it.”",
      "Vanity metrics go up while the project dies. Watch leading indicators (applies this week, incomplete prior days) not only lagging ones (total tasks ever completed).",
      "RAG on a number is a judgment. 70% of a quota on Wednesday might be on track; 70% on Sunday is not.",
    ],
    gyam: "These eight tiles recompute from your live database every time you open PM. No git push. Each tile below is what a working PM would map them to.",
    extra: [
      {
        heading: "Streak",
        body: "A streak is consecutive days you actually finished the day’s work. In PM this is closer to team reliability / cadence than to a schedule metric. Use it as an early warning that dogfooding (or a team’s daily stand-up discipline) is slipping. A best-streak number is a baseline: if current << best, something changed.",
      },
      {
        heading: "Last 30d",
        body: "A rolling average completion % answers “is this month healthy?” not “did Tuesday look good?” Rolling windows smooth one-off bad days and hide a slow bleed if you never look at the heatmap. In industry you will see similar 4-week or 13-week views on delivery dashboards.",
      },
      {
        heading: "Tasks done / open",
        body: "Throughput vs remaining work. Done going up while Open stays huge means you are chewing the iceberg, not finishing the project. Open includes future roadmap tasks GYAM already seeded, so do not panic at a large Open count — that is the 12-month backlog, not “I am drowning today.”",
      },
      {
        heading: "Jobs",
        body: "Pipeline volume. Applied and Interview are the stages that matter for a job search. In a software project you would instead show items in Build vs Test vs Done. Same idea: how much work is sitting in each column.",
      },
      {
        heading: "Apply quota",
        body: "A quota is a capacity commitment: we agreed to do N of X this week. PMs use this for applications, story points, support tickets, or change requests. “On track” here means you have met the daily targets due so far, not that you already hit the full week on Monday.",
      },
      {
        heading: "Rollover",
        body: "This is GYAM’s accountability rule, and it maps to a real PM idea: unfinished work from a prior period blocks starting the next one until you confront it. In industry that might be a sprint that cannot close, or a gate review that fails. Blocked is not a badge of shame — it is a decision prompt: finish, cut, or reschedule (Tomorrow).",
      },
      {
        heading: "Reviews",
        body: "Count of Sunday Review rows with real content. That is your retrospective cadence. A team that never retrospects repeats the same defects. Empty weeks are a smell even if Today looks busy.",
      },
      {
        heading: "Milestones",
        body: "Milestones are named checkpoints, not tasks. “Month 2: living RAID” is a milestone; “edit the RAID file” is a task. Stakeholders remember milestones. You report “3 of 12 hit,” then say whether the next one is still dated correctly.",
      },
    ],
  },
  burnup: {
    title: "Burnup chart",
    what: "A burnup chart shows work completed over time as a line that should rise. The “up” is cumulative Done. A burndown is the cousin that starts high and should fall toward zero remaining work.",
    purpose: "See whether delivery is actually accumulating, or whether you had one heroic week and then stalled. It also makes scope changes visible: if the total work line jumps up, someone added scope (or you discovered hidden work).",
    howUsed:
      "Scrum teams put a burnup or burndown on the sprint wall / Jira dashboard. In status you point at the slope: flat = blocked or idle; steep = finishing; a late spike often means sandbagging then a dump of tickets marked Done. Executives like burnup because it shows progress even when remaining work grows.",
    know: [
      "Burndown without a scope line hides the trick where you “finish” by deleting stories.",
      "GYAM’s burnup is task count, not story points or hours. In a job you will be asked which unit you used. Pick one and stick to it.",
      "Do not compare two teams’ burnups. Different sizing, different “Done.” Compare a team to its own history.",
      "Ideal line (a straight diagonal) is a teaching tool, not physics. Real work is lumpy. Explain lumps; do not fake a straight line.",
    ],
    gyam: "This chart is live. Every completed task from your first seeded day through today adds to the line. Future roadmap tasks are not in the cumulative total until you complete them. There is no separate “scope” line because the 12-month seed is already in the database as Open work.",
  },
  funnel: {
    title: "Job funnel (pipeline / Kanban counts)",
    what: "A funnel or pipeline chart shows how many items sit in each stage of a process. Kanban is the board version of the same idea: columns, WIP limits, and flow. Wishlist → Applied → Interview → Accepted is a hiring funnel. Rejected is an exit, not a stage you “progress through.”",
    purpose: "Find where work piles up. If Applied is huge and Interview is tiny, the constraint is conversion, not volume. If Wishlist is huge and Applied is tiny, the constraint is you not sending applications.",
    howUsed:
      "PMs and product people review funnels in growth, sales, hiring, and support. You ask three questions: volume in, conversion between stages, and time-in-stage (this screen does not yet show time-in-stage). You then put the fix on the bottleneck, not on the stage that already works.",
    know: [
      "A funnel with no conversion rates is incomplete. “61 Applied, 3 Interview” is a 5% conversion story, not a bar-chart decoration.",
      "Never “clean up” a funnel by deleting Rejected to look healthier. Rejected is data. Learn from it.",
      "WIP (work in progress) limits stop you from stuffing a column. Kanban’s rule: stop starting, start finishing.",
      "Screenshots of funnels with real employer names are a privacy risk. Counts travel; names do not.",
    ],
    gyam: "Bars are live status counts from the Jobs board. Companies never appear here. Moving a job on Jobs updates this on refresh. Quota is a separate KPI because volume of applies ≠ health of the funnel.",
  },
  hours: {
    title: "Hours by subject (effort / resource view)",
    what: "This is a simple resource or effort histogram: where did the clock time actually go. In a multi-person project you would chart people or teams on the axis instead of subjects (PM study, jobs, Python CS, and so on).",
    purpose: "Plans assume effort. Reality spends it somewhere else. If “Jobs” ate the week and “PM study” is empty, the roadmap is a wish. This chart is how you catch that without arguing from memory.",
    howUsed:
      "PMs use timesheets, ticket time tracking, or capacity plans. In status: “we planned 40% on applications and spent 10%.” Then you either change the plan or change the behavior. Resource histograms also show overallocation (one person booked 60 hours).",
    know: [
      "Time tracked is not value delivered. Eight hours of busywork still plots as a long bar.",
      "GYAM timers exclude paused gaps. That is closer to “focus time” than to “I had the ticket assigned.”",
      "In industry, never use time tracking as a gotcha. People game clocks. Use it to rebalance work, not to punish.",
      "A professional capacity plan starts with available hours (minus meetings, PTO), then assigns work to fit. Starting from a 12-month wish list and hoping the hours appear is how projects slip.",
    ],
    gyam: "Live from elapsed timer milliseconds, rolled up by task subject. Subjects with zero time are omitted. This is you, one person — not a team histogram. No git needed.",
  },
  weeklyApplies: {
    title: "Applies by week (throughput / velocity analog)",
    what: "Each bar is how many applications you actually sent that week (jobs with an applied date in Applied / Interview / Accepted / Rejected). In software delivery the cousin is velocity: stories (or points) finished per sprint.",
    purpose: "See cadence, not just lifetime totals. A career OS that applied 61 times in one burst and then went quiet is not “on quota.” Weekly bars make the habit visible.",
    howUsed:
      "Scrum Masters chart velocity to forecast: if we finish ~20 points a sprint, a 60-point epic is about three sprints — until the team or the definition of Done changes. You never promise a date from one lucky sprint. You use a range from several sprints.",
    know: [
      "Velocity is a forecast input, not a target to beat. The day leadership “raises velocity” without changing capacity, quality dies and estimates inflate.",
      "Compare like with like. A week with a holiday is not a failure of character.",
      "For job search, quality of applications still beats raw count. Quota exists so you do not freeze; it is not a license to spam.",
    ],
    gyam: "Live from appliedAt dates. Weeks with zero applies simply do not appear. This is not story-point velocity — GYAM does not estimate points. Treat it as weekly throughput of one workstream (applications).",
  },
  heatmap: {
    title: "Completion heatmap",
    what: "A heatmap paints each day by intensity. GitHub’s contribution graph is the famous version. Here, greener means you completed a higher percent of that day’s tasks. Empty days stay dark — no work scheduled or none logged.",
    purpose: "Spot patterns you will miss in a single number: weekends off, a dead week while traveling, or a slow fade from 100% to 40%. Consistency is a project asset. Heatmaps show it at a glance.",
    howUsed:
      "PMs and engineering managers use heatmaps for on-call load, deploy frequency, or support ticket volume by day. In a status pack you might show “we slipped every Friday” and then change the Friday plan instead of giving a pep talk.",
    know: [
      "A dark day is not always failure. GYAM seeds some days with no tasks. Hover the cell: 0 tasks is different from 0% of 5 tasks.",
      "Percent complete can game you: one tiny task Done and one huge one skipped still looks 50%. Pair this with burnup and hours.",
      "Do not use heatmaps to shame. Use them to redesign the calendar (too much on Mondays, nothing on the day you actually have interviews).",
    ],
    gyam: "Same live window as the Progress page (~17 weeks). Opening PM refreshes it from the database. It is a teaching stand-in for “team reliability over a calendar,” not a git-contribution flex.",
  },
  riskMatrix: {
    title: "Risk matrix (probability × impact)",
    what: "A risk matrix is a grid. One axis is how likely the bad thing is (Probability, 1–5). The other is how much it would hurt (Impact, 1–5). Score = P × I. Items in the top-right are the ones you manage this week, not the ones that merely sound dramatic.",
    purpose: "You cannot treat every worry equally. The matrix forces a ranking so mitigation money and attention go to R1 (scope creep, 4×4=16) before a low-probability annoyance. It also makes residual risk visible after you mitigate: P or I should drop, or the status moves to Watching / Closed.",
    howUsed:
      "You will see this in RAID reviews, PMO templates, and client steering committees. Walk the red/amber cells, name the owner, name the next action, name the trigger (“if X happens, we do Y”). Then log it. A matrix with no owners is a poster.",
    know: [
      "Probability × impact is a heuristic, not science. Two people will score the same risk differently. Write a one-line rationale when scores matter.",
      "Do not put issues on the risk matrix. A risk is a possible future. An issue is already happening (see RAID).",
      "Watching is a valid status: the risk is real, mitigation is in place, you are monitoring. Open means it still needs an active response.",
      "Heat color is not the decision. A 5×1 (rare catastrophe) and a 1×5 (certain nuisance) can share a score and need totally different treatments.",
    ],
    gyam: "This grid is a snapshot of docs/pm RAID, not live edits. Changing a risk score in markdown does not move the dots until the snapshot in the API is updated and deployed. Daily Today work will not reshuffle R1–R8 for you.",
  },
  raid: {
    title: "RAID log (Risks, Assumptions, Issues, Dependencies)",
    what: "RAID is the working memory of a project. Risks = might hurt us. Assumptions = we are treating as true without proof. Issues = already hurting us. Dependencies = we are waiting on someone or something. Each row has an ID, owner, status, and an action.",
    purpose: "Projects die from unnamed surprises. RAID is how you stop “I thought you were handling that.” It is also how you brief a substitute PM in twenty minutes.",
    howUsed:
      "Review RAID at least weekly (GYAM’s Sunday). New item → ID it → owner → next action → due or trigger. Close items out loud so they do not haunt the log forever. In a job, RAID often lives in Confluence, Jira, or a PMO spreadsheet. The tool does not matter. The weekly habit does.",
    know: [
      "Risk vs issue: “the NAS might die” is a risk. “the NAS is down” is an issue. Do not mix them; the response is different (backup vs restore).",
      "Assumptions should be tested. “LAN-only is enough” stayed an assumption until you decided it (A5). Then it is a decision, not a hope.",
      "Dependencies need a named person outside your head. “Waiting on Docker” is not an owner. “Sean / TrueNAS” is.",
      "A long Open list you never touch is worse than a short honest list. Archive Resolved so the log stays a decision tool.",
    ],
    gyam: "The table is the docs snapshot (as-of date on the dashboard). Issues listed here include Resolved/Accepted history so you can see the practice of closing items. To change scores or statuses on this screen you still update docs/pm and the snapshot — this is not a RAID editor yet.",
  },
  wbs: {
    title: "WBS (Work Breakdown Structure) / stories",
    what: "A WBS chops a project into a tree: Epic → Story → Task. You keep breaking work until a piece is small enough to assign, estimate, and finish. “Stories” here are user-facing slices (“as Sean, I need X so that Y”), not novels.",
    purpose: "Big goals hide. “Ship V1” is not actionable. S1 Authenticated Today is. The WBS is how you know what “done” means and what is still out of scope. It is also the backbone for schedule, cost, and RAID: every risk should point at a WBS item.",
    howUsed:
      "Predictive (waterfall-ish) projects build a fairly complete WBS up front. Agile projects still have a backlog that is a living WBS; they just do not pretend the lower levels are frozen. In interviews you should be able to take a vague goal and produce epics and stories in ten minutes. That skill is the job.",
    know: [
      "The 100% rule: the child items of a parent, together, are the parent. If S1–S5 do not actually equal Epic E1, you have a hole or double-counting.",
      "Stories are for users; tasks are for the team. Do not write a story that is secretly a technical task unless you say so (enablers exist, but label them).",
      "Status words matter. Done, Partial, Parked, and Open are different. Parked with an owner and a wake-up condition is professional. “Someday” is not.",
      "Do not add stories to look productive. If it is not in the WBS (or the change log), it did not happen as a planned commitment.",
    ],
    gyam: "S1–S10 statuses are a snapshot from docs/pm/07, not computed from your Today completions. Finishing a seeded task does not flip S4 to Done. That is how real PM works too: story Done means acceptance against the definition of done, not “I touched a related ticket.”",
  },
  raci: {
    title: "RACI (who does what)",
    what: "RACI is a responsibility matrix. For each work package: Responsible (does the work), Accountable (one neck on the line), Consulted (two-way), Informed (FYI). If two people are Accountable, nobody is.",
    purpose: "Kill the phrase “we should…” Assign a name. On a team of agents plus you, RACI is how you practice directing work without doing all of it — the same muscle you will use with human ICs.",
    howUsed:
      "Build RACI when roles get fuzzy (vendor + internal team, or PM + tech lead + PO). Walk it in a kickoff. Update it when someone leaves. In a status meeting, if a delayed item has no R, that is the finding.",
    know: [
      "A = one person. R can be several, but then you still need a lead R or the work fragments.",
      "Consulted is expensive. Too many C’s means meetings. Prefer I unless you actually need their input.",
      "RACI does not replace a task list. It answers “who,” not “when” or “how much.”",
      "In GYAM, Sean is always A for product decisions. That is correct for a solo PM/PO. In a company the PO and the delivery manager might split A by workstream — and you must write that down.",
    ],
    gyam: "Standing matrix snapshot from docs/pm/04 (Sean vs Primary Agent). It does not auto-update when a chat session uses a different subagent. Treat it as the rule of the road, then log exceptions in the sprint notes if you actually assigned Homelab Deploy or Scope Guard.",
  },
  milestones: {
    title: "Milestones",
    what: "A milestone is a zero-duration flag in the plan: a date when a meaningful state is true (“Phase A live,” “Month 2 RAID habit”). It is not a work package. You do not “work on” a milestone; you complete the tasks that make it true, then you tick it.",
    purpose: "Humans and steering committees cannot hold 400 tasks in their head. They can hold 8–12 milestones. You schedule backward from them (what must be true the week before) and you slip them in the open if the date is no longer honest.",
    howUsed:
      "Put milestones on a timeline in the charter and status report. In predictive projects they often align with phase gates (design complete, UAT start). In hybrid/agile they still exist: “MVP in customers’ hands”). Never hide a slipped milestone by quietly renaming it.",
    know: [
      "If everything is a milestone, nothing is. Keep them scarce and consequential.",
      "A milestone with no owner and no evidence is a slogan. GYAM’s monthly milestones should match something you can point at (URL, dump file, review row).",
      "Ticking a milestone early to look Green is a career-limiting move once someone audits it.",
    ],
    gyam: "This list is live from the Roadmap milestones table. Toggling complete on Roadmap updates PM on refresh. Titles came from the seed; you can still mark them honestly when the outcome is real, not when the calendar month ends.",
  },
  reviews: {
    title: "Sunday reviews (retrospective / cadence)",
    what: "A retrospective is a scheduled look back: what worked, what blocked, what we will do differently. GYAM’s Sunday Review is that ceremony with four prompts (wins, blockers, focus, plan next week). Cadence means it happens whether you “feel like it” or not.",
    purpose: "Delivery without learning repeats waste. Reviews are how a team (or a solo PM) turns friction into a change — or writes down why you will not change it (I4: no extra catalog page).",
    howUsed:
      "Scrum: retro every sprint, timeboxed, actions with owners. Waterfall: lessons learned at phase end — too late if that is the only time. Hybrid (GYAM): weekly review plus a living lessons file. In a job, you will be judged on whether retro actions actually appear in next sprint, not on how heartfelt the sticky notes were.",
    know: [
      "A retro with no actions is a diary. Capture 1–3 changes max.",
      "Blameless does not mean consequence-free. You still name the process that failed.",
      "Skipping retros during “crunch” is how crunch becomes the culture.",
      "Your Review page is the working session. This PM list is only the attendance sheet: did you submit that week.",
    ],
    gyam: "Live count of WeeklyReview rows that have any content. Submitting Review updates this. The written wins/blockers stay on the Review page — PM does not paste them here so a screenshot cannot leak private notes as easily.",
  },
  catalog: {
    title: "PM chart catalog (used vs skipped)",
    what: "This is a decision log of visuals. Professional PMs know many chart types. Good PMs refuse to draw ones they cannot back with data. Gantt with no predecessors, EVM with no costs, and PERT with no task network would be fiction.",
    purpose: "Teach you the menu so you recognize it in a PMO or interview, and teach you the integrity rule: empty chart < honest “we don’t have that data.” Portfolio work that invents SPI/CPI will get you hired by people you should not work for, then fired by people who can count.",
    howUsed:
      "When a stakeholder asks “can we have a Gantt?” you answer with the data requirement: dependencies, durations, and a scheduling tool. If you only have a date-seeded task list, say so and offer a milestone timeline instead. That conversation is PM competence.",
    know: [
      "Gantt: bars on a calendar, usually with links (FS/SS/FF). Useful for predictive schedules and construction. Misleading if every bar is “this seed day.”",
      "PERT/CPM: network of tasks; critical path is the longest chain. No path in GYAM’s schema → no CPM.",
      "Earned value (PV/EV/AC, SPI/CPI): cost and schedule performance in one framework. Needs a budget. GYAM has none.",
      "Resource histogram: hours demanded vs capacity by person. Solo user → skip.",
      "CFD (cumulative flow): stacked counts by Kanban column over time. You could add this later from job/task history; it is not here yet.",
    ],
    gyam: "The Yes/No column is a snapshot of product intent, not live telemetry. Skipped items stay skipped until GYAM has real fields for them. Do not take a “No” as “these charts are useless in a career” — they are useful when the data exists.",
  },
} as const satisfies Record<string, PmLesson>;

export type PmLessonId = keyof typeof PM_LESSONS;

export function getPmLesson(id: PmLessonId): PmLesson {
  return PM_LESSONS[id];
}
