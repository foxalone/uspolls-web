import { MARKET_URLS, TRENDS } from "../data/midterms2026";
import { TrendSparkline } from "./TrendSparkline";

export function HomeTrends() {
  return (
    <section className="panel home-trends" aria-labelledby="home-trends-title">
      <header className="home-trends__head">
        <div>
          <h2 id="home-trends-title">Most searched now</h2>
          <p>Last 7 days vs. the prior week</p>
        </div>
        <a href={MARKET_URLS.trends} rel="noopener noreferrer" target="_blank">
          Google Trends
        </a>
      </header>
      <div className="home-trends__grid">
        {TRENDS.map((card) => (
          <article className="home-trends__card" key={card.id}>
            <span>{card.kind === "chamber" ? "Chamber" : card.kind === "race" ? "Race" : "Figure"}</span>
            <strong>{card.label}</strong>
            <TrendSparkline series={card.series} />
            <b>
              {card.change >= 0 ? "+" : ""}
              {card.change.toFixed(1)}%
            </b>
            <em className={card.rising ? "is-up" : "is-down"}>{card.rising ? "▲ Rising" : "▼ Falling"}</em>
          </article>
        ))}
      </div>
      <p className="home-trends__note">
        Search interest is not sentiment and not a poll. A spike can come from news,
        controversy, or simple curiosity about a candidate or chamber.
      </p>
    </section>
  );
}
