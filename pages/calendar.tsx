import Head from "next/head";
import Link from "next/link";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    eyebrow: "Road to Election Day",
    title: "The 2028 timeline",
    description: "Key stages in the 2028 U.S. presidential election, with confirmed dates clearly separated from typical windows.",
    lead: "The national election date is set. Primary and convention schedules take shape state by state and party by party.",
    typical: "Typical window · dates to be confirmed",
    confirmed: "Confirmed date",
    stages: [
      { when: "2027", title: "The field takes shape", text: "Candidates usually announce campaigns and begin formal filings. The Federal Election Commission publishes candidate and committee records.", fixed: false },
      { when: "January–June 2028", title: "Primaries and caucuses", text: "States and parties choose delegates through primaries and caucuses. Each state sets its own schedule and rules.", fixed: false },
      { when: "July–early September 2028", title: "National conventions", text: "Parties formally nominate their presidential and vice-presidential tickets.", fixed: false },
      { when: "September–October 2028", title: "General-election campaign", text: "The nominees campaign nationally and may take part in debates. Debate dates are not yet fixed.", fixed: false },
      { when: "November 7, 2028", title: "Election Day", text: "Voters cast ballots for president and vice president. Congress is also on the ballot, but this site currently follows the presidential race.", fixed: true },
      { when: "December 2028", title: "Electors vote", text: "Presidential electors meet after the state results are certified. The exact 2028 meeting date will be added when official.", fixed: false },
      { when: "January 20, 2029", title: "Inauguration", text: "The next president and vice president are scheduled to take office.", fixed: true },
    ],
    sourceTitle: "Official references",
    sourceText: "The windows above follow USA.gov's description of a typical presidential cycle. We will replace them with state and party dates when published.",
    process: "Presidential election process ↗",
    primaries: "How primaries work ↗",
    inauguration: "Inauguration date ↗",
    polls: "Go to polls →",
  },
  es: {
    eyebrow: "Rumbo al día de las elecciones",
    title: "Calendario de 2028",
    description: "Etapas clave de la elección presidencial de EE. UU. de 2028, con fechas confirmadas separadas de períodos habituales.",
    lead: "La fecha de la elección nacional está fijada. Los calendarios de primarias y convenciones se definen por estado y por partido.",
    typical: "Período habitual · fechas por confirmar",
    confirmed: "Fecha confirmada",
    stages: [
      { when: "2027", title: "Se perfila el campo", text: "Los aspirantes suelen anunciar sus campañas y presentar documentos. La Comisión Federal Electoral publica los registros de candidatos y comités.", fixed: false },
      { when: "Enero–junio de 2028", title: "Primarias y asambleas", text: "Los estados y partidos eligen delegados mediante primarias y asambleas. Cada estado define su calendario y sus reglas.", fixed: false },
      { when: "Julio–principios de septiembre de 2028", title: "Convenciones nacionales", text: "Los partidos nominan formalmente sus fórmulas para presidente y vicepresidente.", fixed: false },
      { when: "Septiembre–octubre de 2028", title: "Campaña general", text: "Los nominados hacen campaña y pueden participar en debates. Sus fechas todavía no están fijadas.", fixed: false },
      { when: "7 de noviembre de 2028", title: "Día de las elecciones", text: "Los votantes eligen presidente y vicepresidente. También se vota por el Congreso, pero este sitio sigue por ahora la carrera presidencial.", fixed: true },
      { when: "Diciembre de 2028", title: "Votación de los electores", text: "Los electores presidenciales se reúnen después de la certificación de los resultados estatales. Añadiremos la fecha exacta cuando sea oficial.", fixed: false },
      { when: "20 de enero de 2029", title: "Investidura", text: "Está previsto que el próximo presidente y vicepresidente asuman sus cargos.", fixed: true },
    ],
    sourceTitle: "Referencias oficiales",
    sourceText: "Los períodos siguen la descripción de USA.gov de un ciclo presidencial habitual. Los sustituiremos por fechas estatales y partidarias cuando se publiquen.",
    process: "Proceso de elección presidencial ↗",
    primaries: "Cómo funcionan las primarias ↗",
    inauguration: "Fecha de investidura ↗",
    polls: "Ir a encuestas →",
  },
  ru: {
    eyebrow: "Путь ко дню выборов",
    title: "Календарь 2028",
    description: "Ключевые этапы президентских выборов в США 2028 года: подтверждённые даты отдельно от обычных периодов.",
    lead: "Дата общенациональных выборов уже назначена. Календари праймериз и съездов складываются по штатам и по партиям.",
    typical: "Обычный период · даты ещё подтвердят",
    confirmed: "Подтверждённая дата",
    stages: [
      { when: "2027", title: "Поле кандидатов складывается", text: "Кандидаты обычно объявляют кампании и подают документы. Федеральная избирательная комиссия публикует записи о кандидатах и комитетах.", fixed: false },
      { when: "Январь–июнь 2028", title: "Праймериз и кокусы", text: "Штаты и партии выбирают делегатов на праймериз и кокусах. Каждый штат сам задаёт календарь и правила.", fixed: false },
      { when: "Июль — начало сентября 2028", title: "Национальные съезды", text: "Партии официально выдвигают пары кандидатов в президенты и вице-президенты.", fixed: false },
      { when: "Сентябрь–октябрь 2028", title: "Кампания всеобщих выборов", text: "Номинанты ведут общенациональную кампанию и могут участвовать в дебатах. Даты дебатов ещё не назначены.", fixed: false },
      { when: "7 ноября 2028", title: "День выборов", text: "Избиратели голосуют за президента и вице-президента. В тот же день выбирают Конгресс, но этот сайт пока следит за президентской гонкой.", fixed: true },
      { when: "Декабрь 2028", title: "Голосование выборщиков", text: "Президентские выборщики собираются после того, как штаты утвердят результаты. Точную дату 2028 года добавим, когда она станет официальной.", fixed: false },
      { when: "20 января 2029", title: "Инаугурация", text: "Следующие президент и вице-президент должны вступить в должность.", fixed: true },
    ],
    sourceTitle: "Официальные источники",
    sourceText: "Периоды выше следуют описанию обычного президентского цикла на USA.gov. Мы заменим их датами штатов и партий, когда те будут опубликованы.",
    process: "Как проходят президентские выборы ↗",
    primaries: "Как устроены праймериз ↗",
    inauguration: "Дата инаугурации ↗",
    polls: "К опросам →",
  },
} as const;

export default function CalendarPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Head><title>{t.title} | US Polls 2028</title><meta name="description" content={t.description} /></Head>
      <div className="campaign-stack">
        <section className="campaign-page-intro"><p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p><h1>{t.title}</h1><p>{t.lead}</p></section>
        <section className="timeline-list" aria-label={t.title}>
          {t.stages.map((stage, index) => (
            <article className={`timeline-stage${stage.fixed ? " is-confirmed" : ""}`} key={index}>
              <div className="timeline-stage__rail"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{stage.fixed ? t.confirmed : t.typical}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
            </article>
          ))}
        </section>
        <section className="campaign-panel timeline-sources"><div><p className="campaign-section-label">USA.gov / 2028</p><h2>{t.sourceTitle}</h2><p>{t.sourceText}</p></div><div><a href="https://www.usa.gov/presidential-election-process" rel="noreferrer" target="_blank">{t.process}</a><a href="https://www.usa.gov/primaries-caucuses" rel="noreferrer" target="_blank">{t.primaries}</a><a href="https://www.usa.gov/inauguration" rel="noreferrer" target="_blank">{t.inauguration}</a><Link href="/polls">{t.polls}</Link></div></section>
      </div>
    </>
  );
}
