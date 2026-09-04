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
      <div className="home-hero__art" aria-hidden="true">
        <TugOfWarArt />
      </div>
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

function TugOfWarArt() {
  return (
    <svg className="tug-art" viewBox="0 0 720 280" role="presentation">
      <defs>
        <linearGradient id="tug-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#12356d" />
          <stop offset="100%" stopColor="#0a2348" />
        </linearGradient>
      </defs>
      <rect fill="url(#tug-sky)" height="280" rx="28" width="720" />
      <ellipse cx="360" cy="248" fill="rgba(7,16,36,0.35)" rx="250" ry="18" />
      <path
        d="M86 168 C 180 128, 250 148, 332 156 L 360 160 L 388 156 C 470 148, 540 128, 634 168"
        fill="none"
        stroke="#d7c39a"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <g transform="translate(318 92)">
        <rect fill="#163a73" height="86" rx="10" width="84" />
        <rect fill="#0d2a58" height="18" width="84" y="68" />
        <circle cx="42" cy="38" fill="#f4f7ff" r="16" />
        <path d="M42 26 l4 12 h12 l-10 7 4 12-10-7-10 7 4-12-10-7h12z" fill="#c9a27a" />
      </g>
      <g fill="#3d78ff">
        <circle cx="118" cy="132" r="22" />
        <circle cx="168" cy="124" r="20" />
        <circle cx="214" cy="136" r="18" />
        <rect height="46" rx="14" width="36" x="100" y="150" />
        <rect height="46" rx="14" width="34" x="151" y="142" />
        <rect height="46" rx="14" width="32" x="198" y="152" />
      </g>
      <g fill="#e23b3b">
        <circle cx="602" cy="132" r="22" />
        <circle cx="552" cy="124" r="20" />
        <circle cx="506" cy="136" r="18" />
        <rect height="46" rx="14" width="36" x="584" y="150" />
        <rect height="46" rx="14" width="34" x="535" y="142" />
        <rect height="46" rx="14" width="32" x="490" y="152" />
      </g>
      <text fill="#9eb6e0" fontSize="13" fontWeight="700" textAnchor="middle" x="168" y="228">
        Democrats
      </text>
      <text fill="#9eb6e0" fontSize="13" fontWeight="700" textAnchor="middle" x="552" y="228">
        Republicans
      </text>
    </svg>
  );
}
