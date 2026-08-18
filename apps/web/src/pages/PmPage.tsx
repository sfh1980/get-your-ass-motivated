import { useEffect, useMemo, useState } from "react";
import { JOB_STATUSES, type PmDashboardDto, type SeriesPoint } from "@gyam/shared";
import { api, type UserDto } from "../api";
import { AppShell } from "../components/AppShell";
import { HowThisWorksButton, PmHowModal } from "../components/PmHowModal";
import type { PmLessonId } from "../pm/pmLessons";

function heatColor(percent: number, total: number): string {
  if (total === 0) return "var(--bg-soft)";
  if (percent >= 100) return "var(--accent)";
  if (percent >= 60) return "#4a7d66";
  if (percent >= 30) return "#3a5a4c";
  return "#2a3a34";
}

function ragClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("closed") || s.includes("resolved") || s.includes("met")) {
    return "rag-g";
  }
  if (s.includes("watch") || s.includes("partial") || s.includes("park") || s.includes("open")) {
    return "rag-a";
  }
  if (s.includes("block") || s.includes("fail")) return "rag-r";
  return "rag-a";
}

function downsample(points: SeriesPoint[], max = 48): SeriesPoint[] {
  if (points.length <= max) return points;
  const step = Math.ceil(points.length / max);
  const kept = points.filter((_, i) => i % step === 0);
  const last = points[points.length - 1];
  if (last && kept[kept.length - 1]?.date !== last.date) kept.push(last);
  return kept;
}

