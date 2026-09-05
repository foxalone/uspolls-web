import { useEffect, useMemo, useState } from "react";
import {
  ELECTION_CALENDAR_EVENTS,
  ELECTION_ISO,
  formatCountdown,
  formatNextElectionEventText,
  getNextElectionEvent,
  getUsDateKey,
} from "../lib/electionCalendar";

export function HomeHero() {
  const targetDate = useMemo(() => new Date(ELECTION_ISO), []);
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const countdown = formatCountdown(targetDate, nowTimestamp);
  const todayKey = getUsDateKey(new Date(nowTimestamp));
  const nextEvent = getNextElectionEvent(ELECTION_CALENDAR_EVENTS, todayKey);
  const nextEventText = formatNextElectionEventText(nextEvent, todayKey);

  return (
    <section className="home-hero" id="monitor">
      <div className="home-hero__copy">
        <p className="home-hero__eyebrow">Live campaign metrics</p>
        <h1>Midterm Monitor ’26</h1>
        <p className="home-hero__lead">
          House. Senate. One board for the November 3 election — polls, markets,
          and the races that can flip a chamber.
        </p>
      </div>

      <div className="home-hero__countdown" aria-label="Countdown to the 2026 midterms">
        <div className="home-hero__timer">
          <CountdownUnit label="Days" value={countdown.days} />
          <span aria-hidden="true">:</span>
          <CountdownUnit label="Hours" value={countdown.hours} />
          <span aria-hidden="true">:</span>
          <CountdownUnit label="Minutes" value={countdown.minutes} />
          <span aria-hidden="true">:</span>
          <CountdownUnit label="Seconds" value={countdown.seconds} />
        </div>
        <h2>Until Election Day — November 3, 2026</h2>
        {nextEventText ? (
          <p className="home-hero__next">
            Next event: <em>{nextEventText}</em>
          </p>
        ) : null}
      </div>

      <div className="home-hero__track">
        <ol className="home-hero__timeline">
          {ELECTION_CALENDAR_EVENTS.map((event) => {
            const isToday = event.date === todayKey;
            const isPast = event.date < todayKey;
            const nodeClass = [
              "home-hero__node",
              isToday ? "is-today" : "",
              event.isElectionDay ? "is-election" : "",
              isPast ? "is-past" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li className={nodeClass} key={event.id}>
                <span className="home-hero__dot">{isToday ? "Today" : event.dateLabel}</span>
                <span className="home-hero__label">{event.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function CountdownUnit({ label, value }: { label: string; value: string }) {
  return (
    <div className="home-hero__unit">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
