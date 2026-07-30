import { FormEvent, useEffect, useMemo, useState } from "react";
import { JOB_STATUSES, type JobDto, type JobStatus, type JobsBoardResponse } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";

const emptyForm = {
  company: "",
  title: "",
  url: "",
  status: "Wishlist" as JobStatus,
  salary: "",
  contact: "",
  followUpDate: "",
  resumeVersion: "",
  notes: "",
  emailSubject: "",
  emailBody: "",
};

export function JobsPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [board, setBoard] = useState<JobsBoardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<JobStatus | "All">("All");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  async function refresh() {
    const data = await api.jobs();
    setBoard(data);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed to load jobs"));
  }, []);

  const visible = useMemo(() => {
    if (!board) return [];
    if (filter === "All") return board.jobs;
    return board.jobs.filter((j) => j.status === filter);
  }, [board, filter]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await api.createJob({
        company: form.company,
        title: form.title,
        url: form.url || null,
        status: form.status,
        salary: form.salary || null,
        contact: form.contact || null,
        followUpDate: form.followUpDate || null,
        resumeVersion: form.resumeVersion || null,
        notes: form.notes,
        emailSubject: form.emailSubject || null,
        emailBody: form.emailBody || null,
      });
      if (pendingFile) {
        await api.uploadJobAttachment(created.job.id, pendingFile);
      }
      setForm(emptyForm);
      setPendingFile(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function attachToJob(job: JobDto, file: File | null) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await api.uploadJobAttachment(job.id, file);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeAttachment(job: JobDto) {
    setBusy(true);
    try {
      await api.clearJobAttachment(job.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(job: JobDto, status: JobStatus) {
    setBusy(true);
    try {
      await api.updateJob(job.id, { status });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(job: JobDto) {
    if (!window.confirm(`Delete ${job.company} — ${job.title}?`)) return;
    setBusy(true);
    try {
      await api.deleteJob(job.id);
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
      {!board ? (
        <p className="muted">Loading jobs…</p>
      ) : (
        <div className="stack">
          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Weekly application quota</strong>
              <span className={board.week.onTrack ? "pill" : "pill pill-warn"}>
                {board.week.applied}/{board.week.target} · {board.week.remaining} left ·{" "}
                {board.week.onTrack ? "on track" : "behind"}
              </span>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              Week {board.week.start} → {board.week.end} (Mon 3 / Wed 2 / Fri 3)
            </p>
            <div className="row">
              {board.week.days.map((d) => (
                <div key={d.date} className="pill">
                  {d.date.slice(5)} {d.applied}/{d.target || "—"}
                </div>
              ))}
            </div>
            <div className="row">
              {JOB_STATUSES.map((s) => (
                <span key={s} className="pill">
                  {s}: {board.byStatus[s]}
                </span>
              ))}
            </div>
          </section>

          <form className="card stack" onSubmit={onCreate}>
            <strong>Add job / posting</strong>
            <div className="row">
              <label style={{ flex: 1 }}>
                Company
                <input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </label>
              <label style={{ flex: 1 }}>
                Title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
            </div>
            <label>
              URL
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </label>
            <div className="row">
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                >
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Salary
                <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              </label>
              <label>
                Contact
                <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </label>
            </div>
            <div className="row">
              <label>
                Follow-up date
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                />
              </label>
              <label>
                Resume version
                <input
                  value={form.resumeVersion}
                  onChange={(e) => setForm({ ...form, resumeVersion: e.target.value })}
                />
              </label>
            </div>
            <label>
              Notes
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            <label>
              Saved email subject
              <input
                value={form.emailSubject}
                onChange={(e) => setForm({ ...form, emailSubject: e.target.value })}
              />
            </label>
            <label>
              Saved email body (paste)
              <textarea
                rows={4}
                value={form.emailBody}
                onChange={(e) => setForm({ ...form, emailBody: e.target.value })}
              />
            </label>
            <label>
              Optional email attachment (pdf/doc/txt/images, max 5MB)
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,application/pdf,text/plain,image/*"
                onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <button className="primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save job"}
            </button>
          </form>

          <div className="row">
            <button type="button" className={filter === "All" ? "primary" : ""} onClick={() => setFilter("All")}>
              All
            </button>
            {JOB_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={filter === s ? "primary" : ""}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <section className="stack">
            {visible.length === 0 ? (
              <p className="muted">No jobs in this column yet.</p>
            ) : (
              visible.map((job) => (
                <article key={job.id} className="card stack">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <h2 className="task-title">
                        {job.company} — {job.title}
                      </h2>
                      <div className="row">
                        <span className="pill">{job.status}</span>
                        {job.appliedAt ? <span className="pill">applied {job.appliedAt}</span> : null}
                        {job.followUpDate ? <span className="pill">follow-up {job.followUpDate}</span> : null}
                      </div>
                    </div>
                    <button type="button" onClick={() => remove(job)} disabled={busy}>
                      Delete
                    </button>
                  </div>
                  {job.url && /^https?:\/\//i.test(job.url) ? (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      {job.url}
                    </a>
                  ) : job.url ? (
                    <span className="muted">{job.url}</span>
                  ) : null}
                  {job.notes ? <p className="muted">{job.notes}</p> : null}
                  {job.emailSubject || job.emailBody || job.emailAttachmentName ? (
                    <details>
                      <summary className="muted">Saved email</summary>
                      {job.emailSubject ? (
                        <p>
                          <strong>{job.emailSubject}</strong>
                        </p>
                      ) : null}
                      {job.emailBody ? <pre className="email-body">{job.emailBody}</pre> : null}
                      {job.emailAttachmentName ? (
                        <div className="row">
                          <a href={api.jobAttachmentUrl(job.id)} target="_blank" rel="noreferrer">
                            {job.emailAttachmentName}
                            {job.emailAttachmentSize
                              ? ` (${Math.round(job.emailAttachmentSize / 1024)} KB)`
                              : ""}
                          </a>
                          <button type="button" disabled={busy} onClick={() => removeAttachment(job)}>
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <label className="muted">
                          Attach file
                          <input
                            type="file"
                            accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif"
                            disabled={busy}
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              void attachToJob(job, f);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </details>
                  ) : (
                    <label className="muted">
                      Attach email file
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif"
                        disabled={busy}
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          void attachToJob(job, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                  <div className="row">
                    {JOB_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={busy || job.status === s}
                        onClick={() => setStatus(job, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
