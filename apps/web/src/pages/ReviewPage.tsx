import { FormEvent, useEffect, useState } from "react";
import type { WeeklyReviewDto } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";

export function ReviewPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [review, setReview] = useState<WeeklyReviewDto | null>(null);
  const [wins, setWins] = useState("");
  const [blockers, setBlockers] = useState("");
  const [focus, setFocus] = useState("");
  const [planNextWeek, setPlanNextWeek] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .weeklyReview()
      .then((r) => {
        setReview(r);
        setWins(r.wins);
        setBlockers(r.blockers);
        setFocus(r.focus);
        setPlanNextWeek(r.planNextWeek);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load review"));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const r = await api.saveWeeklyReview({
        weekStart: review?.weekStart,
        wins,
        blockers,
        focus,
        planNextWeek,
      });
      setReview(r);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell user={user} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}
      {!review ? (
        <p className="muted">Loading weekly review…</p>
      ) : (
        <form className="card stack" onSubmit={onSubmit}>
          <div>
            <strong>Guided Sunday review</strong>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Week {review.weekStart} → {review.weekEnd}
              {review.submitted ? " · previously submitted (editable)" : ""}
            </p>
          </div>
          <label>
            Wins — what moved forward this week?
            <textarea rows={4} value={wins} onChange={(e) => setWins(e.target.value)} required />
          </label>
          <label>
            Blockers — what slowed you down?
            <textarea rows={4} value={blockers} onChange={(e) => setBlockers(e.target.value)} required />
          </label>
          <label>
            Focus — what matters most right now?
            <textarea rows={3} value={focus} onChange={(e) => setFocus(e.target.value)} required />
          </label>
          <label>
            Plan next week — concrete commitments
            <textarea
              rows={4}
              value={planNextWeek}
              onChange={(e) => setPlanNextWeek(e.target.value)}
              required
            />
          </label>
          {saved ? <p className="muted">Saved. Sunday retrospective tasks marked complete when matched.</p> : null}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Submit weekly review"}
          </button>
        </form>
      )}
    </AppShell>
  );
}
