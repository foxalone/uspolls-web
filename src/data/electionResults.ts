export type CandidateKey = "bushSr" | "bushJr" | "dukakis" | "clinton" | "dole" | "gore" | "kerry" | "mccain" | "obama" | "romney" | "trump" | "biden" | "harris";

export type ElectionResult = {
  year: number;
  recordedOn: string;
  republican: CandidateKey;
  democrat: CandidateKey;
  republicanPct: number;
  democratPct: number;
  republicanElectors: number;
  democratElectors: number;
  otherElectors?: { count: number; label: "bentsen" | "abstained" | "edwards" | "others" };
  sourceUrl: string;
};

// Electors are the certified Electoral College totals from the National
// Archives. Popular-vote shares are rounded to one decimal; 2012–2024 match
// the figures on each year's timeline. Years before 2012 are results only.
export const ELECTION_RESULTS: ElectionResult[] = [
  { year: 1988, recordedOn: "1988-11-08", republican: "bushSr", democrat: "dukakis", republicanPct: 53.4, democratPct: 45.6, republicanElectors: 426, democratElectors: 111, otherElectors: { count: 1, label: "bentsen" }, sourceUrl: "https://www.archives.gov/electoral-college/1988" },
  { year: 1992, recordedOn: "1992-11-03", republican: "bushSr", democrat: "clinton", republicanPct: 37.4, democratPct: 43.0, republicanElectors: 168, democratElectors: 370, sourceUrl: "https://www.archives.gov/electoral-college/1992" },
  { year: 1996, recordedOn: "1996-11-05", republican: "dole", democrat: "clinton", republicanPct: 40.7, democratPct: 49.2, republicanElectors: 159, democratElectors: 379, sourceUrl: "https://www.archives.gov/electoral-college/1996" },
  { year: 2000, recordedOn: "2000-11-07", republican: "bushJr", democrat: "gore", republicanPct: 47.9, democratPct: 48.4, republicanElectors: 271, democratElectors: 266, otherElectors: { count: 1, label: "abstained" }, sourceUrl: "https://www.archives.gov/electoral-college/2000" },
  { year: 2004, recordedOn: "2004-11-02", republican: "bushJr", democrat: "kerry", republicanPct: 50.7, democratPct: 48.3, republicanElectors: 286, democratElectors: 251, otherElectors: { count: 1, label: "edwards" }, sourceUrl: "https://www.archives.gov/electoral-college/2004" },
  { year: 2008, recordedOn: "2008-11-04", republican: "mccain", democrat: "obama", republicanPct: 45.7, democratPct: 52.9, republicanElectors: 173, democratElectors: 365, sourceUrl: "https://www.archives.gov/electoral-college/2008" },
  { year: 2012, recordedOn: "2012-11-06", republican: "romney", democrat: "obama", republicanPct: 47.2, democratPct: 51.1, republicanElectors: 206, democratElectors: 332, sourceUrl: "https://www.archives.gov/electoral-college/2012" },
  { year: 2016, recordedOn: "2016-11-08", republican: "trump", democrat: "clinton", republicanPct: 46.1, democratPct: 48.2, republicanElectors: 304, democratElectors: 227, otherElectors: { count: 7, label: "others" }, sourceUrl: "https://www.archives.gov/electoral-college/2016" },
  { year: 2020, recordedOn: "2020-11-03", republican: "trump", democrat: "biden", republicanPct: 46.9, democratPct: 51.3, republicanElectors: 232, democratElectors: 306, sourceUrl: "https://www.archives.gov/electoral-college/2020" },
  { year: 2024, recordedOn: "2024-11-05", republican: "trump", democrat: "harris", republicanPct: 49.8, democratPct: 48.3, republicanElectors: 312, democratElectors: 226, sourceUrl: "https://www.archives.gov/electoral-college/2024" },
];
