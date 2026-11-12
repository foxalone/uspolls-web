import { SITE_NAME, SITE_URL } from "../lib/site";

export const PRESIDENTIAL_ELECTION_DATE = "2028-11-07T00:00:00-05:00";

export const PRESIDENTIAL_SITE = {
  name: SITE_NAME,
  year: 2028,
  url: SITE_URL,
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

const NATIONAL_MATCHUP: TranslatedText = {
  en: "National · hypothetical matchup",
  es: "Nacional · enfrentamiento hipotético",
  ru: "Общенациональный · гипотетическая пара",
};

/** Add only polls with a verifiable original source and a 2028 presidential question. */
export const PRESIDENTIAL_POLLS: PresidentialPoll[] = [
  {
    id: "umass-lowell-yougov-newsom-vance-oct-2026",
    pollster: "UMass Lowell / YouGov",
    sourceUrl: "https://www.uml.edu/research/public-opinion/polls/2026/2026-october-national.aspx",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    sampleSize: 1000,
    population: "likely",
    scope: NATIONAL_MATCHUP,
    question: { en: "Newsom vs. Vance", es: "Newsom frente a Vance", ru: "Ньюсом против Вэнса" },
    results: [
      { candidate: "Gavin Newsom", percent: 46 },
      { candidate: "JD Vance", percent: 42 },
      { candidate: "Another candidate", percent: 4 },
      { candidate: "Undecided", percent: 6 },
      { candidate: "Would not vote", percent: 2 },
    ],
  },
  {
    id: "emerson-harris-rubio-aug-2026",
    pollster: "Emerson College Polling",
    sourceUrl: "https://emersoncollegepolling.com/august-2026-national-poll/",
    startDate: "2026-08-16",
    endDate: "2026-08-17",
    sampleSize: 1000,
    population: "likely",
    scope: NATIONAL_MATCHUP,
    question: { en: "Harris vs. Rubio", es: "Harris frente a Rubio", ru: "Харрис против Рубио" },
    results: [
      { candidate: "Kamala Harris", percent: 43.1 },
      { candidate: "Marco Rubio", percent: 48 },
      { candidate: "Undecided", percent: 8.9 },
    ],
  },
  {
    id: "overton-insights-newsom-vance-may-2026",
    pollster: "Overton Insights",
    sourceUrl: "https://overtoninsights.com/wp-content/uploads/2026/05/Key-Toplines-May-2026-Overton-Insights-Poll.pdf",
    startDate: "2026-05-16",
    endDate: "2026-05-20",
    sampleSize: 1377,
    population: "registered",
    scope: NATIONAL_MATCHUP,
    question: { en: "Newsom vs. Vance", es: "Newsom frente a Vance", ru: "Ньюсом против Вэнса" },
    results: [
      { candidate: "Gavin Newsom", percent: 44 },
      { candidate: "JD Vance", percent: 39 },
      { candidate: "Undecided", percent: 9 },
      { candidate: "Would not vote", percent: 8 },
    ],
  },
];
