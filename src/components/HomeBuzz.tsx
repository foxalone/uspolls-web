import { BUZZ } from "../data/midterms2026";

export function HomeBuzz() {
  return (
    <section className="panel home-buzz">
      <header className="home-buzz__head">
        <div>
          <h2>Buzz index</h2>
          <p>Attention vs. tone on public Wikipedia traffic and recent coverage.</p>
        </div>
        <span>Wikipedia</span>
      </header>
      <div className="home-buzz__grid">
        {BUZZ.map((card) => (
          <article className="buzz-card" key={card.id}>
            <div
              className="buzz-ring"
              style={{
                background: `conic-gradient(#3ecf8e ${card.positive * 3.6}deg, #ff6b73 0)`,
              }}
            >
              <span className={`buzz-ring__face is-${card.party.toLowerCase()}`}>{card.initials}</span>
            </div>
            <i className={card.rising ? "is-up" : "is-down"} aria-hidden="true">
              {card.rising ? "▲" : "▼"}
            </i>
            <strong>{card.name}</strong>
            <span>{card.views} views</span>
          </article>
        ))}
      </div>
    </section>
  );
}
