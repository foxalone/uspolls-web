import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Seo } from "../../src/components/Seo";
import { RACE_ENTITIES, raceEntity, trendsHref } from "../../src/lib/home/entities";
import { useLanguage } from "../../src/lib/language";

const copy = {
  en: {
    title: (name: string) => `${name} and the 2028 presidential race`,
    description: (name: string) => `${name} in the public conversation about the 2028 presidential race. Not an official ballot or an endorsement.`,
    eyebrow: "2028 presidential race",
    lead: "This page follows public attention. It is not a declaration of candidacy, a ballot line, or an endorsement.",
    wiki: "English Wikipedia",
    trends: "Google Trends",
    back: "All candidates",
    history: "Attention history",
  },
  es: {
    title: (name: string) => `${name} y la carrera presidencial de 2028`,
    description: (name: string) => `${name} en la conversación pública sobre la carrera presidencial de 2028. No es una papeleta oficial ni un respaldo.`,
    eyebrow: "Carrera presidencial de 2028",
    lead: "Esta página sigue la atención pública. No es una declaración de candidatura, una línea de papeleta ni un respaldo.",
    wiki: "Wikipedia en inglés",
    trends: "Google Trends",
    back: "Todos los candidatos",
    history: "Historial de atención",
  },
  ru: {
    title: (name: string) => `${name} и президентская гонка 2028`,
    description: (name: string) => `${name} в публичном разговоре о президентской гонке 2028 года. Это не бюллетень и не поддержка.`,
    eyebrow: "Президентская гонка 2028",
    lead: "Эта страница следит за общественным вниманием. Это не заявление о выдвижении, не строка бюллетеня и не поддержка.",
    wiki: "Английская Википедия",
    trends: "Google Trends",
    back: "Все кандидаты",
    history: "История внимания",
  },
} as const;

export default function CandidatePage({ slug }: { slug: string }) {
  const entity = raceEntity(slug);
  const { language } = useLanguage();
  const t = copy[language];
  if (!entity) return null;
  return (
    <>
      <Seo title={t.title(entity.name)} description={t.description(entity.name)} path={`/candidates/${entity.slug}`} />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{entity.name}</h1>
          <p>{t.lead}</p>
        </section>
        <section className="campaign-panel">
          <p className="hub-outlinks">
            <a className="campaign-text-link" href={`https://en.wikipedia.org/wiki/${entity.wiki}`} rel="noreferrer" target="_blank">{t.wiki}</a>
            <a className="campaign-text-link" href={trendsHref(entity.trendsQuery)} rel="noreferrer" target="_blank">{t.trends}</a>
            <Link className="campaign-text-link" href="/attention" prefetch={false}>{t.history}</Link>
            <Link className="campaign-text-link" href="/candidates" prefetch={false}>{t.back}</Link>
          </p>
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: RACE_ENTITIES.map((entity) => ({ params: { slug: entity.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ slug: string }> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!raceEntity(slug)) return { notFound: true };
  return { props: { slug } };
};
