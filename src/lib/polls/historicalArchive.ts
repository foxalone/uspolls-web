import obama2012 from "../../data/obamaRomney2012.json";
import biden2020 from "../../data/trumpBiden2020.json";
import biden2024 from "../../data/trumpBiden2024.json";
import clinton2016 from "../../data/trumpClinton2016.json";
import harris2024 from "../../data/trumpHarris2024.json";
import { HISTORICAL_PAGE_SIZE, type HistoricalCursor, type HistoricalCycle, type HistoricalPollRow, type HistoricalPollsterCount } from "./historical";

type ArchiveRow = {
  id: string;
  pollster: string;
  recordedOn: string;
  trumpPct: number;
  obamaPct?: number;
  clintonPct?: number;
  bidenPct?: number;
  harrisPct?: number;
  population: string | null;
  sampleSize: number | null;
  sourceUrl: string | null;
};

function mapRows(rows: ArchiveRow[], democrat: HistoricalPollRow["democrat"], percent: (row: ArchiveRow) => number | undefined) {
  return rows.flatMap((row) => {
    const democratPct = percent(row);
    if (!row.id || !row.pollster || !row.recordedOn || !Number.isFinite(row.trumpPct) || democratPct === undefined || !Number.isFinite(democratPct)) return [];
    return [{
      id: row.id,
      pollster: row.pollster,
      recordedOn: row.recordedOn,
      trumpPct: row.trumpPct,
      democrat,
      democratPct,
      population: row.population,
      sampleSize: row.sampleSize,
      sourceUrl: row.sourceUrl,
    }];
  });
}

function byNewest(a: HistoricalPollRow, b: HistoricalPollRow) {
  return b.recordedOn.localeCompare(a.recordedOn) || b.id.localeCompare(a.id);
}

const archives: Record<HistoricalCycle, HistoricalPollRow[]> = {
  2012: mapRows(obama2012 as ArchiveRow[], "Obama", (row) => row.obamaPct).sort(byNewest),
  2016: mapRows(clinton2016 as ArchiveRow[], "Clinton", (row) => row.clintonPct).sort(byNewest),
  2020: mapRows(biden2020 as ArchiveRow[], "Biden", (row) => row.bidenPct).sort(byNewest),
  2024: [
    ...mapRows(biden2024 as ArchiveRow[], "Biden", (row) => row.bidenPct),
    ...mapRows(harris2024 as ArchiveRow[], "Harris", (row) => row.harrisPct),
  ].sort(byNewest),
};

function countPollsters(rows: HistoricalPollRow[]): HistoricalPollsterCount[] {
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.pollster, (counts.get(row.pollster) ?? 0) + 1);
  return [...counts].map(([pollster, count]) => ({ pollster, count }))
    .sort((a, b) => b.count - a.count || a.pollster.localeCompare(b.pollster));
}

const pollsterCounts: Record<HistoricalCycle, HistoricalPollsterCount[]> = {
  2012: countPollsters(archives[2012]),
  2016: countPollsters(archives[2016]),
  2020: countPollsters(archives[2020]),
  2024: countPollsters(archives[2024]),
};

export function listHistoricalPollsterRows(cycle: HistoricalCycle, pollster: string) {
  return archives[cycle].filter((row) => row.pollster === pollster);
}

export function listHistoricalPollsterCounts(cycle: HistoricalCycle) {
  return pollsterCounts[cycle];
}

export function listHistoricalPage(cycle: HistoricalCycle, cursor?: HistoricalCursor) {
  const all = archives[cycle];
  let start = 0;
  if (cursor) {
    const index = all.findIndex((row) => row.recordedOn === cursor.recordedOn && row.id === cursor.id);
    start = index < 0 ? all.length : index + 1;
  }
  const rows = all.slice(start, start + HISTORICAL_PAGE_SIZE);
  const last = rows.at(-1);
  const nextCursor = rows.length === HISTORICAL_PAGE_SIZE && last ? { recordedOn: last.recordedOn, id: last.id } : null;
  return { rows, nextCursor, pollsterCounts: pollsterCounts[cycle] };
}
