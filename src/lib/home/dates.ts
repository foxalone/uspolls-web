import { getUsDateKey } from "../electionCalendar";

const ELECTION_YEAR = 2028;

export type TimelineLabel =
  | "today"
  | "primaries"
  | "conventions"
  | "election"
  | "certify"
  | "electors"
  | "congress"
  | "inauguration";

export type TimelineWhen =
  | { kind: "date"; date: string }
  | { kind: "window"; days: number }
  | { kind: "before" };

export type TimelineNode = {
  id: string;
  label: TimelineLabel;
  when: TimelineWhen;
  done: boolean;
  today: boolean;
  election: boolean;
};

export function nyWeekday(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  }).format(new Date(`${isoDate}T12:00:00-05:00`));
}

export function formatNyDate(isoDate: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00-05:00`));
}

export function formatNyLong(isoDate: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00-05:00`));
}

export function formatNyStamp(isoTimestamp: string, locale: string) {
  const formatted = new Intl.DateTimeFormat(locale, {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
  return `${formatted} ET`;
}

/** Tuesday after the first Monday in November. 3 U.S.C. § 1. */
export function electionDay(year: number) {
  for (let day = 1; day <= 7; day += 1) {
    const iso = `${year}-11-${String(day).padStart(2, "0")}`;
    if (nyWeekday(iso) === "Mon") return `${year}-11-${String(day + 1).padStart(2, "0")}`;
  }
  throw new Error(`No presidential Election Day in ${year}`);
}

/** First Tuesday after the second Wednesday in December. 3 U.S.C. § 7. */
export function electoralCollegeDay(year: number) {
  let wednesdays = 0;
  for (let day = 1; day <= 31; day += 1) {
    const iso = `${year}-12-${String(day).padStart(2, "0")}`;
    if (nyWeekday(iso) !== "Wed") continue;
    wednesdays += 1;
    if (wednesdays === 2) return shiftIsoDate(iso, 6);
  }
  throw new Error(`No Electoral College day in ${year}`);
}

export function certificationDeadline(year: number) {
  return shiftIsoDate(electoralCollegeDay(year), -6);
}

export function congressCountDay(year: number) {
  return `${year + 1}-01-06`;
}

export function inaugurationDay(year: number) {
  return `${year + 1}-01-20`;
}

export const PRESIDENTIAL_YEAR = ELECTION_YEAR;
export const PRESIDENTIAL_DAY = electionDay(ELECTION_YEAR);
export const NEXT_PRESIDENTIAL_DAY = electionDay(ELECTION_YEAR + 4);

export function daysBetween(fromKey: string, toKey: string) {
  const from = Date.parse(`${fromKey}T12:00:00-05:00`);
  const to = Date.parse(`${toKey}T12:00:00-05:00`);
  return Math.round((to - from) / 86_400_000);
}

export function presidentialTimeline(todayKey: string): TimelineNode[] {
  const election = PRESIDENTIAL_DAY;
  const electors = electoralCollegeDay(ELECTION_YEAR);
  const certify = certificationDeadline(ELECTION_YEAR);
  const congress = congressCountDay(ELECTION_YEAR);
  const inauguration = inaugurationDay(ELECTION_YEAR);
  const beforeElection = todayKey < election;
  const windowDays = Math.max(daysBetween(todayKey, election), 1);

  const dated: TimelineNode[] = [
    {
      id: "election",
      label: "election",
      when: { kind: "date", date: election },
      done: todayKey > election,
      today: todayKey === election,
      election: true,
    },
    {
      id: "certify",
      label: "certify",
      when: { kind: "date", date: certify },
      done: todayKey > certify,
      today: todayKey === certify,
      election: false,
    },
    {
      id: "electors",
      label: "electors",
      when: { kind: "date", date: electors },
      done: todayKey > electors,
      today: todayKey === electors,
      election: false,
    },
    {
      id: "congress",
      label: "congress",
      when: { kind: "date", date: congress },
      done: todayKey > congress,
      today: todayKey === congress,
      election: false,
    },
    {
      id: "inauguration",
      label: "inauguration",
      when: { kind: "date", date: inauguration },
      done: todayKey > inauguration,
      today: todayKey === inauguration,
      election: false,
    },
  ];

  const undated: TimelineNode[] = [
    {
      id: "primaries",
      label: "primaries",
      when: beforeElection ? { kind: "window", days: windowDays } : { kind: "before" },
      done: !beforeElection,
      today: false,
      election: false,
    },
    {
      id: "conventions",
      label: "conventions",
      when: beforeElection ? { kind: "window", days: windowDays } : { kind: "before" },
      done: !beforeElection,
      today: false,
      election: false,
    },
  ];

  const sequence = [...undated, ...dated];
  if (sequence.some((node) => node.today)) return sequence;

  const today: TimelineNode = {
    id: "today",
    label: "today",
    when: { kind: "date", date: todayKey },
    done: false,
    today: true,
    election: false,
  };
  const insertAt = sequence.findIndex((node) => !node.done);
  if (insertAt === -1) return [...sequence, today];
  return [...sequence.slice(0, insertAt), today, ...sequence.slice(insertAt)];
}

export function nextConstitutionalStep(todayKey: string): TimelineLabel | null {
  if (todayKey <= PRESIDENTIAL_DAY) return null;
  const next = presidentialTimeline(todayKey).find((node) => !node.done && !node.today);
  return next?.label ?? null;
}

export function currentNyDate() {
  return getUsDateKey(new Date());
}

function shiftIsoDate(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00-05:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return getUsDateKey(date);
}
