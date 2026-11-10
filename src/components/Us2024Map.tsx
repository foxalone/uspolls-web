import { CYCLE_SIDES, electorsFor, olderWinner, type MapCycle } from "../data/historicalMaps";
import { US_STATE_LABELS } from "../data/usStateLabels";
import { US_STATE_SHAPES } from "../data/usStateShapes";

const BIDEN_2020_FLIPS = new Set(["az", "ga", "mi", "nv", "pa", "wi"]);
const TRUMP_2016_FROM_2020 = new Set(["az", "ga", "mi", "pa", "wi"]);
const OBAMA_2012 = new Set(["ca", "co", "ct", "de", "dc", "fl", "hi", "il", "ia", "me", "md", "ma", "mi", "mn", "nv", "nh", "nj", "nm", "ny", "oh", "or", "pa", "ri", "vt", "va", "wa", "wi"]);

export type ResultsCycle = MapCycle;

function stateTone(code: string, winner2024: string, cycle: ResultsCycle) {
  if (cycle === "2024") return winner2024;
  if (cycle === "2012") return OBAMA_2012.has(code) ? "obama" : "romney";
  if (cycle === "2020" || cycle === "2016") {
    const biden2020 = winner2024 === "harris" || BIDEN_2020_FLIPS.has(code);
    if (cycle === "2020") return biden2020 ? "biden" : "trump";
    if (!biden2020 || TRUMP_2016_FROM_2020.has(code)) return "trump";
    return "clinton";
  }
  return olderWinner(cycle, code);
}

export function Us2024ResultsSection({
  kicker,
  title,
  text,
  trump,
  harris,
  colored = true,
  cycle = "2024",
}: {
  kicker?: string;
  title: string;
  text: string;
  trump?: string;
  harris?: string;
  colored?: boolean;
  cycle?: ResultsCycle;
}) {
  const { red, blue } = CYCLE_SIDES[cycle];
  return (
    <section className="campaign-panel" aria-label={title}>
      {kicker ? <p className="campaign-section-label">{kicker}</p> : null}
      <h2>{title}</h2>
      <p>{text}</p>
      {colored ? (
        <div className="us-map-legend">
          <span><i className={`is-${red}`} />{trump}</span>
          <span><i className={`is-${blue}`} />{harris}</span>
        </div>
      ) : null}
      <Us2024Map label={text} colored={colored} cycle={cycle} />
    </section>
  );
}

export function Us2024Map({ label, colored = true, cycle = "2024" }: { label: string; colored?: boolean; cycle?: ResultsCycle }) {
  const votesFor = electorsFor(cycle);
  const dcTone = colored ? stateTone("dc", "harris", cycle) : "open";
  return (
    <svg className={colored ? "us-map" : "us-map is-open"} viewBox="0 0 959 593" role="img" aria-label={label}>
      {US_STATE_SHAPES.map((state) => (
        <path key={state.code} className={colored ? `us-map__state is-${stateTone(state.code, state.winner, cycle)}` : "us-map__state is-open"} d={state.d}>
          <title>{`${state.name}, ${votesFor[state.code]}`}</title>
        </path>
      ))}
      <circle className={`us-map__state is-${dcTone}`} cx="801.6" cy="252.1" r="5">
        <title>{`District of Columbia, ${votesFor.dc}`}</title>
      </circle>
      <g aria-hidden="true">
        {US_STATE_SHAPES.map((state) => {
          const spot = US_STATE_LABELS[state.code];
          const votes = votesFor[state.code];
          return (
            <text key={state.code} className="us-map__label" x={spot.x} y={spot.y - spot.size * 0.42} fontSize={spot.size}>
              <tspan x={spot.x} dy="0">{state.code.toUpperCase()}</tspan>
              <tspan className="us-map__votes" x={spot.x} dy={spot.size * 0.92}>{votes}</tspan>
            </text>
          );
        })}
      </g>
    </svg>
  );
}
