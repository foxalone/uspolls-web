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

const DONKEY_PATH =
  "M6 42 C 0 36 1 26 11 28 C 12 18 24 20 30 30 L 26 6 C 28 0 36 2 36 16 L 42 4 C 46 -2 54 2 50 18 C 68 16 88 26 90 40 C 92 46 86 52 76 50 C 68 48 60 44 54 42 C 56 56 60 78 56 84 H 46 L 44 58 L 38 84 H 28 L 30 58 L 20 84 H 10 L 14 56 C 6 52 4 46 6 42 Z";
const ELEPHANT_PATH =
  "M22 38 C 6 36 -2 50 4 64 C 8 72 20 70 20 62 C 16 54 20 48 28 46 C 26 58 24 78 30 84 H 42 L 44 60 L 54 84 H 68 L 66 60 L 78 84 H 92 L 90 58 L 100 84 H 112 L 106 52 C 116 48 118 38 110 32 C 116 24 106 18 96 22 C 88 8 64 4 52 14 C 48 4 28 6 32 20 C 22 8 8 16 14 30 C 8 32 10 38 22 38 Z";

function TugOfWarArt() {
  return (
    <svg className="tug-art" viewBox="0 0 720 280" role="presentation">
      <defs>
        <linearGradient id="tug-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--hero-art-top)" />
          <stop offset="100%" stopColor="var(--hero-art-bottom)" />
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
      <FlagMascot
        clipId="tug-donkey-clip"
        path={DONKEY_PATH}
        scale={1.55}
        starXs={[24, 36, 48, 60]}
        x={102}
        y={80}
      />
      <FlagMascot
        clipId="tug-elephant-clip"
        path={ELEPHANT_PATH}
        scale={1.48}
        starXs={[42, 58, 74]}
        x={470}
        y={78}
      />
      <text fill="var(--hero-art-label)" fontSize="13" fontWeight="700" textAnchor="middle" x="168" y="228">
        Democrats
      </text>
      <text fill="var(--hero-art-label)" fontSize="13" fontWeight="700" textAnchor="middle" x="552" y="228">
        Republicans
      </text>
    </svg>
  );
}

function FlagMascot({
  clipId,
  path,
  scale,
  starXs,
  x,
  y,
}: {
  clipId: string;
  path: string;
  scale: number;
  starXs: number[];
  x: number;
  y: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <clipPath id={clipId}>
        <path d={path} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect fill="#1d4ebd" height="50" width="130" x="-6" y="-8" />
        <rect fill="#d3202b" height="52" width="130" x="-6" y="42" />
        {starXs.map((starX) => (
          <path
            d="M0-6.2 1.8-1.8h4.8L2.6 1 4.2 5.8 0 3.2-4.2 5.8-2.6 1-6.6-1.8h4.8Z"
            fill="#ffffff"
            key={starX}
            transform={`translate(${starX} 36)`}
          />
        ))}
      </g>
    </g>
  );
}
