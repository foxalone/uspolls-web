import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getFirestoreDb } from "../src/lib/firebase/admin";
import { HISTORICAL_POLLS_COLLECTION, TRUMP_CLINTON_2016_RACE_KEY } from "../src/lib/polls/historical";
import { commitWrites } from "../src/lib/polls/repository";
import archive from "../src/data/trumpClinton2016.json";

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
  clintonPct: number;
  population: string | null;
  sampleSize: number | null;
  sourceUrl: string | null;
  source: string;
  archiveSnapshot: string;
};

const importedAt = new Date().toISOString();
const db = getFirestoreDb();
const rows = archive as ArchiveRow[];
const writes = rows.map((row) => ({
  ref: db.collection(HISTORICAL_POLLS_COLLECTION).doc(row.id),
  data: {
    id: row.id,
    poll_id: row.pollId,
    cycle: row.cycle,
    matchup: row.matchup,
    scope: row.scope,
    race_key: TRUMP_CLINTON_2016_RACE_KEY,
    pollster: row.pollster,
    recorded_on: row.recordedOn,
    trump_pct: row.trumpPct,
    democrat: "Clinton",
    democrat_pct: row.clintonPct,
    biden_pct: null,
    harris_pct: null,
    population: row.population,
    sample_size: row.sampleSize,
    source_url: row.sourceUrl,
    source: row.source,
    archive_snapshot: row.archiveSnapshot,
    imported_at: importedAt,
  },
}));

const result = await commitWrites(db, writes);
console.log(JSON.stringify({ collection: HISTORICAL_POLLS_COLLECTION, clinton: rows.length, ...result }));
if (result.failed > 0) process.exitCode = 1;
