import type { IncomingMessage } from "node:http";

/** Home network of the site admin. Extra addresses can be added with ADMIN_PREVIEW_IPS. */
const DEFAULT_ADMIN_IPS = ["109.186.158.125"];

function headerValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function normalizeIp(ip: string) {
  return ip.trim().replace(/^::ffff:/, "");
}

export function requestIp(req: IncomingMessage) {
  if (process.env.NODE_ENV !== "production") {
    return normalizeIp(req.socket.remoteAddress || "");
  }
  const real = headerValue(req.headers["x-real-ip"]);
  if (real.trim()) return normalizeIp(real);
  const forwarded = headerValue(req.headers["x-forwarded-for"]);
  if (forwarded.trim()) return normalizeIp(forwarded.split(",")[0] || "");
  return normalizeIp(req.socket.remoteAddress || "");
}

function isLoopback(ip: string) {
  return ip === "127.0.0.1" || ip === "::1" || ip === "localhost";
}

export function isAdminPreviewIp(req: IncomingMessage) {
  const ip = requestIp(req);
  if (process.env.NODE_ENV !== "production" && isLoopback(ip)) return true;
  const extra = (process.env.ADMIN_PREVIEW_IPS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_ADMIN_IPS, ...extra]).has(ip);
}
