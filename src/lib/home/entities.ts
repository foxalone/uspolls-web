export type RaceKind = "party" | "republican" | "democrat";

export type RaceEntity = {
  slug: string;
  kind: RaceKind;
  name: string;
  wiki: string;
  trendsQuery: string;
};

/** People and parties in the public 2028 presidential conversation. Not a ballot and not an endorsement. */
export const RACE_ENTITIES: RaceEntity[] = [
  { slug: "democratic-party", kind: "party", name: "Democratic Party", wiki: "Democratic_Party_(United_States)", trendsQuery: "Democratic Party" },
  { slug: "republican-party", kind: "party", name: "Republican Party", wiki: "Republican_Party_(United_States)", trendsQuery: "Republican Party" },
  { slug: "jd-vance", kind: "republican", name: "JD Vance", wiki: "JD_Vance", trendsQuery: "JD Vance" },
  { slug: "marco-rubio", kind: "republican", name: "Marco Rubio", wiki: "Marco_Rubio", trendsQuery: "Marco Rubio" },
  { slug: "ron-desantis", kind: "republican", name: "Ron DeSantis", wiki: "Ron_DeSantis", trendsQuery: "Ron DeSantis" },
  { slug: "nikki-haley", kind: "republican", name: "Nikki Haley", wiki: "Nikki_Haley", trendsQuery: "Nikki Haley" },
  { slug: "gavin-newsom", kind: "democrat", name: "Gavin Newsom", wiki: "Gavin_Newsom", trendsQuery: "Gavin Newsom" },
  { slug: "kamala-harris", kind: "democrat", name: "Kamala Harris", wiki: "Kamala_Harris", trendsQuery: "Kamala Harris" },
  { slug: "gretchen-whitmer", kind: "democrat", name: "Gretchen Whitmer", wiki: "Gretchen_Whitmer", trendsQuery: "Gretchen Whitmer" },
  { slug: "pete-buttigieg", kind: "democrat", name: "Pete Buttigieg", wiki: "Pete_Buttigieg", trendsQuery: "Pete Buttigieg" },
];

export function raceEntity(slug: string) {
  return RACE_ENTITIES.find((entity) => entity.slug === slug) ?? null;
}

export function trendsHref(query: string) {
  return `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(query)}`;
}

export const RACE_TRENDS_HREF = trendsHref("2028 presidential election");
