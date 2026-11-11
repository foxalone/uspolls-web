import Link from "next/link";
import { useEffect, useState } from "react";
import { NewsCube } from "./PresidentialNews";
import { TrendSparkline } from "./TrendSparkline";
import { RACE_TRENDS_HREF } from "../lib/home/entities";
import {
  NEXT_PRESIDENTIAL_DAY,
  PRESIDENTIAL_DAY,
  formatNyDate,
  formatNyLong,
  formatNyStamp,
  nextConstitutionalStep,
  presidentialTimeline,
  type TimelineNode,
} from "../lib/home/dates";
import { HUB_CHIPS, boundedPollCount } from "../lib/home/polls";
import { orderHomeNews } from "../lib/home/newsOrder";
import type { PresidentialHub } from "../lib/home/types";
import { formatCountdown, getUsDateKey } from "../lib/electionCalendar";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import styles from "./PresidentialNews.module.css";

const RESULTS_HREF = "https://www.archives.gov/electoral-college/results";
const CALENDAR_HREF = "https://www.archives.gov/electoral-college/key-dates";
const STATUTE_HREF = "https://www.law.cornell.edu/uscode/text/3/1";
const ELECTION_INSTANT = `${PRESIDENTIAL_DAY}T00:00:00-05:00`;
const NEXT_INSTANT = `${NEXT_PRESIDENTIAL_DAY}T00:00:00-05:00`;

