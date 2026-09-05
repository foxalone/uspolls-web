import type { IncomingMessage } from "node:http";
import { getFirebaseAuth } from "../firebase/admin";
import { isAdminEmail } from "./allowlist";

export const ADMIN_COOKIE = "uspolls_admin";
const SESSION_MS = 5 * 24 * 60 * 60 * 1000;

export function readCookie(req: IncomingMessage, name: string) {
  const header = req.headers.cookie || "";
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (!part.startsWith(`${name}=`)) continue;
    return decodeURIComponent(part.slice(name.length + 1));
  }
  return "";
}

export function adminCookieHeader(token: string, clear = false) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  if (clear) {
    return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
  }
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_MS / 1000)}${secure}`;
}

export async function createAdminSession(idToken: string) {
  const auth = getFirebaseAuth();
  const decoded = await auth.verifyIdToken(idToken);
  if (!decoded.email_verified || !isAdminEmail(decoded.email)) {
    const error = new Error("FORBIDDEN");
    (error as Error & { status: number }).status = 403;
    throw error;
  }
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MS });
  return { sessionCookie, email: decoded.email as string };
}

export async function verifyAdminSession(req: IncomingMessage) {
  const cookie = readCookie(req, ADMIN_COOKIE);
  if (!cookie) return null;
  try {
    const decoded = await getFirebaseAuth().verifySessionCookie(cookie, true);
    if (!decoded.email_verified || !isAdminEmail(decoded.email)) return null;
    return { email: decoded.email as string, uid: decoded.uid };
  } catch {
    return null;
  }
}
