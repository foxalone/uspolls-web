export const POLYMARKET_EVENT_HREF = "https://polymarket.com/event/presidential-election-winner-2028";

const BAR_COLORS = ["#e55850", "#315e9d", "#c9892d", "#1f8a4c", "#7c5cbf", "#0e7c86", "#c23b6e", "#4d6b8a"];
const BAR_LIMIT = 8;

export type MarketBar = {
  name: string;
  percent: number;
  color: string;
};

export type MarketPanel = {
  hidden: boolean;
  unavailable: boolean;
  href: string;
  asOf: string | null;
  bars: MarketBar[];
};

export function polymarketHidden(todayKey: string, env: Record<string, string | undefined> = process.env) {
  if (env.POLYMARKET_HIDDEN === "1") return true;
  const until = env.POLYMARKET_HIDDEN_UNTIL ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(until) && todayKey < until;
}

export function parsePolymarketEvent(payload: unknown): { asOf: string | null; bars: MarketBar[] } {
  const event = Array.isArray(payload) ? payload[0] : payload;
  if (!event || typeof event !== "object") return { asOf: null, bars: [] };
  const record = event as { updatedAt?: unknown; markets?: unknown };
  const asOf = typeof record.updatedAt === "string" ? record.updatedAt : null;
  const markets = Array.isArray(record.markets) ? record.markets : [];
  const ranked = markets.flatMap((market) => {
    if (!market || typeof market !== "object") return [];
    const row = market as { groupItemTitle?: unknown; outcomePrices?: unknown; active?: unknown; closed?: unknown };
    if (row.active === false || row.closed === true) return [];
    const name = typeof row.groupItemTitle === "string" ? row.groupItemTitle.trim() : "";
    const prices = parsePrices(row.outcomePrices);
    if (!name || prices === null || prices <= 0) return [];
    return [{ name, percent: Math.round(prices * 1000) / 10 }];
  });
  ranked.sort((a, b) => b.percent - a.percent || a.name.localeCompare(b.name));
  const seen = new Set<string>();
  const bars: MarketBar[] = [];
  for (const row of ranked) {
    if (seen.has(row.name)) continue;
    seen.add(row.name);
    bars.push({ ...row, color: BAR_COLORS[bars.length % BAR_COLORS.length] });
    if (bars.length === BAR_LIMIT) break;
  }
  return { asOf, bars };
}

export async function loadPolymarket(todayKey: string): Promise<MarketPanel> {
  const href = POLYMARKET_EVENT_HREF;
  if (polymarketHidden(todayKey)) return { hidden: true, unavailable: false, href, asOf: null, bars: [] };
  const response = await fetch("https://gamma-api.polymarket.com/events?slug=presidential-election-winner-2028", {
    cache: "no-store",
    headers: { accept: "application/json", "user-agent": "VotePulse/1.0 (https://votepulse.site; presidential hub)" },
  });
  if (!response.ok) throw new Error("polymarket");
  const parsed = parsePolymarketEvent(await response.json());
  return {
    hidden: false,
    unavailable: parsed.bars.length === 0,
    href,
    asOf: parsed.asOf,
    bars: parsed.bars,
  };
}

function parsePrices(value: unknown) {
  const parsed = typeof value === "string" ? safeJson(value) : value;
  if (!Array.isArray(parsed) || parsed.length === 0) return null;
  const price = Number(parsed[0]);
  return Number.isFinite(price) ? price : null;
}

function safeJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
