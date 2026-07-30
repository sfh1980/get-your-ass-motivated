import { useEffect, useState } from "react";
import type { ProgressStats } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";

function heatColor(percent: number, total: number): string {
  if (total === 0) return "var(--bg-soft)";
  if (percent >= 100) return "var(--accent)";
  if (percent >= 60) return "#4a7d66";
  if (percent >= 30) return "#3a5a4c";
  return "#2a3a34";
}

export function ProgressPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .progress()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load progress"));
  }, []);

  return (
    <AppShell user={user} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}
      {!stats ? (
        <p className="muted">Loading progress…</p>
      ) : (
        <div className="stack">
          <section className="card row" style={{ justifyContent: "space-between" }}>
            <div>
              <div className="muted">Current streak</div>
              <strong style={{ fontSize: "1.6rem" }}>{stats.currentStreak}d</strong>
            </div>
            <div>
              <div className="muted">Best streak</div>
              <strong style={{ fontSize: "1.6rem" }}>{stats.bestStreak}d</strong>
            </div>
            <div>
              <div className="muted">Last 30 days avg</div>
              <strong style={{ fontSize: "1.6rem" }}>{stats.last30Percent}%</strong>
            </div>
          </section>

          <section className="card stack">
            <strong>Completion heatmap</strong>
            <p className="muted" style={{ margin: 0 }}>
              Last ~17 weeks. Darker/green = higher completion.
            </p>
            <div className="heatmap">
              {stats.heatmap.map((d) => (
                <div
                  key={d.date}
                  className="heat-cell"
                  title={`${d.date}: ${d.completed}/${d.total} (${d.percent}%)`}
                  style={{ background: heatColor(d.percent, d.total) }}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
