import { CHAMBERS, type ChamberId } from "../data/midterms2026";
import { formatMargin, type HomePollSnapshot } from "../lib/polls/summarize";
import { ChamberToggle } from "./ChamberToggle";

type HomeChamberBattleProps = {
  chamber: ChamberId;
  onChamberChange: (value: ChamberId) => void;
  polls: HomePollSnapshot;
};

export function HomeChamberBattle({ chamber, onChamberChange, polls }: HomeChamberBattleProps) {
  const house = CHAMBERS.house;
  const senate = CHAMBERS.senate;
  const active = CHAMBERS[chamber];
  const ballot = polls.genericBallot;

  return (
    <section className="panel chamber-battle" id="chambers">
      <header className="chamber-battle__head">
        <div>
          <p className="eyebrow">The chamber fight</p>
          <h2>House 435 · Senate 100</h2>
        </div>
        <ChamberToggle onChange={onChamberChange} value={chamber} />
      </header>

      <div className="chamber-battle__source">
        <button aria-label="Previous snapshot" className="chamber-battle__arrow" type="button">
          ‹
        </button>
        <div>
          <strong>{ballot?.latestEndDate || "VoteHub"}</strong>
          <span>
            {ballot
              ? `Simple generic-ballot average ${formatMargin(ballot.margin)} · ${ballot.pollCount} polls`
              : "Generic ballot pending import"}
          </span>
        </div>
        <button aria-label="Next snapshot" className="chamber-battle__arrow" type="button">
          ›
        </button>
      </div>

      <div className="chamber-battle__grid" data-chamber={chamber}>
        <BattleBlock
          accent="dem"
          current={active.currentDem}
          forecast={active.forecastDem}
          label="Democrats"
          leader="Jeffries / Schumer"
        />
        <BattleBlock
          accent="need"
          current={active.majority - active.currentDem}
          forecast={Math.max(active.majority - active.forecastDem, 0)}
          label={chamber === "house" ? "Seats to 218" : "Seats to 51"}
          leader="Path to majority"
          suffix=""
        />
        <BattleBlock
          accent="ind"
          current={active.currentInd}
          forecast={active.forecastInd}
          label="Independent"
          leader="Caucus / other"
        />
        <BattleBlock
          accent="gop"
          current={active.currentGop}
          forecast={active.forecastGop}
          label="Republicans"
          leader="Johnson / Thune"
        />
      </div>

      <div className="chamber-battle__leaders" aria-hidden="true">
        <LeaderCard initials="HJ" name="Hakeem Jeffries" party="D" role="House Democrats" />
        <div className="chamber-battle__split">
          <p>
            <strong>{house.forecastDem}</strong>
            <span>House D</span>
          </p>
          <p>
            <strong>{senate.forecastDem}</strong>
            <span>Senate D</span>
          </p>
          <p>
            <strong>{house.forecastGop}</strong>
            <span>House R</span>
          </p>
          <p>
            <strong>{senate.forecastGop}</strong>
            <span>Senate R</span>
          </p>
        </div>
        <LeaderCard initials="MJ" name="Mike Johnson" party="R" role="House Republicans" />
      </div>
    </section>
  );
}

function BattleBlock({
  accent,
  current,
  forecast,
  label,
  leader,
  suffix = "",
}: {
  accent: "dem" | "gop" | "ind" | "need";
  current: number;
  forecast: number;
  label: string;
  leader: string;
  suffix?: string;
}) {
  return (
    <div className={`chamber-battle__block is-${accent}`}>
      <span>{label}</span>
      <strong>
        {forecast}
        {suffix}
      </strong>
      <em>Now {current}</em>
      <small>{leader}</small>
    </div>
  );
}

function LeaderCard({
  initials,
  name,
  party,
  role,
}: {
  initials: string;
  name: string;
  party: "D" | "R";
  role: string;
}) {
  return (
    <div className={`leader-card is-${party.toLowerCase()}`}>
      <span className="leader-card__avatar">{initials}</span>
      <div>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
    </div>
  );
}
