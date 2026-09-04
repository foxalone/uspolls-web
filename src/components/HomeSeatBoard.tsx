import {
  CHAMBERS,
  HOUSE_DEM_ROWS,
  HOUSE_GOP_ROWS,
  SENATE_DEM_ROWS,
  SENATE_GOP_ROWS,
  type ChamberId,
  type SeatRow,
} from "../data/midterms2026";

type HomeSeatBoardProps = {
  chamber: ChamberId;
};

export function HomeSeatBoard({ chamber }: HomeSeatBoardProps) {
  const snapshot = CHAMBERS[chamber];
  const demRows = chamber === "house" ? HOUSE_DEM_ROWS : SENATE_DEM_ROWS;
  const gopRows = chamber === "house" ? HOUSE_GOP_ROWS : SENATE_GOP_ROWS;
  const max = Math.max(...demRows.map((row) => row.seats), ...gopRows.map((row) => row.seats), 1);
  const demShare = (snapshot.forecastDem / snapshot.seats) * 100;

  return (
    <section className="panel seat-board" aria-labelledby="seat-board-title">
      <header className="seat-board__head">
        <div className="seat-gauge" aria-hidden="true">
          <svg viewBox="0 0 220 128">
            <path
              d="M18 118 A 92 92 0 0 1 202 118"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M18 118 A 92 92 0 0 1 202 118"
              fill="none"
              stroke="#3d78ff"
              strokeDasharray={`${(demShare / 100) * 289} 289`}
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M18 118 A 92 92 0 0 1 202 118"
              fill="none"
              stroke="#e23b3b"
              strokeDasharray={`${((100 - demShare) / 100) * 289} 289`}
              strokeDashoffset={-((demShare / 100) * 289)}
              strokeLinecap="round"
              strokeWidth="16"
            />
          </svg>
          <div className="seat-gauge__label">
            <strong>{snapshot.seats}</strong>
            <span>{snapshot.title} seats</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Projection board</p>
          <h2 id="seat-board-title">
            {snapshot.title}: {snapshot.forecastDem} D · {snapshot.forecastGop} R
          </h2>
          <p className="seat-board__note">
            Majority is {snapshot.majority}. Current chamber is {snapshot.currentDem} D /{" "}
            {snapshot.currentGop} R.
            {chamber === "senate" ? " Rows below are latest polling shares in the key races." : ""}
          </p>
        </div>
      </header>

      <div className="seat-board__columns">
        <SeatColumn accent="dem" rows={demRows} max={max} title="Democrats" />
        <SeatColumn accent="gop" rows={gopRows} max={max} title="Republicans" />
      </div>
    </section>
  );
}

function SeatColumn({
  accent,
  max,
  rows,
  title,
}: {
  accent: "dem" | "gop";
  max: number;
  rows: SeatRow[];
  title: string;
}) {
  return (
    <div className={`seat-column is-${accent}`}>
      <h3>{title}</h3>
      <ol>
        {rows.map((row) => (
          <li key={row.id}>
            <strong>{row.seats}</strong>
            <div className="seat-column__track">
              <div
                className="seat-column__bar"
                style={{ width: `${Math.max((row.seats / max) * 100, row.seats > 0 ? 12 : 0)}%` }}
              />
            </div>
            <div className="seat-column__meta">
              <span>{row.label}</span>
              {row.note ? <em>{row.note}</em> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
