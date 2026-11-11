import type { ReactNode } from "react";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";
import { CHROME, LanguageProvider, useLanguage } from "../lib/language";
import { SITE_NAME } from "../lib/site";

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
        <strong>{SITE_NAME} · 2028</strong>
        <p>{CHROME[language].footer}</p>
      </footer>
    </div>
  );
}
