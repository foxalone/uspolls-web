import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";
import { syncSecret } from "./protectSync";

export const ADMIN_COOKIE = "uspolls_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function secretsEqual(provided: string, expected: string) {
  if (!provided || !expected) return false;
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function adminSessionToken() {
  const secret = syncSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update("uspolls-admin-session").digest("hex");
}

export function readCookie(req: IncomingMessage, name: string) {
  const header = req.headers.cookie || "";
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (!part.startsWith(`${name}=`)) continue;
    return decodeURIComponent(part.slice(name.length + 1));
  }
  return "";
}

export function isAdminRequest(req: IncomingMessage) {
  const expected = adminSessionToken();
  if (!expected) return false;
  return secretsEqual(readCookie(req, ADMIN_COOKIE), expected);
}

export function adminCookieHeader(token: string, clear = false) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  if (clear) {
    return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
  }
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}
