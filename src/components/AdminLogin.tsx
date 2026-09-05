import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { ADMIN_EMAIL } from "../lib/admin/allowlist";
import { getFirebaseClientAuth, googleAuthProvider } from "../lib/firebase/client";

export function AdminLogin() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setPending(true);
    setError("");
    const auth = getFirebaseClientAuth();
    try {
      const result = await signInWithPopup(auth, googleAuthProvider());
      const email = result.user.email?.toLowerCase() || "";
      if (!result.user.emailVerified || email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError(`Only ${ADMIN_EMAIL} can open this admin table.`);
        setPending(false);
        return;
      }

      const idToken = await result.user.getIdToken();
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth);
        setError(
          response.status === 403
            ? `Only ${ADMIN_EMAIL} can open this admin table.`
            : "Google sign-in failed.",
        );
        setPending(false);
        return;
      }

      window.location.reload();
    } catch (err) {
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setPending(false);
        return;
      }
      setError(code === "auth/unauthorized-domain" ? "This domain is not authorized for Firebase Auth." : "Google sign-in failed.");
      setPending(false);
    }
  }

  return (
    <section className="panel admin-login">
      <p className="eyebrow">Admin</p>
      <h1>Raw polling data</h1>
      <p>
        Sign in with Google as <strong>{ADMIN_EMAIL}</strong>. Other accounts cannot see this
        table.
      </p>
      {error ? <p className="admin-login__error">{error}</p> : null}
      <button className="admin-login__google" disabled={pending} onClick={signInWithGoogle} type="button">
        {pending ? "Signing in…" : "Sign in with Google"}
      </button>
    </section>
  );
}
