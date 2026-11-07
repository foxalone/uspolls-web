import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminPreviewIp } from "../../src/lib/admin/previewAccess";
import { ADMIN_COOKIE, readCookie, verifyAdminSession } from "../../src/lib/admin/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  res.setHeader("Cache-Control", "private, no-store");
  if (isAdminPreviewIp(req)) return res.status(200).json({ ru: true });
  if (!readCookie(req, ADMIN_COOKIE)) return res.status(200).json({ ru: false });

  try {
    const session = await verifyAdminSession(req);
    return res.status(200).json({ ru: Boolean(session) });
  } catch {
    return res.status(200).json({ ru: false });
  }
}
