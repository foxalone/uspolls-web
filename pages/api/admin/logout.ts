import type { NextApiRequest, NextApiResponse } from "next";
import { adminCookieHeader } from "../../../src/lib/admin/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  res.setHeader("Set-Cookie", adminCookieHeader("", true));
  return res.status(200).json({ ok: true });
}
