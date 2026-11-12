import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Seo } from "../../src/components/Seo";
import { TrendSparkline } from "../../src/components/TrendSparkline";
import type { EntityAttention } from "../../src/lib/home/attention";
import { formatNyDate } from "../../src/lib/home/dates";
import { RACE_ENTITIES, raceEntity, trendsHref } from "../../src/lib/home/entities";
import { languageLocale, useLanguage } from "../../src/lib/language";

const copy = {
  en: {
    title: (name: string) => `${name} and the 2028 presidential race`,
    description: (name: string) => `${name} in the public conversation about the 2028 presidential race. Not an official ballot or an endorsement.`,
    eyebrow: "2028 presidential race",
    lead: "Public interest measured by visits to the English Wikipedia article.",
    chart: "Daily Wikipedia pageviews",
    recent: "Last 14 days",
    previous: "Previous 14 days",
    change: "Change in pageviews",
    empty: "Daily pageviews are temporarily unavailable.",
    wiki: "English Wikipedia",
    trends: "Google Trends",
    back: "All candidates",
    history: "Attention history",
  },
  es: {
    title: (name: string) => `${name} y la carrera presidencial de 2028`,
    description: (name: string) => `${name} en la conversación pública sobre la carrera presidencial de 2028. No es una papeleta oficial ni un respaldo.`,
    eyebrow: "Carrera presidencial de 2028",
    lead: "Interés público medido por las visitas al artículo de Wikipedia en inglés.",
    chart: "Visitas diarias en Wikipedia",
    recent: "Últimos 14 días",
    previous: "14 días anteriores",
    change: "Variación de las visitas",
    empty: "Las visitas diarias no están disponibles temporalmente.",
    wiki: "Wikipedia en inglés",
    trends: "Google Trends",
    back: "Todos los candidatos",
    history: "Historial de atención",
  },
  ru: {
    title: (name: string) => `${name} и президентская гонка 2028`,
    description: (name: string) => `${name} в публичном разговоре о президентской гонке 2028 года. Это не бюллетень и не поддержка.`,
    eyebrow: "Президентская гонка 2028",
    lead: "Интерес к теме по числу просмотров статьи в англоязычной Википедии.",
    chart: "Просмотры Википедии по дням",
    recent: "Последние 14 дней",
    previous: "Предыдущие 14 дней",
    change: "Изменение просмотров",
    empty: "Данные о просмотрах по дням временно недоступны.",
    wiki: "Английская Википедия",
    trends: "Google Trends",
    back: "Все кандидаты",
    history: "История внимания",
  },
} as const;

type CandidatePageProps = {
  slug: string;
  attention: EntityAttention | null;
};

export default function CandidatePage({ slug, attention }: CandidatePageProps) {
  const entity = raceEntity(slug);
  const { language } = useLanguage();
  const t = copy[language];
  const locale = languageLocale(language);
  const comparison = attention?.comparison;
  if (!entity) return null;
  return (
    <>
      <Seo title={t.title(entity.name)} description={t.description(entity.name)} path={`/candidates/${entity.slug}`} />
      <div className="campaign-stack">
        <section className="campaign-page-intro candidate-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{entity.name}</h1>
          <p>{t.lead}</p>
        </section>
        <section className="campaign-panel" aria-labelledby="candidate-attention-title">
          <h2 id="candidate-attention-title">{t.chart}</h2>
          {attention ? (
            <>
              {comparison ? (
                <dl className="candidate-attention__stats">
                  <div><dt>{t.recent}</dt><dd>{comparison.recent.toLocaleString(locale)}</dd></div>
                  <div><dt>{t.previous}</dt><dd>{comparison.previous.toLocaleString(locale)}</dd></div>
                  {comparison.change !== null ? (
                    <div>
                      <dt>{t.change}</dt>
                      <dd>{new Intl.NumberFormat(locale, { style: "percent", signDisplay: "exceptZero" }).format(comparison.change / 100)}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              <figure className="candidate-attention__chart">
                <TrendSparkline className="candidate-attention__line" series={attention.series} width={720} height={180} />
                <figcaption>
                  <time dateTime={attention.startDate}>{formatNyDate(attention.startDate, locale)}</time>
                  <time dateTime={attention.endDate}>{formatNyDate(attention.endDate, locale)}</time>
                </figcaption>
              </figure>
            </>
          ) : <p>{t.empty}</p>}
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

export const getStaticProps: GetStaticProps<CandidatePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const entity = raceEntity(slug);
  if (!entity) return { notFound: true };

  const { loadEntityAttention } = await import("../../src/lib/home/attention");
  const attention = await loadEntityAttention(entity).catch(() => null);
  return { props: { slug, attention }, revalidate: attention ? 15 * 60 : 60 };
};
