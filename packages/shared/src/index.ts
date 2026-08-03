export type TaskStatus = "pending" | "in_progress" | "paused" | "completed" | "skipped";

export type JobStatus = "Wishlist" | "Applied" | "Interview" | "Accepted" | "Rejected";

export const CATCH_UP_PROMPT =
  "Yesterday isn't done. Today stays paused. Finish the backlog or increase today's load and catch up — you're not getting any younger.";

export const JOB_STATUSES: JobStatus[] = [
  "Wishlist",
  "Applied",
  "Interview",
  "Accepted",
  "Rejected",
];

/** Weekly application targets from the standard routine (Mon 3 / Wed 2 / Fri 3). */
export const WEEKLY_APPLY_QUOTA = 8;

export const DAILY_APPLY_QUOTA: Record<number, number> = {
  0: 3, // Monday
  2: 2, // Wednesday
  4: 3, // Friday
};

export interface TaskAttachmentDto {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface TodayTaskDto {
  id: string;
  title: string;
  notes: string;
  /** Coach brief (Why / Do this / Done when); separate from user notes. */
  instructions: string;
  status: TaskStatus;
  subject: string | null;
  suggestedMinutes: number | null;
  elapsedMs: number;
  sortOrder: number;
  activeStartedAt: string | null;
  attachments: TaskAttachmentDto[];
}

export interface TodayResponse {
  date: string;
  blocked: boolean;
  blockReason: string | null;
  incompletePriorDates: string[];
  progressPercent: number;
  tasks: TodayTaskDto[];
  /** When blocked, unfinished tasks from prior days so you can clear the backlog. */
  backlogTasks: TodayTaskDto[];
}

export interface HeatDay {
  date: string;
  total: number;
  completed: number;
  percent: number;
}

export interface ProgressStats {
  currentStreak: number;
  bestStreak: number;
  last30Percent: number;
  heatmap: HeatDay[];
}

export interface JobDto {
  id: string;
  company: string;
  title: string;
  url: string | null;
  status: JobStatus;
  salary: string | null;
  contact: string | null;
  followUpDate: string | null;
  resumeVersion: string | null;
  notes: string;
  emailSubject: string | null;
  emailBody: string | null;
  emailAttachmentName: string | null;
  emailAttachmentMime: string | null;
  emailAttachmentSize: number | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaDay {
  date: string;
  weekday: number;
  target: number;
  applied: number;
}

export interface JobsBoardResponse {
  jobs: JobDto[];
  byStatus: Record<JobStatus, number>;
  week: {
    start: string;
    end: string;
    target: number;
    applied: number;
    remaining: number;
    days: QuotaDay[];
    onTrack: boolean;
  };
}

export interface WeeklyReviewDto {
  id: string | null;
  weekStart: string;
  weekEnd: string;
  wins: string;
  blockers: string;
  focus: string;
  planNextWeek: string;
  submitted: boolean;
  updatedAt: string | null;
}

export interface RoadmapTaskDto {
  id: string;
  date: string;
  title: string;
  notes: string;
  instructions: string;
  status: TaskStatus;
  subject: string | null;
  suggestedMinutes: number | null;
  sortOrder: number;
  sourceWeek: number | null;
  attachments: TaskAttachmentDto[];
}

export interface RoadmapDayDto {
  date: string;
  sourceWeek: number | null;
  tasks: RoadmapTaskDto[];
}

export interface MilestoneDto {
  id: string;
  monthIndex: number;
  title: string;
  completed: boolean;
  completedAt: string | null;
}

export interface SubjectDurationDto {
  id: string;
  subject: string;
  suggestedMinutes: number;
}

export interface RoadmapResponse {
  startDate: string;
  from: string;
  to: string;
  days: RoadmapDayDto[];
  milestones: MilestoneDto[];
  subjects: SubjectDurationDto[];
}
