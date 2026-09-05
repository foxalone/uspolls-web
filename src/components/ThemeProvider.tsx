import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  applyTheme,
  isThemePreference,
  readThemePreference,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "../lib/theme";

function readDomPreference(): ThemePreference {
  if (typeof document === "undefined") return "auto";
  const fromDom = document.documentElement.dataset.themePref || "";
  return isThemePreference(fromDom) ? fromDom : readThemePreference();
}

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readDomPreference);
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const current = readThemePreference();
    setPreferenceState(current);
    setResolved(applyTheme(current));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const next = readThemePreference();
      setPreferenceState(next);
      setResolved(applyTheme(next));
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      setPreference: (next) => {
        setPreferenceState(next);
        setResolved(writeThemePreference(next));
      },
    }),
    [preference, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
