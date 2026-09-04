import Head from "next/head";
import { HomePage } from "../src/components/HomePage";
import { SITE } from "../src/data/midterms2026";
import { emptyHomePollSnapshot, type HomePollSnapshot } from "../src/lib/polls/summarize";

type IndexPageProps = {
  polls: HomePollSnapshot;
};

export default function IndexPage({ polls }: IndexPageProps) {
  const title = `US House & Senate polls ${SITE.year} — Midterm Monitor`;
  const description =
    "Track the November 2026 midterms with live VoteHub polling: generic ballot, Senate, House, governor races, and Trump approval.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <HomePage polls={polls} />
    </>
  );
}

export async function getStaticProps() {
  const { getHomePollSnapshot, POLLS_ISR_REVALIDATE_SECONDS } = await import("../src/lib/polls/homeData");
  try {
    const polls = await getHomePollSnapshot();
    return {
      props: { polls },
      revalidate: POLLS_ISR_REVALIDATE_SECONDS,
    };
  } catch {
    return {
      props: { polls: emptyHomePollSnapshot() },
      revalidate: 60,
    };
  }
}
