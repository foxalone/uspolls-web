import type { NextApiRequest, NextApiResponse } from "next";
import { listPresidentialNews } from "../../src/lib/news/store";

const PAGE_SIZE = 10;

function readCursor(value: string | string[] | undefined) {
  if (typeof value !== "string" || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  const before = readCursor(req.query.before);
  const after = readCursor(req.query.after);
  if (before === null || after === null) return res.status(400).json({ error: "BAD_CURSOR" });
  if (before !== undefined && after !== undefined && after >= before) return res.status(400).json({ error: "BAD_CURSOR" });
  try {
    const page = await listPresidentialNews(PAGE_SIZE, before, after);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json(page);
  } catch {
    return res.status(500).json({ error: "NEWS_UNAVAILABLE" });
  }
}
