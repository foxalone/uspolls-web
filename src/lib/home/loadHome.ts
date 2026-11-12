import { listPresidentialNews } from "../news/store";
import type { PublicNewsCard } from "../news/types";
import { loadAttention } from "./attention";
import { currentNyDate } from "./dates";
import { loadPolymarket } from "./market";
import { HOME_NEWS_LIMIT, orderHomeNews } from "./newsOrder";
import { shapePresidentialPolls } from "./polls";
import { EMPTY_MARKET, type PresidentialHome } from "./types";

export const HOME_REVALIDATE_SECONDS = 15 * 60;
export const HOME_RETRY_SECONDS = 60;
const SOURCE_TIMEOUT_MS = 15_000;

export async function loadPresidentialHome(): Promise<{ home: PresidentialHome; revalidate: number }> {
  const generatedOn = currentNyDate();
  const polls = shapePresidentialPolls();
  const [news, market, attention] = await Promise.all([
    settle(loadHomeNews(), [] as PublicNewsCard[]),
    settle(loadPolymarket(generatedOn), { ...EMPTY_MARKET }),
    settle(loadAttention(shiftKey(generatedOn, -1), 14), [] as PresidentialHome["attention"]),
  ]);
  const degraded = news.failed || market.failed || attention.failed;
  return {
    home: {
      ...polls,
      generatedOn,
      news: orderHomeNews(news.value),
      market: market.value,
      attention: attention.value,
    },
    revalidate: degraded ? HOME_RETRY_SECONDS : HOME_REVALIDATE_SECONDS,
  };
}

async function loadHomeNews() {
  const page = await listPresidentialNews(HOME_NEWS_LIMIT);
  return orderHomeNews(page.items);
}

function settle<T>(work: Promise<T>, fallback: T, ms = SOURCE_TIMEOUT_MS) {
  return new Promise<{ value: T; failed: boolean }>((resolve) => {
    const timer = setTimeout(() => resolve({ value: fallback, failed: true }), ms);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve({ value, failed: false });
      },
      () => {
        clearTimeout(timer);
        resolve({ value: fallback, failed: true });
      },
    );
  });
}

function shiftKey(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00-05:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
