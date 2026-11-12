import { SITE_URL } from "./site";
import { RACE_ENTITIES } from "./home/entities";
import { pollsterSlug } from "./home/polls";
import { PRESIDENTIAL_POLLS } from "../data/presidential2028";

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq: "hourly" | "daily" | "weekly";
  priority: string;
};

export const PUBLIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
  { loc: `${SITE_URL}/polls`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/calendar`, changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE_URL}/news`, changefreq: "hourly", priority: "0.8" },
  { loc: `${SITE_URL}/average`, changefreq: "weekly", priority: "0.6" },
  { loc: `${SITE_URL}/candidates`, changefreq: "weekly", priority: "0.6" },
  { loc: `${SITE_URL}/electoral-college`, changefreq: "weekly", priority: "0.6" },
  { loc: `${SITE_URL}/sources`, changefreq: "weekly", priority: "0.5" },
  { loc: `${SITE_URL}/attention`, changefreq: "daily", priority: "0.5" },
  ...RACE_ENTITIES.map((entity) => ({
    loc: `${SITE_URL}/candidates/${entity.slug}`,
    changefreq: "weekly" as const,
    priority: "0.4",
  })),
  ...PRESIDENTIAL_POLLS.filter((poll) => /^[a-z0-9-]{1,80}$/.test(poll.id)).map((poll) => ({
    loc: `${SITE_URL}/polls/${poll.id}`,
    changefreq: "weekly" as const,
    priority: "0.5",
  })),
  ...[...new Set(PRESIDENTIAL_POLLS.map((poll) => pollsterSlug(poll.pollster)))].map((slug) => ({
    loc: `${SITE_URL}/pollsters/${slug}`,
    changefreq: "weekly" as const,
    priority: "0.4",
  })),
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
