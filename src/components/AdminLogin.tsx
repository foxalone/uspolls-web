import { useState, type FormEvent } from "react";

export function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (!response.ok) {
        setError(response.status === 401 ? "Wrong secret." : "Login failed.");
        setPending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Login failed.");
      setPending(false);
    }
  }

  return (
    <section className="panel admin-login">
      <p className="eyebrow">Admin</p>
      <h1>Raw polling data</h1>
      <p>Enter the existing CRON_SECRET / ADMIN_SYNC_SECRET to open the raw VoteHub table.</p>
      <form className="admin-login__form" onSubmit={onSubmit}>
        <label>
          Admin secret
          <input
            autoComplete="current-password"
            onChange={(event) => setSecret(event.target.value)}
            required
            type="password"
            value={secret}
          />
        </label>
        {error ? <p className="admin-login__error">{error}</p> : null}
        <button disabled={pending} type="submit">
          {pending ? "Checking…" : "Open raw data"}
        </button>
      </form>
    </section>
  );
}
