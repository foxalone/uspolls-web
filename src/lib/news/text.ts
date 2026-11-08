import { createHash } from "node:crypto";

export function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;|&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => {
      const point = Number(code);
      return point > 0 && point < 0x110000 ? String.fromCodePoint(point) : " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function titleKey(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function newsId(url: string) {
  return createHash("sha256").update(url).digest("hex").slice(0, 24);
}

export function clipWords(value: string, max: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  return words.slice(0, max).join(" ");
}

export function sortKeyFor(publishedAt: string, id: string) {
  const parsed = Date.parse(publishedAt);
  const base = Number.isFinite(parsed) ? parsed : Date.now();
  const tie = Number.parseInt(id.slice(0, 2), 16) % 1000;
  return base * 1000 + tie;
}
