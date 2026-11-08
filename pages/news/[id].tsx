import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { languageLocale, useLanguage, type Language } from "../../src/lib/language";
import { RelatedNews } from "../../src/components/PresidentialNews";
import type { PublicNewsCard } from "../../src/lib/news/types";
import styles from "../../src/components/PresidentialNews.module.css";

const copy = {
  en: { back: "All news", missing: "This story is no longer available." },
  es: { back: "Todas las noticias", missing: "Esta nota ya no está disponible." },
  ru: { back: "Все новости", missing: "Этого материала больше нет." },
} as const;

function words(language: Language) {
  return language === "es" ? "es" : "en";
}

function paragraphs(value: string) {
  return value.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);
}

function when(iso: string, language: Language) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(languageLocale(language), { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NewsItemPage({ item, more }: { item: PublicNewsCard | null; more: PublicNewsCard[] }) {
  const { language } = useLanguage();
  const t = copy[language];
  const text = words(language);
  if (!item) {
    return (
      <article className={styles.article}>
        <Link className={styles.back} href="/news">{t.back}</Link>
        <p className={styles.empty}>{t.missing}</p>
      </article>
    );
  }
  const headline = item.headline[text];
  return (
    <>
      <Head>
        <title>{`${headline} — US Polls`}</title>
        <meta name="description" content={item.teaser[text]} />
      </Head>
      <article className={styles.article}>
        <Link className={styles.back} href="/news">{t.back}</Link>
        <div className={styles.story}>
          {item.image ? (
            <figure className={styles.articlePhoto}>
              <img src={item.image.url} alt="" />
              <figcaption>{item.image.author || "Wikimedia Commons"}</figcaption>
            </figure>
          ) : null}
          <div className={styles.copy}>
            <p className={styles.meta}>
              <b>{item.source}</b>
              <time dateTime={item.publishedAt}>{when(item.publishedAt, language)}</time>
            </p>
            {item.topic ? <span className={styles.topic}>{item.topic}</span> : null}
            <h1 lang={text}>{headline}</h1>
            <div className={styles.articleBody} lang={text}>
              {paragraphs(item.body[text] || item.teaser[text]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className={styles.original}><a href={item.url} target="_blank" rel="noreferrer">{item.source}</a></p>
          </div>
        </div>
      </article>
      <RelatedNews items={more} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ item: PublicNewsCard | null; more: PublicNewsCard[] }> = async ({ params, res }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  try {
    const { getPresidentialNews, listPresidentialNews } = await import("../../src/lib/news/store");
    const [item, page] = await Promise.all([getPresidentialNews(id), listPresidentialNews(8)]);
    if (!item) return { notFound: true };
    const more = page.items.filter((entry) => entry.id !== item.id).slice(0, 4);
    return { props: { item, more } };
  } catch {
    return { notFound: true };
  }
};
