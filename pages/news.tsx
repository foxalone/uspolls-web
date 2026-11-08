import type { GetServerSideProps } from "next";
import Head from "next/head";
import { PresidentialNews } from "../src/components/PresidentialNews";
import type { NewsPage } from "../src/lib/news/types";

const EMPTY: NewsPage = { items: [], next: null };

export default function NewsPage({ initial }: { initial: NewsPage }) {
  return (
    <>
      <Head>
        <title>2028 presidential news — US Polls</title>
        <meta name="description" content="Headlines on the 2028 U.S. presidential race, in English and Spanish. Each card links to its original source." />
      </Head>
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
