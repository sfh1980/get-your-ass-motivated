import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type UserDto } from "../api";

export function SetupPage({ onDone }: { onDone: (user: UserDto) => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.setup(username.trim(), pin);
      onDone(res.user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell stack">
      <header>
        <h1 className="brand">GYAM</h1>
        <p className="muted">Create your local account. PIN unlock only — no email required.</p>
      </header>
      <form className="card stack" onSubmit={onSubmit}>
        <label>
          User ID / name
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            pattern="[a-zA-Z0-9._\-]{2,64}"
            maxLength={64}
            required
          />
        </label>
        <label>
          PIN (4–8 digits)
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            inputMode="numeric"
            pattern="\d{4,8}"
            autoComplete="new-password"
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Seeding roadmap…" : "Start GYAM"}
        </button>
      </form>
    </div>
  );
}
