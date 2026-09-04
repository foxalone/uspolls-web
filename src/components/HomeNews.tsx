import { NEWS } from "../data/midterms2026";

export function HomeNews() {
  return (
    <section className="panel home-news" id="news">
      <header>
        <p className="eyebrow">Today</p>
        <h2>Latest headlines</h2>
      </header>
      <ol>
        {NEWS.map((item) => (
          <li key={item.id}>
            <span>{item.source}</span>
            <a href={item.href}>{item.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
