import { useState } from "react";
import { Seo } from "../src/components/Seo";
import { HomeChamberBattle } from "../src/components/HomeChamberBattle";
import { HomeSeatBoard } from "../src/components/HomeSeatBoard";
import { SITE, type ChamberId } from "../src/data/midterms2026";
import type { HomePollSnapshot } from "../src/lib/polls/summarize";

type ChambersPageProps = {
  polls: HomePollSnapshot;
};

export default function ChambersPage({ polls }: ChambersPageProps) {
  const [chamber, setChamber] = useState<ChamberId>("house");
  const title = `House and Senate chambers ${SITE.year}`;
  const description = "House and Senate control board for the 2026 midterms: seats, majority math, and the races that can flip a chamber.";

  return (
    <>
      <Seo title={title} description={description} path="/chambers" noindex />
      <div className="home-stack">
        <HomeChamberBattle chamber={chamber} onChamberChange={setChamber} polls={polls} />
        <HomeSeatBoard chamber={chamber} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { getHomePollsStaticProps } = await import("../src/lib/polls/homeData");
  return getHomePollsStaticProps();
}
