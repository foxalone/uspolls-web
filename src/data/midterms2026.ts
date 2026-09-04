export type Party = "D" | "R" | "I";
export type ChamberId = "house" | "senate";
export type ChangeTone = "up" | "down" | "flat";

export type ChamberSnapshot = {
  currentDem: number;
  currentGop: number;
  currentInd: number;
  forecastDem: number;
  forecastGop: number;
  forecastInd: number;
  majority: number;
  seats: number;
  title: string;
};

export type SeatRow = {
  id: string;
  label: string;
  party: Party;
  seats: number;
  note?: string;
};

export type MarketRow = {
  color: string;
  name: string;
  percent: number;
  textColor: string;
};

export type LeadingBet = {
  id: string;
  kind: "list" | "binary" | "ranges";
  source: string;
  title: string;
  rows: { color?: string; label: string; percent: number }[];
};

export type TrendCard = {
  change: number;
  id: string;
  kind: "chamber" | "race" | "figure";
  label: string;
  rising: boolean;
  series: number[];
};

export type HeadlineFigure = {
  id: string;
  initials: string;
  name: string;
  party: Party;
  role: string;
  articles: number;
  headlines: { source: string; title: string }[];
};

export type BuzzCard = {
  id: string;
  initials: string;
  name: string;
  party: Party;
  positive: number;
  views: string;
  rising: boolean;
};

export type NewsItem = {
  id: string;
  source: string;
  title: string;
  href: string;
};

export type TodayCard = {
  id: string;
  kind: "polls" | "markets" | "media" | "trend";
  label: string;
  text: string;
  tone: ChangeTone;
};

export const SITE = {
  name: "US Polls",
  tagline: "House & Senate midterm monitor",
  year: 2026,
};

export const GENERIC_BALLOT = {
  dem: 48.1,
  gop: 41.8,
  other: 10.1,
  margin: 6.3,
  source: "National polling average",
  updated: "Sep 4, 2026",
};

export const CHAMBERS: Record<ChamberId, ChamberSnapshot> = {
  house: {
    title: "House",
    seats: 435,
    majority: 218,
    currentDem: 213,
    currentGop: 222,
    currentInd: 0,
    forecastDem: 226,
    forecastGop: 209,
    forecastInd: 0,
  },
  senate: {
    title: "Senate",
    seats: 100,
    majority: 51,
    currentDem: 47,
    currentGop: 53,
    currentInd: 0,
    forecastDem: 49,
    forecastGop: 51,
    forecastInd: 0,
  },
};

export const HOUSE_DEM_ROWS: SeatRow[] = [
  { id: "h-d-safe", label: "Safe Democratic", party: "D", seats: 176 },
  { id: "h-d-likely", label: "Likely Democratic", party: "D", seats: 22 },
  { id: "h-d-lean", label: "Lean Democratic", party: "D", seats: 16 },
  { id: "h-d-toss", label: "Toss-up, Dem favored", party: "D", seats: 12 },
];

export const HOUSE_GOP_ROWS: SeatRow[] = [
  { id: "h-r-safe", label: "Safe Republican", party: "R", seats: 168 },
  { id: "h-r-likely", label: "Likely Republican", party: "R", seats: 19 },
  { id: "h-r-lean", label: "Lean Republican", party: "R", seats: 14 },
  { id: "h-r-toss", label: "Toss-up, GOP favored", party: "R", seats: 8 },
];

export const SENATE_DEM_ROWS: SeatRow[] = [
  { id: "s-nh", label: "New Hampshire — Hassan", party: "D", seats: 51, note: "Lean D" },
  { id: "s-oh", label: "Ohio special — Brown", party: "D", seats: 48, note: "Special election" },
  { id: "s-mi", label: "Michigan — Peters", party: "D", seats: 47, note: "Toss-up hold" },
  { id: "s-ak", label: "Alaska — Peltola", party: "D", seats: 47, note: "Pickup watch" },
  { id: "s-tx", label: "Texas — Talarico", party: "D", seats: 42, note: "Pickup watch" },
];

export const SENATE_GOP_ROWS: SeatRow[] = [
  { id: "s-nc", label: "North Carolina — Tillis", party: "R", seats: 49, note: "Lean R" },
  { id: "s-ia", label: "Iowa — Ernst", party: "R", seats: 46, note: "Toss-up" },
  { id: "s-me", label: "Maine — Collins", party: "R", seats: 45, note: "Toss-up" },
  { id: "s-oh-r", label: "Ohio special — Husted", party: "R", seats: 44, note: "Appointed incumbent" },
  { id: "s-ak-r", label: "Alaska — Sullivan", party: "R", seats: 41, note: "Toss-up" },
  { id: "s-tx-r", label: "Texas — Paxton", party: "R", seats: 39, note: "Open / toss-up" },
];

