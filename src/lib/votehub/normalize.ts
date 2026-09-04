import {
  GENERIC_BALLOT_RACE_KEY,
  TRUMP_APPROVAL_RACE_KEY,
  TRUMP_APPROVAL_SUBJECT_SLUG,
} from "./constants";
import type { NormalizedRace, RaceType, VoteHubPoll } from "./types";

const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: "al",
  alaska: "ak",
  arizona: "az",
  arkansas: "ar",
  california: "ca",
  colorado: "co",
  connecticut: "ct",
  delaware: "de",
  "district of columbia": "dc",
  florida: "fl",
  georgia: "ga",
  hawaii: "hi",
  idaho: "id",
  illinois: "il",
  indiana: "in",
  iowa: "ia",
  kansas: "ks",
  kentucky: "ky",
  louisiana: "la",
  maine: "me",
  maryland: "md",
  massachusetts: "ma",
  michigan: "mi",
  minnesota: "mn",
  mississippi: "ms",
  missouri: "mo",
  montana: "mt",
  nebraska: "ne",
  nevada: "nv",
  "new hampshire": "nh",
  "new jersey": "nj",
  "new mexico": "nm",
  "new york": "ny",
  "north carolina": "nc",
  "north dakota": "nd",
  ohio: "oh",
  oklahoma: "ok",
  oregon: "or",
  pennsylvania: "pa",
  "rhode island": "ri",
  "south carolina": "sc",
  "south dakota": "sd",
  tennessee: "tn",
  texas: "tx",
  utah: "ut",
  vermont: "vt",
  virginia: "va",
  washington: "wa",
  "west virginia": "wv",
  wisconsin: "wi",
  wyoming: "wy",
};

const STATE_NAMES_BY_LENGTH = Object.keys(STATE_NAME_TO_CODE).sort(
  (a, b) => b.length - a.length,
);

const STATE_CODE_SET = new Set(Object.values(STATE_NAME_TO_CODE));

const DISTRICT_RE = /^([A-Za-z]{2})-(\d{1,2})$/;
const YEAR_PREFIX_RE = /^(\d{4})(?:\s+(.+))?$/;

export function slugifySubject(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

export function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function padDistrict(value: string): string {
  return value.padStart(2, "0");
}

function parseDistrictToken(token: string): { state: string; district: string } | null {
  const match = token.trim().match(DISTRICT_RE);
  if (!match) return null;
  const state = match[1].toLowerCase();
  if (!STATE_CODE_SET.has(state)) return null;
  return { state, district: padDistrict(match[2]) };
}

function parseStateAndQualifier(rest: string): { state: string; qualifier: string | null } | null {
  const normalized = rest.trim().toLowerCase().replace(/\s+/g, " ");
  for (const name of STATE_NAMES_BY_LENGTH) {
    if (normalized === name) {
      return { state: STATE_NAME_TO_CODE[name], qualifier: null };
    }
    if (normalized.startsWith(`${name} `)) {
      const qualifier = slugifySubject(normalized.slice(name.length).trim());
      return { state: STATE_NAME_TO_CODE[name], qualifier: qualifier || null };
    }
  }

  const codeMatch = normalized.match(/^([a-z]{2})(?:\s+(.+))?$/);
  if (codeMatch && STATE_CODE_SET.has(codeMatch[1])) {
    return {
      state: codeMatch[1],
      qualifier: codeMatch[2] ? slugifySubject(codeMatch[2]) : null,
    };
  }

  return null;
}

function raceTypeFromPollType(pollType: string): RaceType | null {
  switch (pollType) {
    case "us-senator":
      return "senate";
    case "us-representative":
      return "house";
    case "governor":
      return "governor";
    case "generic-ballot":
      return "generic_ballot";
    case "approval":
      return "presidential_approval";
    default:
      return null;
  }
}

function buildRaceKey(parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part && part.length))
    .join("-");
}

export function normalizeRace(input: {
  poll_type?: unknown;
  subject?: unknown;
  seat_name?: unknown;
}): NormalizedRace | null {
  const pollType = asTrimmedString(input.poll_type);
  const subject = asTrimmedString(input.subject);
  const seatName = asTrimmedString(input.seat_name);
  if (!pollType || !subject) return null;

  const raceType = raceTypeFromPollType(pollType);
  if (!raceType) return null;

  if (raceType === "generic_ballot") {
    const yearMatch = subject.match(/^(\d{4})$/);
    if (!yearMatch) return null;
    const electionYear = Number(yearMatch[1]);
    return {
      election_year: electionYear,
      race_type: "generic_ballot",
      state: null,
      district: null,
      qualifier: null,
      race_key: electionYear === 2026 ? GENERIC_BALLOT_RACE_KEY : `${electionYear}-generic-ballot`,
    };
  }

  if (raceType === "presidential_approval") {
    if (slugifySubject(subject) !== TRUMP_APPROVAL_SUBJECT_SLUG) return null;
    return {
      election_year: null,
      race_type: "presidential_approval",
      state: null,
      district: null,
      qualifier: null,
      race_key: TRUMP_APPROVAL_RACE_KEY,
    };
  }

  const yearMatch = subject.match(YEAR_PREFIX_RE);
  const electionYear = yearMatch ? Number(yearMatch[1]) : null;
  const rest = yearMatch?.[2]?.trim() || (yearMatch ? "" : subject);

  const districtFromSubject = rest ? parseDistrictToken(rest) : null;
  const districtFromSeat = seatName ? parseDistrictToken(seatName) : null;
  const district = districtFromSubject ?? (raceType === "house" ? districtFromSeat : null);

  if (raceType === "house" && district) {
    return {
      election_year: electionYear,
      race_type: "house",
      state: district.state,
      district: district.district,
      qualifier: null,
      race_key: buildRaceKey([
        electionYear ? String(electionYear) : null,
        "house",
        district.state,
        district.district,
      ]),
    };
  }

  if (!rest) return null;
  const parsed = parseStateAndQualifier(rest);
  if (!parsed) return null;

  return {
    election_year: electionYear,
    race_type: raceType,
    state: parsed.state,
    district: null,
    qualifier: parsed.qualifier,
    race_key: buildRaceKey([
      electionYear ? String(electionYear) : null,
      raceType,
      parsed.state,
      parsed.qualifier,
    ]),
  };
}

export function isTarget2026Poll(poll: Pick<VoteHubPoll, "poll_type" | "subject" | "seat_name">): boolean {
  const normalized = normalizeRace(poll);
  if (!normalized) return false;
  if (normalized.race_type === "presidential_approval") return true;
  return normalized.election_year === 2026;
}
