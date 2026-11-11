import type { PublicNewsCard } from "../news/types";

export const HOME_NEWS_LIMIT = 8;

export function orderHomeNews(items: PublicNewsCard[]) {
  return [...items].sort((a, b) => {
    const video = Number(Boolean(b.video?.url)) - Number(Boolean(a.video?.url));
    if (video !== 0) return video;
    return b.sortKey - a.sortKey;
  }).slice(0, HOME_NEWS_LIMIT);
}
