import { unstable_cache } from "next/cache";
import {
  POLLS_COLLECTION,
  POLLS_ISR_REVALIDATE_SECONDS,
  POLLS_MEMORY_CACHE_TTL_MS,
  RACES_COLLECTION,
} from "../votehub/constants";
import { getFirestoreDb } from "../firebase/admin";
import type { RaceIndexDoc, RaceType, StoredPoll } from "../votehub/types";

if (typeof window !== "undefined") {
  throw new Error("src/lib/polls/cachedQuery is server-only");
}

export { POLLS_ISR_REVALIDATE_SECONDS };

type CacheEntry<T> = { expires: number; value: T };

const memoryCache = new Map<string, CacheEntry<unknown>>();

function readCache<T>(key: string): T | undefined {
  const hit = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!hit) return undefined;
  if (hit.expires <= Date.now()) {
    memoryCache.delete(key);
    return undefined;
  }
  return hit.value;
}

function writeCache<T>(key: string, value: T, ttlMs = POLLS_MEMORY_CACHE_TTL_MS) {
  memoryCache.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

export function clearPollsMemoryCache() {
  memoryCache.clear();
}

function cached<T>(key: string, tags: string[], loader: () => Promise<T>): Promise<T> {
  return unstable_cache(
    async () => {
      const hit = readCache<T>(key);
      if (hit !== undefined) return hit;
      return writeCache(key, await loader());
    },
    [key, ...tags],
    { revalidate: POLLS_ISR_REVALIDATE_SECONDS },
  )();
}

export function getCachedPollsByRaceKey(raceKey: string, limit = 100): Promise<StoredPoll[]> {
  return cached(`polls:race:${raceKey}:${limit}`, ["votehub-polls"], async () => {
    const snap = await getFirestoreDb()
      .collection(POLLS_COLLECTION)
      .where("race_key", "==", raceKey)
      .orderBy("end_date", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((doc) => doc.data() as StoredPoll);
  });
}

export function getCachedPollsByRaceType(raceType: RaceType, limit = 50): Promise<StoredPoll[]> {
  return cached(`polls:type:${raceType}:${limit}`, ["votehub-polls"], async () => {
    const snap = await getFirestoreDb()
      .collection(POLLS_COLLECTION)
      .where("race_type", "==", raceType)
      .orderBy("end_date", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((doc) => doc.data() as StoredPoll);
  });
}

export function getCachedPollsByYearAndType(
  electionYear: number,
  raceType: RaceType,
  limit = 50,
): Promise<StoredPoll[]> {
  return cached(`polls:year:${electionYear}:${raceType}:${limit}`, ["votehub-polls"], async () => {
    const snap = await getFirestoreDb()
      .collection(POLLS_COLLECTION)
      .where("election_year", "==", electionYear)
      .where("race_type", "==", raceType)
      .orderBy("end_date", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((doc) => doc.data() as StoredPoll);
  });
}

export function getCachedRace(raceKey: string): Promise<RaceIndexDoc | null> {
  return cached(`race:${raceKey}`, ["votehub-races"], async () => {
    const snap = await getFirestoreDb().collection(RACES_COLLECTION).doc(raceKey).get();
    return snap.exists ? (snap.data() as RaceIndexDoc) : null;
  });
}

export function getCachedRacesByType(raceType: RaceType, limit = 100): Promise<RaceIndexDoc[]> {
  return cached(`races:type:${raceType}:${limit}`, ["votehub-races"], async () => {
    const snap = await getFirestoreDb().collection(RACES_COLLECTION).where("race_type", "==", raceType).get();
    return snap.docs
      .map((doc) => doc.data() as RaceIndexDoc)
      .sort((a, b) => (b.last_poll_date || "").localeCompare(a.last_poll_date || ""))
      .slice(0, limit);
  });
}
