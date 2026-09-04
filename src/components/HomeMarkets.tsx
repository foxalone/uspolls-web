import {
  HOUSE_CONTROL_MARKET,
  LEADING_BETS,
  MARKET_URLS,
  SENATE_CONTROL_MARKET,
  type ChamberId,
  type LeadingBet,
  type MarketRow,
} from "../data/midterms2026";

type HomeMarketsProps = {
  chamber: ChamberId;
};

export function HomeMarkets({ chamber }: HomeMarketsProps) {
  const rows = chamber === "house" ? HOUSE_CONTROL_MARKET : SENATE_CONTROL_MARKET;
  const title = chamber === "house" ? "Who controls the House?" : "Who controls the Senate?";

  return (
    <section className="panel home-markets" id="odds">
      <header className="home-markets__head">
        <div>
          <h2>What are the odds?</h2>
          <p>
            Polymarket is a prediction market where traders price real-world political
            outcomes. These are market probabilities, not polls.
          </p>
        </div>
        <p className="home-markets__brand" aria-hidden="true">
          polymarket ~
        </p>
      </header>

      <div className="home-markets__chart">
        <h3>{title}</h3>
        <ol>
          {rows.map((row) => (
            <MarketBar key={row.name} row={row} />
          ))}
        </ol>
        <a href={MARKET_URLS[chamber]} rel="noopener noreferrer" target="_blank">
          View the full market on Polymarket →
        </a>
      </div>

      <div className="leading-bets">
        <h3>Leading bets</h3>
        <div className="leading-bets__grid">
          {LEADING_BETS.map((bet) => (
            <BetCard bet={bet} key={bet.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketBar({ row }: { row: MarketRow }) {
  return (
    <li>
      <span>{row.name}</span>
      <div className="market-track">
        <div
          className="market-bar"
          style={{
            background: row.color,
            color: row.textColor,
            width: `${Math.max(row.percent, 10)}%`,
          }}
        >
          {row.percent}%
        </div>
      </div>
    </li>
  );
}

function BetCard({ bet }: { bet: LeadingBet }) {
  return (
    <article className="bet-card">
      <h4>{bet.title}</h4>
      <ul className={bet.kind === "binary" ? "is-binary" : ""}>
        {bet.rows.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <strong style={row.color ? { color: row.color } : undefined}>{row.percent}%</strong>
          </li>
        ))}
      </ul>
      <p>{bet.source}</p>
    </article>
  );
}
