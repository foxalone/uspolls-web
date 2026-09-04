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
        <DonkeySilhouette x={78} y={108} scale={1.08} />
        <DonkeySilhouette x={128} y={98} scale={0.96} />
        <DonkeySilhouette x={172} y={112} scale={0.84} />
      </g>
      <g fill="#e23b3b">
        <ElephantSilhouette x={528} y={96} scale={1.08} />
        <ElephantSilhouette x={478} y={86} scale={0.96} />
        <ElephantSilhouette x={434} y={104} scale={0.84} />
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

function DonkeySilhouette({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M10 40 Q2 28 8 20 Q14 30 16 38 Z" />
      <ellipse cx="34" cy="46" rx="22" ry="15" />
      <ellipse cx="52" cy="34" rx="11" ry="13" />
      <ellipse cx="66" cy="34" rx="13" ry="9" />
      <ellipse cx="76" cy="36" rx="8" ry="6" />
      <path d="M46 24 L40 2 Q50 8 52 24 Z" />
      <path d="M54 22 L60 0 Q68 8 64 24 Z" />
      <rect height="22" rx="4" width="8" x="18" y="54" />
      <rect height="20" rx="4" width="8" x="28" y="56" />
      <rect height="22" rx="4" width="8" x="40" y="54" />
      <rect height="20" rx="4" width="8" x="50" y="56" />
    </g>
  );
}

function ElephantSilhouette({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M86 40 Q100 32 96 50 Q90 42 84 44 Z" />
      <ellipse cx="60" cy="44" rx="30" ry="20" />
      <ellipse cx="56" cy="28" rx="18" ry="16" />
      <ellipse cx="32" cy="38" rx="16" ry="14" />
      <path d="M20 42 C 6 46 0 60 8 70 C 12 74 20 70 18 64 C 14 54 18 48 28 46 Z" />
      <rect height="24" rx="5" width="11" x="34" y="54" />
      <rect height="22" rx="5" width="11" x="48" y="56" />
      <rect height="24" rx="5" width="11" x="64" y="54" />
      <rect height="22" rx="5" width="11" x="78" y="56" />
    </g>
  );
}
