import type { NewsImage } from "./types";

type Entity = {
  id?: string;
  claims?: Record<string, { mainsnak?: { datavalue?: { value?: unknown } } }[]>;
};

function claimValues(entity: Entity, property: string) {
  return (entity.claims?.[property] || []).flatMap((claim) => {
    const value = claim.mainsnak?.datavalue?.value;
    if (typeof value === "string") return [value];
    if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return [value.id];
    return [];
  });
}

function plain(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const WIKI_HEADERS = {
  Accept: "application/json",
  "User-Agent": "USPolls/1.0 (https://uspolls-web.vercel.app; 2028 presidential news)",
};

async function wikiJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, { headers: WIKI_HEADERS, signal: AbortSignal.timeout(8000) });
  if (!response.ok) return null;
  return response.json() as Promise<T>;
}

export async function commonsPortrait(nameEn: string): Promise<NewsImage | null> {
  const search = new URL("https://www.wikidata.org/w/api.php");
  search.searchParams.set("action", "wbsearchentities");
  search.searchParams.set("search", nameEn);
  search.searchParams.set("language", "en");
  search.searchParams.set("type", "item");
  search.searchParams.set("limit", "1");
  search.searchParams.set("format", "json");
  const found = await wikiJson<{ search?: { id?: string; label?: string }[] }>(search.toString());
  const hit = found?.search?.[0];
  if (!hit?.id || hit.label?.toLowerCase() !== nameEn.toLowerCase()) return null;

  const claimsUrl = new URL("https://www.wikidata.org/w/api.php");
  claimsUrl.searchParams.set("action", "wbgetclaims");
  claimsUrl.searchParams.set("entity", hit.id);
  claimsUrl.searchParams.set("format", "json");
  const entity = await wikiJson<Entity>(claimsUrl.toString());
  if (!entity || !claimValues(entity, "P31").includes("Q5")) return null;
  const file = claimValues(entity, "P18")[0];
  if (!file) return null;

  const infoUrl = new URL("https://commons.wikimedia.org/w/api.php");
  infoUrl.searchParams.set("action", "query");
  infoUrl.searchParams.set("titles", `File:${file}`);
  infoUrl.searchParams.set("prop", "imageinfo");
  infoUrl.searchParams.set("iiprop", "url|size|mime|extmetadata");
  infoUrl.searchParams.set("iiurlwidth", "640");
  infoUrl.searchParams.set("format", "json");
  const info = await wikiJson<{
    query?: { pages?: Record<string, { imageinfo?: { thumburl?: string; thumbwidth?: number; mime?: string; descriptionurl?: string; extmetadata?: Record<string, { value?: string }> }[] }> };
  }>(infoUrl.toString());
  const image = Object.values(info?.query?.pages || {})[0]?.imageinfo?.[0];
  const url = image?.thumburl || "";
  if (!/^https:\/\/(?:upload|thumb)\.wikimedia\.org\//.test(url)) return null;
  if ((image?.thumbwidth || 0) < 320) return null;
  if (!image?.mime || !/^image\/(jpeg|png|webp)$/.test(image.mime)) return null;
  const author = plain(image.extmetadata?.Artist?.value || "");
  return {
    url,
    author: author.slice(0, 120),
    page: image.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  };
}
