import { BOOTSTRAP_FROM_DATE, INCREMENTAL_OVERLAP_DAYS } from "./constants";
import type { VoteHubSyncDoc } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  return DATE_RE.test(value);
}

export function formatDateUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function subtractDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return BOOTSTRAP_FROM_DATE;
  date.setUTCDate(date.getUTCDate() - days);
  return formatDateUtc(date);
}

export function dateFromTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isIsoDate(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return formatDateUtc(parsed);
}

export function resolveSyncFromDate(input: {
  bootstrap?: boolean;
  fromDate?: string;
  sync?: VoteHubSyncDoc | null;
  overlapDays?: number;
}): { fromDate: string; mode: "bootstrap" | "incremental" } {
  if (input.fromDate && isIsoDate(input.fromDate)) {
    return {
      fromDate: input.fromDate,
      mode: input.bootstrap || !input.sync?.last_successful_sync ? "bootstrap" : "incremental",
    };
  }

  if (input.bootstrap || !input.sync?.last_successful_sync) {
    return { fromDate: BOOTSTRAP_FROM_DATE, mode: "bootstrap" };
  }

  const last = dateFromTimestamp(input.sync.last_successful_sync) ?? BOOTSTRAP_FROM_DATE;
  return {
    fromDate: subtractDays(last, input.overlapDays ?? INCREMENTAL_OVERLAP_DAYS),
    mode: "incremental",
  };
}
