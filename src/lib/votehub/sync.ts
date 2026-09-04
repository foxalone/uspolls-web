import type { DocumentReference } from "firebase-admin/firestore";
import { getFirestoreDb } from "../firebase/admin";
import {
  buildRaceIndexUpdate,
  commitWrites,
  loadExistingPolls,
  loadExistingRaces,
  pollDocRef,
  raceDocRef,
  raceNeedsWrite,
  readVoteHubSync,
  writeVoteHubSync,
} from "../polls/repository";
import {
  INCREMENTAL_OVERLAP_DAYS,
  SYNC_LOCK_STALE_MS,
  TARGET_POLL_TYPES,
} from "./constants";
import { fetchVoteHubPollTypes, fetchVoteHubPolls, fetchVoteHubSubjects } from "./client";
import { resolveSyncFromDate } from "./dates";
import { discoverMvpSubjects, voteHubQueryPlan } from "./discover";
import { votehubLog } from "./log";
import { mapVoteHubPoll, pollNeedsWrite } from "./mapPoll";
import { isTarget2026Poll } from "./normalize";
import type { RaceIndexDoc, StoredPoll, SyncOptions, SyncResult, VoteHubPoll, VoteHubSyncDoc } from "./types";

function emptyResult(
  partial: Partial<SyncResult> & Pick<SyncResult, "status" | "mode" | "from_date">,
): SyncResult {
  return {
    ok: partial.status === "success",
    polls_fetched: 0,
    polls_processed: 0,
    polls_created: 0,
    polls_updated: 0,
    polls_skipped: 0,
    polls_rejected: 0,
    races_updated: 0,
    skipped_overlap: false,
    error: null,
    duration_ms: 0,
    ...partial,
  };
}

function isLockFresh(sync: VoteHubSyncDoc | null) {
  if (!sync || sync.status !== "running" || !sync.last_attempt) return false;
  const started = Date.parse(sync.last_attempt);
  return Number.isFinite(started) && Date.now() - started < SYNC_LOCK_STALE_MS;
}

function dedupePolls(polls: VoteHubPoll[]): VoteHubPoll[] {
  const byId = new Map<string, VoteHubPoll>();
  for (const poll of polls) {
    if (typeof poll.id !== "string" || !poll.id.trim()) continue;
    byId.set(poll.id.trim(), poll);
  }
  return [...byId.values()];
}

