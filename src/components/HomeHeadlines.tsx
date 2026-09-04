import { useMemo, useState } from "react";
import { HEADLINE_FIGURES, partyName } from "../data/midterms2026";

export function HomeHeadlines() {
  const [selectedId, setSelectedId] = useState(HEADLINE_FIGURES[0]?.id ?? "");
  const selected = useMemo(
    () => HEADLINE_FIGURES.find((figure) => figure.id === selectedId) ?? HEADLINE_FIGURES[0],
    [selectedId],
  );

  if (!selected) return null;

  return (
    <section className="panel home-headlines" id="headlines">
      <header>
        <p className="eyebrow">Last 3 days · Google News mentions</p>
        <h2>Who’s in the headlines?</h2>
      </header>
      <div className="headline-rail" role="list">
        {HEADLINE_FIGURES.map((figure, index) => (
          <button
            className={`headline-card${figure.id === selected.id ? " is-active" : ""}`}
            key={figure.id}
            onClick={() => setSelectedId(figure.id)}
            type="button"
          >
            <span className="headline-card__rank">{index + 1}</span>
            <span className={`headline-card__avatar is-${figure.party.toLowerCase()}`}>
              {figure.initials}
            </span>
            <strong>{figure.name}</strong>
            <em>{figure.role}</em>
          </button>
        ))}
      </div>
      <div className="headline-detail">
        <p className="headline-detail__badge">
          {partyName(selected.party)} · {selected.articles}+ articles
        </p>
        <ul>
          {selected.headlines.map((item) => (
            <li key={item.title}>
              <span>{item.source}</span>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
