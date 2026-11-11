import { PRESIDENTIAL_POLLS, type PresidentialPoll } from "../../data/presidential2028";

export type HubPollLink = {
  href: string;
  pollster: string;
  endDate: string;
};

export type HubPollsterLink = {
  href: string;
  name: string;
};

export type HubPollDirectory = {
  count: number;
  pollsterCount: number;
  latest: { pollster: string; endDate: string } | null;
  newest: HubPollLink[];
  pollsters: HubPollsterLink[];
  latestPolls: HubPollLink[];
};

export const HUB_CHIPS = [
  { href: "/average", key: "average" },
  { href: "/candidates", key: "candidates" },
  { href: "/electoral-college", key: "college" },
  { href: "/sources", key: "sources" },
] as const;

const SAFE_SLUG = /^[a-z0-9-]{1,80}$/;

export function pollsterSlug(name: string) {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base.slice(0, 80) || "pollster";
}

export function shapePresidentialPolls(polls: PresidentialPoll[] = PRESIDENTIAL_POLLS): HubPollDirectory {
  const sorted = [...polls].sort((a, b) => b.endDate.localeCompare(a.endDate) || a.id.localeCompare(b.id));
  const links = sorted.flatMap((poll) => {
    if (!SAFE_SLUG.test(poll.id)) return [];
    return [{ href: `/polls/${poll.id}`, pollster: poll.pollster, endDate: poll.endDate }];
  });
  const pollsters = new Map<string, { name: string; last: string }>();
  for (const poll of sorted) {
    const slug = pollsterSlug(poll.pollster);
    if (!SAFE_SLUG.test(slug)) continue;
    const current = pollsters.get(slug);
    if (!current || poll.endDate > current.last) pollsters.set(slug, { name: poll.pollster, last: poll.endDate });
  }
  const pollsterLinks = [...pollsters.entries()]
    .sort((a, b) => b[1].last.localeCompare(a[1].last) || a[1].name.localeCompare(b[1].name))
    .map(([slug, row]) => ({ href: `/pollsters/${slug}`, name: row.name }));
  const latest = sorted[0] ? { pollster: sorted[0].pollster, endDate: sorted[0].endDate } : null;

  return {
    count: polls.length,
    pollsterCount: pollsterLinks.length,
    latest,
    newest: links.slice(0, 3),
    pollsters: pollsterLinks,
    latestPolls: links.slice(0, 40),
  };
}

export function pollsForPollster(slug: string) {
  return PRESIDENTIAL_POLLS
    .filter((poll) => pollsterSlug(poll.pollster) === slug)
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
}

export function pollById(id: string) {
  return PRESIDENTIAL_POLLS.find((poll) => poll.id === id) ?? null;
}

export function boundedPollCount(count: number) {
  return count >= 1000 ? "1,000+" : String(count);
}
