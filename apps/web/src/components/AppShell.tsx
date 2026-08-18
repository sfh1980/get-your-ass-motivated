import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { UserDto } from "../api";

const links = [
  { to: "/", label: "Today" },
  { to: "/progress", label: "Progress" },
  { to: "/pm", label: "PM" },
  { to: "/jobs", label: "Jobs" },
  { to: "/review", label: "Review" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({
  user,
  onLogout,
  children,
  wide = false,
}: {
  user: UserDto;
  onLogout: () => Promise<void>;
  children: ReactNode;
  wide?: boolean;
}) {
  const loc = useLocation();

  return (
    <div className={`app-shell stack${wide ? " app-shell-wide" : ""}`}>

      <header className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="brand">GYAM</h1>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>
            {user.username} · start {user.startDate}
          </p>
        </div>
        <button type="button" onClick={() => onLogout()}>
          Lock
        </button>
      </header>
      <nav className="row nav-tabs">
        {links.map((l) => (
          <Link key={l.to} className={loc.pathname === l.to ? "nav-active" : ""} to={l.to}>
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
