export type ElectionCalendarEvent = {
  date: string;
  dateLabel: string;
  id: string;
  isElectionDay?: boolean;
  label: string;
};

/** Official-style run-up to the November 3, 2026 midterms. */
export const ELECTION_CALENDAR_EVENTS: ElectionCalendarEvent[] = [
  {
    id: "campaign-week",
    date: "2026-09-04",
    dateLabel: "4.9",
    label: "Campaign week",
  },
  {
    id: "last-primaries",
    date: "2026-09-08",
    dateLabel: "8.9",
    label: "Last major primaries",
  },
  {
    id: "fall-launch",
    date: "2026-09-15",
    dateLabel: "15.9",
    label: "Fall campaign launch",
  },
  {
    id: "debate-window",
    date: "2026-10-06",
    dateLabel: "6.10",
    label: "Senate debate window",
  },
  {
    id: "early-vote",
    date: "2026-10-14",
    dateLabel: "14.10",
    label: "Early voting begins",
  },
  {
    id: "last-polls",
    date: "2026-10-27",
    dateLabel: "27.10",
    label: "Last national polls",
  },
  {
    id: "election-day",
    date: "2026-11-03",
    dateLabel: "3.11",
    isElectionDay: true,
    label: "Election Day",
  },
];

export const ELECTION_ISO = "2026-11-03T00:00:00-05:00";

export type CountdownParts = {
  days: string;
  hours: string;
  isComplete: boolean;
  minutes: string;
  seconds: string;
};

export function getUsDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatCountdown(targetDate: Date, nowTimestamp: number): CountdownParts {
  const remaining = Math.max(targetDate.getTime() - nowTimestamp, 0);
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: String(Math.floor(totalSeconds / 86_400)).padStart(2, "0"),
    hours: String(Math.floor((totalSeconds % 86_400) / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
    isComplete: remaining === 0,
  };
}

export function getNextElectionEvent(events: ElectionCalendarEvent[], todayKey: string) {
  return events.find((event) => event.date > todayKey) ?? events.find((event) => event.date === todayKey) ?? events[events.length - 1] ?? null;
}

export function formatNextElectionEventText(event: ElectionCalendarEvent | null, todayKey: string) {
  if (!event) return "";
  if (event.date === todayKey) return `Today — ${event.label}`;

  const eventDate = new Date(`${event.date}T12:00:00-05:00`);
  const today = new Date(`${todayKey}T12:00:00-05:00`);
  const days = Math.round((eventDate.getTime() - today.getTime()) / 86_400_000);

  if (days <= 0) return event.label;
  if (days === 1) return `In 1 day — ${event.label}`;
  return `In ${days} days — ${event.label}`;
}

export function formatUsLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
