import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runVoteHubSync } from "../src/lib/votehub/sync";

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

function readArg(name: string) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

const bootstrap = process.argv.includes("--bootstrap");
const dryRun = process.argv.includes("--dry-run");
const fromDate = readArg("from-date");

const result = await runVoteHubSync({
  bootstrap,
  dryRun,
  fromDate,
  trigger: "cli",
});

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok || result.skipped_overlap ? 0 : 1);
