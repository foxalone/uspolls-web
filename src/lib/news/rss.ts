import { clipWords, decodeXml, newsId, titleKey } from "./text";
import type { RawNewsItem } from "./types";

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function sourceName(block: string) {
  const match = block.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
  return match ? decodeXml(match[1]) : "";
}

export function parseRss(xml: string, language: RawNewsItem["language"], limit = 10, publisher?: string): RawNewsItem[] {
  const items: RawNewsItem[] = [];
  for (const block of xml.split(/<item\b[^>]*>/i).slice(1)) {
    const rawTitle = tag(block, "title");
    const source = publisher ?? sourceName(block);
    const suffix = ` - ${source}`;
    const title = source && rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length) : rawTitle;
    const url = tag(block, "link") || tag(block, "guid");
    const published = Date.parse(tag(block, "pubDate"));
    if (!title || !url.startsWith("http") || !Number.isFinite(published)) continue;
    const description = tag(block, "description");
    const content = tag(block, "content:encoded");
    const headlineKeys = [titleKey(title), titleKey(`${title} ${source}`)];
    const context = content.length > description.length ? content : description;
    const summary = headlineKeys.includes(titleKey(context)) ? "" : clipWords(context, 320);
    items.push({
      id: newsId(url),
      url,
      title: title.slice(0, 240),
      source: source || (language === "es" ? "Prensa" : "Press"),
      summary,
      publishedAt: new Date(published).toISOString(),
      language,
      titleKey: titleKey(title),
    });
    if (items.length >= limit) break;
  }
  return items;
}

export const NEWS_FEEDS: { url: string; language: RawNewsItem["language"]; publisher?: string }[] = [
  {
    language: "en",
    url: "https://news.google.com/rss/search?q=%222028%22+(presidential+OR+president)+(campaign+OR+primary+OR+primaries+OR+candidate+OR+nomination+OR+election)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    language: "es",
    url: "https://news.google.com/rss/search?q=%222028%22+(presidencial+OR+presidente)+(campa%C3%B1a+OR+primarias+OR+candidato+OR+nominaci%C3%B3n+OR+elecci%C3%B3n)&hl=es-419&gl=US&ceid=US:es-419",
  },
  {
    language: "en",
    publisher: "The Guardian",
    url: "https://www.theguardian.com/us-news/us-politics/rss",
  },
  {
    language: "en",
    publisher: "Elon University",
    url: "https://www.elon.edu/u/news/elon_departments_cat/elon-university-poll/feed/",
  },
];
