import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Historical2024Board } from "../src/components/Historical2024Board";
import { PRESIDENTIAL_POLLS } from "../src/data/presidential2028";
import { languageLocale, useLanguage } from "../src/lib/language";

const copy = {
  en: {
    eyebrow: "The polling desk",
    title: "Presidential polls",
    description: "National polls for the 2028 presidential race, and the 2012, 2016, 2020 and 2024 archives.",
    lead2028: "Every survey belongs to a question, a place and a moment. We will show those details before drawing a trend.",
    lead2024: "National head-to-head polls from the 2024 election: Trump against Biden, then Trump against Harris after Biden left the race.",
    lead2020: "National head-to-head polls from the 2020 election: Trump against Biden.",
    lead2016: "National head-to-head polls from the 2016 election: Trump against Clinton.",
    lead2012: "National head-to-head polls from the 2012 election: Romney against Obama.",
    count: "verified polls",
    tab2012: "2012 · Romney / Obama",
    tab2016: "2016 · Trump / Clinton",
    tab2020: "2020 · Trump / Biden",
    tab2024: "2024 · Trump / Harris",
    tab2028: "2028",
    previous: "Previous election",
    emptyTitle: "The board is ready. The data is not here yet.",
    emptyText: "No verified 2028 presidential polls have been added to this site. When they are, each result will link to its original source and show field dates, sample size and voter population.",
    archiveEmptyTitle: "The 2024 archive is not loaded.",
    archiveEmptyText: "The Trump–Biden rows live in Firebase. This page will list them once that read succeeds.",
    archiveMissing: "Firebase does not have the 2024 Trump–Biden archive yet.",
    trump: "Trump",
    biden: "Biden",
    harris: "Harris",
    candidateFilter: "Candidates",
    filterLabel: "Pollster",
    filterAll: "All",
    resultFilter: "Final results",
    noPollster: "No polls from this pollster.",
    noCandidate: "No polls for this selection.",
    date: "Recorded",
    pollster: "Pollster",
    news: "News",
    newsHover: "Biden dropped out and Kamala stepped in.",
    criteria: "What qualifies for this board",
    item1: "A question explicitly about the 2028 presidential nomination or general election.",
    item2: "A named pollster and a publicly traceable original publication.",
    item3: "Field dates, sample size, voter population and the exact results reported.",
    methodTitle: "Averages come after comparable polls",
    methodText: "Primary and general-election questions are kept separate. We will not average different candidates, states or voter populations into a single headline number. Until a transparent method and enough comparable polls are in place, the site shows source-level results only.",
    sourceTitle: "Follow the source trail",
    sourceText: "The Federal Election Commission lists candidate filings. VoteHub publishes an open polling API, but its documented categories do not yet establish a verified 2028 presidential feed for this site.",
    fec: "FEC candidate filings ↗",
    votehub: "VoteHub API documentation ↗",
    viewCalendar: "See the election timeline →",
    sample: "sample",
    source: "Original source ↗",
  },
  es: {
    eyebrow: "Mesa de encuestas",
    title: "Encuestas presidenciales",
    description: "Encuestas nacionales de la carrera de 2028 y los archivos de 2012, 2016, 2020 y 2024.",
    lead2028: "Cada encuesta responde a una pregunta, un lugar y un momento. Mostraremos esos detalles antes de trazar tendencias.",
    lead2024: "Encuestas nacionales de 2024: Trump contra Biden y, tras su retirada, Trump contra Harris.",
    lead2020: "Encuestas nacionales de 2020: Trump contra Biden.",
    lead2016: "Encuestas nacionales de 2016: Trump contra Clinton.",
    lead2012: "Encuestas nacionales de 2012: Romney contra Obama.",
    tab2012: "2012 · Romney / Obama",
    count: "encuestas verificadas",
    tab2016: "2016 · Trump / Clinton",
    tab2020: "2020 · Trump / Biden",
    tab2024: "2024 · Trump / Harris",
    tab2028: "2028",
    previous: "Elección anterior",
    emptyTitle: "El tablero está listo. Los datos aún no.",
    emptyText: "Todavía no se han añadido encuestas presidenciales verificadas de 2028. Cada resultado tendrá un enlace a su fuente original, fechas de campo, tamaño de muestra y población encuestada.",
    archiveEmptyTitle: "El archivo de 2024 no está cargado.",
    archiveEmptyText: "Las filas de Trump–Biden están en Firebase. Esta página las mostrará cuando esa lectura funcione.",
    archiveMissing: "Firebase todavía no tiene el archivo Trump–Biden de 2024.",
    trump: "Trump",
    biden: "Biden",
    harris: "Harris",
    candidateFilter: "Candidatos",
    filterLabel: "Encuestadora",
    filterAll: "Todas",
    resultFilter: "Resultado final",
    noPollster: "No hay encuestas de esta encuestadora.",
    noCandidate: "No hay encuestas para esta selección.",
    date: "Registro",
    pollster: "Encuestadora",
    news: "Noticia",
    newsHover: "Biden se retiró y Kamala entró en la carrera.",
    criteria: "Qué entra en este tablero",
    item1: "Una pregunta explícita sobre la nominación o elección presidencial de 2028.",
    item2: "Una encuestadora identificada y una publicación original verificable.",
    item3: "Fechas de campo, tamaño de muestra, población y resultados exactos.",
    methodTitle: "Los promedios llegarán con encuestas comparables",
    methodText: "Separamos las primarias de la elección general. No mezclaremos candidatos, estados ni poblaciones distintas en una sola cifra. Hasta definir un método transparente y reunir suficientes encuestas comparables, mostraremos resultados con su fuente.",
    sourceTitle: "Seguir las fuentes",
    sourceText: "La Comisión Federal Electoral publica las candidaturas registradas. VoteHub ofrece una API abierta, pero sus categorías documentadas aún no establecen una fuente presidencial verificada de 2028 para este sitio.",
    fec: "Candidaturas ante la FEC ↗",
    votehub: "Documentación de la API de VoteHub ↗",
    viewCalendar: "Ver el calendario electoral →",
    sample: "muestra",
    source: "Fuente original ↗",
  },
  ru: {
    eyebrow: "Опросы",
    title: "Президентские опросы",
    description: "Общенациональные опросы гонки 2028 года и архивы 2012, 2016, 2020 и 2024 годов.",
    lead2028: "У каждого опроса есть свой вопрос, место и время. Сначала покажем эти подробности, и только потом — динамику.",
    lead2024: "Общенациональные опросы 2024 года: Трамп против Байдена, а после его выхода из гонки — Трамп против Харрис.",
    lead2020: "Общенациональные опросы 2020 года: Трамп против Байдена.",
    lead2016: "Общенациональные опросы 2016 года: Трамп против Клинтон.",
    lead2012: "Общенациональные опросы 2012 года: Ромни против Обамы.",
    count: "проверенных опросов",
    tab2012: "2012 · Ромни / Обама",
    tab2016: "2016 · Трамп / Клинтон",
    tab2020: "2020 · Трамп / Байден",
    tab2024: "2024 · Трамп / Харрис",
    tab2028: "2028",
    previous: "Прошлые выборы",
    emptyTitle: "Таблица готова. Данных пока нет.",
    emptyText: "Проверенные президентские опросы 2028 года ещё не добавлены. У каждого результата будут ссылка на исходный источник, даты поля, размер выборки и кого опрашивали.",
    archiveEmptyTitle: "Архив 2024 года не загрузился.",
    archiveEmptyText: "Строки Трамп–Байден лежат в Firebase. Страница покажет их, когда это чтение удастся.",
    archiveMissing: "В Firebase пока нет архива Трамп–Байден за 2024 год.",
    trump: "Трамп",
    biden: "Байден",
    harris: "Харрис",
    candidateFilter: "Кандидаты",
    filterLabel: "Институт",
    filterAll: "Все",
    resultFilter: "Итог",
    noPollster: "У этого института нет опросов.",
    noCandidate: "Для этого выбора опросов нет.",
    date: "Дата в базе",
    pollster: "Институт",
    news: "Новость",
    newsHover: "Байден вышел, и Камала вступила в гонку.",
    criteria: "Что попадает в таблицу",
    item1: "Вопрос прямо о номинации или президентских выборах 2028 года.",
    item2: "Названный институт и публично проверяемая исходная публикация.",
    item3: "Даты поля, размер выборки, кого опрашивали и точные опубликованные результаты.",
    methodTitle: "Средние появятся после сопоставимых опросов",
    methodText: "Праймериз и всеобщие выборы не смешиваются. Разных кандидатов, штаты и группы опрошенных мы не сведём в одну заголовочную цифру. Пока нет прозрачного метода и достаточного числа сопоставимых опросов, сайт показывает только результаты с источником.",
    sourceTitle: "По следу источников",
    sourceText: "Федеральная избирательная комиссия публикует зарегистрированные кандидатуры. У VoteHub есть открытый API опросов, но его описанные категории ещё не дают проверенную президентскую ленту 2028 года для этого сайта.",
    fec: "Кандидатуры в FEC ↗",
    votehub: "Документация API VoteHub ↗",
    viewCalendar: "Смотреть календарь выборов →",
    sample: "выборка",
    source: "Исходный источник ↗",
  },
} as const;

