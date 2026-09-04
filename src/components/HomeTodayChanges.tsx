import { STORY, TODAY_CARDS, type ChangeTone } from "../data/midterms2026";
import { formatMargin, type HomePollSnapshot } from "../lib/polls/summarize";

type HomeTodayChangesProps = {
  polls: HomePollSnapshot;
};

export function HomeTodayChanges({ polls }: HomeTodayChangesProps) {
  const ballot = polls.genericBallot;
  const cards = TODAY_CARDS.map((card) => {
    if (card.id !== "polls") return card;
    return {
      ...card,
      text: ballot
        ? `Generic ballot simple average ${formatMargin(ballot.margin)} (Dem ${ballot.dem.toFixed(1)} / GOP ${ballot.gop.toFixed(1)}) from the last ${ballot.pollCount} VoteHub polls.`
        : "VoteHub polling has not been loaded onto this page yet.",
    };
  });

  const storyBody = ballot
    ? [
        `The latest simple generic-ballot average from VoteHub is ${formatMargin(ballot.margin)} — Democrats ${ballot.dem.toFixed(1)}, Republicans ${ballot.gop.toFixed(1)} — across the last ${ballot.pollCount} national polls.`,
        STORY.body[1],
        STORY.body[2],
      ]
    : STORY.body;

  return (
    <section className="panel today-changes" id="today">
      <header>
        <p className="eyebrow">Daily brief</p>
        <h2>What changed today?</h2>
      </header>
      <div className="today-changes__grid">
        {cards.map((card) => (
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
        {storyBody.map((paragraph) => (
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
