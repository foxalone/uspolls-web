import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import type { AllElectionEntry } from "../lib/polls/allElectionArchive";
import type { ElectionResult, CandidateKey } from "../data/electionResults";
import styles from "./AllElectionTimeline.module.css";

const STEP = { poll: 196, news: 196, result: 372 };
const OVERSCAN = 700;
type Side = "both" | "electors" | "polls";

const copy = {
  en: {
    title: "All presidential elections",
    loading: "Loading earlier elections…",
    error: "Earlier elections could not be loaded. Scroll left to try again.",
    empty: "The election archive is unavailable.",
    result: "Final results",
    filterAll: "All",
    filterLabel: "Pollster",
    noPollster: "No polls from this pollster.",
    viewLabel: "What to show",
    onlyElectors: "Only electors",
    onlyPolls: "Only polls",
    electors: "Electors",
    news: "News",
    newsHover: "Biden dropped out and Kamala stepped in.",
    other: { bentsen: "1 vote for Bentsen", abstained: "1 elector abstained", edwards: "1 vote for Edwards", others: "7 votes for other candidates" },
    names: { bushSr: "Bush Sr.", bushJr: "Bush", dukakis: "Dukakis", clinton: "B. Clinton", hillary: "H. Clinton", dole: "Dole", gore: "Gore", kerry: "Kerry", mccain: "McCain", obama: "Obama", romney: "Romney", trump: "Trump", biden: "Biden", harris: "Harris" },
  },
  es: {
    title: "Todas las elecciones presidenciales",
    loading: "Cargando elecciones anteriores…",
    error: "No se pudieron cargar elecciones anteriores. Desplázate a la izquierda para reintentar.",
    empty: "El archivo electoral no está disponible.",
    result: "Resultado final",
    filterAll: "Todas",
    filterLabel: "Encuestadora",
    noPollster: "No hay encuestas de esta encuestadora.",
    viewLabel: "Qué mostrar",
    onlyElectors: "Solo electores",
    onlyPolls: "Solo encuestas",
    electors: "Electores",
    news: "Noticia",
    newsHover: "Biden se retiró y Kamala entró en la carrera.",
    other: { bentsen: "1 voto para Bentsen", abstained: "1 elector se abstuvo", edwards: "1 voto para Edwards", others: "7 votos para otros candidatos" },
    names: { bushSr: "Bush padre", bushJr: "Bush", dukakis: "Dukakis", clinton: "B. Clinton", hillary: "H. Clinton", dole: "Dole", gore: "Gore", kerry: "Kerry", mccain: "McCain", obama: "Obama", romney: "Romney", trump: "Trump", biden: "Biden", harris: "Harris" },
  },
  ru: {
    title: "Все президентские выборы",
    loading: "Загружаем предыдущие выборы…",
    error: "Не удалось загрузить предыдущие выборы. Прокрутите влево, чтобы повторить.",
    empty: "Архив выборов недоступен.",
    result: "Итог",
    filterAll: "Все",
    filterLabel: "Институт",
    noPollster: "У этого института нет опросов.",
    viewLabel: "Что показать",
    onlyElectors: "Только выборщики",
    onlyPolls: "Только опросы",
    electors: "Выборщики",
    news: "Новость",
    newsHover: "Байден вышел, и Камала вступила в гонку.",
    other: { bentsen: "1 голос Бентсену", abstained: "1 выборщик воздержался", edwards: "1 голос Эдвардсу", others: "7 голосов другим кандидатам" },
    names: { bushSr: "Буш-ст.", bushJr: "Буш", dukakis: "Дукакис", clinton: "Б. Клинтон", hillary: "Х. Клинтон", dole: "Доул", gore: "Гор", kerry: "Керри", mccain: "Маккейн", obama: "Обама", romney: "Ромни", trump: "Трамп", biden: "Байден", harris: "Харрис" },
  },
} as const;

type PollsterCount = { pollster: string; count: number };
type Page = { entries: AllElectionEntry[]; nextOffset: number | null; total: number; pollsterCounts: PollsterCount[] };

async function loadPage(pollster: string, offset?: number): Promise<Page> {
  const params = new URLSearchParams({ v: "3" });
  if (offset !== undefined) params.set("offset", String(offset));
  if (pollster !== "all") params.set("pollster", pollster);
  const response = await fetch(`/api/all-election-timeline?${params.toString()}`);
  if (!response.ok) throw new Error("election timeline unavailable");
  return await response.json() as Page;
}

