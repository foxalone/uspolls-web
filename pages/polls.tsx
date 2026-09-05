import Head from "next/head";
import { HomePolls } from "../src/components/HomePolls";
import { SITE } from "../src/data/midterms2026";
import type { HomePollSnapshot } from "../src/lib/polls/summarize";

type PollsPageProps = {
  polls: HomePollSnapshot;
};

export default function PollsPage({ polls }: PollsPageProps) {
  const title = `Polls ${SITE.year} — US Polls`;
  const description = "Live VoteHub polling for the 2026 generic ballot, Senate, House, governor races, and Trump approval.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="home-stack">
        <HomePolls polls={polls} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { getHomePollsStaticProps } = await import("../src/lib/polls/homeData");
  return getHomePollsStaticProps();
}
