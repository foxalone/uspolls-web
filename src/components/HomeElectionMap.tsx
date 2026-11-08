import { useState, type CSSProperties } from "react";
import { PRESIDENTIAL_POLLS, type PresidentialPoll } from "../data/presidential2028";
import { useLanguage } from "../lib/language";
import { Us2024Map, type ResultsCycle } from "./Us2024Map";
import styles from "./HomeElectionMap.module.css";

const years: ResultsCycle[] = ["2012", "2016", "2020", "2024"];

const copy = {
  en: {
    section: "Election map",
    results: "results",
    latest: "Latest available result",
    latestMap: "Latest complete map",
    latestPoll: "Latest verified presidential poll",
    pollMapNote: "The map below still shows the latest complete state results.",
    originalSource: "Original source ↗",
    official: "Election result",
    timeline: "Election timeline",
    hint: "Drag the slider or choose a year to see how the map changed.",
    description: "Each state is colored by its winner. The number is its electoral votes.",
    red: "Red",
    blue: "blue",
    names: {
      2012: { red: "Romney", blue: "Obama" },
      2016: { red: "Trump", blue: "Clinton" },
      2020: { red: "Trump", blue: "Biden" },
      2024: { red: "Trump", blue: "Harris" },
    },
    notes: {
      2012: "Maine and Nebraska did not split electoral votes.",
      2016: "Maine also awarded one electoral vote by district.",
      2020: "Maine and Nebraska also awarded electoral votes by district.",
      2024: "Maine and Nebraska also awarded electoral votes by district.",
    },
  },
  es: {
    section: "Mapa electoral",
    results: "Resultados de",
    latest: "Resultado más reciente disponible",
    latestMap: "Mapa completo más reciente",
    latestPoll: "Encuesta presidencial verificada más reciente",
    pollMapNote: "El mapa siguiente sigue mostrando los últimos resultados estatales completos.",
    originalSource: "Fuente original ↗",
    official: "Resultado electoral",
    timeline: "Línea de tiempo electoral",
    hint: "Arrastra el control o elige un año para ver cómo cambió el mapa.",
    description: "Cada estado tiene el color de su ganador. El número indica sus votos electorales.",
    red: "Rojo",
    blue: "azul",
    names: {
      2012: { red: "Romney", blue: "Obama" },
      2016: { red: "Trump", blue: "Clinton" },
      2020: { red: "Trump", blue: "Biden" },
      2024: { red: "Trump", blue: "Harris" },
    },
    notes: {
      2012: "Maine y Nebraska no repartieron votos por distrito.",
      2016: "Maine también asignó un voto por distrito.",
      2020: "Maine y Nebraska también asignaron votos por distrito.",
      2024: "Maine y Nebraska también asignaron votos por distrito.",
    },
  },
  ru: {
    section: "Карта выборов",
    results: "Итоги",
    latest: "Последние доступные итоги",
    latestMap: "Последняя полная карта",
    latestPoll: "Последний проверенный президентский опрос",
    pollMapNote: "Карта ниже по-прежнему показывает последние полные итоги по штатам.",
    originalSource: "Первоисточник ↗",
    official: "Итоги выборов",
    timeline: "Хронология выборов",
    hint: "Передвигайте ползунок или выберите год, чтобы увидеть изменения карты.",
    description: "Цвет штата показывает победителя, число — голоса выборщиков.",
    red: "Красный",
    blue: "синий",
    names: {
      2012: { red: "Ромни", blue: "Обама" },
      2016: { red: "Трамп", blue: "Клинтон" },
      2020: { red: "Трамп", blue: "Байден" },
      2024: { red: "Трамп", blue: "Харрис" },
    },
    notes: {
      2012: "Мэн и Небраска не делили голоса по округам.",
      2016: "Мэн также распределил один голос по округу.",
      2020: "Мэн и Небраска также распределили голоса по округам.",
      2024: "Мэн и Небраска также распределили голоса по округам.",
    },
  },
} as const;

const latestPoll = PRESIDENTIAL_POLLS.reduce<PresidentialPoll | null>((latest, poll) =>
  poll.endDate > "2024-11-05" && (!latest || poll.endDate > latest.endDate) ? poll : latest, null);

export function HomeElectionMap() {
  const { language } = useLanguage();
  const t = copy[language];
  const [yearIndex, setYearIndex] = useState(years.length - 1);
  const cycle = years[yearIndex];
  const names = t.names[cycle];
  const title = language === "en" ? `${cycle} ${t.results}` : `${t.results} ${cycle}`;
  const description = `${t.description} ${t.red}: ${names.red}; ${t.blue}: ${names.blue}. ${t.notes[cycle]}`;
  const progress = `${(yearIndex / (years.length - 1)) * 100}%`;

  return (
    <section className="campaign-panel" aria-labelledby="home-election-map-title">
      <p className="campaign-section-label">03 / {t.section}</p>
      <div className={styles.heading}>
        <h2 id="home-election-map-title">{title}</h2>
        <span className={styles.badge}>{yearIndex === years.length - 1 ? latestPoll ? t.latestMap : t.latest : t.official}</span>
      </div>
      {latestPoll ? (
        <div className={styles.pollUpdate}>
          <strong>{t.latestPoll}</strong>
          <p>{latestPoll.scope[language]} · {latestPoll.pollster} · {latestPoll.endDate}</p>
          <div className={styles.pollResults}>{latestPoll.results.map((result) => <span key={result.candidate}>{result.candidate} <b>{result.percent}%</b></span>)}</div>
          <a href={latestPoll.sourceUrl} rel="noreferrer" target="_blank">{t.originalSource}</a>
          <p>{t.pollMapNote}</p>
        </div>
      ) : null}
      <p>{description}</p>
      <div className={styles.timeline}>
        <div className={styles.timelineHeader}>
          <label htmlFor="home-election-year">{t.timeline}</label>
          <output htmlFor="home-election-year">{cycle}</output>
        </div>
        <input
          id="home-election-year"
          className={styles.slider}
          type="range"
          min={0}
          max={years.length - 1}
          step={1}
          value={yearIndex}
          onChange={(event) => setYearIndex(Number(event.currentTarget.value))}
          aria-valuetext={`${cycle} ${t.official}`}
          style={{ "--timeline-progress": progress } as CSSProperties}
        />
        <div className={styles.years} role="group" aria-label={t.timeline}>
          {years.map((year, index) => (
            <button key={year} type="button" className={index === yearIndex ? styles.activeYear : undefined} aria-pressed={index === yearIndex} onClick={() => setYearIndex(index)}>{year}</button>
          ))}
        </div>
        <p className={styles.hint}>{t.hint}</p>
      </div>
      <div className="us-map-legend">
        <span><i className={cycle === "2012" ? "is-romney" : "is-trump"} />{names.red}</span>
        <span><i className={`is-${cycle === "2012" ? "obama" : cycle === "2016" ? "clinton" : cycle === "2020" ? "biden" : "harris"}`} />{names.blue}</span>
      </div>
      <Us2024Map label={description} cycle={cycle} />
    </section>
  );
}
