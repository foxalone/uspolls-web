import type { TargetPollType } from "./constants";

export type VoteHubPollType = TargetPollType | (string & {});

export type VoteHubAnswer = {
  choice?: unknown;
  pct?: unknown;
  [key: string]: unknown;
};

export type VoteHubPoll = {
  id?: unknown;
  poll_type?: unknown;
  subject?: unknown;
  seat_name?: unknown;
  pollster?: unknown;
  sample_size?: unknown;
  population?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  created_at?: unknown;
  answers?: unknown;
  sponsors?: unknown;
  internal?: unknown;
  partisan?: unknown;
  url?: unknown;
  [key: string]: unknown;
};

export type VoteHubSubject = {
  subject?: unknown;
  poll_types?: unknown;
};

export type RaceType =
  | "senate"
  | "house"
  | "governor"
  | "generic_ballot"
  | "presidential_approval";

export type NormalizedRace = {
  election_year: number | null;
  race_type: RaceType;
  state: string | null;
  district: string | null;
  race_key: string;
  qualifier: string | null;
};

export type StoredPollAnswer = {
  choice: string | null;
  pct: number | null;
  [key: string]: unknown;
};

export type StoredPoll = {
  id: string;
  poll_type: string;
  subject: string;
  seat_name: string | null;
  pollster: string | null;
  sample_size: number | null;
  population: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  answers: StoredPollAnswer[];
  sponsors: string[];
  internal: boolean | null;
  partisan: string | null;
  url: string | null;
  source_url: string | null;
  source: "votehub";
  election_year: number | null;
  race_type: RaceType;
  state: string | null;
  district: string | null;
  race_key: string;
  source_hash: string;
  imported_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type RaceIndexDoc = {
  race_key: string;
  election_year: number | null;
  race_type: RaceType;
  state: string | null;
  district: string | null;
  subject: string | null;
  last_poll_date: string | null;
  poll_count: number;
  updated_at: string;
};

export type VoteHubSyncDoc = {
  last_successful_sync: string | null;
  last_attempt: string | null;
  polls_processed: number;
  polls_created: number;
  polls_updated: number;
  polls_skipped: number;
  polls_rejected: number;
  races_updated: number;
  from_date: string | null;
  mode: "bootstrap" | "incremental" | null;
  status: "idle" | "running" | "success" | "partial" | "error";
  error: string | null;
};

export type SyncTrigger = "cron" | "admin" | "cli";

export type SyncOptions = {
  bootstrap?: boolean;
  fromDate?: string;
  dryRun?: boolean;
  trigger?: SyncTrigger;
};

export type SyncResult = {
  ok: boolean;
  status: VoteHubSyncDoc["status"];
  mode: "bootstrap" | "incremental";
  from_date: string;
  polls_fetched: number;
  polls_processed: number;
  polls_created: number;
  polls_updated: number;
  polls_skipped: number;
  polls_rejected: number;
  races_updated: number;
  skipped_overlap: boolean;
  error: string | null;
  duration_ms: number;
};
