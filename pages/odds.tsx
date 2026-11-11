import { useState } from "react";
import { Seo } from "../src/components/Seo";
import { HomeMarkets } from "../src/components/HomeMarkets";
import { HomeTrends } from "../src/components/HomeTrends";
import { SITE, type ChamberId } from "../src/data/midterms2026";

export default function OddsPage() {
  const [chamber, setChamber] = useState<ChamberId>("house");
  const title = `Odds and prediction markets ${SITE.year}`;
  const description = "Prediction-market odds for 2026 House and Senate control, plus the races drawing the most search attention.";

  return (
    <>
      <Seo title={title} description={description} path="/odds" noindex />
      <div className="home-stack">
        <HomeMarkets chamber={chamber} onChamberChange={setChamber} />
        <HomeTrends />
      </div>
    </>
  );
}
