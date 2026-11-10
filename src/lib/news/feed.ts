import type { PublicNewsCard } from "./types";

export function mergeNews(current: PublicNewsCard[], incoming: PublicNewsCard[]) {
  const byId = new Map<string, PublicNewsCard>();
  for (const item of current) byId.set(item.id, item);
  for (const item of incoming) byId.set(item.id, item);
  return [...byId.values()].sort((a, b) => b.sortKey - a.sortKey);
}
