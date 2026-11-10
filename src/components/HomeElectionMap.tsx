import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CYCLE_SIDES, MAP_CYCLES, type MapCycle } from "../data/historicalMaps";
import { PRESIDENTIAL_POLLS, type PresidentialPoll } from "../data/presidential2028";
import { useLanguage } from "../lib/language";
import { Us2024Map } from "./Us2024Map";
import styles from "./HomeElectionMap.module.css";

const years: MapCycle[] = [...MAP_CYCLES];

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
    description: "Each state is colored by its winner. The number is its electoral votes.",
    red: "Red",
    blue: "blue",
    names: {
      "1988": { red: "Bush Sr.", blue: "Dukakis" },
      "1992": { red: "Bush Sr.", blue: "B. Clinton" },
      "1996": { red: "Dole", blue: "B. Clinton" },
      "2000": { red: "Bush", blue: "Gore" },
      "2004": { red: "Bush", blue: "Kerry" },
      "2008": { red: "McCain", blue: "Obama" },
      "2012": { red: "Romney", blue: "Obama" },
      "2016": { red: "Trump", blue: "Clinton" },
      "2020": { red: "Trump", blue: "Biden" },
      "2024": { red: "Trump", blue: "Harris" },
    },
    notes: {
      "1988": "One West Virginia elector voted for Lloyd Bentsen.",
      "1992": "",
      "1996": "",
      "2000": "One District of Columbia elector cast a blank ballot.",
      "2004": "One Minnesota elector voted for John Edwards.",
      "2008": "Nebraska also awarded one electoral vote by district.",
      "2012": "Maine and Nebraska did not split electoral votes.",
      "2016": "Maine also awarded one electoral vote by district.",
      "2020": "Maine and Nebraska also awarded electoral votes by district.",
      "2024": "Maine and Nebraska also awarded electoral votes by district.",
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
    description: "Cada estado tiene el color de su ganador. El número indica sus votos electorales.",
    red: "Rojo",
    blue: "azul",
    names: {
      "1988": { red: "Bush padre", blue: "Dukakis" },
      "1992": { red: "Bush padre", blue: "B. Clinton" },
      "1996": { red: "Dole", blue: "B. Clinton" },
      "2000": { red: "Bush", blue: "Gore" },
      "2004": { red: "Bush", blue: "Kerry" },
      "2008": { red: "McCain", blue: "Obama" },
      "2012": { red: "Romney", blue: "Obama" },
      "2016": { red: "Trump", blue: "Clinton" },
      "2020": { red: "Trump", blue: "Biden" },
      "2024": { red: "Trump", blue: "Harris" },
    },
    notes: {
      "1988": "Un elector de Virginia Occidental votó por Lloyd Bentsen.",
      "1992": "",
      "1996": "",
      "2000": "Un elector del Distrito de Columbia dejó la papeleta en blanco.",
      "2004": "Un elector de Minnesota votó por John Edwards.",
      "2008": "Nebraska también asignó un voto por distrito.",
      "2012": "Maine y Nebraska no repartieron votos por distrito.",
      "2016": "Maine también asignó un voto por distrito.",
      "2020": "Maine y Nebraska también asignaron votos por distrito.",
      "2024": "Maine y Nebraska también asignaron votos por distrito.",
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
    description: "Цвет штата показывает победителя, число — голоса выборщиков.",
    red: "Красный",
    blue: "синий",
    names: {
      "1988": { red: "Буш-ст.", blue: "Дукакис" },
      "1992": { red: "Буш-ст.", blue: "Б. Клинтон" },
      "1996": { red: "Доул", blue: "Б. Клинтон" },
      "2000": { red: "Буш", blue: "Гор" },
      "2004": { red: "Буш", blue: "Керри" },
      "2008": { red: "Маккейн", blue: "Обама" },
      "2012": { red: "Ромни", blue: "Обама" },
      "2016": { red: "Трамп", blue: "Клинтон" },
      "2020": { red: "Трамп", blue: "Байден" },
      "2024": { red: "Трамп", blue: "Харрис" },
    },
    notes: {
      "1988": "Один выборщик Западной Виргинии отдал голос Ллойду Бентсену.",
      "1992": "",
      "1996": "",
      "2000": "Один выборщик округа Колумбия сдал пустой бюллетень.",
      "2004": "Один выборщик Миннесоты отдал голос Джону Эдвардсу.",
      "2008": "Небраска также распределила один голос по округу.",
      "2012": "Мэн и Небраска не делили голоса по округам.",
      "2016": "Мэн также распределил один голос по округу.",
      "2020": "Мэн и Небраска также распределили голоса по округам.",
      "2024": "Мэн и Небраска также распределили голоса по округам.",
    },
  },
} as const;

