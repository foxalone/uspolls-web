import { Seo } from "../src/components/Seo";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    title: "Presidential poll sources",
    description: "What a 2028 presidential poll needs before VotePulse will show it.",
    eyebrow: "Sources",
    h1: "Poll sources",
    lead: "A presidential poll appears only with a traceable original publication.",
    items: [
      "The question is about the 2028 presidential nomination or general election.",
      "The pollster is named, and the original publication can be opened.",
      "Field dates, sample size, the voter population, and the reported results are included.",
    ],
    fec: "FEC candidate filings",
    votehub: "VoteHub API documentation",
  },
  es: {
    title: "Fuentes de las encuestas presidenciales",
    description: "Qué necesita una encuesta presidencial de 2028 para aparecer en VotePulse.",
    eyebrow: "Fuentes",
    h1: "Fuentes de encuestas",
    lead: "Una encuesta presidencial aparece solo con una publicación original verificable.",
    items: [
      "La pregunta trata de la nominación o la elección presidencial de 2028.",
      "La encuestadora está identificada y la publicación original se puede abrir.",
      "Incluye fechas de campo, tamaño de muestra, población y resultados publicados.",
    ],
    fec: "Candidaturas ante la FEC",
    votehub: "Documentación de la API de VoteHub",
  },
  ru: {
    title: "Источники президентских опросов",
    description: "Что нужно опросу президентской гонки 2028 года, чтобы попасть на VotePulse.",
    eyebrow: "Источники",
    h1: "Источники опросов",
    lead: "Президентский опрос появляется только со ссылкой на исходную публикацию.",
    items: [
      "Вопрос касается номинации или президентских выборов 2028 года.",
      "Назван центр опросов, и исходную публикацию можно открыть.",
      "Есть даты поля, размер выборки, совокупность и опубликованные результаты.",
    ],
    fec: "Регистрации кандидатов в FEC",
    votehub: "Документация API VoteHub",
  },
} as const;

export default function SourcesPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Seo title={t.title} description={t.description} path="/sources" />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.lead}</p>
        </section>
        <section className="campaign-panel campaign-panel--list">
          <ul>
            {t.items.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{item}</p></div></li>
            ))}
          </ul>
          <p className="hub-outlinks">
            <a className="campaign-text-link" href="https://www.fec.gov/data/elections/president/2028/" rel="noreferrer" target="_blank">{t.fec}</a>
            <a className="campaign-text-link" href="https://votehub.com/polls/api/" rel="noreferrer" target="_blank">{t.votehub}</a>
          </p>
        </section>
      </div>
    </>
  );
}
