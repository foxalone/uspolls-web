import { useState } from "react";
import type { ChamberId } from "../data/midterms2026";
import { HomeBuzz } from "./HomeBuzz";
import { HomeChamberBattle } from "./HomeChamberBattle";
import { HomeHeadlines } from "./HomeHeadlines";
import { HomeHero } from "./HomeHero";
import { HomeMarkets } from "./HomeMarkets";
import { HomeNews } from "./HomeNews";
import { HomeSeatBoard } from "./HomeSeatBoard";
import { HomeTodayChanges } from "./HomeTodayChanges";
import { HomeTrends } from "./HomeTrends";

export function HomePage() {
  const [chamber, setChamber] = useState<ChamberId>("house");

  return (
    <div className="home-stack">
      <HomeHero />
      <HomeChamberBattle chamber={chamber} onChamberChange={setChamber} />
      <HomeSeatBoard chamber={chamber} />
      <HomeTodayChanges />
      <HomeMarkets chamber={chamber} />
      <HomeTrends />
      <HomeHeadlines />
      <HomeBuzz />
      <HomeNews />
    </div>
  );
}
