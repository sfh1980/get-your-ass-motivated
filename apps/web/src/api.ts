import type {
  JobDto,
  JobStatus,
  JobsBoardResponse,
  MilestoneDto,
  ProgressStats,
  RoadmapResponse,
  RoadmapTaskDto,
  SubjectDurationDto,
  TodayResponse,
  WeeklyReviewDto,
  PmDashboardDto,
} from "@gyam/shared";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : data?.message ?? res.statusText;
    throw new Error(message || "Request failed");
  }
  return data as T;
}

export type UserDto = { id: string; username: string; startDate: string };

export type JobInput = {
  company: string;
  title: string;
  url?: string | null;
  status?: JobStatus;
  salary?: string | null;
  contact?: string | null;
  followUpDate?: string | null;
  resumeVersion?: string | null;
  notes?: string;
  emailSubject?: string | null;
  emailBody?: string | null;
  appliedAt?: string | null;
};

export const api = {
  status: () => request<{ needsSetup: boolean }>("/api/auth/status"),
  setup: (username: string, pin: string) =>
    request<{ user: UserDto }>("/api/auth/setup", {
      method: "POST",
      body: JSON.stringify({ username, pin }),
    }),
  login: (username: string, pin: string) =>
    request<{ user: UserDto }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, pin }),
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  me: () => request<{ user: UserDto }>("/api/auth/me"),
  today: () => request<TodayResponse>("/api/tasks/today"),
  start: (id: string) => request(`/api/tasks/${id}/start`, { method: "POST", body: "{}" }),
  pause: (id: string, reason?: "auto") =>
    request(`/api/tasks/${id}/pause`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  complete: (id: string, notes?: string) =>
    request(`/api/tasks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
  deferTomorrow: (id: string) => request(`/api/tasks/${id}/tomorrow`, { method: "POST", body: "{}" }),
  notes: (id: string, notes: string) =>
    request(`/api/tasks/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    }),
  progress: () => request<ProgressStats>("/api/progress"),
  pmDashboard: () => request<PmDashboardDto>("/api/pm/dashboard"),
  jobs: () => request<JobsBoardResponse>("/api/jobs"),
  createJob: (input: JobInput) =>
    request<{ job: JobDto }>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateJob: (id: string, input: Partial<JobInput>) =>
    request<{ job: JobDto }>(`/api/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteJob: (id: string) => request<{ ok: boolean }>(`/api/jobs/${id}`, { method: "DELETE" }),
  uploadJobAttachment: async (id: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`/api/jobs/${id}/attachment`, {
      method: "POST",
      credentials: "include",
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = typeof data?.error === "string" ? data.error : data?.message ?? res.statusText;
      throw new Error(message || "Upload failed");
    }
    return data as { job: JobDto };
  },
  clearJobAttachment: (id: string) =>
    request<{ job: JobDto }>(`/api/jobs/${id}/attachment`, { method: "DELETE" }),
  jobAttachmentUrl: (id: string) => `/api/jobs/${id}/attachment`,
  uploadTaskAttachment: async (taskId: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`/api/tasks/${taskId}/attachments`, {
      method: "POST",
      credentials: "include",
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = typeof data?.error === "string" ? data.error : data?.message ?? res.statusText;
      throw new Error(message || "Upload failed");
    }
    return data as { attachment: import("@gyam/shared").TaskAttachmentDto };
  },
  deleteTaskAttachment: (taskId: string, attachmentId: string) =>
    request<{ ok: boolean }>(`/api/tasks/${taskId}/attachments/${attachmentId}`, {
      method: "DELETE",
    }),
  taskAttachmentUrl: (taskId: string, attachmentId: string) =>
    `/api/tasks/${taskId}/attachments/${attachmentId}`,
  weeklyReview: (weekStart?: string) =>
    request<WeeklyReviewDto>(
      weekStart ? `/api/reviews/weekly?weekStart=${encodeURIComponent(weekStart)}` : "/api/reviews/weekly",
    ),
  saveWeeklyReview: (input: {
    weekStart?: string;
    wins: string;
    blockers: string;
    focus: string;
    planNextWeek: string;
  }) =>
    request<WeeklyReviewDto>("/api/reviews/weekly", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  roadmap: (from: string, to: string) =>
    request<RoadmapResponse>(
      `/api/roadmap?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),
  updateRoadmapTask: (
    id: string,
    input: {
      title?: string;
      notes?: string;
      instructions?: string;
      subject?: string | null;
      suggestedMinutes?: number | null;
    },
  ) =>
    request<{ task: RoadmapTaskDto }>(`/api/roadmap/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  createRoadmapTask: (input: {
    date: string;
    title: string;
    subject?: string | null;
    suggestedMinutes?: number | null;
  }) =>
    request<{ task: RoadmapTaskDto }>("/api/roadmap/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteRoadmapTask: (id: string) =>
    request<{ ok: boolean }>(`/api/roadmap/tasks/${id}`, { method: "DELETE" }),
  toggleMilestone: (id: string, completed: boolean) =>
    request<{ milestone: MilestoneDto }>(`/api/roadmap/milestones/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),
  updateSubject: (subject: string, suggestedMinutes: number) =>
    request<{ subject: SubjectDurationDto }>(
      `/api/roadmap/subjects/${encodeURIComponent(subject)}`,
      {
        method: "PUT",
        body: JSON.stringify({ suggestedMinutes }),
      },
    ),
  notifyStatus: () =>
    request<{
      smtpConfigured: boolean;
      smtpHost: string | null;
      smtpTo: string | null;
    }>("/api/system/notify/status"),
  testEmail: () =>
    request<{ ok: boolean; error?: string }>("/api/system/notify/test-email", {
      method: "POST",
      body: "{}",
    }),
  followUps: () =>
    request<{
      due: Array<{
        id: string;
        company: string;
        title: string;
        followUpDate: string | null;
      }>;
    }>("/api/system/reminders/follow-ups"),
  emailFollowUps: () =>
    request<{
      ok: boolean;
      sent?: boolean;
      count?: number;
      message?: string;
      error?: string;
    }>("/api/system/reminders/follow-ups/email", {
      method: "POST",
      body: "{}",
    }),
  exportData: () => request<Record<string, unknown>>("/api/system/export"),
  importData: (payload: unknown) =>
    request<{
      ok: boolean;
      result: {
        subjects: number;
        milestones: number;
        reviews: number;
        jobs: number;
        tasks: number;
      };
    }>("/api/system/import", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
