import type { NextApiRequest, NextApiResponse } from "next";
import { authorizeVoteHubSync } from "../../../src/lib/admin/protectSync";
import { ingestPresidentialNews } from "../../../src/lib/news/ingest";

export const config = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  const auth = authorizeVoteHubSync(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  try {
    const result = await ingestPresidentialNews();
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "NEWS_INGEST_FAILED";
    const status = message.startsWith("MISSING_ENV:") ? 503 : 500;
    return res.status(status).json({ error: message });
  }
}
