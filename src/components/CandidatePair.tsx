type Cycle = "2012" | "2016" | "2020" | "2024" | "2028";

const PORTRAITS = {
  obama: "/candidates/obama.jpg",
  romney: "/candidates/romney.jpg",
  clinton: "/candidates/clinton.jpg",
  biden: "/candidates/biden.jpg",
  harris: "/candidates/harris.jpg",
  trump: "/candidates/trump.jpg",
} as const;

const PAIRS: Record<Exclude<Cycle, "2028">, Array<keyof typeof PORTRAITS>> = {
  2012: ["obama", "romney"],
  2016: ["clinton", "trump"],
  2020: ["biden", "trump"],
  2024: ["harris", "trump"],
};

type CandidatePairProps = {
  cycle: Cycle;
  names: Record<keyof typeof PORTRAITS, string>;
  openLabel: string;
};

export function CandidatePair({ cycle, names, openLabel }: CandidatePairProps) {
  if (cycle === "2028") {
    return (
      <figure className="candidate-pair is-open">
        <div className="candidate-pair__ghost" aria-hidden="true"><i /><i /></div>
        <figcaption>{openLabel}</figcaption>
      </figure>
    );
  }

  const pair = PAIRS[cycle];
  return (
    <figure className="candidate-pair" aria-label={pair.map((key) => names[key]).join(", ")}>
      {pair.map((key) => (
        <img key={key} className={key === "obama" ? "is-obama" : undefined} src={PORTRAITS[key]} alt={names[key]} />
      ))}
    </figure>
  );
}