const latestPoll = PRESIDENTIAL_POLLS.reduce<PresidentialPoll | null>((latest, poll) =>
  poll.endDate > "2024-11-05" && (!latest || poll.endDate > latest.endDate) ? poll : latest, null);

export function HomeElectionMap() {
  const { language } = useLanguage();
  const t = copy[language];
  const [yearIndex, setYearIndex] = useState(years.length - 1);
  const yearListRef = useRef<HTMLDivElement>(null);
  const cycle = years[yearIndex];
  const names = t.names[cycle];
  const sides = CYCLE_SIDES[cycle];
  const title = language === "en" ? `${cycle} ${t.results}` : `${t.results} ${cycle}`;
  const note = t.notes[cycle];
  const description = `${t.description} ${t.red}: ${names.red}; ${t.blue}: ${names.blue}.${note ? ` ${note}` : ""}`;
  const progress = `${(yearIndex / (years.length - 1)) * 100}%`;

  useEffect(() => {
    const list = yearListRef.current;
    const button = list?.querySelector<HTMLButtonElement>("[aria-pressed='true']");
    if (!list || !button) return;
    const left = button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left) });
  }, [yearIndex]);

  return (
    <section className="campaign-panel" aria-labelledby="home-election-map-title">
      <p className="campaign-section-label">03 / {t.section}</p>
      <div className={styles.heading}>
        <h2 id="home-election-map-title">{title}</h2>
        <span className={styles.badgeSlot}>
          <span className={styles.badge}>{yearIndex === years.length - 1 ? latestPoll ? t.latestMap : t.latest : t.official}</span>
          <span className={`${styles.badge} ${styles.badgeSizer}`} aria-hidden="true">{t.latestMap}</span>
          <span className={`${styles.badge} ${styles.badgeSizer}`} aria-hidden="true">{t.latest}</span>
          <span className={`${styles.badge} ${styles.badgeSizer}`} aria-hidden="true">{t.official}</span>
        </span>
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
      <p className={styles.summary}>
        <span className={styles.summarySlot}>
          <span>{description}</span>
          {years.map((year) => {
            const item = t.names[year];
            const yearNote = t.notes[year];
            const text = `${t.description} ${t.red}: ${item.red}; ${t.blue}: ${item.blue}.${yearNote ? ` ${yearNote}` : ""}`;
            return <span key={year} className={styles.summarySizer} aria-hidden="true">{text}</span>;
          })}
        </span>
      </p>
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
        <div className={styles.years} ref={yearListRef} role="group" aria-label={t.timeline}>
          {years.map((year, index) => (
            <button key={year} type="button" className={index === yearIndex ? styles.activeYear : undefined} aria-pressed={index === yearIndex} onClick={() => setYearIndex(index)}>{year}</button>
          ))}
        </div>
      </div>
      <div className="us-map-legend">
        <span><i className={`is-${sides.red}`} />{names.red}</span>
        <span><i className={`is-${sides.blue}`} />{names.blue}</span>
      </div>
      <Us2024Map label={description} cycle={cycle} />
    </section>
  );
}