async function fetchRelevantPolls(fromDate: string) {
  let pollTypes: string[] = [];
  try {
    pollTypes = await fetchVoteHubPollTypes();
    const missingTypes = TARGET_POLL_TYPES.filter((type) => !pollTypes.includes(type));
    if (missingTypes.length) {
      votehubLog("warn", "votehub_poll_types_missing", { missingTypes, pollTypes });
    }
  } catch (error) {
    votehubLog("warn", "votehub_poll_types_unavailable", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const subjects = await fetchVoteHubSubjects();
    const discovered = discoverMvpSubjects(subjects);
    votehubLog("info", "votehub_subjects_discovered", {
      subjects: discovered.length,
      fromDate,
    });
  } catch (error) {
    votehubLog("warn", "votehub_subjects_unavailable", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const fetched: VoteHubPoll[] = [];
  const errors: string[] = [];

  for (const query of voteHubQueryPlan()) {
    try {
      const rows = await fetchVoteHubPolls({
        poll_type: query.poll_type,
        from_date: fromDate,
        ...(query.subject ? { subject: query.subject } : {}),
      });
      fetched.push(...rows);
      votehubLog("info", "votehub_polls_fetched", {
        poll_type: query.poll_type,
        subject: query.subject ?? null,
        count: rows.length,
        from_date: fromDate,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${query.poll_type}: ${message}`);
      votehubLog("error", "votehub_polls_fetch_failed", {
        poll_type: query.poll_type,
        error: message,
      });
    }
  }

  const relevant = dedupePolls(fetched).filter(isTarget2026Poll);
  return { relevant, fetched: fetched.length, errors };
}

export async function runVoteHubSync(options: SyncOptions = {}): Promise<SyncResult> {
  const started = Date.now();
  const nowIso = new Date().toISOString();
  const db = options.dryRun ? null : getFirestoreDb();
  const existingSync = db ? await readVoteHubSync(db) : null;

  if (db && isLockFresh(existingSync)) {
    votehubLog("warn", "votehub_sync_locked", { last_attempt: existingSync?.last_attempt });
    return emptyResult({
      ok: true,
      status: "running",
      mode: existingSync?.mode === "bootstrap" ? "bootstrap" : "incremental",
      from_date: existingSync?.from_date ?? "",
      skipped_overlap: true,
      duration_ms: Date.now() - started,
    });
  }

  const { fromDate, mode } = resolveSyncFromDate({
    bootstrap: options.bootstrap,
    fromDate: options.fromDate,
    sync: existingSync,
    overlapDays: Number(process.env.VOTEHUB_INCREMENTAL_OVERLAP_DAYS) || INCREMENTAL_OVERLAP_DAYS,
  });

  if (db) {
    await writeVoteHubSync(db, {
      last_successful_sync: existingSync?.last_successful_sync ?? null,
      last_attempt: nowIso,
      polls_processed: 0,
      polls_created: 0,
      polls_updated: 0,
      polls_skipped: 0,
      polls_rejected: 0,
      races_updated: 0,
      from_date: fromDate,
      mode,
      status: "running",
      error: null,
    });
  }

  try {
    const fetched = await fetchRelevantPolls(fromDate);
    const mapped: StoredPoll[] = [];
    let rejected = 0;

    for (const poll of fetched.relevant) {
      const doc = mapVoteHubPoll(poll, nowIso);
      if (!doc) {
        rejected += 1;
        votehubLog("warn", "votehub_poll_rejected", {
          id: typeof poll.id === "string" ? poll.id : null,
          subject: poll.subject ?? null,
          poll_type: poll.poll_type ?? null,
        });
        continue;
      }
      mapped.push(doc);
    }

    if (options.dryRun) {
      const result = emptyResult({
        ok: fetched.errors.length === 0,
        status: fetched.errors.length ? "partial" : "success",
        mode,
        from_date: fromDate,
        polls_fetched: fetched.fetched,
        polls_processed: mapped.length,
        polls_rejected: rejected,
        error: fetched.errors.length ? fetched.errors.join("; ") : null,
        duration_ms: Date.now() - started,
      });
      votehubLog("info", "votehub_sync_dry_run", result);
      return result;
    }

    if (!db) throw new Error("Firestore is not initialized");

    const existingPolls = await loadExistingPolls(
      db,
      mapped.map((poll) => poll.id),
    );

    type Write = { ref: DocumentReference; data: Record<string, unknown> };
    const writes: Write[] = [];
    const touchedRaces = new Map<string, { created: number; sample: StoredPoll }>();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const poll of mapped) {
      const existing = existingPolls.get(poll.id);
      const action = pollNeedsWrite(poll, existing);
      if (action === "skip") {
        skipped += 1;
        continue;
      }

      const stored: StoredPoll = {
        ...poll,
        imported_at:
          action === "update" && typeof existing?.imported_at === "string"
            ? existing.imported_at
            : poll.imported_at,
        updated_at: nowIso,
      };

      writes.push({ ref: pollDocRef(db, stored.id), data: stored });
      if (action === "create") created += 1;
      else updated += 1;

      const race = touchedRaces.get(stored.race_key) ?? { created: 0, sample: stored };
      if (action === "create") race.created += 1;
      if (!race.sample.end_date || (stored.end_date && stored.end_date >= race.sample.end_date)) {
        race.sample = stored;
      }
      touchedRaces.set(stored.race_key, race);
    }

    const existingRaces = await loadExistingRaces(db, [...touchedRaces.keys()]);
    const finalRaces: RaceIndexDoc[] = [];

    for (const [raceKey, touch] of touchedRaces) {
      const existingRace = existingRaces.get(raceKey);
      const incoming = buildRaceIndexUpdate({
        existing: existingRace,
        poll: touch.sample,
        created: touch.created > 0,
        nowIso,
      });
      incoming.poll_count = (existingRace?.poll_count ?? 0) + touch.created;
      if (!raceNeedsWrite(incoming, existingRace)) continue;
      finalRaces.push(incoming);
      writes.push({ ref: raceDocRef(db, raceKey), data: incoming });
    }

    const committed = await commitWrites(db, writes);
    const writeFailures = committed.failed;
    const status: VoteHubSyncDoc["status"] =
      fetched.errors.length || writeFailures ? "partial" : "success";
    const error =
      [...fetched.errors, writeFailures ? `${writeFailures} Firestore writes failed` : null]
        .filter(Boolean)
        .join("; ") || null;

    await writeVoteHubSync(db, {
      last_successful_sync:
        status === "success" ? nowIso : existingSync?.last_successful_sync ?? null,
      last_attempt: nowIso,
      polls_processed: mapped.length,
      polls_created: created,
      polls_updated: updated,
      polls_skipped: skipped,
      polls_rejected: rejected,
      races_updated: finalRaces.length,
      from_date: fromDate,
      mode,
      status,
      error,
    });

    const result: SyncResult = {
      ok: status === "success",
      status,
      mode,
      from_date: fromDate,
      polls_fetched: fetched.fetched,
      polls_processed: mapped.length,
      polls_created: created,
      polls_updated: updated,
      polls_skipped: skipped,
      polls_rejected: rejected,
      races_updated: finalRaces.length,
      skipped_overlap: false,
      error,
      duration_ms: Date.now() - started,
    };
    votehubLog("info", "votehub_sync_complete", result);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (db) {
      await writeVoteHubSync(db, {
        last_successful_sync: existingSync?.last_successful_sync ?? null,
        last_attempt: nowIso,
        polls_processed: existingSync?.polls_processed ?? 0,
        polls_created: existingSync?.polls_created ?? 0,
        polls_updated: existingSync?.polls_updated ?? 0,
        polls_skipped: existingSync?.polls_skipped ?? 0,
        polls_rejected: existingSync?.polls_rejected ?? 0,
        races_updated: existingSync?.races_updated ?? 0,
        from_date: fromDate,
        mode,
        status: "error",
        error: message,
      });
    }
    votehubLog("error", "votehub_sync_failed", { error: message, mode, fromDate });
    return emptyResult({
      ok: false,
      status: "error",
      mode,
      from_date: fromDate,
      error: message,
      duration_ms: Date.now() - started,
    });
  }
}