const POPULATION = {
  en: { adults: "adults", registered: "registered voters", likely: "likely voters" },
  es: { adults: "adultos", registered: "votantes registrados", likely: "votantes probables" },
  ru: { adults: "взрослые", registered: "зарегистрированные избиратели", likely: "вероятные избиратели" },
} as const;

type PollTab = "2012" | "2016" | "2020" | "2024" | "2028";

export default function PollsPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [tab, setTab] = useState<PollTab>("2024");
  useEffect(() => {
    document.getElementById(`poll-tab-${tab}`)?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [tab]);

  return (
    <>
      <Head><title>{t.title} | US Polls 2028</title><meta name="description" content={t.description} /></Head>
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{tab === "2028" ? t.eyebrow : t.previous}</p>
          <h1>{t.title}</h1>
          <p>{tab === "2012" ? t.lead2012 : tab === "2016" ? t.lead2016 : tab === "2020" ? t.lead2020 : tab === "2024" ? t.lead2024 : t.lead2028}</p>
          <div className="poll-tabs" role="tablist" aria-label={t.title}>
            <button type="button" role="tab" id="poll-tab-2012" aria-selected={tab === "2012"} aria-controls="poll-panel-2012" className={tab === "2012" ? "is-active" : undefined} onClick={() => setTab("2012")}>{t.tab2012}</button>
            <button type="button" role="tab" id="poll-tab-2016" aria-selected={tab === "2016"} aria-controls="poll-panel-2016" className={tab === "2016" ? "is-active" : undefined} onClick={() => setTab("2016")}>{t.tab2016}</button>
            <button type="button" role="tab" id="poll-tab-2020" aria-selected={tab === "2020"} aria-controls="poll-panel-2020" className={tab === "2020" ? "is-active" : undefined} onClick={() => setTab("2020")}>{t.tab2020}</button>
            <button type="button" role="tab" id="poll-tab-2024" aria-selected={tab === "2024"} aria-controls="poll-panel-2024" className={tab === "2024" ? "is-active" : undefined} onClick={() => setTab("2024")}>{t.tab2024}</button>
            <button type="button" role="tab" id="poll-tab-2028" aria-selected={tab === "2028"} aria-controls="poll-panel-2028" className={tab === "2028" ? "is-active" : undefined} onClick={() => setTab("2028")}>{t.tab2028}</button>
          </div>
          {tab === "2028" ? <span className="poll-count"><b>{PRESIDENTIAL_POLLS.length}</b> {t.count}</span> : null}
        </section>

        {tab === "2028" ? (
          <div role="tabpanel" id="poll-panel-2028" aria-labelledby="poll-tab-2028" className="campaign-stack">
            {PRESIDENTIAL_POLLS.length === 0 ? (
              <section className="poll-empty campaign-panel" aria-live="polite">
                <div className="poll-empty__icon" aria-hidden="true">◎</div>
                <h2>{t.emptyTitle}</h2>
                <p>{t.emptyText}</p>
              </section>
            ) : (
              <section className="poll-list" aria-label={t.title}>
                {PRESIDENTIAL_POLLS.map((poll) => (
                  <article className="campaign-panel poll-entry" key={poll.id}>
                    <div className="poll-entry__head"><div><p className="campaign-section-label">{poll.scope[language]}</p><h2>{poll.question[language]}</h2></div><span>{poll.endDate}</span></div>
                    <p>{poll.pollster} · {poll.startDate}–{poll.endDate} · {poll.sampleSize.toLocaleString(languageLocale(language))} {t.sample} · {POPULATION[language][poll.population]}</p>
                    <div className="poll-entry__results">{poll.results.map((result) => <span key={result.candidate}><strong>{result.percent}%</strong> {result.candidate}</span>)}</div>
                    <a className="campaign-text-link" href={poll.sourceUrl} rel="noreferrer" target="_blank">{t.source}</a>
                  </article>
                ))}
              </section>
            )}
            <div className="campaign-columns">
              <section className="campaign-panel"><p className="campaign-section-label">01 / {t.criteria}</p><h2>{t.criteria}</h2><ol className="criteria-list"><li>{t.item1}</li><li>{t.item2}</li><li>{t.item3}</li></ol></section>
              <section className="campaign-panel"><p className="campaign-section-label">02 / {t.methodTitle}</p><h2>{t.methodTitle}</h2><p>{t.methodText}</p></section>
            </div>
            <section className="campaign-panel poll-sources"><div><p className="campaign-section-label">03 / {t.sourceTitle}</p><h2>{t.sourceTitle}</h2><p>{t.sourceText}</p></div><div className="poll-sources__links"><a href="https://www.fec.gov/data/elections/president/2028/" rel="noreferrer" target="_blank">{t.fec}</a><a href="https://votehub.com/polls/api/" rel="noreferrer" target="_blank">{t.votehub}</a><Link href="/calendar">{t.viewCalendar}</Link></div></section>
          </div>
        ) : tab === "2012" ? (
          <div role="tabpanel" id="poll-panel-2012" aria-labelledby="poll-tab-2012">
            <Historical2024Board key="polls-2012" variant="list" cycle="2012" />
          </div>
        ) : tab === "2016" ? (
          <div role="tabpanel" id="poll-panel-2016" aria-labelledby="poll-tab-2016">
            <Historical2024Board key="polls-2016" variant="list" cycle="2016" />
          </div>
        ) : tab === "2020" ? (
          <div role="tabpanel" id="poll-panel-2020" aria-labelledby="poll-tab-2020">
            <Historical2024Board key="polls-2020" variant="list" cycle="2020" />
          </div>
        ) : (
          <div role="tabpanel" id="poll-panel-2024" aria-labelledby="poll-tab-2024">
            <Historical2024Board key="polls-2024" variant="list" />
          </div>
        )}
      </div>
    </>
  );
}

