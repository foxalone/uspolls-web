import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Seo } from "../../src/components/Seo";
import { PRESIDENTIAL_POLLS, type PresidentialPoll } from "../../src/data/presidential2028";
import { formatNyDate } from "../../src/lib/home/dates";
import { pollsForPollster, pollsterSlug } from "../../src/lib/home/polls";
import { languageLocale, useLanguage } from "../../src/lib/language";

const copy = {
  en: {
    title: (name: string) => `${name} presidential polls`,
    description: (name: string) => `Verified 2028 presidential polls from ${name}.`,
    eyebrow: "Pollster",
    empty: "No verified presidential polls from this pollster are on the site.",
  },
  es: {
    title: (name: string) => `Encuestas presidenciales de ${name}`,
    description: (name: string) => `Encuestas presidenciales verificadas de 2028 de ${name}.`,
    eyebrow: "Encuestadora",
    empty: "No hay encuestas presidenciales verificadas de esta encuestadora.",
  },
  ru: {
    title: (name: string) => `Президентские опросы ${name}`,
    description: (name: string) => `Проверенные президентские опросы 2028 года от ${name}.`,
    eyebrow: "Центр опросов",
    empty: "Проверенных президентских опросов этого центра на сайте нет.",
  },
} as const;

export default function PollsterPage({ name, polls }: { name: string; polls: PresidentialPoll[] }) {
  const { language } = useLanguage();
  const t = copy[language];
  const locale = languageLocale(language);
  return (
    <>
      <Seo title={t.title(name)} description={t.description(name)} path={`/pollsters/${pollsterSlug(name)}`} />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{name}</h1>
        </section>
        <section className="campaign-panel">
          {polls.length === 0 ? <p>{t.empty}</p> : (
            <ul className="hub-directory">
              {polls.map((poll) => (
                <li key={poll.id}>
                  <Link href={`/polls/${poll.id}`} prefetch={false}>{poll.pollster} · {formatNyDate(poll.endDate, locale)}</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = [...new Set(PRESIDENTIAL_POLLS.map((poll) => pollsterSlug(poll.pollster)))];
  return {
    paths: slugs.filter((slug) => /^[a-z0-9-]{1,80}$/.test(slug)).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ name: string; polls: PresidentialPoll[] }> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const polls = pollsForPollster(slug);
  const name = polls[0]?.pollster;
  if (!name) return { notFound: true };
  return { props: { name, polls } };
};
