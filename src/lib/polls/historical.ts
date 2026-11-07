export const HISTORICAL_POLLS_COLLECTION = "historical_polls";

export const OBAMA_ROMNEY_2012_RACE_KEY = "2012-obama-romney";

export const TRUMP_CLINTON_2016_RACE_KEY = "2016-trump-clinton";

export const TRUMP_BIDEN_2020_RACE_KEY = "2020-trump-biden";

export const TRUMP_BIDEN_2024_RACE_KEY = "2024-trump-biden";

export const TRUMP_HARRIS_2024_RACE_KEY = "2024-trump-harris";

export const HISTORICAL_PAGE_SIZE = 20;

export type HistoricalCycle = 2012 | 2016 | 2020 | 2024;

export type HistoricalCursor = { recordedOn: string; id: string };

export type Democrat2024 = "Obama" | "Clinton" | "Biden" | "Harris";

export type HistoricalPollRow = {
  id: string;
  pollster: string;
  recordedOn: string;
  trumpPct: number;
  democrat: Democrat2024;
  democratPct: number;
  population: string | null;
  sampleSize: number | null;
  sourceUrl: string | null;
};
