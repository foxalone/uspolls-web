import { useState } from "react";
import type { ChamberId } from "../data/midterms2026";
import type { HomePollSnapshot } from "../lib/polls/summarize";
import { HomeBuzz } from "./HomeBuzz";
import { HomeChamberBattle } from "./HomeChamberBattle";
import { HomeHeadlines } from "./HomeHeadlines";
import { HomeHero } from "./HomeHero";
import { HomeMarkets } from "./HomeMarkets";
import { HomeNews } from "./HomeNews";
import { HomePolls } from "./HomePolls";
import { HomeSeatBoard } from "./HomeSeatBoard";
import { HomeTodayChanges } from "./HomeTodayChanges";
import { HomeTrends } from "./HomeTrends";

type HomePageProps = {
  polls: HomePollSnapshot;
};

export function HomePage({ polls }: HomePageProps) {
  const [chamber, setChamber] = useState<ChamberId>("house");

  return (
    <div className="home-stack">
      <HomeHero />
      <HomePolls polls={polls} />
      <HomeChamberBattle chamber={chamber} onChamberChange={setChamber} polls={polls} />
      <HomeSeatBoard chamber={chamber} />
      <HomeTodayChanges polls={polls} />
      <HomeMarkets chamber={chamber} />
      <HomeTrends />
      <HomeHeadlines />
      <HomeBuzz />
      <HomeNews />
    </div>
  );
}
