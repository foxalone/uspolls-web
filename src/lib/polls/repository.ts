import type { DocumentData, DocumentReference, Firestore } from "firebase-admin/firestore";
import {
  FIRESTORE_GETALL_CHUNK,
  FIRESTORE_WRITE_CHUNK,
  POLLS_COLLECTION,
  RACES_COLLECTION,
  SYSTEM_COLLECTION,
  VOTEHUB_SYNC_DOC,
} from "../votehub/constants";
import { votehubLog } from "../votehub/log";
import type { RaceIndexDoc, StoredPoll, VoteHubSyncDoc } from "../votehub/types";

/** Firestore document paths cannot contain `/`; VoteHub IDs sometimes do. */
export function firestoreDocumentId(id: string): string {
  return id.replaceAll("/", "%2F");
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function syncRef(db: Firestore) {
  return db.collection(SYSTEM_COLLECTION).doc(VOTEHUB_SYNC_DOC);
}

export async function readVoteHubSync(db: Firestore): Promise<VoteHubSyncDoc | null> {
  const snap = await syncRef(db).get();
  return snap.exists ? (snap.data() as VoteHubSyncDoc) : null;
}

export async function writeVoteHubSync(db: Firestore, data: VoteHubSyncDoc) {
  await syncRef(db).set(data, { merge: true });
}

export function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const clean = { ...value };
  for (const key of Object.keys(clean)) {
    if (clean[key] === undefined) delete clean[key];
  }
  return clean;
}

export async function loadExistingPolls(
  db: Firestore,
  ids: string[],
): Promise<Map<string, DocumentData>> {
  const existing = new Map<string, DocumentData>();
  for (const group of chunk(ids, FIRESTORE_GETALL_CHUNK)) {
    const refs = group.map((id) => pollDocRef(db, id));
    const snaps = await db.getAll(...refs);
    for (let i = 0; i < snaps.length; i += 1) {
      const snap = snaps[i];
      if (snap.exists) existing.set(group[i], snap.data() ?? {});
    }
  }
  return existing;
}

export async function loadExistingRaces(
  db: Firestore,
  raceKeys: string[],
): Promise<Map<string, RaceIndexDoc>> {
  const existing = new Map<string, RaceIndexDoc>();
  for (const group of chunk(raceKeys, FIRESTORE_GETALL_CHUNK)) {
    const refs = group.map((key) => db.collection(RACES_COLLECTION).doc(key));
    const snaps = await db.getAll(...refs);
    for (const snap of snaps) {
      if (snap.exists) existing.set(snap.id, snap.data() as RaceIndexDoc);
    }
  }
  return existing;
}

export async function commitWrites(
  db: Firestore,
  writes: Array<{ ref: DocumentReference; data: Record<string, unknown> }>,
): Promise<{ written: number; failed: number }> {
  let written = 0;
  let failed = 0;

  for (const group of chunk(writes, FIRESTORE_WRITE_CHUNK)) {
    const batch = db.batch();
    for (const item of group) {
      batch.set(item.ref, stripUndefined(item.data), { merge: true });
    }
    try {
      await batch.commit();
      written += group.length;
    } catch (error) {
      failed += group.length;
      votehubLog("error", "firestore_batch_failed", {
        size: group.length,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { written, failed };
}

export function pollDocRef(db: Firestore, id: string) {
  return db.collection(POLLS_COLLECTION).doc(firestoreDocumentId(id));
}

export function raceDocRef(db: Firestore, raceKey: string) {
  return db.collection(RACES_COLLECTION).doc(raceKey);
}

export function buildRaceIndexUpdate(input: {
  existing: RaceIndexDoc | undefined;
  poll: StoredPoll;
  created: boolean;
  nowIso: string;
}): RaceIndexDoc {
  const lastPollDate = [input.existing?.last_poll_date, input.poll.end_date]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  return {
    race_key: input.poll.race_key,
    election_year: input.poll.election_year,
    race_type: input.poll.race_type,
    state: input.poll.state,
    district: input.poll.district,
    subject: input.poll.subject || input.existing?.subject || null,
    last_poll_date: lastPollDate,
    poll_count: (input.existing?.poll_count ?? 0) + (input.created ? 1 : 0),
    updated_at: input.nowIso,
  };
}

export function raceNeedsWrite(incoming: RaceIndexDoc, existing: RaceIndexDoc | undefined) {
  if (!existing) return true;
  return (
    existing.poll_count !== incoming.poll_count ||
    existing.last_poll_date !== incoming.last_poll_date ||
    existing.subject !== incoming.subject ||
    existing.election_year !== incoming.election_year ||
    existing.race_type !== incoming.race_type ||
    existing.state !== incoming.state ||
    existing.district !== incoming.district
  );
}
