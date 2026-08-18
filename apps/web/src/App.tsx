import { useEffect, useState, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api, type UserDto } from "./api";
import { SetupPage } from "./pages/SetupPage";
import { LoginPage } from "./pages/LoginPage";
import { TodayPage } from "./pages/TodayPage";
import { ProgressPage } from "./pages/ProgressPage";
import { JobsPage } from "./pages/JobsPage";
import { ReviewPage } from "./pages/ReviewPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PmPage } from "./pages/PmPage";

export function App() {
  const [ready, setReady] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await api.status();
        if (cancelled) return;
        setNeedsSetup(status.needsSetup);
        if (!status.needsSetup) {
          try {
            const me = await api.me();
            if (!cancelled) setUser(me.user);
          } catch {
            if (!cancelled) setUser(null);
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogout() {
    await api.logout();
    setUser(null);
  }

  if (!ready) {
    return (
      <div className="app-shell">
        <p className="muted">Loading GYAM…</p>
      </div>
    );
  }

  const gate = (page: ReactElement) =>
    needsSetup ? <Navigate to="/setup" replace /> : !user ? <Navigate to="/login" replace /> : page;

  const page = (el: (u: UserDto) => ReactElement) =>
    gate(user ? el(user) : <Navigate to="/login" replace />);

  return (
    <Routes>
      <Route
        path="/setup"
        element={
          needsSetup ? (
            <SetupPage
              onDone={(u) => {
                setUser(u);
                setNeedsSetup(false);
              }}
            />
          ) : (
            <Navigate to={user ? "/" : "/login"} replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          needsSetup ? (
            <Navigate to="/setup" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onDone={setUser} />
          )
        }
      />
      <Route path="/" element={page((u) => <TodayPage user={u} onLogout={onLogout} />)} />
      <Route path="/progress" element={page((u) => <ProgressPage user={u} onLogout={onLogout} />)} />
      <Route path="/pm" element={page((u) => <PmPage user={u} onLogout={onLogout} />)} />
      <Route path="/jobs" element={page((u) => <JobsPage user={u} onLogout={onLogout} />)} />
      <Route path="/review" element={page((u) => <ReviewPage user={u} onLogout={onLogout} />)} />
      <Route path="/roadmap" element={page((u) => <RoadmapPage user={u} onLogout={onLogout} />)} />
      <Route path="/settings" element={page((u) => <SettingsPage user={u} onLogout={onLogout} />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
