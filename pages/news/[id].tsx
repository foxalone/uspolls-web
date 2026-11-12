import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Seo } from "../../src/components/Seo";
import { languageLocale, useLanguage, type Language } from "../../src/lib/language";
import { RelatedNews } from "../../src/components/PresidentialNews";
import { archiveDetails, type ArchiveDetail } from "../../src/lib/news/archiveDetails";
import type { PublicNewsCard } from "../../src/lib/news/types";
import styles from "../../src/components/PresidentialNews.module.css";

const copy = {
  en: { back: "All news", missing: "This story is no longer available.", original: "Read the original", context: "Additional source" },
  es: { back: "Todas las noticias", missing: "Esta nota ya no está disponible.", original: "Leer el original", context: "Fuente adicional" },
  ru: { back: "Все новости", missing: "Этого материала больше нет.", original: "Читать оригинал", context: "Дополнительный источник" },
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

type NewsItemProps = { item: PublicNewsCard | null; more: PublicNewsCard[]; detail: ArchiveDetail | null };

export default function NewsItemPage({ item, more, detail }: NewsItemProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const text = words(language);
  if (!item) {
    return (
      <>
        <Seo title={t.missing} description={t.missing} path="/news" noindex />
        <article className={styles.article}>
          <Link className={styles.back} href="/news">{t.back}</Link>
          <p className={styles.empty}>{t.missing}</p>
        </article>
      </>
    );
  }
  const headline = item.headline[text] || item.headline.en;
  const teaser = item.teaser[text] || item.teaser.en;
  const body = item.body[text] || detail?.body[text] || teaser;
  return (
    <>
      <Seo title={headline} description={teaser} path={`/news/${item.id}`} type="article" />
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
              {paragraphs(body).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <p className={styles.original}>
              <a href={detail?.original || item.url} target="_blank" rel="noreferrer">{t.original} · {item.source}</a>
              {detail?.context ? (
                <a href={detail.context.href} target="_blank" rel="noreferrer">{t.context} · {detail.context.label}</a>
              ) : null}
            </p>
          </div>
        </div>
      </article>
      <RelatedNews items={more} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<NewsItemProps> = async ({ params, res }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  try {
    const { getPresidentialNews, listPresidentialNews } = await import("../../src/lib/news/store");
    const [item, page] = await Promise.all([getPresidentialNews(id), listPresidentialNews(8)]);
    if (!item) return { notFound: true };
    const more = page.items.filter((entry) => entry.id !== item.id).slice(0, 4);
    return { props: { item, more, detail: archiveDetails[item.id] ?? null } };
  } catch {
    return { notFound: true };
  }
};
