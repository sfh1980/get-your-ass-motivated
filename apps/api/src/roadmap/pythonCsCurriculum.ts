/**
 * Python CS curriculum pairing for roadmap Monday/Saturday slots.
 * Curr Wk N → Roadmap weeks 2N (Week A) and 2N+1 (Week B).
 * Planning/task layer only — GYAM app stays TypeScript.
 */

export type PythonCsWeek = {
  currWeek: number;
  topic: string;
  /** Interview algorithm or focus for Week B; null if none listed */
  algorithm: string | null;
  /** Saturday portfolio label when that Saturday lands on a Python-portfolio week */
  portfolio: string;
};

/** Curriculum weeks 1–24. Portfolio names for 11/13/17 are placeholders. */
export const PYTHON_CS_WEEKS: PythonCsWeek[] = [
  { currWeek: 1, topic: "Basics / type conversion", algorithm: "FizzBuzz", portfolio: "Python portfolio: foundations warm-up" },
  { currWeek: 2, topic: "Control flow", algorithm: "Valid Parentheses", portfolio: "Python portfolio: control-flow kata set" },
  { currWeek: 3, topic: "Loops", algorithm: "Two Sum", portfolio: "Python portfolio: loop drills" },
  { currWeek: 4, topic: "Functions", algorithm: "Reverse String", portfolio: "Python portfolio: function library" },
  { currWeek: 5, topic: "Lists & Strings", algorithm: "Palindrome Checker", portfolio: "Python portfolio: string utilities" },
  { currWeek: 6, topic: "Debugging & Testing", algorithm: "Find Max in Array", portfolio: "Python portfolio: test/debug practice" },
  { currWeek: 7, topic: "Lists vs Dicts + OOP intro", algorithm: "Contains Duplicate", portfolio: "Python portfolio: OOP intro mini-project" },
  { currWeek: 8, topic: "Searching + OOP methods", algorithm: "Binary Search", portfolio: "Python portfolio: search demos" },
  { currWeek: 9, topic: "Sorting + OOP attributes", algorithm: "Selection Sort", portfolio: "Python portfolio: sort visualizer sketch" },
  { currWeek: 10, topic: "Efficient sorting", algorithm: "Merge/Quick sort", portfolio: "Python portfolio: sort comparison notes" },
  { currWeek: 11, topic: "Stacks & Queues", algorithm: null, portfolio: "Python portfolio: (TBD curr wk 11)" },
  { currWeek: 12, topic: "Big O deep dive", algorithm: null, portfolio: "Python portfolio: Big-O cheat sheet" },
  { currWeek: 13, topic: "Brute force vs efficient", algorithm: null, portfolio: "Python portfolio: (TBD curr wk 13)" },
  { currWeek: 14, topic: "Review week", algorithm: null, portfolio: "Python portfolio: Part 2 review notes" },
  { currWeek: 15, topic: "Linked lists", algorithm: null, portfolio: "Python portfolio: linked-list drills" },
  { currWeek: 16, topic: "Recursion", algorithm: null, portfolio: "Python portfolio: recursion practice" },
  { currWeek: 17, topic: "Trees", algorithm: null, portfolio: "Python portfolio: (TBD curr wk 17)" },
  { currWeek: 18, topic: "Graphs", algorithm: null, portfolio: "Python portfolio: graph traversal notes" },
  { currWeek: 19, topic: "Weighted graphs / Dijkstra", algorithm: "Dijkstra", portfolio: "Python portfolio: pathfinding sketch" },
  { currWeek: 20, topic: "Review + DP/greedy intro", algorithm: "Climbing Stairs", portfolio: "Python portfolio: DP intro drills" },
  { currWeek: 21, topic: "File I/O", algorithm: "CSV Parser", portfolio: "Python portfolio: CSV toolkit" },
  { currWeek: 22, topic: "Libraries & APIs", algorithm: null, portfolio: "Python portfolio: API client practice" },
  { currWeek: 23, topic: "Combining everything / system design", algorithm: null, portfolio: "Python portfolio: mini system-design writeup" },
  { currWeek: 24, topic: "Capstone", algorithm: null, portfolio: "Python portfolio: Capstone build" },
];

export const GENERIC_MONDAY_SOFTWARE = "1 hr software (Python/C#)";
export const GENERIC_SATURDAY_DEEP_WORK = "Deep work (3 hrs) on GYAM or portfolio-export pack";
export const REVIEW_MONDAY_TITLE =
  "Python CS review: spaced repetition (algorithms + glossary)";
export const SATURDAY_GYAM_TITLE = "Deep work (3 hrs) on GYAM or portfolio-export pack";

/** Curr week for roadmap sourceWeek in 2..49; null outside curriculum span. */
export function curriculumWeekForSourceWeek(sourceWeek: number): number | null {
  if (sourceWeek < 2 || sourceWeek > 49) return null;
  return Math.floor(sourceWeek / 2);
}

export function pythonCsEntryForSourceWeek(sourceWeek: number): PythonCsWeek | null {
  const curr = curriculumWeekForSourceWeek(sourceWeek);
  if (curr == null) return null;
  return PYTHON_CS_WEEKS.find((w) => w.currWeek === curr) ?? null;
}

/** Monday title for roadmap sourceWeek (2–52). */
export function mondaySoftwareTitle(sourceWeek: number): string {
  if (sourceWeek >= 50) return REVIEW_MONDAY_TITLE;
  const entry = pythonCsEntryForSourceWeek(sourceWeek);
  if (!entry) return GENERIC_MONDAY_SOFTWARE;
  const isWeekA = sourceWeek % 2 === 0;
  if (isWeekA) {
    return `Python CS Wk${entry.currWeek}A: ${entry.topic} (start practice)`;
  }
  const algo = entry.algorithm ? ` + ${entry.algorithm}` : "";
  return `Python CS Wk${entry.currWeek}B: Finish practice${algo}`;
}

/** Saturday deep-work title: even sourceWeek → GYAM; odd → Python portfolio. */
export function saturdayDeepWorkTitle(sourceWeek: number): string {
  if (sourceWeek % 2 === 0) return SATURDAY_GYAM_TITLE;
  if (sourceWeek >= 50) return SATURDAY_GYAM_TITLE;
  const entry = pythonCsEntryForSourceWeek(sourceWeek);
  if (!entry) return GENERIC_SATURDAY_DEEP_WORK;
  return `Deep work (3 hrs): ${entry.portfolio}`;
}

export function isRemappableMondayTitle(title: string): boolean {
  return (
    title === GENERIC_MONDAY_SOFTWARE ||
    title.startsWith("Python CS Wk") ||
    title === REVIEW_MONDAY_TITLE
  );
}

export function isRemappableSaturdayTitle(title: string): boolean {
  return (
    title === GENERIC_SATURDAY_DEEP_WORK ||
    title === SATURDAY_GYAM_TITLE ||
    title.startsWith("Deep work (3 hrs): Python portfolio") ||
    title.startsWith("Deep work (3 hrs) on GYAM")
  );
}
