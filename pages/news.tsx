import type { GetServerSideProps } from "next";
import { Seo } from "../src/components/Seo";
import { PresidentialNews } from "../src/components/PresidentialNews";
import { useLanguage } from "../src/lib/language";
import type { NewsPage } from "../src/lib/news/types";

const EMPTY: NewsPage = { items: [], next: null };

const copy = {
  en: {
    title: "2028 presidential news",
    description: "Headlines on the 2028 U.S. presidential race, in English and Spanish. Each card links to its original source.",
  },
  es: {
    title: "Noticias presidenciales 2028",
    description: "Titulares de la carrera presidencial de EE. UU. de 2028, en inglés y español. Cada ficha enlaza a su fuente original.",
  },
  ru: {
    title: "Новости президентской гонки 2028",
    description: "Заголовки о президентской гонке в США 2028 года. Каждая карточка ведёт к исходному источнику.",
  },
} as const;

export default function NewsPage({ initial }: { initial: NewsPage }) {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <>
      <Seo title={t.title} description={t.description} path="/news" />
      <PresidentialNews initial={initial} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ initial: NewsPage }> = async ({ res }) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  try {
    const { listPresidentialNews } = await import("../src/lib/news/store");
    const initial = await listPresidentialNews(10);
    return { props: { initial } };
  } catch {
    return { props: { initial: EMPTY } };
  }
};
