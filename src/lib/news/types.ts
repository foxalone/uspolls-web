export type NewsText = { en: string; es: string };

export type NewsImage = {
  url: string;
  author: string;
  page: string;
};

export type RawNewsItem = {
  id: string;
  url: string;
  title: string;
  source: string;
  summary: string;
  publishedAt: string;
  language: "en" | "es";
  titleKey: string;
};

export type ModelDecision = {
  id: string;
  publish: boolean;
  duplicateOf: string | null;
  headline: NewsText;
  teaser: NewsText;
  people: { name: string; nameEn: string }[];
  topic: string;
};

export type AcceptedNews = {
  item: RawNewsItem;
  headline: NewsText;
  teaser: NewsText;
  people: { name: string; nameEn: string }[];
  topic: string;
};

export type PublicNewsCard = {
  id: string;
  url: string;
  source: string;
  publishedAt: string;
  headline: NewsText;
  teaser: NewsText;
  topic: string;
  image: NewsImage | null;
  sortKey: number;
};

export type NewsPage = {
  items: PublicNewsCard[];
  next: number | null;
};
