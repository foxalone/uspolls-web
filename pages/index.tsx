import Head from "next/head";
import { HomePage } from "../src/components/HomePage";
import { SITE } from "../src/data/midterms2026";

export default function IndexPage() {
  const title = `US House & Senate polls ${SITE.year} — Midterm Monitor`;
  const description =
    "Track the November 2026 midterms: House and Senate seat boards, generic ballot, prediction-market odds, headlines, and the countdown to Election Day.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <HomePage />
    </>
  );
}