function formatPercent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatRecorded(iso: string, language: Language) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString(languageLocale(language), { day: "2-digit", month: "2-digit", year: "numeric" });
}

function barShare(pct: number) {
  return `${Math.max(16, Math.min(100, (pct / 62) * 100))}%`;
}

function barVotes(votes: number) {
  return `${Math.max(16, Math.min(100, (votes / 538) * 100))}%`;
}

function leadClass(republicanPct: number, democratPct: number) {
  if (republicanPct === democratPct) return "";
  return republicanPct > democratPct ? " poll-bar--lead-trump" : " poll-bar--lead-democrat";
}

function democratTone(democrat: CandidateKey | "Harris" | "Clinton" | "Obama" | "Biden") {
  return democrat === "harris" || democrat === "Harris" ? "harris" : "biden";
}

function ScorePair({ republicanPct, democratPct, republicanName, democratName, tone, votes, names }: { republicanPct: number; democratPct: number; republicanName: string; democratName: string; tone: "biden" | "harris"; votes?: boolean; names?: boolean }) {
  const height = votes ? barVotes : barShare;
  return (
    <>
      <div className="poll-bar__col">
        <span className="poll-bar__pct">{votes ? republicanPct : formatPercent(republicanPct)}</span>
        <div className="poll-bar__track poll-bar__track--trump"><div className="poll-bar__fill poll-bar__fill--trump" style={{ height: height(republicanPct) }} /></div>
        {names ? <span className="poll-bar__who">{republicanName}</span> : null}
      </div>
      <div className="poll-bar__col">
        <span className="poll-bar__pct">{votes ? democratPct : formatPercent(democratPct)}</span>
        <div className={`poll-bar__track poll-bar__track--${tone}`}><div className={`poll-bar__fill poll-bar__fill--${tone}`} style={{ height: height(democratPct) }} /></div>
        {names ? <span className="poll-bar__who">{democratName}</span> : null}
      </div>
    </>
  );
}

function ResultCard({ result, language, side }: { result: ElectionResult; language: Language; side: Side }) {
  const t = copy[language];
  const tone = democratTone(result.democrat);
  const republicanName = t.names[result.republican];
  const democratName = t.names[result.democrat === "clinton" ? "clinton" : result.democrat];
  const note = result.otherElectors ? t.other[result.otherElectors.label] : "";
  const label = `${result.year} · ${t.result}`;
  const showPolls = side !== "electors";
  const showElectors = side !== "polls";
  const lead = showElectors && !showPolls ? leadClass(result.republicanElectors, result.democratElectors) : leadClass(result.republicanPct, result.democratPct);
  return (
    <article className={`poll-bar poll-bar--result${lead}`} role="listitem" aria-label={`${formatRecorded(result.recordedOn, language)}, ${label}, ${republicanName} ${formatPercent(result.republicanPct)}%, ${result.republicanElectors} ${t.electors}, ${democratName} ${formatPercent(result.democratPct)}%, ${result.democratElectors} ${t.electors}${note ? `, ${note}` : ""}`}>
      <div className="poll-bar__pair">
        {showPolls ? <ScorePair republicanPct={result.republicanPct} democratPct={result.democratPct} republicanName={republicanName} democratName={democratName} tone={tone} names /> : null}
        {showElectors ? (
          <div className={`poll-bar__votes${showPolls ? "" : " is-solo"}`}>
            <span className="poll-bar__votes-label">{t.electors}</span>
            <div className="poll-bar__pair">
              <ScorePair republicanPct={result.republicanElectors} democratPct={result.democratElectors} republicanName={republicanName} democratName={democratName} tone={tone} votes names={!showPolls} />
            </div>
          </div>
        ) : null}
      </div>
      <p className="poll-bar__date">{formatRecorded(result.recordedOn, language)}</p>
      <p className="poll-bar__pollster">{label}</p>
      <span className="poll-bar__dots" aria-hidden="true"><i className="poll-bar__dot poll-bar__dot--trump" /><i className={`poll-bar__dot poll-bar__dot--${tone}`} /></span>
    </article>
  );
}

