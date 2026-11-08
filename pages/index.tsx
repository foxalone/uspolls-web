import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeElectionMap } from "../src/components/HomeElectionMap";
import { PRESIDENTIAL_ELECTION_DATE } from "../src/data/presidential2028";
import { languageLocale, useLanguage, type Language } from "../src/lib/language";

const copy = {
  en: {
    title: "The road to the White House",
    description: "A clear, source-led guide to the 2028 U.S. presidential election, its polls and key dates.",
    eyebrow: "U.S. presidential election · 2028",
    lead: "One place to follow the race as it takes shape — verified polls, the path through the primaries, and the Electoral College.",
    dateLabel: "Election Day",
    date: "November 7, 2028",
    days: "days to go",
    dayOf: "Election Day is here",
    pollLink: "Explore polls",
    timelineLink: "See the timeline",
    facts: "The race at a glance",
    electors: "electoral votes",
    threshold: "to win the presidency",
    jurisdictions: "voting jurisdictions",
    process: "How the race works",
    processText: "Voters choose presidential electors state by state. Most states award all their electoral votes to the statewide winner; Maine and Nebraska use a different allocation. A candidate needs at least 270 of 538 votes to win.",
    processSource: "How the Electoral College works ↗",
    track: "What this site will track",
    trackIntro: "Built for a long campaign, with the evidence behind every number.",
    card1: "Presidential polls",
    card1Text: "National and state surveys with pollster, field dates, sample and a link to the original publication.",
    card2: "The nomination calendar",
    card2Text: "Primaries, conventions and debates as schedules are confirmed by states and parties.",
    card3: "The path to 270",
    card3Text: "An Electoral College view once comparable state polling is available. No early map built on guesses.",
    sourceNote: "Official election date and process: USA.gov. Poll figures will not appear until their sources are verified.",
  },
  es: {
    title: "El camino a la Casa Blanca",
    description: "Una guía clara y basada en fuentes sobre la elección presidencial de EE. UU. de 2028, sus encuestas y fechas clave.",
    eyebrow: "Elección presidencial de EE. UU. · 2028",
    lead: "Un solo lugar para seguir la carrera: encuestas verificadas, el camino de las primarias y el Colegio Electoral.",
    dateLabel: "Día de las elecciones",
    date: "7 de noviembre de 2028",
    days: "días restantes",
    dayOf: "Hoy son las elecciones",
    pollLink: "Ver encuestas",
    timelineLink: "Ver calendario",
    facts: "La elección de un vistazo",
    electors: "votos electorales",
    threshold: "para ganar la presidencia",
    jurisdictions: "jurisdicciones electorales",
    process: "Cómo funciona la elección",
    processText: "Los votantes eligen electores presidenciales por estado. La mayoría de los estados asigna todos sus votos electorales al ganador estatal; Maine y Nebraska usan otro sistema. Se necesitan al menos 270 de 538 votos para ganar.",
    processSource: "Cómo funciona el Colegio Electoral ↗",
    track: "Qué seguirá este sitio",
    trackIntro: "Creado para una campaña larga, con evidencia detrás de cada cifra.",
    card1: "Encuestas presidenciales",
    card1Text: "Encuestas nacionales y estatales con encuestadora, fechas de campo, muestra y enlace a la publicación original.",
    card2: "Calendario de nominación",
    card2Text: "Primarias, convenciones y debates cuando los estados y partidos confirmen sus fechas.",
    card3: "El camino a 270",
    card3Text: "Una vista del Colegio Electoral cuando haya encuestas estatales comparables. Sin mapas prematuros basados en conjeturas.",
    sourceNote: "Fecha y proceso oficiales: USA.gov. No se mostrarán cifras de encuestas hasta verificar sus fuentes.",
  },
  ru: {
    title: "Дорога в Белый дом",
    description: "Понятный справочник по президентским выборам в США 2028 года: опросы с указанием источника и ключевые даты.",
    eyebrow: "Президентские выборы в США · 2028",
    lead: "Одно место, чтобы следить за гонкой: проверенные опросы, путь через праймериз и коллегия выборщиков.",
    dateLabel: "День выборов",
    date: "7 ноября 2028",
    days: "дней осталось",
    dayOf: "Сегодня день выборов",
    pollLink: "Смотреть опросы",
    timelineLink: "Открыть календарь",
    facts: "Выборы коротко",
    electors: "голосов выборщиков",
    threshold: "чтобы победить",
    jurisdictions: "избирательных юрисдикций",
    process: "Как устроены выборы",
    processText: "Избиратели выбирают президентских выборщиков по штатам. В большинстве штатов все голоса выборщиков получает победитель в штате; в Мэне и Небраске голоса распределяются иначе. Чтобы победить, нужно не меньше 270 из 538 голосов.",
    processSource: "Как работает коллегия выборщиков ↗",
    track: "Что будет на этом сайте",
    trackIntro: "Сайт рассчитан на долгую кампанию: за каждой цифрой стоит источник.",
    card1: "Президентские опросы",
    card1Text: "Общенациональные опросы и опросы по штатам: институт, даты поля, выборка и ссылка на исходную публикацию.",
    card2: "Календарь номинации",
    card2Text: "Праймериз, съезды и дебаты — по мере того, как штаты и партии подтверждают даты.",
    card3: "Путь к 270",
    card3Text: "Карта коллегии выборщиков появится, когда будут сопоставимые опросы по штатам. Без ранней карты на догадках.",
    sourceNote: "Официальная дата и порядок выборов: USA.gov. Цифры опросов не появятся, пока источники не проверены.",
  },
} as const;

