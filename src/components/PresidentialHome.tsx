import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NewsCube } from "./PresidentialNews";
import { TrendSparkline } from "./TrendSparkline";
import {
  PRESIDENTIAL_DAY,
  formatNyDate,
  formatNyStamp,
  presidentialTimeline,
  type TimelineNode,
} from "../lib/home/dates";
import { HOME_QUICK_LINKS, boundedPollCount } from "../lib/home/polls";
import { orderHomeNews } from "../lib/home/newsOrder";
import type { PresidentialHome as HomeData } from "../lib/home/types";
import { PRESIDENTIAL_ELECTION_DATE } from "../data/presidential2028";
import { formatCountdown, getUsDateKey } from "../lib/electionCalendar";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import styles from "./PresidentialNews.module.css";

const CALENDAR_HREF = "https://www.usa.gov/presidential-election-process";

const copy = {
  en: {
    title: "The 2028 U.S. presidential election",
    description: "Follow the race to the White House with 2028 presidential polls, key election dates and campaign news.",
    eyebrow: "United States · 2028",
    h1: "Presidential election",
    lead: "Track the race to the White House with the latest polls, the election calendar and campaign news.",
    calendarTitle: "Election calendar",
    viewCalendar: "Full timeline",
    polls: "Polls on VotePulse",
    pollsters: "Pollsters",
    latestPoll: "Latest field date",
    noneYet: "Not yet available",
    viewPolls: "All 2028 polls",
    datesPending: "Dates to be announced",
    untilElection: "Until Election Day",
    electionDay: "Election Day",
    afterElection: "Election held on",
    dateLabel: "November 7, 2028",
    chips: { average: "Poll average", candidates: "All candidates", college: "Electoral College", sources: "Poll sources" },
    units: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
    steps: {
      today: "Today",
      primaries: "Primaries and caucuses",
      conventions: "National conventions",
      election: "Election Day",
      certify: "States certify electors",
      electors: "Electoral College votes",
      congress: "Congress counts the votes",
      inauguration: "Inauguration",
    },
    details: {
      today: "Where the calendar stands today.",
      primaries: "Each state and party sets its own dates.",
      conventions: "Dates are set by the national parties.",
      election: "Voters choose presidential electors.",
      certify: "A certificate of ascertainment is due at least six days before electors meet.",
      electors: "Electors meet in their own states.",
      congress: "Electoral votes are counted in a joint session.",
      inauguration: "The next president takes the oath.",
    },
    calendar: "U.S. election process",
    marketTitle: "2028 prediction market",
    marketLead: "Prices on Polymarket reflect traders’ expectations.",
    asOf: (stamp: string) => `As of ${stamp}.`,
    marketLink: "View on Polymarket",
    newsTitle: "What’s happening now",
    allNews: "All news",
    previousNews: "Scroll news left",
    nextNews: "Scroll news right",
    newsEmpty: "No presidential headlines are published right now.",
    photo: "Photo",
    buzzTitle: "Most talked about right now",
    period: "last 14 days",
    history: "Full history",
    kind: { party: "Party", republican: "Republican", democrat: "Democrat" },
    direction: { up: "rising", down: "falling", flat: "steady" },
    buzzNote: "The percent compares attention, not favorability. A rise can come from news, controversy, or curiosity.",
    byPollster: "Polls by pollster",
    latestPolls: "Latest polls",
    noPollPages: "No verified poll pages yet.",
  },
  es: {
    title: "Elecciones presidenciales de EE. UU. de 2028",
    description: "Sigue la carrera a la Casa Blanca con encuestas presidenciales de 2028, fechas clave y noticias de campaña.",
    eyebrow: "Estados Unidos · 2028",
    h1: "Elección presidencial",
    lead: "Sigue la carrera a la Casa Blanca con las últimas encuestas, el calendario electoral y noticias de campaña.",
    calendarTitle: "Calendario electoral",
    viewCalendar: "Ver cronología",
    polls: "Encuestas en VotePulse",
    pollsters: "Encuestadoras",
    latestPoll: "Último día de campo",
    noneYet: "Sin datos",
    viewPolls: "Todas las encuestas de 2028",
    datesPending: "Fechas por anunciar",
    untilElection: "Cuenta atrás electoral",
    electionDay: "Día de las elecciones",
    afterElection: "Elecciones celebradas el",
    dateLabel: "7 de noviembre de 2028",
    chips: { average: "Promedio", candidates: "Todos los candidatos", college: "Colegio Electoral", sources: "Fuentes" },
    units: { days: "Días", hours: "Horas", minutes: "Min", seconds: "Seg" },
    steps: {
      today: "Hoy",
      primaries: "Primarias y caucus",
      conventions: "Convenciones nacionales",
      election: "Día de las elecciones",
      certify: "Los estados certifican electores",
      electors: "Voto del Colegio Electoral",
      congress: "El Congreso cuenta los votos",
      inauguration: "Investidura",
    },
    details: {
      today: "Así está el calendario hoy.",
      primaries: "Cada estado y cada partido fija sus fechas.",
      conventions: "Las fechas las fijan los partidos nacionales.",
      election: "Los votantes eligen a los electores presidenciales.",
      certify: "El certificado de determinación vence al menos seis días antes de que se reúnan los electores.",
      electors: "Los electores se reúnen en sus estados.",
      congress: "Los votos electorales se cuentan en sesión conjunta.",
      inauguration: "El próximo presidente presta juramento.",
    },
    calendar: "Proceso electoral de EE. UU.",
    marketTitle: "Quién gana la presidencia",
    marketLead: "Estas cifras son precios de operadores, no una encuesta ni un resultado oficial.",
    asOf: (stamp: string) => `A fecha de ${stamp}.`,
    marketLink: "Ver en Polymarket",
    newsTitle: "Qué está pasando",
    allNews: "Todas las noticias",
    previousNews: "Desplazar noticias a la izquierda",
    nextNews: "Desplazar noticias a la derecha",
    newsEmpty: "Ahora mismo no hay titulares presidenciales publicados.",
    photo: "Foto",
    buzzTitle: "De lo que más se habla ahora",
    period: "últimos 14 días",
    history: "Historial completo",
    kind: { party: "Partido", republican: "Republicano", democrat: "Demócrata" },
    direction: { up: "al alza", down: "a la baja", flat: "estable" },
    buzzNote: "El porcentaje compara atención, no favorabilidad. Una subida puede venir de noticias, polémica o curiosidad.",
    byPollster: "Encuestas por encuestadora",
    latestPolls: "Últimas encuestas",
    noPollPages: "Todavía no hay páginas de encuestas verificadas.",
  },
  ru: {
    title: "Президентские выборы в США 2028 года",
    description: "Опросы президентской гонки в США 2028 года, ключевые даты и новости кампании.",
    eyebrow: "США · 2028",
    h1: "Президентские выборы",
    lead: "Следите за гонкой за Белый дом по свежим опросам, календарю выборов и новостям кампании.",
    calendarTitle: "Календарь выборов",
    viewCalendar: "Вся хронология",
    polls: "Опросы на VotePulse",
    pollsters: "Центры опросов",
    latestPoll: "Последний день опроса",
    noneYet: "Пока нет данных",
    viewPolls: "Все опросы 2028 года",
    datesPending: "Даты уточняются",
    untilElection: "До дня выборов",
    electionDay: "День выборов",
    afterElection: "Выборы прошли",
    dateLabel: "7 ноября 2028",
    chips: { average: "Среднее", candidates: "Все кандидаты", college: "Коллегия выборщиков", sources: "Источники" },
    units: { days: "Дни", hours: "Часы", minutes: "Мин", seconds: "Сек" },
    steps: {
      today: "Сегодня",
      primaries: "Праймериз и кокусы",
      conventions: "Национальные съезды",
      election: "День выборов",
      certify: "Штаты сертифицируют выборщиков",
      electors: "Голосование коллегии",
      congress: "Конгресс считает голоса",
      inauguration: "Инаугурация",
    },
    details: {
      today: "Так календарь выглядит сегодня.",
      primaries: "Даты назначают штаты и партии.",
      conventions: "Даты назначают национальные партии.",
      election: "Избиратели выбирают президентских выборщиков.",
      certify: "Сертификат об итогах нужен не позже чем за шесть дней до собрания выборщиков.",
      electors: "Выборщики собираются в своих штатах.",
      congress: "Голоса выборщиков считают на совместном заседании.",
      inauguration: "Следующий президент приносит присягу.",
    },
    calendar: "Как проходят выборы в США",
    marketTitle: "Рынок прогнозов на 2028 год",
    marketLead: "Это цены участников рынка, а не опрос и не официальный итог.",
    asOf: (stamp: string) => `По состоянию на ${stamp}.`,
    marketLink: "Открыть на Polymarket",
    newsTitle: "Что происходит сейчас",
    allNews: "Все новости",
    previousNews: "Листать новости влево",
    nextNews: "Листать новости вправо",
    newsEmpty: "Сейчас нет опубликованных заголовков о президентской гонке.",
    photo: "Фото",
    buzzTitle: "О ком говорят прямо сейчас",
    period: "последние 14 дней",
    history: "Полная история",
    kind: { party: "Партия", republican: "Республиканец", democrat: "Демократ" },
    direction: { up: "растёт", down: "падает", flat: "без изменений" },
    buzzNote: "Процент сравнивает внимание, а не поддержку. Рост может идти от новостей, споров или простого интереса.",
    byPollster: "Опросы по центрам",
    latestPolls: "Последние опросы",
    noPollPages: "Страниц проверенных опросов пока нет.",
  },
} as const;

