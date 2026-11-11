import type { NextApiRequest, NextApiResponse } from "next";
import { PUBLIC_SITEMAP_ENTRIES, renderSitemap, type SitemapEntry } from "../../src/lib/sitemap";
import { SITE_URL } from "../../src/lib/site";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end("Method not allowed");
  }

  const entries: SitemapEntry[] = [...PUBLIC_SITEMAP_ENTRIES];
  try {
    const { listNewsSitemapEntries } = await import("../../src/lib/news/store");
    const news = await listNewsSitemapEntries();
    for (const item of news) {
      entries.push({
        loc: `${SITE_URL}/news/${item.id}`,
        lastmod: item.lastmod,
        changefreq: "weekly",
        priority: "0.6",
      });
    }
  } catch {
    // The public section URLs stay in the sitemap when the news archive cannot be read.
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderSitemap(entries));
}
