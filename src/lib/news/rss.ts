import { decodeXml, newsId, titleKey } from "./text";
import type { RawNewsItem } from "./types";

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function sourceName(block: string) {
  const match = block.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
  return match ? decodeXml(match[1]) : "";
}

export function parseRss(xml: string, language: RawNewsItem["language"], limit = 10): RawNewsItem[] {
  const items: RawNewsItem[] = [];
  for (const block of xml.split(/<item\b[^>]*>/i).slice(1)) {
    const title = tag(block, "title").replace(/\s+-\s+[^-]+$/, "").trim();
    const url = tag(block, "link") || tag(block, "guid");
    const published = Date.parse(tag(block, "pubDate"));
    if (!title || !url.startsWith("http") || !Number.isFinite(published)) continue;
    const summary = tag(block, "description").slice(0, 480);
    items.push({
      id: newsId(url),
      url,
      title: title.slice(0, 240),
      source: sourceName(block) || (language === "es" ? "Prensa" : "Press"),
      summary,
      publishedAt: new Date(published).toISOString(),
      language,
      titleKey: titleKey(title),
    });
    if (items.length >= limit) break;
  }
  return items;
}

export const NEWS_FEEDS: { url: string; language: RawNewsItem["language"] }[] = [
  {
    language: "en",
    url: "https://news.google.com/rss/search?q=%222028%22+(presidential+OR+president)+(campaign+OR+primary+OR+primaries+OR+candidate+OR+nomination+OR+election)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    language: "es",
    url: "https://news.google.com/rss/search?q=%222028%22+(presidencial+OR+presidente)+(campa%C3%B1a+OR+primarias+OR+candidato+OR+nominaci%C3%B3n+OR+elecci%C3%B3n)&hl=es-419&gl=US&ceid=US:es-419",
  },
];