function LineChart({ points, label }: { points: SeriesPoint[]; label: string }) {
  const data = downsample(points);
  const max = Math.max(...data.map((p) => p.value), 1);
  const w = 640;
  const h = 180;
  const padL = 36;
  const padR = 8;
  const padT = 10;
  const padB = 22;
  const coords = data.map((p, i) => {
    const x = padL + (i / Math.max(data.length - 1, 1)) * (w - padL - padR);
    const y = padT + (1 - p.value / max) * (h - padT - padB);
    return { x, y, ...p };
  });
  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${d} L${coords[coords.length - 1]?.x ?? padL},${h - padB} L${padL},${h - padB} Z`;
  const first = data[0]?.date.slice(5) ?? "";
  const last = data[data.length - 1]?.date.slice(5) ?? "";

  if (data.length === 0) {
    return <p className="muted">No completion history yet.</p>;
  }

  return (
    <svg className="pm-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      <path d={area} fill="rgba(61, 154, 122, 0.16)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x={padL} y={h - 4} className="pm-svg-label">
        {first}
      </text>
      <text x={w - padR} y={h - 4} textAnchor="end" className="pm-svg-label">
        {last}
      </text>
      <text x={4} y={padT + 8} className="pm-svg-label">
        {max}
      </text>
    </svg>
  );
}

function HBars({
  rows,
  valueKey = "count",
}: {
  rows: Array<{ name: string; count: number; minutes?: number }>;
  valueKey?: "count" | "minutes";
}) {
  const max = Math.max(...rows.map((r) => (valueKey === "minutes" ? (r.minutes ?? 0) : r.count)), 1);
  if (rows.length === 0) return <p className="muted">No data yet.</p>;
  return (
    <div className="pm-bars">
      {rows.map((r) => {
        const value = valueKey === "minutes" ? (r.minutes ?? 0) : r.count;
        return (
          <div key={r.name} className="pm-bar-row">
            <span className="pm-bar-label">{r.name}</span>
            <div className="pm-bar-track">
              <span style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
            </div>
            <span className="pm-bar-value">
              {valueKey === "minutes" ? `${value}m` : value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PmPage({
  user,
  onLogout,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
}) {
  const [data, setData] = useState<PmDashboardDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<PmLessonId | null>(null);

  useEffect(() => {
    api
      .pmDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load PM dashboard"));
  }, []);

  const funnel = useMemo(() => {
    if (!data) return [];
    return JOB_STATUSES.map((name) => ({ name, count: data.jobsByStatus[name] ?? 0 }));
  }, [data]);

  return (
    <AppShell user={user} onLogout={onLogout} wide>
      {error ? <p className="error">{error}</p> : null}
      {!data ? (
        <p className="muted">Loading PM dashboard…</p>
      ) : (
        <div className="stack pm-page">
          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>PM dashboard</strong>
              <div className="row">
                <HowThisWorksButton onClick={() => setLessonId("overview")} />
                <span className={`pill ${ragClass(data.sprint.status)}`}>
                  {data.sprint.name}: {data.sprint.status}
                </span>
              </div>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              Live counts from this database. RAID / WBS / RACI snapshot from docs/pm as of {data.raid.asOf}.
              Job funnel is counts only — employer names stay on Jobs.
            </p>
            <p className="muted" style={{ margin: 0 }}>
              {data.sprint.window}
            </p>
          </section>

          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Status strip</strong>
              <HowThisWorksButton onClick={() => setLessonId("kpis")} />
            </div>
            <div className="pm-kpi-grid">
            <Kpi label="Streak" value={`${data.kpis.currentStreak}d`} hint={`best ${data.kpis.bestStreak}d`} />
            <Kpi label="Last 30d" value={`${data.kpis.last30Percent}%`} />
            <Kpi
              label="Tasks done"
              value={String(data.kpis.tasksCompleted)}
              hint={`${data.kpis.tasksOpen} open`}
            />
            <Kpi
              label="Jobs"
              value={String(data.kpis.jobsTotal)}
              hint={`${data.kpis.jobsApplied} applied · ${data.kpis.jobsInterview} interview`}
            />
            <Kpi
              label="Apply quota"
              value={`${data.quota.applied}/${data.quota.target}`}
              hint={data.quota.onTrack ? "on track this week" : "behind this week"}
              warn={!data.quota.onTrack}
            />
            <Kpi
              label="Rollover"
              value={data.kpis.todayBlocked ? "Blocked" : "Clear"}
              hint={`${data.kpis.incompletePriorDays} incomplete prior day(s)`}
              warn={data.kpis.todayBlocked}
            />
            <Kpi
              label="Reviews"
              value={String(data.kpis.reviewsSubmitted)}
              hint="Sunday Review rows with content"
            />
            <Kpi
              label="Milestones"
              value={`${data.kpis.milestonesDone}/${data.kpis.milestonesTotal}`}
            />
            </div>
          </section>

          <section className="pm-grid">
            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Burnup — completed tasks</strong>
                <HowThisWorksButton onClick={() => setLessonId("burnup")} />
              </div>
              <p className="muted" style={{ margin: 0 }}>
                Cumulative Done tasks from first seeded day through today.
              </p>
              <LineChart points={data.burnup} label="Cumulative completed tasks" />
            </article>

            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Job funnel</strong>
                <HowThisWorksButton onClick={() => setLessonId("funnel")} />
              </div>
              <p className="muted" style={{ margin: 0 }}>
                Pipeline counts. Rejected is a terminal bucket, not a stage.
              </p>
              <HBars rows={funnel} />
            </article>
          </section>

          <section className="pm-grid">
            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Hours by subject</strong>
                <HowThisWorksButton onClick={() => setLessonId("hours")} />
              </div>
              <p className="muted" style={{ margin: 0 }}>
                Timer elapsed (paused time excluded), all tasks.
              </p>
              <HBars rows={data.hoursBySubject.slice(0, 10)} valueKey="minutes" />
            </article>

            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Applies by week</strong>
                <HowThisWorksButton onClick={() => setLessonId("weeklyApplies")} />
              </div>
              <HBars
                rows={data.jobsByWeek.map((p) => ({ name: `w/c ${p.date.slice(5)}`, count: p.value }))}
              />
            </article>
          </section>

          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Completion heatmap</strong>
              <HowThisWorksButton onClick={() => setLessonId("heatmap")} />
            </div>
            <p className="muted" style={{ margin: 0 }}>
              Same window as Progress. Empty days stay dark.
            </p>
            <div className="heatmap">
              {data.dailyCompletion.map((d) => (
                <div
                  key={d.date}
                  className="heat-cell"
                  title={`${d.date}: ${d.percent}% (${d.total} tasks)`}
                  style={{ background: heatColor(d.percent, d.total) }}
                />
              ))}
            </div>
          </section>

          <section className="pm-grid">
            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Risk matrix (P × I)</strong>
                <HowThisWorksButton onClick={() => setLessonId("riskMatrix")} />
              </div>
              <p className="muted" style={{ margin: 0 }}>
                Probability →, Impact ↑. Score = P×I from RAID.
              </p>
              <RiskMatrix risks={data.raid.risks} />
            </article>

            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>RAID risks</strong>
                <HowThisWorksButton onClick={() => setLessonId("raid")} />
              </div>
              <div className="pm-table-wrap">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Risk</th>
                      <th>P×I</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.raid.risks.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.title}</td>
                        <td>
                          {r.probability}×{r.impact}={r.score}
                        </td>
                        <td>
                          <span className={`pill ${ragClass(r.status)}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <strong>Issues</strong>
              <ul className="pm-list">
                {data.raid.issues.map((i) => (
                  <li key={i.id}>
                    {i.id} {i.title} — {i.status}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="pm-grid">
            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>WBS stories</strong>
                <HowThisWorksButton onClick={() => setLessonId("wbs")} />
              </div>
              <div className="pm-table-wrap">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Story</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.wbs.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.title}</td>
                        <td>
                          <span className={`pill ${ragClass(s.status)}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>RACI (standing)</strong>
                <HowThisWorksButton onClick={() => setLessonId("raci")} />
              </div>
              <div className="pm-table-wrap">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Work package</th>
                      <th>Sean</th>
                      <th>Primary agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.raci.map((row) => (
                      <tr key={row.work}>
                        <td>{row.work}</td>
                        <td>{row.sean}</td>
                        <td>{row.primary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section className="pm-grid">
            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Milestones</strong>
                <HowThisWorksButton onClick={() => setLessonId("milestones")} />
              </div>
              <ul className="pm-list">
                {data.milestones.map((m) => (
                  <li key={m.id}>
                    <span className={`pill ${m.completed ? "rag-g" : "rag-a"}`}>M{m.monthIndex}</span>{" "}
                    {m.title}
                  </li>
                ))}
              </ul>
            </article>

            <article className="card stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Sunday reviews</strong>
                <HowThisWorksButton onClick={() => setLessonId("reviews")} />
              </div>
              {data.reviews.length === 0 ? (
                <p className="muted">No review rows yet.</p>
              ) : (
                <ul className="pm-list">
                  {data.reviews.map((r) => (
                    <li key={r.weekStart}>
                      Week of {r.weekStart}: {r.submitted ? "submitted" : "empty"}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>

          <section className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>PM chart catalog — used vs skipped</strong>
              <HowThisWorksButton onClick={() => setLessonId("catalog")} />
            </div>
            <p className="muted" style={{ margin: 0 }}>
              Textbook PM visuals. GYAM only renders types with real data. No fake EVM, Gantt
              predecessors, or cost curves.
            </p>
            <div className="pm-table-wrap">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>Visual</th>
                    <th>Here?</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  {data.catalog.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{c.used ? "Yes" : "No"}</td>
                      <td>{c.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
      <PmHowModal lessonId={lessonId} onClose={() => setLessonId(null)} />
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: string;
  hint?: string;
  warn?: boolean;
}) {
  return (
    <div className={`card kpi-card ${warn ? "kpi-warn" : ""}`}>
      <div className="muted">{label}</div>
      <strong className="kpi-value">{value}</strong>
      {hint ? <div className="muted kpi-hint">{hint}</div> : null}
    </div>
  );
}

function RiskMatrix({
  risks,
}: {
  risks: PmDashboardDto["raid"]["risks"];
}) {
  const cells: Record<string, string[]> = {};
  for (const r of risks) {
    const key = `${r.probability}-${r.impact}`;
    cells[key] = [...(cells[key] ?? []), r.id];
  }
  return (
    <div className="risk-matrix" role="img" aria-label="Risk probability vs impact matrix">
      {[5, 4, 3, 2, 1].map((impact) =>
        [1, 2, 3, 4, 5].map((probability) => {
          const ids = cells[`${probability}-${impact}`] ?? [];
          const score = probability * impact;
          const tone = score >= 15 ? "hot" : score >= 8 ? "warm" : "cool";
          return (
            <div
              key={`${probability}-${impact}`}
              className={`risk-cell risk-${tone}`}
              title={`P${probability} I${impact} score ${score}`}
            >
              {ids.join(" ")}
            </div>
          );
        }),
      )}
    </div>
  );
}