export const HOUSE_CONTROL_MARKET: MarketRow[] = [
  { name: "Democrats", percent: 72, color: "#3d78ff", textColor: "#ffffff" },
  { name: "Republicans", percent: 26, color: "#e23b3b", textColor: "#ffffff" },
  { name: "No majority / other", percent: 2, color: "#c9a27a", textColor: "#1a1208" },
];

export const SENATE_CONTROL_MARKET: MarketRow[] = [
  { name: "Republicans", percent: 51, color: "#e23b3b", textColor: "#ffffff" },
  { name: "Democrats", percent: 47, color: "#3d78ff", textColor: "#ffffff" },
  { name: "50–50 / tie", percent: 2, color: "#c9a27a", textColor: "#1a1208" },
];

export const LEADING_BETS: LeadingBet[] = [
  {
    id: "house-winner",
    title: "Which party wins the House?",
    source: "Polymarket",
    kind: "list",
    rows: [
      { label: "Democrats", percent: 72, color: "#3d78ff" },
      { label: "Republicans", percent: 26, color: "#e23b3b" },
      { label: "Other / contested", percent: 2, color: "#c9a27a" },
    ],
  },
  {
    id: "gop-lose-house",
    title: "Will Republicans lose the House?",
    source: "Polymarket",
    kind: "binary",
    rows: [
      { label: "Yes", percent: 74, color: "#5ea4ff" },
      { label: "No", percent: 26, color: "#ff8a7a" },
    ],
  },
  {
    id: "dem-house-seats",
    title: "House — Democratic seats?",
    source: "Polymarket",
    kind: "ranges",
    rows: [
      { label: "220–229", percent: 38 },
      { label: "230–239", percent: 24 },
      { label: "210–219", percent: 18 },
      { label: "240+", percent: 12 },
      { label: "Under 210", percent: 8 },
    ],
  },
  {
    id: "senate-majority",
    title: "Will the Senate finish without a 51-seat majority?",
    source: "Polymarket",
    kind: "binary",
    rows: [
      { label: "Yes", percent: 28, color: "#5ea4ff" },
      { label: "No", percent: 72, color: "#ff8a7a" },
    ],
  },
];

export const TRENDS: TrendCard[] = [
  { id: "talarico", kind: "figure", label: "James Talarico", change: 18.4, rising: true, series: [22, 24, 28, 31, 40, 52, 61] },
  { id: "paxton", kind: "figure", label: "Ken Paxton", change: 12.1, rising: true, series: [30, 28, 33, 36, 41, 48, 55] },
  { id: "peltola", kind: "figure", label: "Mary Peltola", change: 9.6, rising: true, series: [18, 20, 19, 26, 30, 34, 39] },
  { id: "house-d", kind: "chamber", label: "House Democrats", change: 4.2, rising: true, series: [40, 41, 43, 44, 46, 47, 48] },
  { id: "thune", kind: "figure", label: "John Thune", change: -3.8, rising: false, series: [36, 38, 37, 35, 33, 31, 29] },
];

export const HEADLINE_FIGURES: HeadlineFigure[] = [
  {
    id: "jeffries",
    name: "Hakeem Jeffries",
    initials: "HJ",
    party: "D",
    role: "House Democratic leader",
    articles: 86,
    headlines: [
      { source: "Politico", title: "Jeffries frames a five-seat path as the House map tightens" },
      { source: "AP", title: "Democratic leader tours toss-up districts after generic-ballot moves" },
      { source: "The Hill", title: "House Democrats treat 218 as a November math problem" },
    ],
  },
  {
    id: "johnson",
    name: "Mike Johnson",
    initials: "MJ",
    party: "R",
    role: "Speaker of the House",
    articles: 74,
    headlines: [
      { source: "Fox News", title: "Speaker Johnson says the House majority is still defensible" },
      { source: "WSJ", title: "GOP incumbents lean on local races as national numbers sag" },
      { source: "CNN", title: "Speaker’s map leaves little room for another wave year" },
    ],
  },
  {
    id: "schumer",
    name: "Chuck Schumer",
    initials: "CS",
    party: "D",
    role: "Senate Democratic leader",
    articles: 61,
    headlines: [
      { source: "NYT", title: "Schumer’s Senate math still runs through Texas and Ohio" },
      { source: "Reuters", title: "Democrats need a net four to take the chamber" },
      { source: "NBC", title: "Leaders treat the Senate as a toss-up even as the House tilts" },
    ],
  },
  {
    id: "thune",
    name: "John Thune",
    initials: "JT",
    party: "R",
    role: "Senate majority leader",
    articles: 54,
    headlines: [
      { source: "Axios", title: "Thune’s conference is defending a six-seat cushion" },
      { source: "Bloomberg", title: "Republican senators split time between hold races and House rescue" },
      { source: "CBS", title: "Majority leader warns against reading House polls into the Senate" },
    ],
  },
  {
    id: "talarico",
    name: "James Talarico",
    initials: "JT",
    party: "D",
    role: "Texas Senate candidate",
    articles: 49,
    headlines: [
      { source: "Texas Tribune", title: "Talarico leads a tight Texas poll as national money arrives" },
      { source: "CNN", title: "The open Texas seat is now the loudest Senate race in the country" },
      { source: "Politico", title: "Democrats treat Texas as a real pickup, not a statement race" },
    ],
  },
  {
    id: "paxton",
    name: "Ken Paxton",
    initials: "KP",
    party: "R",
    role: "Texas Senate candidate",
    articles: 47,
    headlines: [
      { source: "AP", title: "Paxton tries to nationalize the Texas Senate race" },
      { source: "WaPo", title: "Republican nominee keeps the contest inside the margin of error" },
      { source: "The Hill", title: "GOP outside groups flood Texas after the latest poll" },
    ],
  },
  {
    id: "brown",
    name: "Sherrod Brown",
    initials: "SB",
    party: "D",
    role: "Ohio special election",
    articles: 38,
    headlines: [
      { source: "Cleveland.com", title: "Brown’s return keeps the Ohio special on a knife edge" },
      { source: "NBC", title: "A four-point lead is not a lock in a midterm special" },
      { source: "Reuters", title: "Ohio becomes the Senate’s clearest industrial-state test" },
    ],
  },
];

