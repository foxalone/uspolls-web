import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import type { HistoricalPollRow } from "../lib/polls/historical";
import { useHistoricalPages, useHistoricalPollster } from "../lib/polls/historicalClient";

const copy = {
  en: {
    lead: "National head-to-head polls from the 2024 election: Trump against Biden, then Trump against Harris after Biden left the race.",
    lead2020: "National head-to-head polls from the 2020 election: Trump against Biden.",
    lead2016: "National head-to-head polls from the 2016 election: Trump against Clinton.",
    lead2012: "National head-to-head polls from the 2012 election: Romney against Obama.",
    clinton: "Clinton",
    obama: "Obama",
    romney: "Romney",
    archiveEmptyTitle2012: "The 2012 archive is not loaded.",
    archiveEmptyText2012: "The Romney–Obama rows live in the local archive. This page will list them once that read succeeds.",
    archiveMissing2012: "The 2012 Romney–Obama archive is not available yet.",
    archiveEmptyTitle2016: "The 2016 archive is not loaded.",
    archiveEmptyText2016: "The Trump–Clinton rows live in Firebase. This page will list them once that read succeeds.",
    archiveMissing2016: "Firebase does not have the 2016 Trump–Clinton archive yet.",
    archiveEmptyTitle2020: "The 2020 archive is not loaded.",
    archiveEmptyText2020: "The Trump–Biden rows live in Firebase. This page will list them once that read succeeds.",
    archiveMissing2020: "Firebase does not have the 2020 Trump–Biden archive yet.",
    trump: "Trump",
    biden: "Biden",
    harris: "Harris",
    candidateFilter: "Candidates",
    filterLabel: "Pollster",
    filterAll: "All",
    resultFilter: "Final results",
    electors: "Electors",
    loadingMore: "Loading earlier polls",
    noPollster: "No polls from this pollster.",
    filterLoadError: "This pollster's polls could not be loaded.",
    noCandidate: "No polls for this selection.",
    news: "News",
    newsHover: "Biden dropped out and Kamala stepped in.",
    archiveEmptyTitle: "The 2024 archive is not loaded.",
    archiveEmptyText: "The Trump–Biden rows live in Firebase. This page will list them once that read succeeds.",
    archiveMissing: "Firebase does not have the 2024 Trump–Biden archive yet.",
  },
  es: {
    lead: "Encuestas nacionales de 2024: Trump contra Biden y, tras su retirada, Trump contra Harris.",
    lead2020: "Encuestas nacionales de 2020: Trump contra Biden.",
    lead2016: "Encuestas nacionales de 2016: Trump contra Clinton.",
    lead2012: "Encuestas nacionales de 2012: Romney contra Obama.",
    clinton: "Clinton",
    obama: "Obama",
    romney: "Romney",
    archiveEmptyTitle2012: "El archivo de 2012 no está cargado.",
    archiveEmptyText2012: "Las filas de Romney–Obama están en el archivo local. Esta página las mostrará cuando esa lectura funcione.",
    archiveMissing2012: "El archivo Romney–Obama de 2012 todavía no está disponible.",
    archiveEmptyTitle2016: "El archivo de 2016 no está cargado.",
    archiveEmptyText2016: "Las filas de Trump–Clinton están en Firebase. Esta página las mostrará cuando esa lectura funcione.",
    archiveMissing2016: "Firebase todavía no tiene el archivo Trump–Clinton de 2016.",
    archiveEmptyTitle2020: "El archivo de 2020 no está cargado.",
    archiveEmptyText2020: "Las filas de Trump–Biden están en Firebase. Esta página las mostrará cuando esa lectura funcione.",
    archiveMissing2020: "Firebase todavía no tiene el archivo Trump–Biden de 2020.",
    trump: "Trump",
    biden: "Biden",
    harris: "Harris",
    candidateFilter: "Candidatos",
    filterLabel: "Encuestadora",
    filterAll: "Todas",
    resultFilter: "Resultado final",
    electors: "Electores",
    loadingMore: "Cargando encuestas anteriores",
    noPollster: "No hay encuestas de esta encuestadora.",
    filterLoadError: "No se pudieron cargar las encuestas de esta encuestadora.",
    noCandidate: "No hay encuestas para esta selección.",
    news: "Noticia",
    newsHover: "Biden se retiró y Kamala entró en la carrera.",
    archiveEmptyTitle: "El archivo de 2024 no está cargado.",
    archiveEmptyText: "Las filas de Trump–Biden están en Firebase. Esta página las mostrará cuando esa lectura funcione.",
    archiveMissing: "Firebase todavía no tiene el archivo Trump–Biden de 2024.",
  },
  ru: {
    lead: "Общенациональные опросы 2024 года: Трамп против Байдена, а после его выхода из гонки — Трамп против Харрис.",
    lead2020: "Общенациональные опросы 2020 года: Трамп против Байдена.",
    lead2016: "Общенациональные опросы 2016 года: Трамп против Клинтон.",
    lead2012: "Общенациональные опросы 2012 года: Ромни против Обамы.",
    clinton: "Клинтон",
    obama: "Обама",
    romney: "Ромни",
    archiveEmptyTitle2012: "Архив 2012 года не загрузился.",
    archiveEmptyText2012: "Строки Ромни–Обама лежат в локальном архиве. Страница покажет их, когда это чтение удастся.",
    archiveMissing2012: "Архив Ромни–Обама за 2012 год пока недоступен.",
    archiveEmptyTitle2016: "Архив 2016 года не загрузился.",
    archiveEmptyText2016: "Строки Трамп–Клинтон лежат в Firebase. Страница покажет их, когда это чтение удастся.",
    archiveMissing2016: "В Firebase пока нет архива Трамп–Клинтон за 2016 год.",
    archiveEmptyTitle2020: "Архив 2020 года не загрузился.",
    archiveEmptyText2020: "Строки Трамп–Байден лежат в Firebase. Страница покажет их, когда это чтение удастся.",
    archiveMissing2020: "В Firebase пока нет архива Трамп–Байден за 2020 год.",
    trump: "Трамп",
    biden: "Байден",
    harris: "Харрис",
    candidateFilter: "Кандидаты",
    filterLabel: "Институт",
    filterAll: "Все",
    resultFilter: "Итог",
    electors: "Выборщики",
    loadingMore: "Загружаем более ранние опросы",
    noPollster: "У этого института нет опросов.",
    filterLoadError: "Не удалось загрузить опросы этого института.",
    noCandidate: "Для этого выбора опросов нет.",
    news: "Новость",
    newsHover: "Байден вышел, и Камала вступила в гонку.",
    archiveEmptyTitle: "Архив 2024 года не загрузился.",
    archiveEmptyText: "Строки Трамп–Байден лежат в Firebase. Страница покажет их, когда это чтение удастся.",
    archiveMissing: "В Firebase пока нет архива Трамп–Байден за 2024 год.",
  },
} as const;

