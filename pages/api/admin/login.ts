import type { NextApiRequest, NextApiResponse } from "next";
import { adminCookieHeader, createAdminSession } from "../../../src/lib/admin/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const idToken = typeof req.body?.idToken === "string" ? req.body.idToken.trim() : "";
  if (!idToken) return res.status(400).json({ error: "MISSING_ID_TOKEN" });

  try {
    const session = await createAdminSession(idToken);
    res.setHeader("Set-Cookie", adminCookieHeader(session.sessionCookie));
    return res.status(200).json({ ok: true, email: session.email });
  } catch (error) {
    const status = (error as { status?: number }).status === 403 ? 403 : 401;
    return res.status(status).json({
      error: status === 403 ? "FORBIDDEN" : "UNAUTHORIZED",
    });
  }
}
