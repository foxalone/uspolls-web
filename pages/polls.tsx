import Head from "next/head";
import Link from "next/link";
import { PRESIDENTIAL_POLLS } from "../src/data/presidential2028";
import { languageLocale, useLanguage } from "../src/lib/language";

const copy = {
  en: {
    eyebrow: "The polling desk",
    title: "Presidential polls",
    description: "A source-first home for national, state and primary polls in the 2028 U.S. presidential race.",
    lead: "Every survey belongs to a question, a place and a moment. We will show those details before drawing a trend.",
    count: "verified polls",
    emptyTitle: "The board is ready. The data is not here yet.",
    emptyText: "No verified 2028 presidential polls have been added to this site. When they are, each result will link to its original source and show field dates, sample size and voter population.",
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
    description: "Un espacio basado en fuentes para encuestas nacionales, estatales y primarias de la carrera presidencial de EE. UU. de 2028.",
    lead: "Cada encuesta responde a una pregunta, un lugar y un momento. Mostraremos esos detalles antes de trazar tendencias.",
    count: "encuestas verificadas",
    emptyTitle: "El tablero está listo. Los datos aún no.",
    emptyText: "Todavía no se han añadido encuestas presidenciales verificadas de 2028. Cada resultado tendrá un enlace a su fuente original, fechas de campo, tamaño de muestra y población encuestada.",
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
    eyebrow: "Опросы 2028",
    title: "Президентские опросы",
    description: "Раздел с источниками для общенациональных опросов, опросов по штатам и праймериз президентской гонки 2028 года.",
    lead: "У каждого опроса есть свой вопрос, место и время. Сначала покажем эти подробности, и только потом — динамику.",
    count: "проверенных опросов",
    emptyTitle: "Таблица готова. Данных пока нет.",
    emptyText: "Проверенные президентские опросы 2028 года ещё не добавлены. У каждого результата будут ссылка на исходный источник, даты поля, размер выборки и кого опрашивали.",
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

export default function PollsPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Head><title>{t.title} | US Polls 2028</title><meta name="description" content={t.description} /></Head>
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <span className="poll-count"><b>{PRESIDENTIAL_POLLS.length}</b> {t.count}</span>
        </section>

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
    </>
  );
}
