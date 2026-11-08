import { clipWords } from "./text";
import type { AcceptedNews, ModelDecision, RawNewsItem } from "./types";

const NAME_EN = /^[A-Z][A-Za-z.'-]+(?: [A-Z][A-Za-z.'-]+){0,4}$/;

function field(row: Record<string, unknown>, name: string, language: "en" | "es") {
  const nested = row[name];
  if (nested && typeof nested === "object" && language in nested) {
    const value = (nested as Record<string, unknown>)[language];
    if (typeof value === "string") return value;
  }
  const dotted = row[`${name}.${language}`];
  return typeof dotted === "string" ? dotted : "";
}

function textPair(row: Record<string, unknown>, name: string, max: number) {
  const english = clipWords(field(row, name, "en"), max);
  const spanish = clipWords(field(row, name, "es"), max) || english;
  return english ? { en: english, es: spanish } : null;
}

export function parseDecisions(raw: string): ModelDecision[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  let parsed: { items?: unknown };
  try {
    parsed = JSON.parse(raw.slice(start, end + 1)) as { items?: unknown };
  } catch {
    return [];
  }
  if (!Array.isArray(parsed.items)) return [];
  const decisions: ModelDecision[] = [];
  for (const entry of parsed.items) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const id = row.id === undefined || row.id === null ? "" : String(row.id).trim();
    if (!id) continue;
    const headline = textPair(row, "headline", 12);
    const teaser = textPair(row, "teaser", 28);
    const people = Array.isArray(row.people) ? row.people.flatMap((person) => {
      const nameEn = clipWords(typeof person === "string"
        ? person
        : String((person as { nameEn?: unknown })?.nameEn || (person as { name?: unknown })?.name || ""), 5);
      const name = typeof person === "string"
        ? nameEn
        : clipWords(String((person as { name?: unknown })?.name || nameEn), 5);
      if (!NAME_EN.test(nameEn)) return [];
      return [{ name: name || nameEn, nameEn }];
    }).slice(0, 2) : [];
    decisions.push({
      id,
      publish: row.publish === true && Boolean(headline && teaser),
      duplicateOf: row.duplicate_of === null || row.duplicate_of === undefined || row.duplicate_of === ""
        ? null
        : String(row.duplicate_of),
      headline: headline || { en: "", es: "" },
      teaser: teaser || { en: "", es: "" },
      people,
      topic: clipWords(typeof row.topic === "string" ? row.topic : "", 3),
    });
  }
  return decisions;
}

export function prepareBatch(items: RawNewsItem[], seen: Set<string>, recentTitleKeys: Set<string>, limit: number) {
  const fresh: RawNewsItem[] = [];
  const exactDupes: RawNewsItem[] = [];
  const batchKeys = new Set<string>();
  const sorted = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  for (const item of sorted) {
    if (seen.has(item.id) || !item.titleKey) continue;
    if (recentTitleKeys.has(item.titleKey) || batchKeys.has(item.titleKey)) {
      exactDupes.push(item);
      continue;
    }
    batchKeys.add(item.titleKey);
    fresh.push(item);
  }
  return { fresh: fresh.slice(0, limit), exactDupes, deferred: fresh.length - limit };
}

export function acceptDecisions(items: RawNewsItem[], decisions: ModelDecision[]) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const accepted: AcceptedNews[] = [];
  const rejected: string[] = [];
  const duplicated: string[] = [];
  for (const decision of decisions) {
    const item = byId.get(decision.id);
    if (!item) continue;
    if (decision.duplicateOf || !decision.publish) {
      (decision.duplicateOf ? duplicated : rejected).push(item.id);
      continue;
    }
    accepted.push({
      item,
      headline: decision.headline,
      teaser: decision.teaser,
      people: decision.people,
      topic: decision.topic || "2028",
    });
  }
  return { accepted, rejected, duplicated };
}