function PollCard({ entry, language }: { entry: Extract<AllElectionEntry, { kind: "poll" }>; language: Language }) {
  const t = copy[language];
  const { poll } = entry;
  const republicanName = entry.cycle === 2012 ? t.names.romney : t.names.trump;
  const democratName = poll.democrat === "Harris" ? t.names.harris : poll.democrat === "Clinton" ? t.names.hillary : poll.democrat === "Obama" ? t.names.obama : t.names.biden;
  const tone = democratTone(poll.democrat);
  return (
    <article className={`poll-bar${leadClass(poll.trumpPct, poll.democratPct)}`} role="listitem" aria-label={`${formatRecorded(poll.recordedOn, language)}, ${poll.pollster}, ${republicanName} ${formatPercent(poll.trumpPct)}, ${democratName} ${formatPercent(poll.democratPct)}`}>
      <div className="poll-bar__pair">
        <ScorePair republicanPct={poll.trumpPct} democratPct={poll.democratPct} republicanName={republicanName} democratName={democratName} tone={tone} names />
      </div>
      <p className="poll-bar__date">{formatRecorded(poll.recordedOn, language)}</p>
      <p className="poll-bar__pollster">{poll.pollster}</p>
      <span className="poll-bar__dots" aria-hidden="true"><i className="poll-bar__dot poll-bar__dot--trump" /><i className={`poll-bar__dot poll-bar__dot--${tone}`} /></span>
    </article>
  );
}

function NewsCard({ language }: { language: Language }) {
  const t = copy[language];
  return (
    <article className="poll-bar poll-bar--news" role="listitem" aria-label={`${formatRecorded("2024-07-21", language)}, ${t.news}. ${t.newsHover}`}>
      <div className="poll-bar__pair">
        <div className="poll-bar__col">
          <span className="poll-bar__pct poll-bar__pct--news">{t.news}</span>
          <div className="poll-bar__track poll-bar__track--news"><div className="poll-bar__fill poll-bar__fill--news" style={{ height: "55%" }} /></div>
        </div>
      </div>
      <p className="poll-bar__date">{formatRecorded("2024-07-21", language)}</p>
      <p className="poll-bar__pollster">{t.newsHover}</p>
    </article>
  );
}

function stepOf(kind: AllElectionEntry["kind"], side: Side) {
  return kind === "result" && side === "both" ? STEP.result : STEP.poll;
}

function visibleEntries(entries: AllElectionEntry[], resultEntries: AllElectionEntry[] | null, side: Side) {
  if (side === "electors") return resultEntries ?? [];
  if (side === "polls") {
    const polls = entries.filter((entry) => entry.kind !== "result");
    return polls.length > 0 ? polls : entries.filter((entry) => entry.kind === "result");
  }
  return entries;
}

function placed(entries: AllElectionEntry[], side: Side) {
  const starts: number[] = [];
  const steps: number[] = [];
  let cursor = 0;
  for (const entry of entries) {
    const step = stepOf(entry.kind, side);
    starts.push(cursor);
    steps.push(step);
    cursor += step;
  }
  return { starts, steps, width: cursor };
}