const copy = {
  en: {
    title: "2028 presidential poll of polls",
    description: "National polls for the 2028 presidential race, the latest survey, and the 270 electoral votes required to win.",
    eyebrow: "Poll of polls",
    h1: "2028 poll of polls: presidential election polls and 270 electoral votes",
    lead: "One national picture of the race: the polls on the presidential ballot, and the 270 electoral votes it takes to win.",
    updated: (pollster: string, date: string) => `Updated from the latest poll: ${pollster}, ${date}.`,
    updatedFallback: "No verified 2028 presidential poll has been added yet.",
    polls: "Polls",
    pollsters: "Pollsters",
    allOfThem: "all of them",
    latestPoll: "Latest poll",
    noneYet: "None yet",
    chips: { average: "Poll average", candidates: "All candidates", college: "Electoral College", sources: "Poll sources" },
    clockEyebrow: "2028 presidential election",
    untilElection: "until Election Day",
    electionDay: "Election Day",
    until: {
      certify: "until states certify electors",
      electors: "until the Electoral College votes",
      congress: "until Congress counts the votes",
      inauguration: "until Inauguration Day",
    },
    afterInauguration: "The inauguration has passed",
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
    within: (days: number) => (days === 1 ? "within 1 day" : `within ${days} days`),
    before: "before Election Day",
    results: "Official results",
    calendar: "Official calendar",
    nextEyebrow: "Next presidential election",
    nextTitle: "until the 2032 election",
    official: "Official date",
    officialText: "Federal law sets Election Day as the Tuesday after the first Monday in November.",
    statute: "3 U.S.C. § 1",
    marketEyebrow: "Polymarket forecast",
    marketTitle: "Who wins the presidency",
    marketLead: "These figures are trader prices, not a poll and not an official result.",
    asOf: (stamp: string) => `As of ${stamp}.`,
    marketLink: "View on Polymarket",
    marketEmpty: "The latest figures are unavailable.",
    newsEyebrow: "Political news",
    newsTitle: "What’s happening now",
    allNews: "All news",
    newsEmpty: "No presidential headlines are published right now.",
    photo: "Photo",
    ad: "Advertisement",
    buzzEyebrow: "Most talked about right now",
    buzzTitle: "Most talked about right now",
    period: "last 14 days",
    trends: "Google Trends",
    history: "Full history",
    buzzEmpty: "Attention figures are unavailable right now.",
    kind: { party: "Party", republican: "Republican", democrat: "Democrat" },
    direction: { up: "rising", down: "falling", flat: "steady" },
    buzzNote: "The percent compares attention, not favorability. A rise can come from news, controversy, or curiosity.",
    byPollster: "Polls by pollster",
    latestPolls: "Latest polls",
    noPollsters: "No verified pollster has a page yet.",
    noPollPages: "No verified poll pages yet.",
  },
  es: {
    title: "Sondeo de sondeos presidenciales 2028",
    description: "Encuestas nacionales de la carrera presidencial de 2028, la encuesta más reciente y los 270 votos electorales necesarios para ganar.",
    eyebrow: "Sondeo de sondeos",
    h1: "Sondeo de sondeos 2028: encuestas presidenciales y 270 votos electorales",
    lead: "Una imagen nacional de la carrera: las encuestas sobre la papeleta presidencial y los 270 votos electorales que hacen falta para ganar.",
    updated: (pollster: string, date: string) => `Actualizado con la última encuesta: ${pollster}, ${date}.`,
    updatedFallback: "Todavía no se ha añadido ninguna encuesta presidencial verificada de 2028.",
    polls: "Encuestas",
    pollsters: "Encuestadoras",
    allOfThem: "todas",
    latestPoll: "Última encuesta",
    noneYet: "Aún ninguna",
    chips: { average: "Promedio", candidates: "Todos los candidatos", college: "Colegio Electoral", sources: "Fuentes" },
    clockEyebrow: "Elección presidencial de 2028",
    untilElection: "hasta el día de las elecciones",
    electionDay: "Día de las elecciones",
    until: {
      certify: "hasta la certificación de los electores",
      electors: "hasta el voto del Colegio Electoral",
      congress: "hasta el recuento del Congreso",
      inauguration: "hasta la investidura",
    },
    afterInauguration: "La investidura ya pasó",
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
    within: (days: number) => (days === 1 ? "en un plazo de 1 día" : `en un plazo de ${days} días`),
    before: "antes del día de las elecciones",
    results: "Resultados oficiales",
    calendar: "Calendario oficial",
    nextEyebrow: "Próxima elección presidencial",
    nextTitle: "hasta la elección de 2032",
    official: "Fecha oficial",
    officialText: "La ley federal fija el día de las elecciones en el martes siguiente al primer lunes de noviembre.",
    statute: "3 U.S.C. § 1",
    marketEyebrow: "Pronóstico de Polymarket",
    marketTitle: "Quién gana la presidencia",
    marketLead: "Estas cifras son precios de operadores, no una encuesta ni un resultado oficial.",
    asOf: (stamp: string) => `A fecha de ${stamp}.`,
    marketLink: "Ver en Polymarket",
    marketEmpty: "Las últimas cifras no están disponibles.",
    newsEyebrow: "Noticias políticas",
    newsTitle: "Qué está pasando",
    allNews: "Todas las noticias",
    newsEmpty: "Ahora mismo no hay titulares presidenciales publicados.",
    photo: "Foto",
    ad: "Anuncio",
    buzzEyebrow: "De lo que más se habla ahora",
    buzzTitle: "De lo que más se habla ahora",
    period: "últimos 14 días",
    trends: "Google Trends",
    history: "Historial completo",
    buzzEmpty: "Las cifras de atención no están disponibles ahora.",
    kind: { party: "Partido", republican: "Republicano", democrat: "Demócrata" },
    direction: { up: "al alza", down: "a la baja", flat: "estable" },
    buzzNote: "El porcentaje compara atención, no favorabilidad. Una subida puede venir de noticias, polémica o curiosidad.",
    byPollster: "Encuestas por encuestadora",
    latestPolls: "Últimas encuestas",
    noPollsters: "Ninguna encuestadora verificada tiene página todavía.",
    noPollPages: "Todavía no hay páginas de encuestas verificadas.",
  },
  ru: {
    title: "Сводка опросов президентской гонки 2028",
    description: "Общенациональные опросы президентской гонки 2028 года, последний опрос и 270 голосов выборщиков, нужных для победы.",
    eyebrow: "Сводка опросов",
    h1: "Сводка опросов 2028: опросы президентских выборов и 270 голосов выборщиков",
    lead: "Одна общенациональная картина гонки: опросы по президентскому бюллетеню и 270 голосов выборщиков, которые нужны для победы.",
    updated: (pollster: string, date: string) => `Обновлено по последнему опросу: ${pollster}, ${date}.`,
    updatedFallback: "Проверенный опрос президентской гонки 2028 года ещё не добавлен.",
    polls: "Опросы",
    pollsters: "Центры опросов",
    allOfThem: "все",
    latestPoll: "Последний опрос",
    noneYet: "Пока нет",
    chips: { average: "Среднее", candidates: "Все кандидаты", college: "Коллегия выборщиков", sources: "Источники" },
    clockEyebrow: "Президентские выборы 2028",
    untilElection: "до дня выборов",
    electionDay: "День выборов",
    until: {
      certify: "до сертификации выборщиков",
      electors: "до голосования коллегии выборщиков",
      congress: "до подсчёта в Конгрессе",
      inauguration: "до инаугурации",
    },
    afterInauguration: "Инаугурация уже прошла",
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
    within: (days: number) => `в течение ${days} дн.`,
    before: "до дня выборов",
    results: "Официальные итоги",
    calendar: "Официальный календарь",
    nextEyebrow: "Следующие президентские выборы",
    nextTitle: "до выборов 2032 года",
    official: "Официальная дата",
    officialText: "Федеральный закон назначает день выборов на вторник после первого понедельника ноября.",
    statute: "3 U.S.C. § 1",
    marketEyebrow: "Прогноз Polymarket",
    marketTitle: "Кто выиграет президентство",
    marketLead: "Это цены участников рынка, а не опрос и не официальный итог.",
    asOf: (stamp: string) => `По состоянию на ${stamp}.`,
    marketLink: "Открыть на Polymarket",
    marketEmpty: "Последние цифры сейчас недоступны.",
    newsEyebrow: "Политические новости",
    newsTitle: "Что происходит сейчас",
    allNews: "Все новости",
    newsEmpty: "Сейчас нет опубликованных заголовков о президентской гонке.",
    photo: "Фото",
    ad: "Реклама",
    buzzEyebrow: "О ком говорят прямо сейчас",
    buzzTitle: "О ком говорят прямо сейчас",
    period: "последние 14 дней",
    trends: "Google Trends",
    history: "Полная история",
    buzzEmpty: "Цифры внимания сейчас недоступны.",
    kind: { party: "Партия", republican: "Республиканец", democrat: "Демократ" },
    direction: { up: "растёт", down: "падает", flat: "без изменений" },
    buzzNote: "Процент сравнивает внимание, а не поддержку. Рост может идти от новостей, споров или простого интереса.",
    byPollster: "Опросы по центрам",
    latestPolls: "Последние опросы",
    noPollsters: "У проверенных центров опросов пока нет страниц.",
    noPollPages: "Страниц проверенных опросов пока нет.",
  },
} as const;

