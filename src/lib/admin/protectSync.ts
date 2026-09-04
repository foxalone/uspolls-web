import { createHash, timingSafeEqual } from "node:crypto";
import type { NextApiRequest } from "next";

export function syncSecret() {
  return (
    process.env.ADMIN_SYNC_SECRET?.trim() ||
    process.env.VOTEHUB_SYNC_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    ""
  );
}

function secretsMatch(provided: string, expected: string) {
  if (!provided || !expected) return false;
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

function readProvidedSecret(req: NextApiRequest) {
  const header = req.headers.authorization || "";
  const bearer = header.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || "";
  if (bearer) return bearer;
  const cronHeader = req.headers["x-cron-secret"];
  return typeof cronHeader === "string" ? cronHeader.trim() : "";
}

export function authorizeVoteHubSync(req: NextApiRequest):
  | { ok: true }
  | { ok: false; status: number; error: string } {
  const expected = syncSecret();
  if (!expected) {
    return { ok: false, status: 503, error: "MISSING_ENV:CRON_SECRET" };
  }
  if (!secretsMatch(readProvidedSecret(req), expected)) {
    return { ok: false, status: 401, error: "UNAUTHORIZED" };
  }
  return { ok: true };
}
