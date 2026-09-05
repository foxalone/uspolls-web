import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth,
  type Auth,
} from "firebase/auth";

function clientAuthDomain() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") return host;
  }
  return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "";
}

function clientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "";
  const authDomain = clientAuthDomain();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "";
  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error("Missing NEXT_PUBLIC Firebase Auth config");
  }
  return { apiKey, authDomain, projectId, appId };
}

export function getFirebaseClientApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(clientConfig());
}

export function getFirebaseClientAuth(): Auth {
  const app = getFirebaseClientApp();
  try {
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
}

export function googleAuthProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account", login_hint: "mityabv@gmail.com" });
  return provider;
}
