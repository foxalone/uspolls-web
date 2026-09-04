import type { ReactNode } from "react";
import { Header } from "./Header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <div className="page-shell__content">{children}</div>
      </main>
      <footer className="site-footer">
        <p>
          <strong>US Polls</strong> — a public tracker for House and Senate polls,
          prediction markets, and campaign metrics for the November 2026 midterms.
        </p>
        <p>
          Informational only. Not political advice, not a forecast you should bet
          on, and not an official election result.
        </p>
      </footer>
    </div>
  );
}
