import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { TodayResponse, TodayTaskDto } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";
import { keepAlivePrompt, showOsNotification } from "../lib/notifications";

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TodayPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const blockedNotified = useRef(false);

  const refresh = useCallback(async () => {
    const data = await api.today();
    setToday(data);
    setDraftNotes((prev) => {
      const next = { ...prev };
      for (const t of data.tasks) {
        if (next[t.id] === undefined) next[t.id] = t.notes;
      }
      for (const t of data.backlogTasks) {
        if (next[t.id] === undefined) next[t.id] = t.notes;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed to load today"));
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!today?.blocked || !today.blockReason) {
      blockedNotified.current = false;
      return;
    }
    if (blockedNotified.current) return;
    blockedNotified.current = true;
    showOsNotification("GYAM — day blocked", today.blockReason, "gyam-day-blocked");
  }, [today?.blocked, today?.blockReason]);

  useEffect(() => {
    if (!today) return;
    const active = [...today.tasks, ...today.backlogTasks].find((t) => t.status === "in_progress");
    if (!active) return;

    const hourMs = 60 * 60 * 1000;
    const timer = window.setInterval(() => {
      void (async () => {
        let answered = false;
        const promptId = window.setTimeout(() => {
          if (!answered) {
            api.pause(active.id, "auto").then(refresh).catch(() => undefined);
          }
        }, 60_000);

        const ok = await keepAlivePrompt(active.title);
        answered = true;
        window.clearTimeout(promptId);
        if (!ok) {
          api.pause(active.id).then(refresh).catch(() => undefined);
        }
      })();
    }, hourMs);

    return () => window.clearInterval(timer);
  }, [today, refresh]);

  const activeTask = useMemo(() => {
    if (!today) return null;
    return [...today.tasks, ...today.backlogTasks].find((t) => t.status === "in_progress") ?? null;
  }, [today]);

  void tick;

  function displayElapsed(task: TodayTaskDto): number {
    if (task.status === "in_progress" && task.activeStartedAt) {
      return task.elapsedMs + Math.max(0, Date.now() - new Date(task.activeStartedAt).getTime());
    }
    return task.elapsedMs;
  }

  async function run(taskId: string, fn: () => Promise<unknown>) {
    setBusyId(taskId);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell user={user} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}

      {!today ? (
        <p className="muted">Loading today’s tasks…</p>
      ) : (
        <>
          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Today’s progress · {today.date}</strong>
              <span className="muted">{today.progressPercent}%</span>
            </div>
            <div className="progress" aria-label="Progress">
              <span style={{ width: `${today.progressPercent}%` }} />
            </div>
            {activeTask ? (
              <p className="muted" style={{ margin: 0 }}>
                Active timer: {activeTask.title} · {formatDuration(displayElapsed(activeTask))}
              </p>
            ) : null}
          </section>

          {today.blocked ? (
            <div className="block-banner">
              <strong>Day blocked</strong>
              <p style={{ margin: "0.5rem 0 0" }}>{today.blockReason}</p>
              <p className="muted" style={{ margin: "0.5rem 0 0" }}>
                Incomplete days: {today.incompletePriorDates.join(", ")}. Clear the backlog below
                before today’s list unlocks.
              </p>
            </div>
          ) : null}

          {today.backlogTasks.length > 0 ? (
            <section className="stack">
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Backlog (finish these first)</h2>
              {today.backlogTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draftNotes={draftNotes}
                  setDraftNotes={setDraftNotes}
                  busyId={busyId}
                  disabled={false}
                  displayElapsed={displayElapsed}
                  run={run}
                  onAttachmentsChanged={refresh}
                />
              ))}
            </section>
          ) : null}

          <section className="stack">
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Today</h2>
            {today.tasks.length === 0 ? (
              <p className="muted">No tasks scheduled for today.</p>
            ) : (
              today.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draftNotes={draftNotes}
                  setDraftNotes={setDraftNotes}
                  busyId={busyId}
                  disabled={today.blocked && task.status !== "completed"}
                  displayElapsed={displayElapsed}
                  run={run}
                  onAttachmentsChanged={refresh}
                />
              ))
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}

function TaskCard({
  task,
  draftNotes,
  setDraftNotes,
  busyId,
  disabled,
  displayElapsed,
  run,
  onAttachmentsChanged,
}: {
  task: TodayTaskDto;
  draftNotes: Record<string, string>;
  setDraftNotes: Dispatch<SetStateAction<Record<string, string>>>;
  busyId: string | null;
  disabled: boolean;
  displayElapsed: (task: TodayTaskDto) => number;
  run: (taskId: string, fn: () => Promise<unknown>) => Promise<void>;
  onAttachmentsChanged: () => Promise<void>;
}) {
  const accept =
    ".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,.xlsx,.xls,.csv,.svg,.drawio";

  return (
    <article className="card stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="task-title">{task.title}</h2>
        <span className="pill">{task.status}</span>
      </div>
      <div className="row">
        {task.subject ? <span className="pill">{task.subject}</span> : null}
        {task.suggestedMinutes != null ? (
          <span className="pill">suggested {task.suggestedMinutes}m</span>
        ) : null}
        <span className="pill">elapsed {formatDuration(displayElapsed(task))}</span>
      </div>
      {task.instructions ? (
        <details className="coach-brief">
          <summary className="muted">How to do this</summary>
          <pre className="coach-brief-body">{task.instructions}</pre>
        </details>
      ) : null}
      <label>
        Notes (learned / questions)
        <textarea
          rows={3}
          value={draftNotes[task.id] ?? ""}
          disabled={task.status === "completed"}
          onChange={(e) => setDraftNotes((prev) => ({ ...prev, [task.id]: e.target.value }))}
          onBlur={() => {
            const notes = draftNotes[task.id] ?? "";
            if (notes !== task.notes) {
              run(task.id, () => api.notes(task.id, notes));
            }
          }}
        />
      </label>
      <div className="stack task-attachments">
        <span className="muted">Attachments (spreadsheets, diagrams, docs — max 5MB each)</span>
        {(task.attachments ?? []).length > 0 ? (
          <ul className="attachment-list">
            {(task.attachments ?? []).map((a) => (
              <li key={a.id} className="row" style={{ justifyContent: "space-between" }}>
                <a href={api.taskAttachmentUrl(task.id, a.id)} target="_blank" rel="noreferrer">
                  {a.fileName}
                  {a.sizeBytes ? ` (${Math.round(a.sizeBytes / 1024)} KB)` : ""}
                </a>
                <button
                  type="button"
                  disabled={busyId === task.id || task.status === "completed"}
                  onClick={() =>
                    run(task.id, async () => {
                      await api.deleteTaskAttachment(task.id, a.id);
                      await onAttachmentsChanged();
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
            No files yet.
          </p>
        )}
        <input
          type="file"
          accept={accept}
          disabled={busyId === task.id || task.status === "completed"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            void run(task.id, async () => {
              await api.uploadTaskAttachment(task.id, file);
              await onAttachmentsChanged();
            });
          }}
        />
      </div>
      <div className="row">
        <button
          type="button"
          className="primary"
          disabled={
            disabled || busyId === task.id || task.status === "completed" || task.status === "in_progress"
          }
          onClick={() => run(task.id, () => api.start(task.id))}
        >
          Start
        </button>
        <button
          type="button"
          disabled={busyId === task.id || task.status !== "in_progress"}
          onClick={() => run(task.id, () => api.pause(task.id))}
        >
          Pause
        </button>
        <button
          type="button"
          disabled={busyId === task.id || task.status === "completed"}
          onClick={() => run(task.id, () => api.complete(task.id, draftNotes[task.id] ?? task.notes))}
        >
          Done
        </button>
        <button
          type="button"
          disabled={busyId === task.id || task.status === "completed"}
          title="Move to tomorrow’s list. Does not mark Done. Clears this item from backlog so it cannot skip-to-clear."
          onClick={() => run(task.id, () => api.deferTomorrow(task.id))}
        >
          Tomorrow
        </button>
      </div>
    </article>
  );
}

