import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { languageLocale, useLanguage, type Language } from "../lib/language";
import { mergeNews } from "../lib/news/feed";
import type { NewsPage, PublicNewsCard } from "../lib/news/types";
import styles from "./PresidentialNews.module.css";

const copy = {
  en: {
    eyebrow: "2028 presidential race",
    title: "News",
    lede: "Headlines about the race, gathered every three hours in English and Spanish.",
    empty: "The first headlines appear after the next update.",
    loading: "Loading…",
    error: "More headlines could not be loaded.",
    photo: "Photo",
  },
  es: {
    eyebrow: "Carrera presidencial de 2028",
    title: "Noticias",
    lede: "Titulares de la carrera, reunidos cada tres horas en inglés y en español.",
    empty: "Los primeros titulares aparecen después de la próxima actualización.",
    loading: "Cargando…",
    error: "No se pudieron cargar más titulares.",
    photo: "Foto",
  },
  ru: {
    eyebrow: "Президентская гонка 2028",
    title: "Новости",
    lede: "Заголовки о гонке собираются каждые три часа на английском и испанском.",
    empty: "Первые заголовки появятся после следующего обновления.",
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

const NEWER_POLL_MS = 60_000;

function columnCountFor(width: number) {
  if (width < 680) return 1;
  if (width < 980) return 2;
  return 3;
}

function cardWeight(item: PublicNewsCard) {
  return item.image ? 46 : 20;
}

function packNews(items: PublicNewsCard[], count: number) {
  const columns: { item: PublicNewsCard; index: number }[][] = Array.from({ length: count }, () => []);
  const weight = Array(count).fill(0);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    let target = 0;
    for (let column = 1; column < count; column += 1) {
      if (weight[column] < weight[target]) target = column;
    }
    columns[target].push({ item, index });
    weight[target] += cardWeight(item);
  }
  return columns;
}

function useColumnCount() {
  const [count, setCount] = useState(3);
  useLayoutEffect(() => {
    const apply = () => setCount(columnCountFor(window.innerWidth));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  return count;
}

export function PresidentialNews({ initial }: { initial: NewsPage }) {
  const { language } = useLanguage();
  const t = copy[language];
  const text = words(language);
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.next);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const itemsRef = useRef(items);
  const cursorRef = useRef(cursor);
  const stickRef = useRef<{ y: number; height: number } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const retriesRef = useRef(0);
  const columns = useColumnCount();
  itemsRef.current = items;
  cursorRef.current = cursor;

  useEffect(() => {
    const stick = stickRef.current;
    if (!stick) return;
    stickRef.current = null;
    const delta = document.documentElement.scrollHeight - stick.height;
    if (delta > 0) window.scrollTo(0, stick.y + delta);
  }, [items]);

  useEffect(() => {
    let stopped = false;
    let loadingNewer = false;

    async function loadNewer() {
      if (loadingNewer || document.visibilityState === "hidden") return;
      loadingNewer = true;
      try {
        await pullNewer();
      } finally {
        loadingNewer = false;
      }
    }

    async function pullNewer() {
      const floor = itemsRef.current.reduce((max, item) => Math.max(max, item.sortKey), 0);
      const incoming: PublicNewsCard[] = [];
      let before: number | undefined;
      let openedNext: number | null | undefined;
      try {
        for (let page = 0; page < 4; page += 1) {
          const params = new URLSearchParams();
          if (floor > 0) params.set("after", String(floor));
          if (before !== undefined) params.set("before", String(before));
          const response = await fetch(`/api/presidential-news?${params}`, { cache: "no-store" });
          if (!response.ok) return;
          const data = await response.json() as NewsPage;
          if (floor === 0) {
            incoming.push(...data.items);
            openedNext = data.next;
            break;
          }
          const fresh = data.items.filter((item) => item.sortKey > floor);
          incoming.push(...fresh);
          if (!data.next || fresh.length === 0) break;
          before = data.next;
        }
      } catch {
        return;
      }
      if (stopped || incoming.length === 0) return;
      if (window.scrollY >= 160) {
        stickRef.current = { y: window.scrollY, height: document.documentElement.scrollHeight };
      }
      setItems((current) => mergeNews(current, incoming));
      if (openedNext !== undefined && cursorRef.current === null) setCursor(openedNext);
    }

    void loadNewer();
    const timer = window.setInterval(() => void loadNewer(), NEWER_POLL_MS);
    document.addEventListener("visibilitychange", loadNewer);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", loadNewer);
    };
  }, []);

  const loadMore = useCallback(async () => {
    const before = cursorRef.current;
    if (before === null || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/presidential-news?before=${before}`);
      if (!response.ok) throw new Error("news");
      const page = await response.json() as NewsPage;
      retriesRef.current = 0;
      setItems((current) => mergeNews(current, page.items));
      setCursor(page.next);
    } catch {
      retriesRef.current += 1;
      setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || cursor === null || error) return;
    let seenHidden = document.documentElement.scrollHeight <= window.innerHeight + 80;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) {
        seenHidden = true;
        return;
      }
      if (seenHidden) void loadMore();
    }, { rootMargin: "120px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [cursor, items.length, error, loadMore]);

  useEffect(() => {
    if (!error) return;
    const onScroll = () => {
      retriesRef.current = 0;
      setError(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    const timer = retriesRef.current < 3 ? window.setTimeout(() => setError(false), 4000) : 0;
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [error]);

  return (
    <section className={styles.board} aria-labelledby="presidential-news-title">
      <header className={styles.intro}>
        <p className="campaign-section-label">{t.eyebrow}</p>
        <h1 id="presidential-news-title">{t.title}</h1>
        <p>{t.lede}</p>
      </header>
      {items.length === 0 ? <p className={styles.empty}>{t.empty}</p> : (
        <div className={styles.masonry} data-columns={columns}>
          {packNews(items, columns).map((column, columnIndex) => (
            <div className={styles.column} key={columnIndex}>
              {column.map(({ item, index }) => (
                <NewsCube item={item} index={index} text={text} photoLabel={t.photo} ageLabel={age(item.publishedAt, language)} key={item.id} />
              ))}
              {loading ? <div className={styles.skeleton} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      )}
      {cursor !== null ? <div ref={sentinelRef} className={styles.sentinel} /> : null}
      {loading ? <p className={styles.status} aria-live="polite">{t.loading}</p> : null}
      {error ? <p className={styles.error} role="alert">{t.error}</p> : null}
    </section>
  );
}

export function RelatedNews({ items }: { items: PublicNewsCard[] }) {
  const { language } = useLanguage();
  const text = words(language);
  const t = copy[language];
  if (items.length === 0) return null;
  return (
    <div className={styles.related}>
      {items.map((item, index) => (
        <NewsCube item={item} index={index} text={text} photoLabel={t.photo} ageLabel={age(item.publishedAt, language)} key={item.id} />
      ))}
    </div>
  );
}

function NewsCube({ item, index, text, photoLabel, ageLabel }: {
  item: PublicNewsCard;
  index: number;
  text: "en" | "es";
  photoLabel: string;
  ageLabel: string;
}) {
  const tone = index % 4;
  return (
    <Link className={styles.card} data-tone={tone} href={`/news/${item.id}`}>
      {item.image ? (
        <span className={styles.photo}>
          <img src={item.image.url} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
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
    </Link>
  );
}