const COUNTDOWN_UNITS = ["days", "hours", "minutes", "seconds"] as const;

export function PresidentialHome({ home }: { home: HomeData }) {
  const { language } = useLanguage();
  const t = copy[language];
  const locale = languageLocale(language);
  const [today, setToday] = useState(home.generatedOn);

  const timeline = presidentialTimeline(today);
  const latestDate = home.latest ? formatNyDate(home.latest.endDate, locale) : t.noneYet;
  const hasMarket = !home.market.hidden && !home.market.unavailable;
  const hasAttention = home.attention.length > 0;

  return (
    <div className="campaign-stack presidential-home">
      <section className="campaign-hero presidential-home__hero" aria-labelledby="presidential-home-title">
        <div className="presidential-home__intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1 id="presidential-home-title">{t.h1}</h1>
          <p className="campaign-hero__lead">{t.lead}</p>
          <nav className="campaign-actions presidential-home__links" aria-label={t.title}>
            <Link className="campaign-button campaign-button--primary" href="/polls">{t.viewPolls}<span aria-hidden="true">→</span></Link>
            {HOME_QUICK_LINKS.map((chip) => (
              <Link className="campaign-button campaign-button--secondary" href={chip.href} key={chip.href} prefetch={false}>{t.chips[chip.key]}</Link>
            ))}
          </nav>
        </div>
        <div className="presidential-home__election">
          <div className="presidential-home__countdown">
            <p>{today < PRESIDENTIAL_DAY ? t.untilElection : today === PRESIDENTIAL_DAY ? t.electionDay : t.afterElection}</p>
            <time dateTime={PRESIDENTIAL_DAY}>{t.dateLabel}</time>
            <Clock labels={t.units} onDateChange={setToday} />
          </div>
        </div>
        <dl className="presidential-home__facts">
          <div><dt>{t.polls}</dt><dd>{boundedPollCount(home.count)}</dd></div>
          <div><dt>{t.pollsters}</dt><dd>{home.pollsterCount}</dd></div>
          <div><dt>{t.latestPoll}</dt><dd>{latestDate}</dd></div>
        </dl>
      </section>

      <section className="campaign-panel presidential-home__panel" aria-labelledby="latest-polls-title">
        <header className="hub-news-head">
          <h2 id="latest-polls-title">{t.latestPolls}</h2>
          <Link className="campaign-text-link" href="/polls">{t.viewPolls} →</Link>
        </header>
        {home.newest.length === 0 ? <p>{t.noPollPages}</p> : (
          <div className="presidential-home__polls">
            {home.newest.map((poll) => (
              <Link className="presidential-home__poll" key={poll.href} href={poll.href} prefetch={false}>
                <span className="presidential-home__poll-meta">
                  {poll.pollster} · <time dateTime={poll.endDate}>{formatNyDate(poll.endDate, locale)}</time>
                </span>
                <h3>{poll.question[language]}</h3>
                <span className="presidential-home__poll-meta">{poll.scope[language]}</span>
                <div className="presidential-home__poll-results">
                  {poll.results.slice(0, 2).map((result) => (
                    <span key={result.candidate}><b>{result.percent.toLocaleString(locale)}%</b>{result.candidate}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
        {home.pollsters.length > 0 ? (
          <div className="presidential-home__pollsters">
            <strong>{t.byPollster}</strong>
            {home.pollsters.map((pollster) => (
              <Link href={pollster.href} key={pollster.href} prefetch={false}>{pollster.name}</Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="campaign-panel presidential-home__panel" aria-labelledby="election-calendar-title">
        <header className="hub-news-head">
          <h2 id="election-calendar-title">{t.calendarTitle}</h2>
          <Link className="campaign-text-link" href="/calendar">{t.viewCalendar} →</Link>
        </header>
        <ol className="hub-timeline presidential-home__timeline">
          {timeline.map((node) => (
            <li className={nodeClass(node)} key={node.id} aria-current={node.today ? "date" : undefined}>
              {node.when.kind === "date" ? (
                <time dateTime={node.when.date}>{formatNyDate(node.when.date, locale)}</time>
              ) : <span>{t.datesPending}</span>}
              <strong>{t.steps[node.label]}</strong>
              {node.label === "today" ? null : <p>{t.details[node.label]}</p>}
            </li>
          ))}
        </ol>
        <p className="hub-outlinks"><a className="campaign-text-link" href={CALENDAR_HREF} rel="noreferrer" target="_blank">{t.calendar} ↗</a></p>
      </section>

      <HomeNews empty={t.newsEmpty} language={language} photo={t.photo} title={t.newsTitle} viewAll={t.allNews} initial={home.news} />

      {hasMarket || hasAttention ? (
        <div className={hasMarket && hasAttention ? "campaign-columns" : undefined}>
          {hasMarket ? (
            <section className="campaign-panel presidential-home__panel" aria-labelledby="market-title">
              <h2 id="market-title">{t.marketTitle}</h2>
              <p>{t.marketLead}</p>
              {home.market.asOf ? <p>{t.asOf(formatNyStamp(home.market.asOf, locale))}</p> : null}
              <div className="hub-bars">
                {home.market.bars.slice(0, 5).map((bar) => (
                  <div className="hub-bar" key={bar.name}>
                    <span className="hub-bar__name">{bar.name}</span>
                    <span className="hub-bar__track">
                      <span className="hub-bar__fill" style={{ width: `${Math.max(bar.percent, 8)}%`, background: bar.color }}>
                        {bar.percent}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p><a className="campaign-text-link" href={home.market.href} rel="noreferrer" target="_blank">{t.marketLink} ↗</a></p>
            </section>
          ) : null}

          {hasAttention ? (
            <section className="campaign-panel presidential-home__panel" aria-labelledby="attention-title">
              <h2 id="attention-title">{t.buzzTitle}</h2>
              <p>{t.period} · <Link className="campaign-text-link" href="/attention" prefetch={false}>{t.history} →</Link></p>
              <div className="hub-entities">
                {home.attention.slice(0, 4).map((item) => (
                  <Link className="campaign-panel hub-entity" href={item.href} key={item.href} prefetch={false}>
                    <span className="campaign-section-label">{t.kind[item.kind]}</span>
                    <strong>{item.name}</strong>
                    <TrendSparkline series={item.series.length > 1 ? item.series : [0, 0]} />
                    <span className={item.direction === "down" ? "hub-change is-down" : "hub-change"}>
                      {item.change > 0 ? "+" : ""}{item.change}% · {t.direction[item.direction]}
                    </span>
                  </Link>
                ))}
              </div>
              <p>{t.buzzNote}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function homeCopy(language: Language) {
  return copy[language];
}

function HomeNews({
  initial, language, title, viewAll, empty, photo,
}: {
  initial: HomeData["news"];
  language: Language;
  title: string;
  viewAll: string;
  empty: string;
  photo: string;
}) {
  const [items, setItems] = useState(initial);
  const [now, setNow] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const text = language === "es" ? "es" : "en";
  const t = copy[language];

  useEffect(() => {
    let stop = false;
    setNow(Date.now());
    async function refresh() {
      try {
        const response = await fetch("/api/presidential-news?limit=8", { cache: "no-store" });
        if (!response.ok) return;
        const page = await response.json() as { items?: HomeData["news"] };
        if (!stop && Array.isArray(page.items)) setItems(orderHomeNews(page.items));
      } catch {
        // The server-rendered row stays until the shared news cache answers.
      }
    }
    void refresh();
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const updateControls = () => {
      const remaining = strip.scrollWidth - strip.clientWidth - strip.scrollLeft;
      setCanScrollLeft(strip.scrollLeft > 1);
      setCanScrollRight(remaining > 1);
    };
    const observer = new ResizeObserver(updateControls);
    observer.observe(strip);
    strip.addEventListener("scroll", updateControls, { passive: true });
    updateControls();

    return () => {
      observer.disconnect();
      strip.removeEventListener("scroll", updateControls);
    };
  }, [items.length]);

  function scrollNews(direction: -1 | 1) {
    const strip = stripRef.current;
    if (!strip || (direction === -1 ? !canScrollLeft : !canScrollRight)) return;

    const first = strip.children[0]?.getBoundingClientRect();
    const second = strip.children[1]?.getBoundingClientRect();
    if (first && second) strip.scrollBy({ left: direction * (second.left - first.left) });
  }

  return (
    <section className="campaign-panel presidential-home__panel" aria-labelledby="home-news-title">
      <header className="hub-news-head">
        <h2 id="home-news-title">{title}</h2>
        <div className={styles.stripActions}>
          <Link className="campaign-text-link" href="/news" prefetch={false}>{viewAll} →</Link>
          {items.length > 1 && (canScrollLeft || canScrollRight) ? (
            <div className={styles.stripButtons}>
              <button type="button" aria-label={t.previousNews} aria-controls="home-news-strip" aria-disabled={!canScrollLeft} onClick={() => scrollNews(-1)}>←</button>
              <button type="button" aria-label={t.nextNews} aria-controls="home-news-strip" aria-disabled={!canScrollRight} onClick={() => scrollNews(1)}>→</button>
            </div>
          ) : null}
        </div>
      </header>
      {items.length === 0 ? <p>{empty}</p> : (
        <div className={`${styles.strip} hub-news-strip`} id="home-news-strip" ref={stripRef} role="group" aria-labelledby="home-news-title" tabIndex={0}>
          {items.map((item, index) => (
            <NewsCube
              ageLabel={now === null ? formatNyStamp(item.publishedAt, languageLocale(language)) : newsAge(item.publishedAt, language, now)}
              index={index}
              item={item}
              key={item.id}
              photoLabel={photo}
              prefetch={false}
              text={text}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Clock({ labels, onDateChange }: {
  labels: { days: string; hours: string; minutes: string; seconds: string };
  onDateChange: (date: string) => void;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => {
      const timestamp = Date.now();
      setNow(timestamp);
      onDateChange(getUsDateKey(new Date(timestamp)));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [onDateChange]);

  const parts = now === null ? null : formatCountdown(new Date(PRESIDENTIAL_ELECTION_DATE), now);
  if (parts?.isComplete) return null;
  return (
    <div className="election-countdown" role="timer">
      {COUNTDOWN_UNITS.map((unit) => (
        <div className="election-countdown__unit" key={unit}>
          <b>{parts ? parts[unit] : "–"}</b>
          <span>{labels[unit]}</span>
        </div>
      ))}
    </div>
  );
}

function nodeClass(node: TimelineNode) {
  const names = ["hub-timeline__node"];
  if (node.done) names.push("is-done");
  if (node.today) names.push("is-today");
  if (node.election) names.push("is-election");
  return names.join(" ");
}

function newsAge(iso: string, language: Language, now: number) {
  const delta = Date.parse(iso) - now;
  if (!Number.isFinite(delta)) return "";
  const minutes = Math.round(delta / 60000);
  const formatter = new Intl.RelativeTimeFormat(languageLocale(language), { numeric: "auto" });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 36) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}