const COUNTDOWN_UNITS = ["days", "hours", "minutes", "seconds"] as const;

export function PresidentialHub({ hub }: { hub: PresidentialHub }) {
  const { language } = useLanguage();
  const t = copy[language];
  const locale = languageLocale(language);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const todayKey = now === null ? hub.generatedOn : getUsDateKey(new Date(now));
  const timeline = presidentialTimeline(todayKey);
  const clockTitle = electionTitle(todayKey, t);
  const latestDate = hub.latest ? formatNyDate(hub.latest.endDate, locale) : null;

  return (
    <div className="campaign-stack">
      <section className="campaign-hero hub-hero" aria-labelledby="hub-title">
        <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
        <h1 id="hub-title">{t.h1}</h1>
        <p className="campaign-hero__lead">{t.lead}</p>
        <p className="hub-updated">
          {hub.latest && latestDate ? t.updated(hub.latest.pollster, latestDate) : t.updatedFallback}
        </p>
      </section>

      <section className="campaign-facts" aria-label={t.polls}>
        <div><strong>{boundedPollCount(hub.count)}</strong><span>{t.polls}</span></div>
        <div><strong>{hub.pollsterCount}</strong><span>{t.pollsters} · {t.allOfThem}</span></div>
        <div><strong>{latestDate ?? t.noneYet}</strong><span>{t.latestPoll}</span></div>
      </section>

      <nav className="campaign-nav hub-chips" aria-label={t.eyebrow}>
        {hub.newest.map((poll) => (
          <Link className="campaign-nav__link" href={poll.href} key={poll.href} prefetch={false}>
            {poll.pollster}
          </Link>
        ))}
        {HUB_CHIPS.map((chip) => (
          <Link className="campaign-nav__link" href={chip.href} key={chip.href} prefetch={false}>
            {t.chips[chip.key]}
          </Link>
        ))}
      </nav>

      <section className="campaign-panel" aria-labelledby="election-clock-title">
        <p className="campaign-section-label">{t.clockEyebrow}</p>
        <h2 id="election-clock-title">{clockTitle}</h2>
        <p>{formatNyLong(todayKey, locale)}</p>
        {todayKey < PRESIDENTIAL_DAY ? (
          <Clock labels={t.units} now={now} target={ELECTION_INSTANT} />
        ) : null}
        <ol className="hub-timeline">
          {timeline.map((node, index) => (
            <li className={nodeClass(node)} key={node.id}>
              <span>{whenLabel(node, t, locale)}</span>
              <b>{index + 1}</b>
              <strong>{t.steps[node.label]}</strong>
              <p>{t.details[node.label]}</p>
            </li>
          ))}
        </ol>
        <p className="hub-outlinks">
          <a className="campaign-text-link" href={RESULTS_HREF} rel="noreferrer" target="_blank">{t.results}</a>
          <a className="campaign-text-link" href={CALENDAR_HREF} rel="noreferrer" target="_blank">{t.calendar}</a>
        </p>
      </section>

      <section className="campaign-panel" aria-labelledby="next-election-title">
        <p className="campaign-section-label">{t.nextEyebrow}</p>
        <h2 id="next-election-title">{t.nextTitle}</h2>
        <p><strong>{t.official}:</strong> {formatNyDate(NEXT_PRESIDENTIAL_DAY, locale)}. {t.officialText}</p>
        <Clock compact labels={t.units} now={now} target={NEXT_INSTANT} />
        <p className="hub-outlinks">
          <a className="campaign-text-link" href={STATUTE_HREF} rel="noreferrer" target="_blank">{t.statute}</a>
          <a className="campaign-text-link" href={CALENDAR_HREF} rel="noreferrer" target="_blank">{t.calendar}</a>
        </p>
      </section>

      {hub.market.hidden ? null : (
        <section className="campaign-panel" aria-labelledby="market-title">
          <p className="campaign-section-label">{t.marketEyebrow}</p>
          <h2 id="market-title">{t.marketTitle}</h2>
          <p>{t.marketLead}</p>
          {hub.market.asOf ? <p>{t.asOf(formatNyStamp(hub.market.asOf, locale))}</p> : null}
          {hub.market.unavailable ? <p>{t.marketEmpty}</p> : (
            <div className="hub-bars">
              {hub.market.bars.map((bar) => (
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
          )}
          <p><a className="campaign-text-link" href={hub.market.href} rel="noreferrer" target="_blank">{t.marketLink}</a></p>
        </section>
      )}

      <HomeNews empty={t.newsEmpty} eyebrow={t.newsEyebrow} language={language} photo={t.photo} title={t.newsTitle} viewAll={t.allNews} initial={hub.news} />

      {hub.showAd ? (
        <aside className="campaign-panel" aria-label={t.ad}>
          <p className="campaign-section-label">{t.ad}</p>
        </aside>
      ) : null}

      <section className="campaign-panel" aria-labelledby="attention-title">
        <p className="campaign-section-label">{t.buzzEyebrow}</p>
        <h2 id="attention-title">{t.buzzTitle}</h2>
        <p>
          {t.period}
          {" · "}
          <a className="campaign-text-link" href={RACE_TRENDS_HREF} rel="noreferrer" target="_blank">{t.trends}</a>
          {" · "}
          <Link className="campaign-text-link" href="/attention" prefetch={false}>{t.history}</Link>
        </p>
        {hub.attention.length === 0 ? <p>{t.buzzEmpty}</p> : null}
      </section>
      {hub.attention.length > 0 ? (
        <div className="hub-entities">
          {hub.attention.map((item) => (
            <Link className="campaign-panel hub-entity" href={item.href} key={item.href} prefetch={false}>
              <span className="campaign-section-label">{t.kind[item.kind]}</span>
              <strong>{item.name}</strong>
              <TrendSparkline series={item.series.length > 1 ? item.series : [0, 0]} />
              <span className={item.direction === "down" ? "hub-change is-down" : "hub-change"}>
                {item.change > 0 ? `+${item.change}` : item.change}% · {t.direction[item.direction]}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
      <p className="campaign-source-note">{t.buzzNote}</p>

      <section className="campaign-panel" aria-labelledby="pollster-directory-title">
        <h2 id="pollster-directory-title">{t.byPollster}</h2>
        {hub.pollsters.length === 0 ? <p>{t.noPollsters}</p> : (
          <ul className="hub-directory">
            {hub.pollsters.map((pollster) => (
              <li key={pollster.href}><Link href={pollster.href} prefetch={false}>{pollster.name}</Link></li>
            ))}
          </ul>
        )}
      </section>

      <section className="campaign-panel" aria-labelledby="latest-polls-title">
        <h2 id="latest-polls-title">{t.latestPolls}</h2>
        {hub.latestPolls.length === 0 ? <p>{t.noPollPages}</p> : (
          <ul className="hub-directory">
            {hub.latestPolls.map((poll) => (
              <li key={poll.href}>
                <Link href={poll.href} prefetch={false}>{poll.pollster} · {formatNyDate(poll.endDate, locale)}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function hubCopy(language: Language) {
  return copy[language];
}

function HomeNews({
  initial, language, eyebrow, title, viewAll, empty, photo,
}: {
  initial: PresidentialHub["news"];
  language: Language;
  eyebrow: string;
  title: string;
  viewAll: string;
  empty: string;
  photo: string;
}) {
  const [items, setItems] = useState(initial);
  const text = language === "es" ? "es" : "en";

  useEffect(() => {
    let stop = false;
    async function refresh() {
      try {
        const response = await fetch("/api/presidential-news?limit=8", { cache: "no-store" });
        if (!response.ok) return;
        const page = await response.json() as { items?: PresidentialHub["news"] };
        if (!stop && Array.isArray(page.items)) setItems(orderHomeNews(page.items));
      } catch {
        // The server-rendered row stays until the shared news cache answers.
      }
    }
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <section className="campaign-panel" aria-labelledby="home-news-title">
      <header className="hub-news-head">
        <div>
          <p className="campaign-section-label">{eyebrow}</p>
          <h2 id="home-news-title">{title}</h2>
        </div>
        <Link className="campaign-text-link" href="/news" prefetch={false}>{viewAll}</Link>
      </header>
      {items.length === 0 ? <p>{empty}</p> : (
        <div className={`${styles.strip} hub-news-strip`}>
          {items.map((item, index) => (
            <NewsCube
              ageLabel={newsAge(item.publishedAt, language)}
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

function Clock({
  target, now, labels, compact = false,
}: {
  target: string;
  now: number | null;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  compact?: boolean;
}) {
  const parts = now === null ? null : formatCountdown(new Date(target), now);
  if (parts?.isComplete) return null;
  const spoken = parts
    ? `${Number(parts.days)} ${labels.days}, ${Number(parts.hours)} ${labels.hours}, ${Number(parts.minutes)} ${labels.minutes}, ${Number(parts.seconds)} ${labels.seconds}`
    : labels.days;
  return (
    <div className={compact ? "election-countdown election-countdown--compact" : "election-countdown"} role="timer" aria-label={spoken}>
      {COUNTDOWN_UNITS.flatMap((unit, index) => {
        const cell = (
          <div className="election-countdown__unit" key={unit}>
            <b>{parts ? parts[unit] : "—"}</b>
            <span>{labels[unit]}</span>
          </div>
        );
        if (index === 0) return [cell];
        return [<span className="election-countdown__sep" aria-hidden="true" key={`${unit}-sep`}>:</span>, cell];
      })}
    </div>
  );
}

function electionTitle(todayKey: string, t: (typeof copy)[Language]) {
  if (todayKey < PRESIDENTIAL_DAY) return t.untilElection;
  if (todayKey === PRESIDENTIAL_DAY) return t.electionDay;
  const step = nextConstitutionalStep(todayKey);
  if (step && step in t.until) return t.until[step as keyof typeof t.until];
  return t.afterInauguration;
}

function whenLabel(node: TimelineNode, t: (typeof copy)[Language], locale: string) {
  if (node.when.kind === "window") return t.within(node.when.days);
  if (node.when.kind === "before") return t.before;
  return formatNyDate(node.when.date, locale);
}

function nodeClass(node: TimelineNode) {
  const names = ["hub-timeline__node"];
  if (node.done) names.push("is-done");
  if (node.today) names.push("is-today");
  if (node.election) names.push("is-election");
  return names.join(" ");
}

function newsAge(iso: string, language: Language) {
  const delta = Date.parse(iso) - Date.now();
  if (!Number.isFinite(delta)) return "";
  const minutes = Math.round(delta / 60000);
  const formatter = new Intl.RelativeTimeFormat(languageLocale(language), { numeric: "auto" });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 36) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}
