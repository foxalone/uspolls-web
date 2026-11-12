import { acceptDecisions, parseDecisions, prepareBatch } from "./decide";
import { commonsPortrait } from "./images";
import { buildPrompt, completeNewsPrompt } from "./model";
import { NEWS_FEEDS, parseRss } from "./rss";
import { finishNewsRun, lockNewsRun, recentNews, saveNewsRun, seenNewsIds } from "./store";
import { titleKey } from "./text";
import type { RawNewsItem } from "./types";

const MODEL_LIMIT = 10;
const RECENT_LIMIT = 30;
const PORTRAIT_LIMIT = 4;
const PUBLISHER_LOOKBACK_MS = 3 * 24 * 60 * 60 * 1000;

async function fetchFeeds(): Promise<RawNewsItem[]> {
  const publisherCutoff = Date.now() - PUBLISHER_LOOKBACK_MS;
  const batches = await Promise.all(NEWS_FEEDS.map(async (feed) => {
    try {
      const response = await fetch(feed.url, {
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml",
          "User-Agent": "VotePulse/1.0 (https://votepulse.site; 2028 presidential news)",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) return [];
      const items = parseRss(await response.text(), feed.language, feed.publisher ? 20 : 10, feed.publisher);
      return feed.publisher ? items.filter((item) =>
        Date.parse(item.publishedAt) >= publisherCutoff && /\b2028\b/.test(`${item.title} ${item.summary}`)
      ) : items;
    } catch {
      return [];
    }
  }));
  const sourceKey = (item: RawNewsItem) => `${titleKey(item.source)}:${item.titleKey}`;
  const publisherItems = batches.flatMap((items, index) => NEWS_FEEDS[index].publisher ? items : []);
  const contextByTitle = new Map(publisherItems.map((item) => [sourceKey(item), item.summary]));
  return batches.flat().map((item) => {
    const context = contextByTitle.get(sourceKey(item));
    return context && context.length > item.summary.length ? { ...item, summary: context } : item;
  });
}

export async function ingestPresidentialNews() {
  const locked = await lockNewsRun();
  if (!locked) return { status: "skipped" as const, reason: "LOCKED" };
  try {
    const incoming = await fetchFeeds();
    const seen = await seenNewsIds(incoming.map((item) => item.id));
    const recent = await recentNews(RECENT_LIMIT);
    const recentTitleKeys = new Set(recent.map((row) => row.titleKey).filter(Boolean));
    const batch = prepareBatch(incoming, seen, recentTitleKeys, MODEL_LIMIT);
    const decisions = batch.fresh.length === 0
      ? []
      : parseDecisions(await completeNewsPrompt(buildPrompt(batch.fresh, recent.map((row) => ({ id: row.id, headline: row.headline })))));
    const judged = acceptDecisions(batch.fresh, decisions);
    let portraits = 0;
    const accepted = [];
    for (const news of judged.accepted) {
      let image = null;
      const person = news.people[0];
      if (person && portraits < PORTRAIT_LIMIT) {
        portraits += 1;
        try {
          image = await commonsPortrait(person.nameEn);
        } catch {
          image = null;
        }
      }
      accepted.push({ news, image });
    }
    const seenRows = [
      ...accepted.map(({ news }) => ({ id: news.item.id, titleKey: news.item.titleKey, status: "published" as const })),
      ...judged.rejected.map((id) => ({ id, titleKey: batch.fresh.find((item) => item.id === id)?.titleKey || "", status: "rejected" as const })),
      ...judged.duplicated.map((id) => ({ id, titleKey: batch.fresh.find((item) => item.id === id)?.titleKey || "", status: "duplicate" as const })),
      ...batch.exactDupes.map((item) => ({ id: item.id, titleKey: item.titleKey, status: "duplicate" as const })),
    ];
    await saveNewsRun({ accepted, seen: seenRows });
    const result = {
      status: "ok" as const,
      fetched: incoming.length,
      sent: batch.fresh.length,
      deferred: batch.deferred,
      published: accepted.length,
      rejected: judged.rejected.length,
      duplicates: judged.duplicated.length + batch.exactDupes.length,
    };
    await finishNewsRun("ok", JSON.stringify(result));
    return result;
  } catch (error) {
    await finishNewsRun("error", error instanceof Error ? error.message : "NEWS_INGEST_FAILED");
    throw error;
  }
}
