import type { ReactNode } from "react";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider, useLanguage } from "../lib/language";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <LanguageProvider><ShellContent>{children}</ShellContent></LanguageProvider>
    </ThemeProvider>
  );
}

function ShellContent({ children }: AppShellProps) {
  const { language } = useLanguage();
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell"><div className="page-shell__content">{children}</div></main>
      <footer className="site-footer campaign-footer">
        <strong>US Polls · 2028</strong>
        <p>{language === "en"
          ? "An independent guide to the U.S. presidential election. Polls will appear only with a traceable source, field dates, and sample details. No candidate endorsements or election forecasts."
          : "Una guía independiente de la elección presidencial de EE. UU. Las encuestas aparecerán solo con fuente verificable, fechas de campo y datos de la muestra. Sin respaldos a candidatos ni pronósticos electorales."}</p>
      </footer>
    </div>
  );
}
