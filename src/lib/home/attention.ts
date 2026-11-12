import { RACE_ENTITIES, type RaceEntity, type RaceKind } from "./entities";
import { currentNyDate } from "./dates";

const MIN_RECENT_VIEWS = 1000;
const ATTENTION_HISTORY_DAYS = 90;
const USER_AGENT = "VotePulse/1.0 (https://votepulse.site; presidential attention)";

export type AttentionCard = {
  href: string;
  kind: RaceKind;
  name: string;
  change: number;
  direction: "up" | "down" | "flat";
  series: number[];
};

type ViewDay = { date: string; views: number };

export type EntityAttention = {
  startDate: string;
  endDate: string;
  series: (number | null)[];
  comparison: { recent: number; previous: number; change: number | null } | null;
};

export function compareAttention(recent: number[], previous: number[]): {
  change: number;
  direction: AttentionCard["direction"];
  recentTotal: number;
} | null {
  const recentTotal = recent.reduce((sum, value) => sum + value, 0);
  const previousTotal = previous.reduce((sum, value) => sum + value, 0);
  if (recentTotal < MIN_RECENT_VIEWS || previousTotal <= 0) return null;
  const change = Math.round(((recentTotal - previousTotal) / previousTotal) * 100);
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  return { change, direction, recentTotal };
}

export function parsePageviews(payload: unknown): ViewDay[] {
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { items?: unknown }).items)) return [];
  return (payload as { items: unknown[] }).items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { timestamp?: unknown; views?: unknown };
    if (typeof row.timestamp !== "string" || row.timestamp.length < 8) return [];
    const views = Number(row.views);
    if (!Number.isFinite(views)) return [];
    return [{ date: `${row.timestamp.slice(0, 4)}-${row.timestamp.slice(4, 6)}-${row.timestamp.slice(6, 8)}`, views }];
  });
}

export function seriesEnding(days: ViewDay[], endKey: string, length: number) {
  return dailyViewsEnding(days, endKey, length).map((views) => views ?? 0);
}

function dailyViewsEnding(days: ViewDay[], endKey: string, length: number) {
  const byDate = new Map(days.map((day) => [day.date, day.views]));
  return Array.from({ length }, (_, index) => byDate.get(shiftKey(endKey, index - length + 1)) ?? null);
}

export async function loadEntityAttention(entity: RaceEntity): Promise<EntityAttention | null> {
  const endDate = shiftKey(currentNyDate(), -1);
  const startDate = shiftKey(endDate, 1 - ATTENTION_HISTORY_DAYS);
  const days = await fetchPageviews(entity, startDate, endDate, AbortSignal.timeout(10_000));
  if (days.length < 2) return null;

  const series = dailyViewsEnding(days, endDate, ATTENTION_HISTORY_DAYS);
  const recent = series.slice(-14);
  const previous = series.slice(-28, -14);
  const comparison = recent.every((value) => value !== null) && previous.every((value) => value !== null)
    ? {
      recent: recent.reduce((total, views) => total + views, 0),
      previous: previous.reduce((total, views) => total + views, 0),
      change: compareAttention(recent, previous)?.change ?? null,
    }
    : null;
  return { startDate, endDate, series, comparison };
}

export async function loadAttention(endKey: string, sparkDays: number): Promise<AttentionCard[]> {
  const fetchDays = Math.max(sparkDays, 28);
  const startKey = shiftKey(endKey, -(fetchDays - 1));
  let failures = 0;
  const rows = await Promise.all(RACE_ENTITIES.map(async (entity) => {
    let days;
    try {
      days = await fetchPageviews(entity, startKey, endKey);
    } catch {
      failures += 1;
      return null;
    }
    const recent = seriesEnding(days, endKey, 14);
    const previous = seriesEnding(days, shiftKey(endKey, -14), 14);
    const compared = compareAttention(recent, previous);
    if (!compared) return null;
    return {
      href: `/candidates/${entity.slug}`,
      kind: entity.kind,
      name: entity.name,
      change: compared.change,
      direction: compared.direction,
      series: seriesEnding(days, endKey, sparkDays),
      recentTotal: compared.recentTotal,
    };
  }));
  if (failures === RACE_ENTITIES.length) throw new Error("pageviews");
  const cards = rows.flatMap((row) => (row ? [row] : []));
  return cards
    .sort((a, b) => b.recentTotal - a.recentTotal || a.name.localeCompare(b.name))
    .slice(0, 10)
    .map(({ recentTotal: _recentTotal, ...card }) => card);
}

async function fetchPageviews(entity: RaceEntity, startKey: string, endKey: string, signal?: AbortSignal) {
  const start = `${startKey.replaceAll("-", "")}00`;
  const end = `${endKey.replaceAll("-", "")}00`;
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(entity.wiki)}/daily/${start}/${end}`;
  const response = await fetch(url, {
    cache: "no-store",
    signal,
    headers: { accept: "application/json", "user-agent": USER_AGENT },
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("pageviews");
  return parsePageviews(await response.json());
}

function shiftKey(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00-05:00`);
  date.setUTCDate(date.getUTCDate() + days);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts;
}
