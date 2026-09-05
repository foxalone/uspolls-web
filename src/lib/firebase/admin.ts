import { existsSync, readFileSync } from "node:fs";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const APP_NAME = "uspolls-server";

function env(name: string) {
  return process.env[name]?.trim() || "";
}

function readJsonCredentials(path: string): { projectId?: string; clientEmail?: string; privateKey?: string } {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };
  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

function resolveCredentials() {
  const projectId = env("FIREBASE_ADMIN_PROJECT_ID") || env("FIREBASE_PROJECT_ID");
  const clientEmail = env("FIREBASE_ADMIN_CLIENT_EMAIL") || env("FIREBASE_CLIENT_EMAIL");
  const privateKey = (env("FIREBASE_ADMIN_PRIVATE_KEY") || env("FIREBASE_PRIVATE_KEY")).replace(
    /\\n/g,
    "\n",
  );

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  const credentialsPath = env("GOOGLE_APPLICATION_CREDENTIALS");
  if (credentialsPath && existsSync(credentialsPath)) {
    const fromFile = readJsonCredentials(credentialsPath);
    if (fromFile.projectId && fromFile.clientEmail && fromFile.privateKey) {
      return {
        projectId: fromFile.projectId,
        clientEmail: fromFile.clientEmail,
        privateKey: fromFile.privateKey,
      };
    }
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
  );
}

export function getFirebaseAdminApp(): App {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin must only be initialized on the server");
  }

  const { projectId, clientEmail, privateKey } = resolveCredentials();
  return initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    },
    APP_NAME,
  );
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}
