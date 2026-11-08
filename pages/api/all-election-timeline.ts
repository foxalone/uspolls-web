import type { NextApiRequest, NextApiResponse } from "next";
import { allElectionEntryCount, listAllElectionPage } from "../../src/lib/polls/allElectionArchive";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const rawOffset = req.query.offset;
  const offset = rawOffset === undefined ? undefined : typeof rawOffset === "string" && /^\d+$/.test(rawOffset) ? Number(rawOffset) : NaN;
  if (offset !== undefined && (!Number.isSafeInteger(offset) || offset < 1 || offset > allElectionEntryCount())) {
    return res.status(400).json({ error: "BAD_OFFSET" });
  }
  const rawPollster = req.query.pollster;
  const pollster = rawPollster === undefined ? "all" : typeof rawPollster === "string" ? rawPollster : "";
  const page = listAllElectionPage(offset, pollster);
  if (!page) return res.status(400).json({ error: "BAD_FILTER" });

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return res.status(200).json(page);
}
