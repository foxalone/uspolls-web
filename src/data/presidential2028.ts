export const PRESIDENTIAL_ELECTION_DATE = "2028-11-07T00:00:00-05:00";

export const PRESIDENTIAL_SITE = {
  name: "US Polls",
  year: 2028,
  url: "https://uspolls-web.vercel.app",
};

export type TranslatedText = { en: string; es: string; ru: string };

export type PresidentialPoll = {
  id: string;
  pollster: string;
  sourceUrl: string;
  startDate: string;
  endDate: string;
  sampleSize: number;
  population: "adults" | "registered" | "likely";
  scope: TranslatedText;
  question: TranslatedText;
  results: { candidate: string; percent: number }[];
};

/** Add only polls with a verifiable original source and a 2028 presidential question. */
export const PRESIDENTIAL_POLLS: PresidentialPoll[] = [];
