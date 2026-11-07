import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "es" | "ru";

const STORAGE_KEY = "uspolls-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  ruAllowed: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const CHROME = {
  en: {
    brand: "Presidential race · 2028",
    nav: "Main navigation",
    language: "Language",
    theme: "Color theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    footer: "An independent guide to the U.S. presidential election. Polls will appear only with a traceable source, field dates, and sample details. No candidate endorsements or election forecasts.",
  },
  es: {
    brand: "Carrera presidencial · 2028",
    nav: "Navegación principal",
    language: "Idioma",
    theme: "Tema de color",
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático",
    footer: "Una guía independiente de la elección presidencial de EE. UU. Las encuestas aparecerán solo con fuente verificable, fechas de campo y datos de la muestra. Sin respaldos a candidatos ni pronósticos electorales.",
  },
  ru: {
    brand: "Президентская гонка · 2028",
    nav: "Основная навигация",
    language: "Язык",
    theme: "Цветовая тема",
    light: "Светлая",
    dark: "Тёмная",
    auto: "Авто",
    footer: "Независимый справочник по президентским выборам в США. Опросы появляются только с проверяемым источником, датами поля и данными выборки. Без поддержки кандидатов и без прогнозов итогов.",
  },
} as const;

export function languageLocale(language: Language) {
  if (language === "es") return "es-ES";
  if (language === "ru") return "ru-RU";
  return "en-US";
}

function persist(language: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Keep the current session usable in private browsing.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [ruAllowed, setRuAllowed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "es") setLanguageState("es");
    } catch {
      // The language switch still works when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/lang-preview")
      .then((response) => (response.ok ? response.json() : { ru: false }))
      .then((data: { ru?: boolean }) => {
        if (cancelled) return;
        const allowed = data.ru === true;
        setRuAllowed(allowed);
        if (!allowed) return;
        try {
          if (localStorage.getItem(STORAGE_KEY) === "ru") setLanguageState("ru");
        } catch {
          // Ignore a missing store and keep English.
        }
      })
      .catch(() => {
        if (!cancelled) setRuAllowed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    ruAllowed,
    setLanguage: (next) => {
      if (next === "ru" && !ruAllowed) return;
      setLanguageState(next);
      persist(next);
    },
  }), [language, ruAllowed]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
