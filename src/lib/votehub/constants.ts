export const VOTEHUB_SOURCE = "votehub" as const;

export const DEFAULT_VOTEHUB_API_BASE = "https://api.votehub.com";

export const BOOTSTRAP_FROM_DATE = "2025-01-01";

export const INCREMENTAL_OVERLAP_DAYS = 3;

export const HTTP_TIMEOUT_MS = 20_000;

export const HTTP_MAX_RETRIES = 4;

export const FIRESTORE_GETALL_CHUNK = 100;

export const FIRESTORE_WRITE_CHUNK = 400;

export const SYNC_LOCK_STALE_MS = 50 * 60 * 1000;

export const POLLS_ISR_REVALIDATE_SECONDS = 60 * 60;

export const POLLS_MEMORY_CACHE_TTL_MS = 10 * 60 * 1000;

export const TARGET_POLL_TYPES = [
  "generic-ballot",
  "us-senator",
  "us-representative",
  "governor",
  "approval",
] as const;

export type TargetPollType = (typeof TARGET_POLL_TYPES)[number];

export const TRUMP_APPROVAL_SUBJECT_SLUG = "donald-trump";

export const GENERIC_BALLOT_RACE_KEY = "2026-generic-ballot";

export const TRUMP_APPROVAL_RACE_KEY = "trump-approval";

export const POLLS_COLLECTION = "polls";

export const RACES_COLLECTION = "races";

export const SYSTEM_COLLECTION = "system";

export const VOTEHUB_SYNC_DOC = "votehub_sync";
