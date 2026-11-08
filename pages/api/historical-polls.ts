import type { NextApiRequest, NextApiResponse } from "next";
import { listHistoricalPage, listHistoricalPollsterCounts, listHistoricalPollsterRows } from "../../src/lib/polls/historicalArchive";
import type { HistoricalCursor, HistoricalCycle } from "../../src/lib/polls/historical";

const CYCLES = new Set<HistoricalCycle>([2012, 2016, 2020, 2024]);

function readCycle(value: unknown): HistoricalCycle | null {
  const cycle = Number(value);
  return CYCLES.has(cycle as HistoricalCycle) ? cycle as HistoricalCycle : null;
}

function readCursor(value: unknown): HistoricalCursor | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const split = value.indexOf("|");
  if (split <= 0) return undefined;
  const recordedOn = value.slice(0, split);
  const id = value.slice(split + 1);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recordedOn) || !id || id.includes("|")) return undefined;
  return { recordedOn, id };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const cycle = readCycle(req.query.cycle);
  if (!cycle) return res.status(400).json({ error: "BAD_CYCLE" });
  const cursor = readCursor(req.query.cursor);
  if (req.query.cursor && !cursor) return res.status(400).json({ error: "BAD_CURSOR" });
  const pollster = req.query.pollster;
  if (pollster !== undefined && (typeof pollster !== "string" || !pollster.trim() || pollster.length > 200 || cursor)) {
    return res.status(400).json({ error: "BAD_POLLSTER" });
  }

  try {
    if (typeof pollster === "string") {
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
      return res.status(200).json({
        polls: listHistoricalPollsterRows(cycle, pollster),
        nextCursor: null,
        pollsterCounts: listHistoricalPollsterCounts(cycle),
      });
    }
    const page = await listHistoricalPage(cycle, cursor);
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.status(200).json({
      polls: page.rows,
      nextCursor: page.nextCursor ? `${page.nextCursor.recordedOn}|${page.nextCursor.id}` : null,
      pollsterCounts: page.pollsterCounts,
    });
  } catch {
    return res.status(500).json({ error: "HISTORICAL_POLLS_FAILED" });
  }
}