export function AllElectionTimeline() {
  const { language } = useLanguage();
  const t = copy[language];
  const [entries, setEntries] = useState<AllElectionEntry[]>([]);
  const [resultEntries, setResultEntries] = useState<AllElectionEntry[] | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [pollster, setPollster] = useState("all");
  const [side, setSide] = useState<Side>("both");
  const [pollsterCounts, setPollsterCounts] = useState<PollsterCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewport, setViewport] = useState(1000);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const addedWidth = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const pollsterRef = useRef(pollster);
  pollsterRef.current = pollster;
  const sideRef = useRef(side);
  sideRef.current = side;
  const shown = useMemo(() => visibleEntries(entries, resultEntries, side), [entries, resultEntries, side]);
  const layout = useMemo(() => placed(shown, side), [shown, side]);

  useEffect(() => {
    let cancelled = false;
    loadPage("result").then((page) => {
      if (!cancelled) setResultEntries(page.entries);
    }).catch(() => { if (!cancelled) setResultEntries([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    initialized.current = false;
    addedWidth.current = null;
    loadingRef.current = false;
    setLoading(true);
    setError(false);
    setEntries([]);
    loadPage(pollster).then((page) => {
      if (cancelled) return;
      setEntries(page.entries);
      setNextOffset(page.nextOffset);
      setTotal(page.total);
      setPollsterCounts(page.pollsterCounts);
      setLoading(false);
    }).catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [pollster]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || shown.length === 0) return;
    if (side === "electors" && resultEntries === null) return;
    if (!initialized.current) {
      el.scrollLeft = el.scrollWidth;
      initialized.current = true;
    } else if (addedWidth.current !== null) {
      el.scrollLeft += addedWidth.current;
      addedWidth.current = null;
    }
    setScrollLeft(el.scrollLeft);
    setViewport(el.clientWidth);
  }, [layout.width, side, shown.length, resultEntries]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setViewport(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function choosePollster(next: string) {
    if (next === pollsterRef.current) return;
    setPollster(next);
  }

  function chooseSide(next: Exclude<Side, "both">) {
    addedWidth.current = null;
    initialized.current = false;
    setSide((current) => current === next ? "both" : next);
  }

  function loadOlder() {
    if (nextOffset === null || loadingRef.current) return;
    const filter = pollsterRef.current;
    loadingRef.current = true;
    setLoadingOlder(true);
    setError(false);
    loadPage(filter, nextOffset).then((page) => {
      if (pollsterRef.current !== filter) return;
      setEntries((current) => {
        const sideNow = sideRef.current;
        const before = placed(visibleEntries(current, resultEntries, sideNow), sideNow).width;
        const merged = [...page.entries, ...current];
        addedWidth.current = placed(visibleEntries(merged, resultEntries, sideNow), sideNow).width - before;
        return merged;
      });
      setNextOffset(page.nextOffset);
    }).catch(() => {
      addedWidth.current = null;
      setError(true);
    }).finally(() => {
      loadingRef.current = false;
      setLoadingOlder(false);
    });
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el || !initialized.current) return;
    setScrollLeft(el.scrollLeft);
    setViewport(el.clientWidth);
    if (el.scrollLeft < 700 && sideRef.current !== "electors") loadOlder();
  }

  const viewLeft = initialized.current ? scrollLeft : Math.max(0, layout.width - viewport);
  let first = 0;
  while (first < shown.length && layout.starts[first] + layout.steps[first] < viewLeft - OVERSCAN) first += 1;
  let last = first;
  while (last < shown.length && layout.starts[last] < viewLeft + viewport + OVERSCAN) last += 1;
  const visible = shown.slice(first, last);
  const resultSide: Side = side === "electors" ? "electors" : side === "polls" ? "polls" : "both";

  return (
    <section className={`campaign-panel ${styles.panel}`} aria-label={t.title}>
      <div className="poll-chips" role="group" aria-label={t.filterLabel}>
        <button type="button" className={pollster === "all" ? "is-active" : undefined} aria-pressed={pollster === "all"} onClick={() => choosePollster("all")}>{t.filterAll}</button>
        <button type="button" className={pollster === "result" ? "is-result is-active" : "is-result"} aria-pressed={pollster === "result"} onClick={() => choosePollster("result")}>{t.result}</button>
        {pollsterCounts.map(({ pollster: name }) => (
          <button type="button" key={name} className={pollster === name ? "is-active" : undefined} aria-pressed={pollster === name} onClick={() => choosePollster(name)}>{name}</button>
        ))}
      </div>
      <div className={styles.switcher} role="group" aria-label={t.viewLabel}>
        <button type="button" aria-pressed={side === "electors"} onClick={() => chooseSide("electors")}><i aria-hidden="true" />{t.onlyElectors}</button>
        <button type="button" aria-pressed={side === "polls"} onClick={() => chooseSide("polls")}><i aria-hidden="true" />{t.onlyPolls}</button>
      </div>
      {error && entries.length === 0 ? <p role="alert">{t.empty}</p> : !loading && entries.length === 0 ? <p className="poll-note">{t.noPollster}</p> : null}
      <div className={styles.scroller} ref={scrollerRef} onScroll={onScroll} role="list" aria-label={t.title} aria-busy={loading || loadingOlder} tabIndex={0}>
        <div className={styles.track} style={{ width: layout.width }}>
          {visible.map((entry, index) => (
            <div key={entry.id} className={styles.slot} data-kind={entry.kind} data-single={entry.kind === "result" && resultSide !== "both" ? "true" : undefined} style={{ left: layout.starts[first + index] }} role="listitem" aria-setsize={total} aria-posinset={total - entries.length + first + index + 1}>
              {entry.kind === "result" ? <ResultCard result={entry.result} language={language} side={resultSide} /> : entry.kind === "news" ? <NewsCard language={language} /> : <PollCard entry={entry} language={language} />}
            </div>
          ))}
        </div>
      </div>
      {loading || loadingOlder ? <p className={styles.status} role="status">{t.loading}</p> : error ? <p className={styles.status} role="alert">{t.error}</p> : null}
    </section>
  );
}
