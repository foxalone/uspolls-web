import { US_STATE_LABELS } from "../data/usStateLabels";
import { US_STATE_SHAPES } from "../data/usStateShapes";

const ELECTORAL_VOTES: Record<string, number> = {
  al: 9, ak: 3, az: 11, ar: 6, ca: 54, co: 10, ct: 7, de: 3, dc: 3,
  fl: 30, ga: 16, hi: 4, id: 4, il: 19, in: 11, ia: 6, ks: 6, ky: 8,
  la: 8, me: 4, md: 10, ma: 11, mi: 15, mn: 10, ms: 6, mo: 10, mt: 4,
  ne: 5, nv: 6, nh: 4, nj: 14, nm: 5, ny: 28, nc: 16, nd: 3, oh: 17,
  ok: 7, or: 8, pa: 19, ri: 4, sc: 9, sd: 3, tn: 11, tx: 40, ut: 6,
  vt: 3, va: 13, wa: 12, wv: 4, wi: 10, wy: 3,
};

const ELECTORAL_VOTES_2020: Record<string, number> = {
  al: 9, ak: 3, az: 11, ar: 6, ca: 55, co: 9, ct: 7, de: 3, dc: 3,
  fl: 29, ga: 16, hi: 4, id: 4, il: 20, in: 11, ia: 6, ks: 6, ky: 8,
  la: 8, me: 4, md: 10, ma: 11, mi: 16, mn: 10, ms: 6, mo: 10, mt: 3,
  ne: 5, nv: 6, nh: 4, nj: 14, nm: 5, ny: 29, nc: 15, nd: 3, oh: 18,
  ok: 7, or: 7, pa: 20, ri: 4, sc: 9, sd: 3, tn: 11, tx: 38, ut: 6,
  vt: 3, va: 13, wa: 12, wv: 5, wi: 10, wy: 3,
};

const BIDEN_2020_FLIPS = new Set(["az", "ga", "mi", "nv", "pa", "wi"]);
const TRUMP_2016_FROM_2020 = new Set(["az", "ga", "mi", "pa", "wi"]);
const OBAMA_2012 = new Set(["ca", "co", "ct", "de", "dc", "fl", "hi", "il", "ia", "me", "md", "ma", "mi", "mn", "nv", "nh", "nj", "nm", "ny", "oh", "or", "pa", "ri", "vt", "va", "wa", "wi"]);

export type ResultsCycle = "2024" | "2020" | "2016" | "2012";

function stateTone(code: string, winner2024: string, cycle: ResultsCycle) {
  if (cycle === "2024") return winner2024;
  if (cycle === "2012") return OBAMA_2012.has(code) ? "obama" : "romney";
  const biden2020 = winner2024 === "harris" || BIDEN_2020_FLIPS.has(code);
  if (cycle === "2020") return biden2020 ? "biden" : "trump";
  if (!biden2020 || TRUMP_2016_FROM_2020.has(code)) return "trump";
  return "clinton";
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
  const blue = cycle === "2012" ? "obama" : cycle === "2016" ? "clinton" : cycle === "2020" ? "biden" : "harris";
  const red = cycle === "2012" ? "romney" : "trump";
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
  const votesFor = cycle === "2024" ? ELECTORAL_VOTES : ELECTORAL_VOTES_2020;
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