const OFFICIAL = {
  "2024": { recordedOn: "2024-11-05", trumpPct: 49.8, democratPct: 48.3, trumpVotes: 312, democratVotes: 226, democrat: "Harris" },
  "2020": { recordedOn: "2020-11-03", trumpPct: 46.9, democratPct: 51.3, trumpVotes: 232, democratVotes: 306, democrat: "Biden" },
  "2016": { recordedOn: "2016-11-08", trumpPct: 46.1, democratPct: 48.2, trumpVotes: 304, democratVotes: 227, democrat: "Clinton" },
  "2012": { recordedOn: "2012-11-06", trumpPct: 47.2, democratPct: 51.1, trumpVotes: 206, democratVotes: 332, democrat: "Obama" },
} as const;

type Cycle = keyof typeof OFFICIAL;

type ShownPoll = { poll: HistoricalPollRow; trump: boolean; democrat: boolean };
type TimelineEntry = { kind: "news" } | ({ kind: "poll" } & ShownPoll);

function formatPercent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatRecorded(iso: string, language: Language) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString(languageLocale(language), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function barShare(pct: number) {
  return `${Math.max(16, Math.min(100, (pct / 62) * 100))}%`;
}

function barVotes(votes: number) {
  return `${Math.max(16, Math.min(100, (votes / 538) * 100))}%`;
}

function leadClass(trumpPct: number, democratPct: number) {
  if (trumpPct === democratPct) return "";
  return trumpPct > democratPct ? " poll-bar--lead-trump" : " poll-bar--lead-democrat";
}

export function Historical2024Board({
  variant,
  cycle = "2024",
}: {
  variant: "timeline" | "list";
  cycle?: Cycle;
}) {
  const { language } = useLanguage();
  const t = copy[language];
  const official = OFFICIAL[cycle];
  const newsOn = cycle === "2024" ? "2024-07-21" : null;
  const lead = cycle === "2012" ? t.lead2012 : cycle === "2016" ? t.lead2016 : cycle === "2020" ? t.lead2020 : t.lead;
  const republican = cycle === "2012" ? t.romney : t.trump;
  const [pollster, setPollster] = useState("all");
  const { rows: polls, pollsterCounts, error, loading, hasMore, loadMore } = useHistoricalPages(cycle);
  const selected = useHistoricalPollster(cycle, pollster);
  const [sides, setSides] = useState({ trump: true, biden: cycle !== "2016", harris: cycle === "2024", clinton: cycle === "2016" });
  const barsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const scrollWidthBefore = useRef<number | null>(null);
  const snapFrame = useRef(0);

  function choosePollster(next: string) {
    pinned.current = true;
    setPollster(next);
  }

  function toggleSide(side: "trump" | "biden" | "harris" | "clinton") {
    pinned.current = true;
    setSides((current) => {
      const next = { ...current, [side]: !current[side] };
      const any = next.trump || next.biden || next.clinton || (cycle === "2024" && next.harris);
      if (!any) return current;
      return next;
    });
  }

  const resultOnly = pollster === "result";
  const visible = pollster === "all" || resultOnly ? polls : selected.rows;
  const shown = (resultOnly ? [] : visible).flatMap((poll) => {
    const democratOn = poll.democrat === "Harris" ? sides.harris : poll.democrat === "Clinton" ? sides.clinton : sides.biden;
    const onlyTrump = sides.trump && !sides.biden && !sides.harris && !sides.clinton;
    if (!onlyTrump && !democratOn) return [];
    return [{ poll, trump: sides.trump, democrat: democratOn }];
  });
  const officialOn = official.democrat === "Harris" ? sides.harris : official.democrat === "Clinton" ? sides.clinton : sides.biden;
  const showResult = sides.trump || officialOn;
  const timeline: TimelineEntry[] = [];
  if (shown.length > 0) {
    let newsPlaced = false;
    const oldest = shown[0].poll.recordedOn;
    const showNews = Boolean(newsOn) && (oldest < (newsOn ?? "") || !hasMore);
    for (const entry of shown) {
      if (showNews && newsOn && !newsPlaced && entry.poll.recordedOn >= newsOn) {
        timeline.push({ kind: "news" });
        newsPlaced = true;
      }
      timeline.push({ kind: "poll", ...entry });
    }
    if (showNews && newsOn && !newsPlaced) timeline.push({ kind: "news" });
  }
  const entries = variant === "list" ? [...timeline].reverse() : timeline;

  useLayoutEffect(() => {
    const el = barsRef.current;
    if (!el || variant !== "timeline") return;
    if (scrollWidthBefore.current !== null) {
      const previous = scrollWidthBefore.current;
      scrollWidthBefore.current = null;
      el.scrollLeft += el.scrollWidth - previous;
      return;
    }
    if (!pinned.current) return;
    const snapToEnd = () => {
      el.scrollLeft = el.scrollWidth;
    };
    snapToEnd();
    snapFrame.current = requestAnimationFrame(snapToEnd);
    return () => cancelAnimationFrame(snapFrame.current);
  }, [variant, pollster, sides.trump, sides.biden, sides.harris, sides.clinton, visible.length]);

  useEffect(() => {
    if (variant !== "list" || pollster !== "all") return;
    let quiet = true;
    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      const node = moreRef.current;
      if (quiet && node && node.getBoundingClientRect().top <= window.innerHeight + 80) loadMore();
      quiet = false;
      timer = window.setTimeout(() => { quiet = true; }, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant, pollster, loadMore]);

  function onBarsScroll() {
    const el = barsRef.current;
    if (!el || variant !== "timeline") return;
    cancelAnimationFrame(snapFrame.current);
    const fromEnd = el.scrollWidth - el.clientWidth - el.scrollLeft;
    pinned.current = fromEnd < 48;
    if (pollster !== "all") return;
    if (el.scrollWidth <= el.clientWidth + 40) return;
    if (el.scrollLeft > 320) return;
    if (!loadMore()) return;
    scrollWidthBefore.current = el.scrollWidth;
    pinned.current = false;
  }

  if (!loading && polls.length === 0) {
    return (
      <section className="poll-empty campaign-panel" aria-live="polite">
        <div className="poll-empty__icon" aria-hidden="true">◎</div>
        <h2>{cycle === "2012" ? t.archiveEmptyTitle2012 : cycle === "2016" ? t.archiveEmptyTitle2016 : cycle === "2020" ? t.archiveEmptyTitle2020 : t.archiveEmptyTitle}</h2>
        <p>{error ? (cycle === "2012" ? t.archiveEmptyText2012 : cycle === "2016" ? t.archiveEmptyText2016 : cycle === "2020" ? t.archiveEmptyText2020 : t.archiveEmptyText) : (cycle === "2012" ? t.archiveMissing2012 : cycle === "2016" ? t.archiveMissing2016 : cycle === "2020" ? t.archiveMissing2020 : t.archiveMissing)}</p>
      </section>
    );
  }

  const loadingMore = loading && polls.length > 0 && pollster === "all";
  const resultLead = leadClass(official.trumpPct, official.democratPct);
  const resultNames = { trump: republican, democrat: official.democrat === "Harris" ? t.harris : official.democrat === "Clinton" ? t.clinton : official.democrat === "Obama" ? t.obama : t.biden, resultFilter: t.resultFilter, electors: t.electors };
  const cardNames = { ...t, trump: republican };
  return (
    <section className="poll-archive">
      <div className="campaign-panel">
        <div className="poll-chips" role="group" aria-label={t.filterLabel}>
          <button type="button" className={pollster === "all" ? "is-active" : undefined} aria-pressed={pollster === "all"} onClick={() => choosePollster("all")}>{t.filterAll}</button>
          <button type="button" className={pollster === "result" ? "is-result is-active" : "is-result"} aria-pressed={pollster === "result"} onClick={() => choosePollster("result")}>{t.resultFilter}</button>
          {pollsterCounts.map(({ pollster: name }) => (
            <button type="button" key={name} className={pollster === name ? "is-active" : undefined} aria-pressed={pollster === name} onClick={() => choosePollster(name)}>{name}</button>
          ))}
        </div>
        {visible.length === 0 && !(loading && polls.length === 0) && !selected.loading ? <p className="poll-note">{selected.error ? t.filterLoadError : t.noPollster}</p> : (
          <>
            <div className="poll-bar-legend" role="group" aria-label={t.candidateFilter}>
              <button type="button" className={sides.trump ? "is-active is-trump" : undefined} aria-pressed={sides.trump} onClick={() => toggleSide("trump")}><i className="poll-bar__swatch poll-bar__swatch--trump" />{republican}</button>
              {cycle === "2016" ? <button type="button" className={sides.clinton ? "is-active is-biden" : undefined} aria-pressed={sides.clinton} onClick={() => toggleSide("clinton")}><i className="poll-bar__swatch poll-bar__swatch--biden" />{t.clinton}</button> : <button type="button" className={sides.biden ? "is-active is-biden" : undefined} aria-pressed={sides.biden} onClick={() => toggleSide("biden")}><i className="poll-bar__swatch poll-bar__swatch--biden" />{cycle === "2012" ? t.obama : t.biden}</button>}
              {cycle === "2024" ? <button type="button" className={sides.harris ? "is-active is-harris" : undefined} aria-pressed={sides.harris} onClick={() => toggleSide("harris")}><i className="poll-bar__swatch poll-bar__swatch--harris" />{t.harris}</button> : null}
              <button type="button" className={resultOnly ? "is-active is-result" : undefined} aria-pressed={resultOnly} onClick={() => choosePollster(resultOnly ? "all" : "result")}><i className="poll-bar__swatch poll-bar__swatch--result" />{t.resultFilter}</button>
            </div>
            {shown.length === 0 && !showResult ? <p className="poll-note">{t.noCandidate}</p> : variant === "timeline" ? (
              <div className="poll-bars" ref={barsRef} role="list" aria-label={lead} aria-busy={loading || selected.loading} onScroll={onBarsScroll}>
                {loadingMore ? <LoadingMore label={t.loadingMore} /> : null}
                {entries.map((entry) => entry.kind === "news" ? <NewsCard key="2024-07-21-news" language={language} label={t.news} text={t.newsHover} /> : <TimelineCard key={entry.poll.id} entry={entry} language={language} names={cardNames} />)}
                {showResult ? <TimelineResult language={language} names={resultNames} official={official} trump={sides.trump} democrat={officialOn} lead={resultLead} /> : null}
              </div>
            ) : null}
          </>
        )}
      </div>
      {variant === "list" && (visible.length > 0 || (loading && polls.length === 0)) && (shown.length > 0 || showResult) ? (
        <div className="poll-rows" role="list" aria-label={lead} aria-busy={loading || selected.loading}>
          {showResult ? <ListResult language={language} names={resultNames} official={official} trump={sides.trump} democrat={officialOn} lead={resultLead} /> : null}
          {entries.map((entry) => entry.kind === "news" ? <NewsRow key="2024-07-21-news" language={language} label={t.news} text={t.newsHover} /> : <ListCard key={entry.poll.id} entry={entry} language={language} names={cardNames} />)}
          {loadingMore ? <LoadingMoreRow label={t.loadingMore} /> : null}
          {hasMore && pollster === "all" ? <div ref={moreRef} className="poll-more" /> : null}
        </div>
      ) : null}
    </section>
  );
}

function LoadingMore({ label }: { label: string }) {
  return (
    <article className="poll-bar poll-bar--loading" role="status" aria-live="polite" aria-label={label}>
      <div className="poll-load__bars" aria-hidden="true">
        <span />
        <span />
      </div>
      <p className="poll-load__label"><span className="poll-load__dots" aria-hidden="true"><i /><i /><i /></span>{label}</p>
    </article>
  );
}

function LoadingMoreRow({ label }: { label: string }) {
  return (
    <article className="poll-row poll-row--loading" role="status" aria-live="polite" aria-label={label}>
      <span className="poll-load__dots" aria-hidden="true"><i /><i /><i /></span>
      <p className="poll-load__label">{label}</p>
    </article>
  );
}

function NewsCard({ language, label, text }: { language: Language; label: string; text: string }) {
  return (
    <article className="poll-bar poll-bar--news" role="listitem" aria-label={`${formatRecorded("2024-07-21", language)}, ${label}. ${text}`}>
      <div className="poll-bar__pair">
        <div className="poll-bar__col">
          <span className="poll-bar__pct poll-bar__pct--news">{label}</span>
          <div className="poll-bar__track poll-bar__track--news"><div className="poll-bar__fill poll-bar__fill--news" style={{ height: "55%" }} /></div>
        </div>
      </div>
      <p className="poll-bar__date">{formatRecorded("2024-07-21", language)}</p>
      <p className="poll-bar__pollster">{text}</p>
    </article>
  );
}

function democratLabel(democrat: ShownPoll["poll"]["democrat"], names: { biden: string; harris: string; clinton: string; obama: string }) {
  if (democrat === "Harris") return names.harris;
  if (democrat === "Clinton") return names.clinton;
  if (democrat === "Obama") return names.obama;
  return names.biden;
}

function TimelineCard({ entry, language, names }: { entry: ShownPoll; language: Language; names: { trump: string; biden: string; harris: string; clinton: string; obama: string } }) {
  const { poll, trump, democrat } = entry;
  const democratName = democratLabel(poll.democrat, names);
  const scores = [trump ? `${names.trump} ${formatPercent(poll.trumpPct)}` : "", democrat ? `${democratName} ${formatPercent(poll.democratPct)}` : ""].filter(Boolean).join(", ");
  return (
    <article className={`poll-bar${leadClass(poll.trumpPct, poll.democratPct)}`} role="listitem" aria-label={`${formatRecorded(poll.recordedOn, language)}, ${poll.pollster}, ${scores}`}>
      <div className="poll-bar__pair">
        {trump ? (
          <div className="poll-bar__col">
            <span className="poll-bar__pct">{formatPercent(poll.trumpPct)}</span>
            <div className="poll-bar__track poll-bar__track--trump"><div className="poll-bar__fill poll-bar__fill--trump" style={{ height: barShare(poll.trumpPct) }}><span className="poll-bar__name">{names.trump}</span></div></div>
          </div>
        ) : null}
        {democrat ? (
          <div className="poll-bar__col">
            <span className="poll-bar__pct">{formatPercent(poll.democratPct)}</span>
            <div className={`poll-bar__track poll-bar__track--${poll.democrat === "Harris" ? "harris" : "biden"}`}><div className={`poll-bar__fill poll-bar__fill--${poll.democrat === "Harris" ? "harris" : "biden"}`} style={{ height: barShare(poll.democratPct) }}><span className={`poll-bar__name poll-bar__name--${poll.democrat === "Harris" ? "harris" : "biden"}`}>{democratName}</span></div></div>
          </div>
        ) : null}
      </div>
      <p className="poll-bar__date">{formatRecorded(poll.recordedOn, language)}</p>
      <p className="poll-bar__pollster">{poll.pollster}</p>
      <span className="poll-bar__dots" aria-hidden="true">
        {trump ? <i className="poll-bar__dot poll-bar__dot--trump" /> : null}
        {democrat ? <i className={`poll-bar__dot poll-bar__dot--${poll.democrat === "Harris" ? "harris" : "biden"}`} /> : null}
      </span>
    </article>
  );
}

function TimelineResult({ language, names, official, trump, democrat, lead }: { language: Language; names: { trump: string; democrat: string; resultFilter: string; electors: string }; official: { recordedOn: string; trumpPct: number; democratPct: number; trumpVotes: number; democratVotes: number; democrat: "Obama" | "Clinton" | "Biden" | "Harris" }; trump: boolean; democrat: boolean; lead: string }) {
  const tone = official.democrat === "Harris" ? "harris" : "biden";
  const scores = [
    trump ? `${names.trump} ${formatPercent(official.trumpPct)}%, ${official.trumpVotes} ${names.electors}` : "",
    democrat ? `${names.democrat} ${formatPercent(official.democratPct)}%, ${official.democratVotes} ${names.electors}` : "",
  ].filter(Boolean).join(", ");
  return (
    <article className={`poll-bar poll-bar--result${lead}`} role="listitem" aria-label={`${formatRecorded(official.recordedOn, language)}, ${names.resultFilter}, ${scores}`}>
      <div className="poll-bar__pair">
        {trump ? (
          <div className="poll-bar__col">
            <span className="poll-bar__pct">{formatPercent(official.trumpPct)}</span>
            <div className="poll-bar__track poll-bar__track--trump"><div className="poll-bar__fill poll-bar__fill--trump" style={{ height: barShare(official.trumpPct) }}><span className="poll-bar__name">{names.trump}</span></div></div>
          </div>
        ) : null}
        {democrat ? (
          <div className="poll-bar__col">
            <span className="poll-bar__pct">{formatPercent(official.democratPct)}</span>
            <div className={`poll-bar__track poll-bar__track--${tone}`}><div className={`poll-bar__fill poll-bar__fill--${tone}`} style={{ height: barShare(official.democratPct) }}><span className={`poll-bar__name poll-bar__name--${tone}`}>{names.democrat}</span></div></div>
          </div>
        ) : null}
        <div className="poll-bar__votes">
          <span className="poll-bar__votes-label">{names.electors}</span>
          <div className="poll-bar__pair">
            {trump ? (
              <div className="poll-bar__col">
                <span className="poll-bar__pct">{official.trumpVotes}</span>
                <div className="poll-bar__track poll-bar__track--trump"><div className="poll-bar__fill poll-bar__fill--trump" style={{ height: barVotes(official.trumpVotes) }}><span className="poll-bar__name">{names.trump}</span></div></div>
              </div>
            ) : null}
            {democrat ? (
              <div className="poll-bar__col">
                <span className="poll-bar__pct">{official.democratVotes}</span>
                <div className={`poll-bar__track poll-bar__track--${tone}`}><div className={`poll-bar__fill poll-bar__fill--${tone}`} style={{ height: barVotes(official.democratVotes) }}><span className={`poll-bar__name poll-bar__name--${tone}`}>{names.democrat}</span></div></div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <p className="poll-bar__date">{formatRecorded(official.recordedOn, language)}</p>
      <p className="poll-bar__pollster">{names.resultFilter}</p>
      <span className="poll-bar__dots" aria-hidden="true">
        {trump ? <i className="poll-bar__dot poll-bar__dot--trump" /> : null}
        {democrat ? <i className={`poll-bar__dot poll-bar__dot--${tone}`} /> : null}
      </span>
    </article>
  );
}

function CandidateLines({ trumpPct, democratPct, democratName, democratKey, trump, democrat, names }: { trumpPct: number; democratPct: number; democratName: string; democratKey: "biden" | "harris"; trump: boolean; democrat: boolean; names: { trump: string } }) {
  return (
    <div className="poll-row__bars">
      {trump ? (
        <div className="poll-row__line">
          <span className="poll-row__who">{names.trump}</span>
          <div className="poll-row__track poll-bar__track--trump"><div className="poll-row__fill poll-bar__fill--trump" style={{ width: barShare(trumpPct) }} /></div>
          <strong className="poll-row__pct">{formatPercent(trumpPct)}</strong>
        </div>
      ) : null}
      {democrat ? (
        <div className="poll-row__line">
          <span className="poll-row__who">{democratName}</span>
          <div className={`poll-row__track poll-bar__track--${democratKey}`}><div className={`poll-row__fill poll-bar__fill--${democratKey}`} style={{ width: barShare(democratPct) }} /></div>
          <strong className="poll-row__pct">{formatPercent(democratPct)}</strong>
        </div>
      ) : null}
    </div>
  );
}

function ListCard({ entry, language, names }: { entry: ShownPoll; language: Language; names: { trump: string; biden: string; harris: string; clinton: string; obama: string } }) {
  const { poll, trump, democrat } = entry;
  const democratName = democratLabel(poll.democrat, names);
  const scores = [trump ? `${names.trump} ${formatPercent(poll.trumpPct)}` : "", democrat ? `${democratName} ${formatPercent(poll.democratPct)}` : ""].filter(Boolean).join(", ");
  return (
    <article className={`poll-row${leadClass(poll.trumpPct, poll.democratPct)}`} role="listitem" aria-label={`${formatRecorded(poll.recordedOn, language)}, ${poll.pollster}, ${scores}`}>
      <div className="poll-row__meta">
        <p className="poll-bar__date">{formatRecorded(poll.recordedOn, language)}</p>
        <p className="poll-bar__pollster">{poll.pollster}</p>
      </div>
      <CandidateLines trumpPct={poll.trumpPct} democratPct={poll.democratPct} democratName={democratName} democratKey={poll.democrat === "Harris" ? "harris" : "biden"} trump={trump} democrat={democrat} names={names} />
    </article>
  );
}

function ListResult({ language, names, official, trump, democrat, lead }: { language: Language; names: { trump: string; democrat: string; resultFilter: string; electors: string }; official: { recordedOn: string; trumpPct: number; democratPct: number; trumpVotes: number; democratVotes: number; democrat: "Obama" | "Clinton" | "Biden" | "Harris" }; trump: boolean; democrat: boolean; lead: string }) {
  const tone = official.democrat === "Harris" ? "harris" : "biden";
  const scores = [
    trump ? `${names.trump} ${formatPercent(official.trumpPct)}%, ${official.trumpVotes} ${names.electors}` : "",
    democrat ? `${names.democrat} ${formatPercent(official.democratPct)}%, ${official.democratVotes} ${names.electors}` : "",
  ].filter(Boolean).join(", ");
  return (
    <article className={`poll-row poll-bar--result${lead}`} role="listitem" aria-label={`${formatRecorded(official.recordedOn, language)}, ${names.resultFilter}, ${scores}`}>
      <div className="poll-row__meta">
        <p className="poll-bar__date">{formatRecorded(official.recordedOn, language)}</p>
        <p className="poll-bar__pollster">{names.resultFilter}</p>
      </div>
      <div className="poll-row__scores">
        <CandidateLines trumpPct={official.trumpPct} democratPct={official.democratPct} democratName={names.democrat} democratKey={tone} trump={trump} democrat={democrat} names={names} />
        <div className="poll-row__bars">
          <span className="poll-row__note">{names.electors}</span>
          {trump ? (
            <div className="poll-row__line">
              <span className="poll-row__who">{names.trump}</span>
              <div className="poll-row__track poll-bar__track--trump"><div className="poll-row__fill poll-bar__fill--trump" style={{ width: barVotes(official.trumpVotes) }} /></div>
              <strong className="poll-row__pct">{official.trumpVotes}</strong>
            </div>
          ) : null}
          {democrat ? (
            <div className="poll-row__line">
              <span className="poll-row__who">{names.democrat}</span>
              <div className={`poll-row__track poll-bar__track--${tone}`}><div className={`poll-row__fill poll-bar__fill--${tone}`} style={{ width: barVotes(official.democratVotes) }} /></div>
              <strong className="poll-row__pct">{official.democratVotes}</strong>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function NewsRow({ language, label, text }: { language: Language; label: string; text: string }) {
  return (
    <article className="poll-row poll-row--news" role="listitem" aria-label={`${formatRecorded("2024-07-21", language)}, ${label}. ${text}`}>
      <div className="poll-row__meta">
        <p className="poll-bar__date">{formatRecorded("2024-07-21", language)}</p>
        <p className="poll-bar__pollster">{text}</p>
      </div>
      <div className="poll-row__bars">
        <div className="poll-row__line">
          <span className="poll-row__who">{label}</span>
          <div className="poll-row__track poll-bar__track--news"><div className="poll-row__fill poll-bar__fill--news" style={{ width: "55%" }} /></div>
          <span />
        </div>
      </div>
    </article>
  );
}
