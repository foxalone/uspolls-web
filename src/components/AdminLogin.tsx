import { useEffect, useState } from "react";
import {
  browserPopupRedirectResolver,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { ADMIN_EMAIL } from "../lib/admin/allowlist";
import { getFirebaseClientAuth, googleAuthProvider } from "../lib/firebase/client";

const REDIRECT_FLAG = "uspolls-admin-redirect";

let redirectUserPromise: Promise<User | null> | null = null;
let sessionPromise: Promise<void> | null = null;

function authErrorMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized for Firebase Auth.";
  }
  if (code === "auth/popup-blocked") return "The Google sign-in window was blocked. Allow popups and try again.";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "";
  }
  if (err instanceof Error && err.message.includes("NEXT_PUBLIC Firebase Auth")) {
    return "Firebase Auth client config is missing on this deployment.";
  }
  return code ? `Google sign-in failed (${code}).` : "Google sign-in failed.";
}

function consumeRedirectUser() {
  if (!redirectUserPromise) {
    redirectUserPromise = (async () => {
      const auth = getFirebaseClientAuth();
      await auth.authStateReady();
      const result = await getRedirectResult(auth, browserPopupRedirectResolver);
      return result?.user ?? auth.currentUser;
    })();
  }
  return redirectUserPromise;
}

async function completeAdminSession(user: User) {
  const email = user.email?.toLowerCase() || "";
  if (!user.emailVerified || email !== ADMIN_EMAIL) {
    await signOut(getFirebaseClientAuth());
    throw Object.assign(new Error(`Only ${ADMIN_EMAIL} can open this admin table.`), { code: "admin/forbidden" });
  }

  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    await signOut(getFirebaseClientAuth());
    const payload = await response.json().catch(() => ({} as { error?: string }));
    const serverError = typeof payload.error === "string" ? payload.error : "";
    throw Object.assign(new Error(
      response.status === 403
        ? `Only ${ADMIN_EMAIL} can open this admin table.`
        : "Google sign-in failed.",
    ), { code: response.status === 403 ? "admin/forbidden" : serverError === "UNAUTHORIZED" ? "admin/session" : `admin/${response.status}` });
  }

  window.location.assign("/admin");
}

function completeAdminSessionOnce(user: User) {
  if (!sessionPromise) {
    sessionPromise = completeAdminSession(user).catch((err) => {
      sessionPromise = null;
      throw err;
    });
  }
  return sessionPromise;
}

export function AdminLogin() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let alive = true;
    const returning = sessionStorage.getItem(REDIRECT_FLAG) === "1";
    if (returning) setPending(true);

    consumeRedirectUser()
      .then(async (user) => {
        if (!user) {
          sessionStorage.removeItem(REDIRECT_FLAG);
          if (alive && returning) setPending(false);
          return;
        }
        if (alive) setPending(true);
        await completeAdminSessionOnce(user);
        sessionStorage.removeItem(REDIRECT_FLAG);
      })
      .catch((err) => {
        sessionStorage.removeItem(REDIRECT_FLAG);
        if (!alive) return;
        const message = err instanceof Error && err.message.startsWith("Only ")
          ? err.message
          : authErrorMessage(err);
        if (message) setError(message);
        setPending(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  async function signInWithGoogle() {
    setPending(true);
    setError("");
    const auth = getFirebaseClientAuth();
    const provider = googleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      await completeAdminSessionOnce(result.user);
    } catch (popupErr) {
      const code = typeof popupErr === "object" && popupErr && "code" in popupErr
        ? String(popupErr.code)
        : "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setPending(false);
        return;
      }
      if (code !== "auth/popup-blocked" && code !== "auth/operation-not-supported-in-this-environment") {
        const message = authErrorMessage(popupErr);
        if (message) setError(message);
        setPending(false);
        return;
      }
      try {
        sessionStorage.setItem(REDIRECT_FLAG, "1");
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
      } catch (redirectErr) {
        sessionStorage.removeItem(REDIRECT_FLAG);
        const message = authErrorMessage(redirectErr);
        if (message) setError(message);
        setPending(false);
      }
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
