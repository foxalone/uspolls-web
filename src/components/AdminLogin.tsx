import { useEffect, useState } from "react";
import { getRedirectResult, signInWithRedirect, signOut, type User } from "firebase/auth";
import { ADMIN_EMAIL } from "../lib/admin/allowlist";
import { getFirebaseClientAuth, googleAuthProvider } from "../lib/firebase/client";

function authErrorMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized for Firebase Auth.";
  }
  if (code === "auth/popup-blocked") return "The Google sign-in window was blocked.";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "";
  }
  if (err instanceof Error && err.message.includes("NEXT_PUBLIC Firebase Auth")) {
    return "Firebase Auth client config is missing on this deployment.";
  }
  return code ? `Google sign-in failed (${code}).` : "Google sign-in failed.";
}

export function AdminLogin() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function completeAdminSession(user: User) {
    const email = user.email?.toLowerCase() || "";
    if (!user.emailVerified || email !== ADMIN_EMAIL) {
      await signOut(getFirebaseClientAuth());
      throw Object.assign(new Error(`Only ${ADMIN_EMAIL} can open this admin table.`), { code: "admin/forbidden" });
    }

    const idToken = await user.getIdToken();
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      await signOut(getFirebaseClientAuth());
      throw Object.assign(new Error(
        response.status === 403
          ? `Only ${ADMIN_EMAIL} can open this admin table.`
          : "Google sign-in failed.",
      ), { code: response.status === 403 ? "admin/forbidden" : "admin/session" });
    }

    window.location.assign("/admin");
  }

  useEffect(() => {
    let cancelled = false;
    const returning = sessionStorage.getItem("uspolls-admin-redirect") === "1";
    if (returning) {
      setPending(true);
      sessionStorage.removeItem("uspolls-admin-redirect");
    }

    try {
      const auth = getFirebaseClientAuth();
      getRedirectResult(auth)
        .then(async (result) => {
          if (cancelled) return;
          if (!result) {
            if (returning) setPending(false);
            return;
          }
          setPending(true);
          await completeAdminSession(result.user);
        })
        .catch((err) => {
          if (cancelled) return;
          const message = err instanceof Error && err.message.startsWith("Only ")
            ? err.message
            : authErrorMessage(err);
          if (message) setError(message);
          setPending(false);
        });
    } catch (err) {
      const message = authErrorMessage(err);
      if (message) setError(message);
      setPending(false);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  async function signInWithGoogle() {
    setPending(true);
    setError("");
    try {
      const auth = getFirebaseClientAuth();
      sessionStorage.setItem("uspolls-admin-redirect", "1");
      await signInWithRedirect(auth, googleAuthProvider());
    } catch (err) {
      sessionStorage.removeItem("uspolls-admin-redirect");
      const message = authErrorMessage(err);
      if (message) setError(message);
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
        {pending ? "Redirecting to Google…" : "Sign in with Google"}
      </button>
    </section>
  );
}
