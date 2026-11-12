import type { GetStaticProps } from "next";
import Link from "next/link";
import { TrendSparkline } from "../src/components/TrendSparkline";
import { Seo } from "../src/components/Seo";
import type { AttentionCard } from "../src/lib/home/attention";
import { RACE_TRENDS_HREF } from "../src/lib/home/entities";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    title: "Attention on the 2028 race",
    description: "English Wikipedia attention for parties and people tied to the 2028 presidential race, over the last 90 days.",
    eyebrow: "Last 90 days",
    h1: "Attention on the 2028 race",
    lead: "The line is English Wikipedia pageviews. The percent compares the last 14 days with the 14 days before that. It is attention, not favorability.",
    empty: "Attention figures are unavailable right now.",
    trends: "Google Trends",
    home: "Back to the hub",
    kind: { party: "Party", republican: "Republican", democrat: "Democrat" },
    direction: { up: "rising", down: "falling", flat: "steady" },
  },
  es: {
    title: "Atención sobre la carrera de 2028",
    description: "Atención en la Wikipedia en inglés hacia partidos y personas de la carrera presidencial de 2028, en los últimos 90 días.",
    eyebrow: "Últimos 90 días",
    h1: "Atención sobre la carrera de 2028",
    lead: "La línea son lecturas de la Wikipedia en inglés. El porcentaje compara los últimos 14 días con los 14 anteriores. Es atención, no favorabilidad.",
    empty: "Las cifras de atención no están disponibles ahora.",
    trends: "Google Trends",
    home: "Volver al inicio",
    kind: { party: "Partido", republican: "Republicano", democrat: "Demócrata" },
    direction: { up: "al alza", down: "a la baja", flat: "estable" },
  },
  ru: {
    title: "Внимание к гонке 2028 года",
    description: "Внимание английской Википедии к партиям и людям президентской гонки 2028 года за последние 90 дней.",
    eyebrow: "Последние 90 дней",
    h1: "Внимание к гонке 2028 года",
    lead: "Линия — просмотры английской Википедии. Процент сравнивает последние 14 дней с предыдущими 14. Это внимание, а не поддержка.",
    empty: "Цифры внимания сейчас недоступны.",
    trends: "Google Trends",
    home: "На главную",
    kind: { party: "Партия", republican: "Республиканец", democrat: "Демократ" },
    direction: { up: "растёт", down: "падает", flat: "без изменений" },
  },
} as const;

export default function AttentionPage({ items }: { items: AttentionCard[] }) {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Seo title={t.title} description={t.description} path="/attention" />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.lead}</p>
          <p className="hub-outlinks">
            <a className="campaign-text-link" href={RACE_TRENDS_HREF} rel="noreferrer" target="_blank">{t.trends}</a>
            <Link className="campaign-text-link" href="/" prefetch={false}>{t.home}</Link>
          </p>
        </section>
        {items.length === 0 ? <section className="campaign-panel"><p>{t.empty}</p></section> : (
          <div className="hub-entities">
            {items.map((item) => (
              <Link className="campaign-panel hub-entity" href={item.href} key={item.href} prefetch={false}>
                <span className="campaign-section-label">{t.kind[item.kind]}</span>
                <strong>{item.name}</strong>
                <TrendSparkline series={item.series.length > 1 ? item.series : [0, 0]} />
                <span>{item.change > 0 ? `+${item.change}` : item.change}% · {t.direction[item.direction]}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ items: AttentionCard[] }> = async () => {
  const { loadAttention } = await import("../src/lib/home/attention");
  const { currentNyDate } = await import("../src/lib/home/dates");
  const end = shiftKey(currentNyDate(), -1);
  try {
    const items = await Promise.race([
      loadAttention(end, 90),
      new Promise<AttentionCard[]>((resolve) => setTimeout(() => resolve([]), 15_000)),
    ]);
    return { props: { items }, revalidate: items.length > 0 ? 15 * 60 : 60 };
  } catch {
    return { props: { items: [] }, revalidate: 60 };
  }
};

function shiftKey(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00-05:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
