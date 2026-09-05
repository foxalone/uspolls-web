import { useTheme } from "./ThemeProvider";
import type { ThemePreference } from "../lib/theme";

const OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "auto", label: "Auto" },
];

function ThemeIcon({ name }: { name: ThemePreference }) {
  if (name === "light") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.4" />
        <path d="M12 3.4v2.1M12 18.5v2.1M3.4 12h2.1M18.5 12h2.1M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M6.1 17.9l1.5-1.5M16.4 7.6l1.5-1.5" />
      </svg>
    );
  }

  if (name === "dark") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M15.4 4.8A7.6 7.6 0 1 0 19.2 14 6.2 6.2 0 0 1 15.4 4.8z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4.2" y="5.2" width="15.6" height="11.2" rx="1.8" />
      <path d="M8.2 19.2h7.6M12 16.4v2.8" />
    </svg>
  );
}

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <div aria-label="Color theme" className="theme-switcher" role="radiogroup">
      {OPTIONS.map((option) => {
        const selected = preference === option.id;
        return (
          <button
            aria-checked={selected}
            aria-label={option.label}
            className={`theme-switcher__btn${selected ? " is-active" : ""}`}
            key={option.id}
            onClick={() => setPreference(option.id)}
            role="radio"
            type="button"
          >
            <ThemeIcon name={option.id} />
          </button>
        );
      })}
    </div>
  );
}
