import type { NextApiRequest, NextApiResponse } from "next";
import { listPresidentialNews } from "../../src/lib/news/store";

const PAGE_SIZE = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  const before = typeof req.query.before === "string" && req.query.before ? Number(req.query.before) : undefined;
  if (before !== undefined && !Number.isFinite(before)) return res.status(400).json({ error: "BAD_CURSOR" });
  try {
    const page = await listPresidentialNews(PAGE_SIZE, before);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json(page);
  } catch {
    return res.status(500).json({ error: "NEWS_UNAVAILABLE" });
  }
}
