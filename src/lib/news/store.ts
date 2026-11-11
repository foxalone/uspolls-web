import { getFirestoreDb } from "../firebase/admin";
import { sortKeyFor } from "./text";
import type { AcceptedNews, NewsImage, NewsPage, PublicNewsCard } from "./types";

const PUBLISHED = "presidential_news";
const SEEN = "presidential_news_seen";
const LOCK = "presidential_news_sync";

function publishedCollection() {
  return getFirestoreDb().collection(PUBLISHED);
}

export async function lockNewsRun() {
  const ref = getFirestoreDb().collection("system").doc(LOCK);
  const snap = await ref.get();
  const data = snap.data();
  const started = typeof data?.last_attempt === "string" ? Date.parse(data.last_attempt) : 0;
  if (data?.status === "running" && Date.now() - started < 10 * 60 * 1000) return false;
  await ref.set({ status: "running", last_attempt: new Date().toISOString() });
  return true;
}

export async function finishNewsRun(status: "ok" | "error", detail: string) {
  await getFirestoreDb().collection("system").doc(LOCK).set({
    status,
    last_attempt: new Date().toISOString(),
    detail: detail.slice(0, 300),
  });
}

export async function recentNews(limit: number) {
  const snap = await publishedCollection().orderBy("sortKey", "desc").limit(limit).get();
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      headline: typeof data.headline?.en === "string" ? data.headline.en : "",
      titleKey: typeof data.titleKey === "string" ? data.titleKey : "",
    };
  });
}

export async function seenNewsIds(ids: string[]) {
  const seen = new Set<string>();
  if (ids.length === 0) return seen;
  const db = getFirestoreDb();
  const snaps = await Promise.all(ids.map((id) => db.collection(SEEN).doc(id).get()));
  for (const snap of snaps) {
    if (snap.exists) seen.add(snap.id);
  }
  return seen;
}

export async function saveNewsRun(input: {
  accepted: { news: AcceptedNews; image: NewsImage | null }[];
  seen: { id: string; titleKey: string; status: "published" | "rejected" | "duplicate" }[];
}) {
  const db = getFirestoreDb();
  const batch = db.batch();
  for (const row of input.accepted) {
    const { item, headline, teaser, people, topic } = row.news;
    const card = {
      url: item.url,
      source: item.source,
      publishedAt: item.publishedAt,
      headline,
      teaser,
      topic,
      people,
      image: row.image,
      titleKey: item.titleKey,
      sortKey: sortKeyFor(item.publishedAt, item.id),
    };
    batch.set(db.collection(PUBLISHED).doc(item.id), card);
  }
  for (const row of input.seen) {
    batch.set(db.collection(SEEN).doc(row.id), {
      status: row.status,
      titleKey: row.titleKey,
      at: new Date().toISOString(),
    });
  }
  if (input.accepted.length > 0 || input.seen.length > 0) await batch.commit();
}

function textPair(value: { en?: unknown; es?: unknown } | undefined) {
  return {
    en: typeof value?.en === "string" ? value.en : "",
    es: typeof value?.es === "string" ? value.es : "",
  };
}

function asCard(id: string, data: Record<string, unknown> & { image?: { url?: unknown; author?: unknown; page?: unknown }; headline?: { en?: unknown; es?: unknown }; teaser?: { en?: unknown; es?: unknown }; body?: { en?: unknown; es?: unknown } }): PublicNewsCard | null {
  const image = data.image && typeof data.image.url === "string" ? {
    url: data.image.url,
    author: typeof data.image.author === "string" ? data.image.author : "",
    page: typeof data.image.page === "string" ? data.image.page : "",
  } : null;
  const card: PublicNewsCard = {
    id,
    url: typeof data.url === "string" ? data.url : "",
    source: typeof data.source === "string" ? data.source : "",
    publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : "",
    headline: textPair(data.headline),
    teaser: textPair(data.teaser),
    body: textPair(data.body),
    topic: typeof data.topic === "string" ? data.topic : "",
    image,
    sortKey: typeof data.sortKey === "number" ? data.sortKey : 0,
  };
  return card.url && card.headline.en ? card : null;
}

export async function listNewsSitemapEntries(limit = 2000) {
  const snap = await publishedCollection().orderBy("sortKey", "desc").limit(limit).select("publishedAt").get();
  return snap.docs.flatMap((doc) => {
    if (!/^[a-f0-9]{24}$/.test(doc.id)) return [];
    const publishedAt = doc.get("publishedAt");
    const lastmod = typeof publishedAt === "string" && /^\d{4}-\d{2}-\d{2}/.test(publishedAt)
      ? publishedAt.slice(0, 10)
      : undefined;
    return [{ id: doc.id, lastmod }];
  });
}

export async function getPresidentialNews(id: string) {
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  const snap = await publishedCollection().doc(id).get();
  if (!snap.exists) return null;
  return asCard(snap.id, snap.data() as Parameters<typeof asCard>[1]);
}

export async function listPresidentialNews(limit: number, before?: number, after?: number): Promise<NewsPage> {
  let query = publishedCollection().orderBy("sortKey", "desc");
  if (after !== undefined) query = query.where("sortKey", ">", after);
  if (before !== undefined) query = query.where("sortKey", "<", before);
  const snap = await query.limit(limit + 1).get();
  const docs = snap.docs.slice(0, limit);
  const items = docs.flatMap((doc) => {
    const card = asCard(doc.id, doc.data());
    return card ? [card] : [];
  });
  const next = snap.docs.length > limit ? items[items.length - 1]?.sortKey ?? null : null;
  return { items, next };
}
