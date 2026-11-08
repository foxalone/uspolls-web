import { ELECTION_RESULTS } from "../../data/electionResults";
import { listAllHistoricalRows } from "./historicalArchive";
import type { HistoricalCycle, HistoricalPollRow } from "./historical";
import type { ElectionResult } from "../../data/electionResults";

export type AllElectionEntry =
  | { kind: "poll"; id: string; recordedOn: string; cycle: HistoricalCycle; poll: HistoricalPollRow }
  | { kind: "result"; id: string; recordedOn: string; result: ElectionResult }
  | { kind: "news"; id: string; recordedOn: string };

const PAGE_SIZE = 80;
const kindRank = { news: 0, poll: 1, result: 2 };

const entries: AllElectionEntry[] = [
  ...listAllHistoricalRows().map(({ cycle, poll }) => ({ kind: "poll" as const, id: `${cycle}:${poll.id}`, recordedOn: poll.recordedOn, cycle, poll })),
  ...ELECTION_RESULTS.map((result) => ({ kind: "result" as const, id: `result:${result.year}`, recordedOn: result.recordedOn, result })),
  { kind: "news" as const, id: "news:2024-07-21", recordedOn: "2024-07-21" },
].sort((a, b) => a.recordedOn.localeCompare(b.recordedOn) || kindRank[a.kind] - kindRank[b.kind] || a.id.localeCompare(b.id));

const pollsterCounts = [...entries.reduce((counts, entry) => {
  if (entry.kind === "poll") counts.set(entry.poll.pollster, (counts.get(entry.poll.pollster) ?? 0) + 1);
  return counts;
}, new Map<string, number>())].map(([pollster, count]) => ({ pollster, count }))
  .sort((a, b) => b.count - a.count || a.pollster.localeCompare(b.pollster));

const knownPollsters = new Set(pollsterCounts.map(({ pollster }) => pollster));

function selectedEntries(pollster: string) {
  if (pollster === "all") return entries;
  if (pollster === "result") return entries.filter((entry) => entry.kind === "result");
  if (!knownPollsters.has(pollster)) return null;
  return entries.filter((entry) => entry.kind === "poll" && entry.poll.pollster === pollster);
}

export function listAllElectionPage(offset?: number, pollster = "all") {
  const rows = selectedEntries(pollster);
  if (!rows) return null;
  const end = offset ?? rows.length;
  if (offset !== undefined && (offset < 1 || offset > rows.length)) return null;
  const start = Math.max(0, end - PAGE_SIZE);
  return { entries: rows.slice(start, end), nextOffset: start > 0 ? start : null, total: rows.length, pollsterCounts };
}

export function allElectionEntryCount() {
  return entries.length;
}
