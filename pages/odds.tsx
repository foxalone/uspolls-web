import { useState } from "react";
import Head from "next/head";
import { HomeMarkets } from "../src/components/HomeMarkets";
import { HomeTrends } from "../src/components/HomeTrends";
import { SITE, type ChamberId } from "../src/data/midterms2026";

export default function OddsPage() {
  const [chamber, setChamber] = useState<ChamberId>("house");
  const title = `Odds and prediction markets ${SITE.year} — US Polls`;
  const description = "Prediction-market odds for 2026 House and Senate control, plus the races drawing the most search attention.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="home-stack">
        <HomeMarkets chamber={chamber} onChamberChange={setChamber} />
        <HomeTrends />
      </div>
    </>
  );
}
