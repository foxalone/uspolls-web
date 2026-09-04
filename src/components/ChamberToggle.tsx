import type { ChamberId } from "../data/midterms2026";

type ChamberToggleProps = {
  value: ChamberId;
  onChange: (value: ChamberId) => void;
};

export function ChamberToggle({ value, onChange }: ChamberToggleProps) {
  return (
    <div className="chamber-toggle" role="tablist" aria-label="Chamber">
      <button
        aria-selected={value === "house"}
        className={`chamber-toggle__btn${value === "house" ? " is-active" : ""}`}
        onClick={() => onChange("house")}
        role="tab"
        type="button"
      >
        House
      </button>
      <button
        aria-selected={value === "senate"}
        className={`chamber-toggle__btn${value === "senate" ? " is-active" : ""}`}
        onClick={() => onChange("senate")}
        role="tab"
        type="button"
      >
        Senate
      </button>
    </div>
  );
}
