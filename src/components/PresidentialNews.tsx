import { useState } from "react";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import type { NewsPage, PublicNewsCard } from "../lib/news/types";
import styles from "./PresidentialNews.module.css";

const copy = {
  en: {
    eyebrow: "2028 presidential race",
    title: "News",
    lede: "Headlines about the race, gathered every three hours in English and Spanish. Each card opens the original story.",
    empty: "The first headlines appear after the next update.",
    more: "Load 10 more",
    loading: "Loading…",
    error: "More headlines could not be loaded.",
    photo: "Photo",
  },
  es: {
    eyebrow: "Carrera presidencial de 2028",
    title: "Noticias",
    lede: "Titulares de la carrera, reunidos cada tres horas en inglés y en español. Cada ficha abre la nota original.",
    empty: "Los primeros titulares aparecen después de la próxima actualización.",
    more: "Cargar 10 más",
    loading: "Cargando…",
    error: "No se pudieron cargar más titulares.",
    photo: "Foto",
  },
  ru: {
    eyebrow: "Президентская гонка 2028",
    title: "Новости",
    lede: "Заголовки о гонке собираются каждые три часа на английском и испанском. Карточка открывает исходный материал.",
    empty: "Первые заголовки появятся после следующего обновления.",
    more: "Ещё 10",
    loading: "Загружаем…",
    error: "Не удалось загрузить ещё заголовки.",
    photo: "Фото",
  },
} as const;

function words(language: Language) {
  return language === "es" ? "es" : "en";
}

function age(iso: string, language: Language) {
  const delta = Date.parse(iso) - Date.now();
  if (!Number.isFinite(delta)) return "";
  const minutes = Math.round(delta / 60000);
  const formatter = new Intl.RelativeTimeFormat(languageLocale(language), { numeric: "auto" });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 36) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}

export function PresidentialNews({ initial }: { initial: NewsPage }) {
  const { language } = useLanguage();
  const t = copy[language];
  const text = words(language);
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.next);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function loadMore() {
    if (cursor === null || loading) return;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/presidential-news?before=${cursor}`);
      if (!response.ok) throw new Error("news");
      const page = await response.json() as NewsPage;
      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...page.items.filter((item) => !known.has(item.id))];
      });
      setCursor(page.next);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.board} aria-labelledby="presidential-news-title">
      <header className={styles.intro}>
        <p className="campaign-section-label">{t.eyebrow}</p>
        <h1 id="presidential-news-title">{t.title}</h1>
        <p>{t.lede}</p>
      </header>
      {items.length === 0 ? <p className={styles.empty}>{t.empty}</p> : (
        <div className={styles.masonry}>
          {items.map((item, index) => <NewsCube item={item} index={index} language={language} text={text} photoLabel={t.photo} ageLabel={age(item.publishedAt, language)} key={item.id} />)}
        </div>
      )}
      {cursor !== null ? (
        <button className={styles.more} type="button" onClick={loadMore} disabled={loading}>
          {loading ? t.loading : t.more}
        </button>
      ) : null}
      {error ? <p className={styles.error} role="alert">{t.error}</p> : null}
    </section>
  );
}

function NewsCube({ item, index, language, text, photoLabel, ageLabel }: {
  item: PublicNewsCard;
  index: number;
  language: Language;
  text: "en" | "es";
  photoLabel: string;
  ageLabel: string;
}) {
  const tone = index % 4;
  return (
    <a className={styles.card} data-tone={tone} href={item.url} target="_blank" rel="noreferrer">
      {item.image ? (
        <span className={styles.photo}>
          <img src={item.image.url} alt="" />
          <span className={styles.credit}>{item.image.author ? `${photoLabel}: ${item.image.author}` : "Wikimedia Commons"}</span>
        </span>
      ) : <span className={styles.quote} aria-hidden="true">“</span>}
      <span className={styles.meta}>
        <b>{item.source}</b>
        <time dateTime={item.publishedAt}>{ageLabel}</time>
      </span>
      {item.topic ? <span className={styles.topic}>{item.topic}</span> : null}
      <strong className={styles.headline} lang={text}>{item.headline[text]}</strong>
      <span className={styles.teaser} lang={text}>{item.teaser[text]}</span>
      <span className="sr-only">{language === "es" ? "Fuente original" : language === "ru" ? "Исходный материал" : "Original source"}</span>
    </a>
  );
}
