import type { StoredPoll, StoredPollAnswer } from "../votehub/types";

const DEM_ALIASES = new Set(["dem", "democrat", "democratic", "d"]);
const GOP_ALIASES = new Set(["rep", "gop", "republican", "r", "repub"]);
const APPROVE_ALIASES = new Set(["approve", "approved", "approval"]);
const DISAPPROVE_ALIASES = new Set(["disapprove", "disapproved", "disapproval"]);

export type PublicAnswer = {
  choice: string;
  pct: number | null;
};

export type PublicPollRow = {
  id: string;
  race_key: string;
  race_type: string;
  subject: string;
  pollster: string | null;
  population: string | null;
  sample_size: number | null;
  start_date: string | null;
  end_date: string | null;
  partisan: string | null;
  internal: boolean | null;
  source_url: string | null;
  answers: PublicAnswer[];
};

export type GenericBallotSummary = {
  dem: number;
  gop: number;
  other: number;
  margin: number;
  pollCount: number;
  latestEndDate: string | null;
};

export type ApprovalSummary = {
  approve: number;
  disapprove: number;
  pollCount: number;
  latestEndDate: string | null;
};

function normChoice(value: string | null) {
  return (value || "").trim().toLowerCase();
}

export function answerPct(answers: StoredPollAnswer[], aliases: Set<string>): number | null {
  const hits = answers.filter((answer) => aliases.has(normChoice(answer.choice)));
  if (!hits.length) return null;
  const values = hits.map((answer) => answer.pct).filter((value): value is number => value != null);
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function summarizeGenericBallot(polls: StoredPoll[], windowSize = 10): GenericBallotSummary | null {
  const recent = polls.slice(0, windowSize);
  const dems: number[] = [];
  const gops: number[] = [];
  for (const poll of recent) {
    const dem = answerPct(poll.answers, DEM_ALIASES);
    const gop = answerPct(poll.answers, GOP_ALIASES);
    if (dem == null || gop == null) continue;
    dems.push(dem);
    gops.push(gop);
  }
  if (!dems.length) return null;
  const dem = round1(average(dems));
  const gop = round1(average(gops));
  return {
    dem,
    gop,
    other: round1(Math.max(0, 100 - dem - gop)),
    margin: round1(dem - gop),
    pollCount: dems.length,
    latestEndDate: recent[0]?.end_date ?? null,
  };
}

export function summarizeApproval(polls: StoredPoll[], windowSize = 10): ApprovalSummary | null {
  const recent = polls.slice(0, windowSize);
  const approve: number[] = [];
  const disapprove: number[] = [];
  for (const poll of recent) {
    const up = answerPct(poll.answers, APPROVE_ALIASES);
    const down = answerPct(poll.answers, DISAPPROVE_ALIASES);
    if (up == null || down == null) continue;
    approve.push(up);
    disapprove.push(down);
  }
  if (!approve.length) return null;
  return {
    approve: round1(average(approve)),
    disapprove: round1(average(disapprove)),
    pollCount: approve.length,
    latestEndDate: recent[0]?.end_date ?? null,
  };
}

export function toPublicPollRow(poll: StoredPoll): PublicPollRow {
  return {
    id: poll.id,
    race_key: poll.race_key,
    race_type: poll.race_type,
    subject: poll.subject,
    pollster: poll.pollster,
    population: poll.population,
    sample_size: poll.sample_size,
    start_date: poll.start_date,
    end_date: poll.end_date,
    partisan: poll.partisan,
    internal: poll.internal,
    source_url: poll.source_url || poll.url,
    answers: (poll.answers || []).map((answer) => ({
      choice: answer.choice || "—",
      pct: answer.pct,
    })),
  };
}

export function formatMargin(margin: number) {
  if (margin > 0) return `D+${margin.toFixed(1)}`;
  if (margin < 0) return `R+${Math.abs(margin).toFixed(1)}`;
  return "Tied";
}

export type HomePollSnapshot = {
  genericBallot: GenericBallotSummary | null;
  trumpApproval: ApprovalSummary | null;
  latest: PublicPollRow[];
  raceCounts: {
    senate: number;
    house: number;
    governor: number;
  };
};

export function emptyHomePollSnapshot(): HomePollSnapshot {
  return {
    genericBallot: null,
    trumpApproval: null,
    latest: [],
    raceCounts: { senate: 0, house: 0, governor: 0 },
  };
}

export function raceTypeLabel(raceType: string) {
  switch (raceType) {
    case "senate":
      return "Senate";
    case "house":
      return "House";
    case "governor":
      return "Governor";
    case "generic_ballot":
      return "Generic ballot";
    case "presidential_approval":
      return "Trump approval";
    default:
      return raceType;
  }
}
