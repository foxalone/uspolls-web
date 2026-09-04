import type { NextApiRequest, NextApiResponse } from "next";
import { adminCookieHeader, adminSessionToken, secretsEqual } from "../../../src/lib/admin/session";
import { syncSecret } from "../../../src/lib/admin/protectSync";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const expected = syncSecret();
  if (!expected) return res.status(503).json({ error: "MISSING_ENV:CRON_SECRET" });

  const provided = typeof req.body?.secret === "string" ? req.body.secret.trim() : "";
  if (!secretsEqual(provided, expected)) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  res.setHeader("Set-Cookie", adminCookieHeader(adminSessionToken()));
  return res.status(200).json({ ok: true });
}