export const BUZZ: BuzzCard[] = [
  { id: "talarico", name: "Talarico", initials: "JT", party: "D", positive: 62, views: "214K", rising: true },
  { id: "paxton", name: "Paxton", initials: "KP", party: "R", positive: 41, views: "198K", rising: true },
  { id: "jeffries", name: "Jeffries", initials: "HJ", party: "D", positive: 58, views: "121K", rising: true },
  { id: "johnson", name: "Johnson", initials: "MJ", party: "R", positive: 39, views: "109K", rising: false },
  { id: "peltola", name: "Peltola", initials: "MP", party: "D", positive: 64, views: "86K", rising: true },
  { id: "thune", name: "Thune", initials: "JT", party: "R", positive: 44, views: "71K", rising: false },
];

export const NEWS: NewsItem[] = [
  { id: "n1", source: "AP", title: "Generic ballot sits at D+6.3 with 60 days to Election Day", href: "#news" },
  { id: "n2", source: "Politico", title: "House Democrats need five seats. Forecasters now give them a path.", href: "#news" },
  { id: "n3", source: "NYT", title: "Senate control still hangs on Texas, Ohio, Alaska, Maine and Iowa", href: "#news" },
  { id: "n4", source: "WSJ", title: "Early voting calendars start locking in from mid-October", href: "#news" },
  { id: "n5", source: "CNN", title: "Prediction markets price a Democratic House and a coin-flip Senate", href: "#news" },
  { id: "n6", source: "Reuters", title: "Cornell district model puts Democrats around 226 House seats", href: "#news" },
];

export const TODAY_CARDS: TodayCard[] = [
  {
    id: "polls",
    kind: "polls",
    label: "Polls",
    tone: "up",
    text: "Generic ballot holds at D+6.3. House forecast: Democrats 226, Republicans 209.",
  },
  {
    id: "markets",
    kind: "markets",
    label: "Prediction markets",
    tone: "up",
    text: "House control: Democrats 72%. Senate control is still essentially even.",
  },
  {
    id: "media",
    kind: "media",
    label: "Media",
    tone: "flat",
    text: "Texas Senate and the Ohio special dominate national coverage.",
  },
  {
    id: "trend",
    kind: "trend",
    label: "Trend",
    tone: "down",
    text: "Search interest in GOP Senate leaders slipped as House numbers softened.",
  },
];

export const STORY = {
  title: "The House has a path. The Senate is still a knife fight.",
  kicker: "Today's story",
  body: [
    "Sixty days from Election Day, the two chambers are telling different stories. The national generic ballot is at D+6.3 — one of the widest Democratic leads since 2018 — and district models now cluster around a Democratic House near 226 seats.",
    "The Senate is tighter. Republicans start with 53 seats. Democrats need a net four, which means Texas, Ohio’s special, Alaska, Maine and Iowa all have to break in a very specific way. Markets still treat Senate control as a coin flip.",
    "That split is the November race: a House that looks like a midterm referendum, and a Senate map that still runs through a handful of names.",
  ],
};

export const MARKET_URLS = {
  house: "https://polymarket.com/elections",
  senate: "https://polymarket.com/elections",
  trends: "https://trends.google.com/trends/explore?geo=US&q=2026%20midterms",
};

export function partyName(party: Party) {
  if (party === "D") return "Democrat";
  if (party === "R") return "Republican";
  return "Independent";
}
