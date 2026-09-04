import { VOTEHUB_SOURCE } from "./constants";
import { contentHash } from "./hash";
import { asTrimmedString, normalizeRace } from "./normalize";
import type { StoredPoll, StoredPollAnswer, VoteHubAnswer, VoteHubPoll } from "./types";

const KNOWN_VOTEHUB_FIELDS = new Set([
  "id",
  "poll_type",
  "subject",
  "seat_name",
  "pollster",
  "sample_size",
  "population",
  "start_date",
  "end_date",
  "created_at",
  "answers",
  "sponsors",
  "internal",
  "partisan",
  "url",
]);

const DERIVED_FIELDS = new Set([
  "source",
  "source_url",
  "source_hash",
  "election_year",
  "race_type",
  "state",
  "district",
  "race_key",
  "imported_at",
  "updated_at",
]);

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function mapAnswer(raw: VoteHubAnswer): StoredPollAnswer {
  const mapped: StoredPollAnswer = {
    choice: asTrimmedString(raw.choice),
    pct: asFiniteNumber(raw.pct),
  };
  for (const [key, value] of Object.entries(raw)) {
    if (key === "choice" || key === "pct") continue;
    mapped[key] = value;
  }
  return mapped;
}

function mapAnswers(value: unknown): StoredPollAnswer[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is VoteHubAnswer => Boolean(item) && typeof item === "object")
    .map(mapAnswer);
}

function mapSponsors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asTrimmedString(item))
    .filter((item): item is string => Boolean(item));
}

function extraVoteHubFields(poll: VoteHubPoll): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(poll)) {
    if (KNOWN_VOTEHUB_FIELDS.has(key) || DERIVED_FIELDS.has(key)) continue;
    if (value === undefined) continue;
    extras[key] = value;
  }
  return extras;
}

export function mapVoteHubPoll(poll: VoteHubPoll, nowIso: string, importedAt?: string): StoredPoll | null {
  const id = asTrimmedString(poll.id);
  if (!id) return null;

  const race = normalizeRace(poll);
  if (!race) return null;

  const url = asTrimmedString(poll.url);
  const extras = extraVoteHubFields(poll);

  const comparable = {
    id,
    poll_type: asTrimmedString(poll.poll_type),
    subject: asTrimmedString(poll.subject),
    seat_name: asTrimmedString(poll.seat_name),
    pollster: asTrimmedString(poll.pollster),
    sample_size: asFiniteNumber(poll.sample_size),
    population: asTrimmedString(poll.population),
    start_date: asTrimmedString(poll.start_date),
    end_date: asTrimmedString(poll.end_date),
    created_at: asTrimmedString(poll.created_at),
    answers: mapAnswers(poll.answers),
    sponsors: mapSponsors(poll.sponsors),
    internal: asBoolean(poll.internal),
    partisan: asTrimmedString(poll.partisan),
    url,
    source_url: url,
    source: VOTEHUB_SOURCE,
    election_year: race.election_year,
    race_type: race.race_type,
    state: race.state,
    district: race.district,
    race_key: race.race_key,
    ...extras,
  };

  return {
    ...comparable,
    id,
    poll_type: comparable.poll_type ?? "",
    subject: comparable.subject ?? "",
    source_hash: contentHash(comparable),
    imported_at: importedAt ?? nowIso,
    updated_at: nowIso,
  };
}

export function pollNeedsWrite(
  incoming: StoredPoll,
  existing: { source_hash?: unknown } | undefined,
): "create" | "update" | "skip" {
  if (!existing) return "create";
  if (typeof existing.source_hash === "string" && existing.source_hash === incoming.source_hash) {
    return "skip";
  }
  return "update";
}
