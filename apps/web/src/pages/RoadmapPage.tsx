import { FormEvent, useEffect, useState } from "react";
import type { RoadmapResponse, RoadmapTaskDto } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";

function shiftIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function RoadmapPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(() => shiftIso(new Date().toISOString().slice(0, 10), 13));
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function refresh(nextFrom = from, nextTo = to) {
    const roadmap = await api.roadmap(nextFrom, nextTo);
    setData(roadmap);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed to load roadmap"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRange(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await refresh(from, to);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }

  async function saveTask(task: RoadmapTaskDto, patch: Partial<RoadmapTaskDto>) {
    setBusy(true);
    setError(null);
    try {
      await api.updateRoadmapTask(task.id, {
        title: patch.title,
        notes: patch.notes,
        instructions: patch.instructions,
        subject: patch.subject,
        suggestedMinutes: patch.suggestedMinutes,
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setBusy(true);
    try {
      await api.createRoadmapTask({ date: newDate, title: newTitle.trim() });
      setNewTitle("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeTask(task: RoadmapTaskDto) {
    if (!window.confirm(`Delete task: ${task.title}?`)) return;
    setBusy(true);
    try {
      await api.deleteRoadmapTask(task.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell user={user} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}

      <form className="card row" onSubmit={loadRange} style={{ alignItems: "end" }}>
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button className="primary" type="submit" disabled={busy}>
          Load
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            const nFrom = shiftIso(from, -14);
            const nTo = shiftIso(to, -14);
            setFrom(nFrom);
            setTo(nTo);
            setBusy(true);
            refresh(nFrom, nTo)
              .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
              .finally(() => setBusy(false));
          }}
        >
          ← 2 weeks
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            const nFrom = shiftIso(from, 14);
            const nTo = shiftIso(to, 14);
            setFrom(nFrom);
            setTo(nTo);
            setBusy(true);
            refresh(nFrom, nTo)
              .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
              .finally(() => setBusy(false));
          }}
        >
          2 weeks →
        </button>
      </form>

      {!data ? (
        <p className="muted">Loading roadmap…</p>
      ) : (
        <div className="stack">
          <p className="muted" style={{ margin: 0 }}>
            Career start date: {data.startDate}. Edits save to your seeded plan (markdown is no longer the only
            source of truth).
          </p>

          <section className="card stack">
            <strong>Monthly milestones</strong>
            {data.milestones.map((m) => (
              <label key={m.id} className="row" style={{ alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={m.completed}
                  disabled={busy}
                  onChange={(e) => {
                    setBusy(true);
                    api
                      .toggleMilestone(m.id, e.target.checked)
                      .then(() => refresh())
                      .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
                      .finally(() => setBusy(false));
                  }}
                />
                <span>
                  Month {m.monthIndex}: {m.title}
                </span>
              </label>
            ))}
          </section>

          <section className="card stack">
            <strong>Suggested study minutes by subject</strong>
            {data.subjects.map((s) => (
              <div key={s.id} className="row" style={{ alignItems: "center" }}>
                <span style={{ minWidth: "10rem" }}>{s.subject}</span>
                <input
                  type="number"
                  min={1}
                  style={{ width: "6rem" }}
                  defaultValue={s.suggestedMinutes}
                  disabled={busy}
                  onBlur={(e) => {
                    const minutes = Number(e.target.value);
                    if (!Number.isFinite(minutes) || minutes < 1) return;
                    setBusy(true);
                    api
                      .updateSubject(s.subject, minutes)
                      .then(() => refresh())
                      .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
                      .finally(() => setBusy(false));
                  }}
                />
                <span className="muted">min</span>
              </div>
            ))}
          </section>

          <form className="card row" onSubmit={addTask} style={{ alignItems: "end" }}>
            <label>
              New task date
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </label>
            <label style={{ flex: 1 }}>
              Title
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            </label>
            <button className="primary" type="submit" disabled={busy}>
              Add task
            </button>
          </form>

          {data.days.length === 0 ? (
            <p className="muted">No tasks in this date range.</p>
          ) : (
            data.days.map((day) => (
              <section key={day.date} className="card stack">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>{day.date}</strong>
                  {day.sourceWeek != null ? <span className="pill">week {day.sourceWeek}</span> : null}
                </div>
                {day.tasks.map((task) => (
                  <article key={task.id} className="stack" style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="pill">{task.status}</span>
                      <button type="button" disabled={busy} onClick={() => removeTask(task)}>
                        Delete
                      </button>
                    </div>
                    <label>
                      Title
                      <input
                        defaultValue={task.title}
                        disabled={busy}
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== task.title) {
                            saveTask(task, { title: e.target.value.trim() });
                          }
                        }}
                      />
                    </label>
                    {task.instructions ? (
                      <details className="coach-brief">
                        <summary className="muted">How to do this</summary>
                        <pre className="coach-brief-body">{task.instructions}</pre>
                      </details>
                    ) : null}
                    <div className="row">
                      <label>
                        Subject
                        <input
                          defaultValue={task.subject ?? ""}
                          disabled={busy}
                          onBlur={(e) => {
                            const subject = e.target.value.trim() || null;
                            if (subject !== task.subject) saveTask(task, { subject });
                          }}
                        />
                      </label>
                      <label>
                        Suggested minutes
                        <input
                          type="number"
                          min={0}
                          defaultValue={task.suggestedMinutes ?? ""}
                          disabled={busy}
                          onBlur={(e) => {
                            const raw = e.target.value;
                            const suggestedMinutes = raw === "" ? null : Number(raw);
                            if (suggestedMinutes !== task.suggestedMinutes) {
                              saveTask(task, { suggestedMinutes });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <label>
                      Instructions (coach brief)
                      <textarea
                        rows={4}
                        defaultValue={task.instructions}
                        disabled={busy}
                        onBlur={(e) => {
                          if (e.target.value !== task.instructions) {
                            saveTask(task, { instructions: e.target.value });
                          }
                        }}
                      />
                    </label>
                    <label>
                      Notes
                      <textarea
                        rows={2}
                        defaultValue={task.notes}
                        disabled={busy}
                        onBlur={(e) => {
                          if (e.target.value !== task.notes) saveTask(task, { notes: e.target.value });
                        }}
                      />
                    </label>
                    <div className="stack task-attachments">
                      <span className="muted">Attachments (max 5MB each)</span>
                      {(task.attachments ?? []).length > 0 ? (
                        <ul className="attachment-list">
                          {(task.attachments ?? []).map((a) => (
                            <li key={a.id} className="row" style={{ justifyContent: "space-between" }}>
                              <a
                                href={api.taskAttachmentUrl(task.id, a.id)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {a.fileName}
                                {a.sizeBytes ? ` (${Math.round(a.sizeBytes / 1024)} KB)` : ""}
                              </a>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={async () => {
                                  setBusy(true);
                                  try {
                                    await api.deleteTaskAttachment(task.id, a.id);
                                    await refresh();
                                  } catch (err) {
                                    setError(err instanceof Error ? err.message : "Delete failed");
                                  } finally {
                                    setBusy(false);
                                  }
                                }}
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
                        accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,.xlsx,.xls,.csv,.svg,.drawio"
                        disabled={busy}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (!file) return;
                          setBusy(true);
                          setError(null);
                          try {
                            await api.uploadTaskAttachment(task.id, file);
                            await refresh();
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Upload failed");
                          } finally {
                            setBusy(false);
                          }
                        }}
                      />
                    </div>
                  </article>
                ))}
              </section>
            ))
          )}
        </div>
      )}
    </AppShell>
  );
}