function daysLeftLabel(language: Language, count: number) {
  if (language !== "ru") return copy[language].days;
  const n10 = count % 10;
  const n100 = count % 100;
  if (n10 === 1 && n100 !== 11) return "день остался";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "дня осталось";
  return "дней осталось";
}

export default function IndexPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setDaysLeft(Math.max(0, Math.ceil((new Date(PRESIDENTIAL_ELECTION_DATE).getTime() - Date.now()) / 86_400_000)));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>{t.title} | US Polls 2028</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
      </Head>
      <div className="campaign-stack">
        <section className="campaign-hero" aria-labelledby="campaign-title">
          <div className="campaign-hero__content">
            <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
            <h1 id="campaign-title">{t.title}</h1>
            <p className="campaign-hero__lead">{t.lead}</p>
            <div className="campaign-actions">
              <Link className="campaign-button campaign-button--primary" href="/polls">{t.pollLink}<span aria-hidden="true">↗</span></Link>
              <Link className="campaign-button campaign-button--secondary" href="/calendar">{t.timelineLink}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="election-date-card">
            <span className="election-date-card__label">{t.dateLabel}</span>
            <strong>{t.date}</strong>
            <div className="election-date-card__rule" />
            <p aria-live="polite">{daysLeft === null ? "—" : daysLeft === 0 ? t.dayOf : <><b>{daysLeft.toLocaleString(languageLocale(language))}</b> {daysLeftLabel(language, daysLeft)}</>}</p>
          </div>
        </section>

        <section className="campaign-facts" aria-label={t.facts}>
          <div><strong>538</strong><span>{t.electors}</span></div>
          <div><strong>270</strong><span>{t.threshold}</span></div>
          <div><strong>50 + D.C.</strong><span>{t.jurisdictions}</span></div>
        </section>

        <div className="campaign-columns">
          <section className="campaign-panel">
            <p className="campaign-section-label">01 / {t.process}</p>
            <h2>{t.process}</h2>
            <p>{t.processText}</p>
            <a className="campaign-text-link" href="https://www.usa.gov/electoral-college" rel="noreferrer" target="_blank">{t.processSource}</a>
          </section>
          <section className="campaign-panel campaign-panel--list">
            <p className="campaign-section-label">02 / {t.track}</p>
            <h2>{t.track}</h2>
            <p>{t.trackIntro}</p>
            <ul>
              <li><span>01</span><div><strong>{t.card1}</strong><p>{t.card1Text}</p></div></li>
              <li><span>02</span><div><strong>{t.card2}</strong><p>{t.card2Text}</p></div></li>
              <li><span>03</span><div><strong>{t.card3}</strong><p>{t.card3Text}</p></div></li>
            </ul>
          </section>
        </div>
        <HomeElectionMap />
        <p className="campaign-source-note">{t.sourceNote} <a href="https://www.usa.gov/presidential-election-process" rel="noreferrer" target="_blank">USA.gov ↗</a></p>
      </div>
    </>
  );
}
