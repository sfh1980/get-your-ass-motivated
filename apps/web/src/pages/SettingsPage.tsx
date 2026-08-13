import { FormEvent, useEffect, useRef, useState } from "react";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";
import { ensureOsNotificationPermission, showOsNotification } from "../lib/notifications";

export function SettingsPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [perm, setPerm] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "denied",
  );
  const [smtp, setSmtp] = useState<{
    smtpConfigured: boolean;
    smtpHost: string | null;
    smtpTo: string | null;
  } | null>(null);
  const [due, setDue] = useState<
    Array<{ id: string; company: string; title: string; followUpDate: string | null }>
  >([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .notifyStatus()
      .then(setSmtp)
      .catch(() => setSmtp({ smtpConfigured: false, smtpHost: null, smtpTo: null }));
    api
      .followUps()
      .then((r) => setDue(r.due))
      .catch(() => undefined);
  }, []);

  async function enableOs() {
    const next = await ensureOsNotificationPermission();
    setPerm(next);
    if (next === "granted") {
      showOsNotification("GYAM", "OS notifications enabled.");
      setMessage("OS notifications enabled.");
    } else {
      setError("Permission not granted. Check browser site settings.");
    }
  }

  async function testOs() {
    const ok = showOsNotification("GYAM test", "If you see this, OS notifications work.");
    setMessage(ok ? "Test notification sent." : "Enable OS notifications first.");
  }

  async function testEmail() {
    setBusy(true);
    setError(null);
    try {
      await api.testEmail();
      setMessage("Test email sent (check inbox/spam).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email failed");
    } finally {
      setBusy(false);
    }
  }

  async function emailFollowUps() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.emailFollowUps();
      setMessage(r.sent ? `Emailed ${r.count} follow-up(s).` : r.message ?? "No email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function doExport() {
    setBusy(true);
    setError(null);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gyam-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Export downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  async function onImportFile(e: FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const r = await api.importData(json);
      setMessage(
        `Import done — subjects ${r.result.subjects}, milestones ${r.result.milestones}, reviews ${r.result.reviews}, jobs ${r.result.jobs}, tasks ${r.result.tasks}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell user={user} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="muted">{message}</p> : null}

      <section className="card stack">
        <strong>OS notifications</strong>
        <p className="muted" style={{ margin: 0 }}>
          Used for hourly keep-alive prompts and reminder nudges. Permission: <code>{perm}</code>
        </p>
        <div className="row">
          <button className="primary" type="button" onClick={enableOs}>
            Enable OS notifications
          </button>
          <button type="button" onClick={testOs}>
            Send test
          </button>
        </div>
      </section>

      <section className="card stack">
        <strong>Email notifications (optional / dormant)</strong>
        <p className="muted" style={{ margin: 0 }}>
          Not part of V1. Nudges use OS notifications above. SMTP stays off unless you
          explicitly re-scope email later.
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {smtp?.smtpConfigured
            ? `Configured via env → ${smtp.smtpTo} (host ${smtp.smtpHost})`
            : "Not configured — leave it that way."}
        </p>
        <div className="row">
          <button type="button" disabled={busy || !smtp?.smtpConfigured} onClick={testEmail}>
            Send test email
          </button>
          <button type="button" disabled={busy || !smtp?.smtpConfigured} onClick={emailFollowUps}>
            Email due follow-ups
          </button>
        </div>
        {due.length > 0 ? (
          <div className="stack">
            <span className="muted">{due.length} follow-up(s) due (in-app; email send is dormant):</span>
            {due.map((j) => (
              <span key={j.id} className="pill">
                {j.followUpDate} · {j.company} — {j.title}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            No follow-ups due.
          </p>
        )}
      </section>

      <section className="card stack">
        <strong>Export / import</strong>
        <p className="muted" style={{ margin: 0 }}>
          JSON backup of tasks, jobs, milestones, subjects, reviews, and recent activity.
        </p>
        <div className="row">
          <button className="primary" type="button" disabled={busy} onClick={doExport}>
            Download export
          </button>
        </div>
        <form className="row" onSubmit={onImportFile} style={{ alignItems: "end" }}>
          <label>
            Import JSON
            <input ref={fileRef} type="file" accept="application/json,.json" />
          </label>
          <button type="submit" disabled={busy}>
            Import merge
          </button>
        </form>
      </section>
    </AppShell>
  );
}
