import { STORY, TODAY_CARDS, type ChangeTone } from "../data/midterms2026";

export function HomeTodayChanges() {
  return (
    <section className="panel today-changes" id="today">
      <header>
        <p className="eyebrow">Daily brief</p>
        <h2>What changed today?</h2>
      </header>
      <div className="today-changes__grid">
        {TODAY_CARDS.map((card) => (
          <article className="today-card" key={card.id}>
            <ToneIcon tone={card.tone} />
            <span>{card.label}</span>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
      <article className="today-story">
        <p className="eyebrow">{STORY.kicker}</p>
        <h3>{STORY.title}</h3>
        {STORY.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </section>
  );
}

function ToneIcon({ tone }: { tone: ChangeTone }) {
  if (tone === "up") return <i className="tone-icon is-up" aria-hidden="true">▲</i>;
  if (tone === "down") return <i className="tone-icon is-down" aria-hidden="true">▼</i>;
  return <i className="tone-icon is-flat" aria-hidden="true">•</i>;
}
