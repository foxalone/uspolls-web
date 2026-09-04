import { getFirestoreDb } from "../firebase/admin";
import { POLLS_COLLECTION, SYSTEM_COLLECTION, VOTEHUB_SYNC_DOC } from "../votehub/constants";
import type { StoredPoll, VoteHubSyncDoc } from "../votehub/types";
import { toPublicPollRow, type PublicPollRow } from "./summarize";

const ADMIN_RAW_LIMIT = 250;

export type AdminRawSnapshot = {
  polls: PublicPollRow[];
  raw: Record<string, unknown>[];
  sync: VoteHubSyncDoc | null;
};

export async function getAdminRawSnapshot(): Promise<AdminRawSnapshot> {
  const db = getFirestoreDb();
  const [pollSnap, syncSnap] = await Promise.all([
    db.collection(POLLS_COLLECTION).orderBy("end_date", "desc").limit(ADMIN_RAW_LIMIT).get(),
    db.collection(SYSTEM_COLLECTION).doc(VOTEHUB_SYNC_DOC).get(),
  ]);

  const stored = pollSnap.docs.map((doc) => doc.data() as StoredPoll);
  return {
    polls: stored.map(toPublicPollRow),
    raw: stored.map((poll) => ({ ...poll })),
    sync: syncSnap.exists ? (syncSnap.data() as VoteHubSyncDoc) : null,
  };
}
