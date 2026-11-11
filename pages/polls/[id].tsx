import type { GetStaticPaths, GetStaticProps } from "next";
import { Seo } from "../../src/components/Seo";
import { PRESIDENTIAL_POLLS, type PresidentialPoll } from "../../src/data/presidential2028";
import { formatNyDate } from "../../src/lib/home/dates";
import { languageLocale, useLanguage } from "../../src/lib/language";

const copy = {
  en: {
    title: (pollster: string, date: string) => `${pollster} presidential poll, ${date}`,
    description: (pollster: string) => `${pollster} survey on the 2028 presidential race, with field dates, sample, and the original source.`,
    sample: "sample",
    source: "Original source",
    population: { adults: "adults", registered: "registered voters", likely: "likely voters" },
  },
  es: {
    title: (pollster: string, date: string) => `Encuesta presidencial de ${pollster}, ${date}`,
    description: (pollster: string) => `Encuesta de ${pollster} sobre la carrera presidencial de 2028, con fechas de campo, muestra y fuente original.`,
    sample: "muestra",
    source: "Fuente original",
    population: { adults: "adultos", registered: "votantes registrados", likely: "votantes probables" },
  },
  ru: {
    title: (pollster: string, date: string) => `Президентский опрос ${pollster}, ${date}`,
    description: (pollster: string) => `Опрос ${pollster} о президентской гонке 2028 года: даты поля, выборка и исходный источник.`,
    sample: "выборка",
    source: "Первоисточник",
    population: { adults: "взрослые", registered: "зарегистрированные избиратели", likely: "вероятные избиратели" },
  },
} as const;

export default function PollDetailPage({ poll }: { poll: PresidentialPoll }) {
  const { language } = useLanguage();
  const t = copy[language];
  const locale = languageLocale(language);
  const date = formatNyDate(poll.endDate, locale);
  return (
    <>
      <Seo title={t.title(poll.pollster, date)} description={t.description(poll.pollster)} path={`/polls/${poll.id}`} />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{date}</p>
          <h1>{poll.pollster}</h1>
          <p>{poll.question[language]}</p>
        </section>
        <section className="campaign-panel">
          <p>{poll.scope[language]} · {t.population[poll.population]} · {poll.sampleSize.toLocaleString(locale)} {t.sample}</p>
          <p>{formatNyDate(poll.startDate, locale)} – {date}</p>
          <ul className="hub-directory">
            {poll.results.map((result) => (
              <li key={result.candidate}><span>{result.candidate}</span> <b>{result.percent}%</b></li>
            ))}
          </ul>
          <p><a className="campaign-text-link" href={poll.sourceUrl} rel="noreferrer" target="_blank">{t.source}</a></p>
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PRESIDENTIAL_POLLS
    .filter((poll) => /^[a-z0-9-]{1,80}$/.test(poll.id))
    .map((poll) => ({ params: { id: poll.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ poll: PresidentialPoll }> = async ({ params }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  const poll = PRESIDENTIAL_POLLS.find((item) => item.id === id);
  if (!poll) return { notFound: true };
  return { props: { poll } };
};
