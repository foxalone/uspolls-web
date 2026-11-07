import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getFirestoreDb } from "../src/lib/firebase/admin";
import { HISTORICAL_POLLS_COLLECTION, TRUMP_BIDEN_2024_RACE_KEY, TRUMP_HARRIS_2024_RACE_KEY } from "../src/lib/polls/historical";
import { commitWrites } from "../src/lib/polls/repository";
import bidenArchive from "../src/data/trumpBiden2024.json";
import harrisArchive from "../src/data/trumpHarris2024.json";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

type ArchiveRow = {
  id: string;
  pollId: string;
  cycle: number;
  matchup: string;
  scope: string;
  pollster: string;
  recordedOn: string;
  trumpPct: number;
  bidenPct?: number;
  harrisPct?: number;
  population: string | null;
  sampleSize: number | null;
  sourceUrl: string | null;
  source: string;
  archiveSnapshot: string;
};

const importedAt = new Date().toISOString();
const db = getFirestoreDb();

function toWrite(row: ArchiveRow, raceKey: string, democrat: "Biden" | "Harris", democratPct: number) {
  return {
    ref: db.collection(HISTORICAL_POLLS_COLLECTION).doc(row.id),
    data: {
      id: row.id,
      poll_id: row.pollId,
      cycle: row.cycle,
      matchup: row.matchup,
      scope: row.scope,
      race_key: raceKey,
      pollster: row.pollster,
      recorded_on: row.recordedOn,
      trump_pct: row.trumpPct,
      democrat,
      democrat_pct: democratPct,
      biden_pct: democrat === "Biden" ? democratPct : null,
      harris_pct: democrat === "Harris" ? democratPct : null,
      population: row.population,
      sample_size: row.sampleSize,
      source_url: row.sourceUrl,
      source: row.source,
      archive_snapshot: row.archiveSnapshot,
      imported_at: importedAt,
    },
  };
}

const bidenRows = bidenArchive as ArchiveRow[];
const harrisRows = harrisArchive as ArchiveRow[];
const writes = [
  ...bidenRows.map((row) => toWrite(row, TRUMP_BIDEN_2024_RACE_KEY, "Biden", row.bidenPct ?? 0)),
  ...harrisRows.map((row) => toWrite(row, TRUMP_HARRIS_2024_RACE_KEY, "Harris", row.harrisPct ?? 0)),
];

const result = await commitWrites(db, writes);
console.log(JSON.stringify({ collection: HISTORICAL_POLLS_COLLECTION, biden: bidenRows.length, harris: harrisRows.length, ...result }));
if (result.failed > 0) process.exitCode = 1;
