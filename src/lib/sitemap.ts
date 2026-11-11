import { SITE_URL } from "./site";

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq: "hourly" | "daily" | "weekly";
  priority: string;
};

export const PUBLIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/polls`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/calendar`, changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE_URL}/news`, changefreq: "hourly", priority: "0.8" },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}
