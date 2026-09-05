import Link from "next/link";
import { useRouter } from "next/router";
import { formatUsLongDate } from "../lib/electionCalendar";
import { NAV } from "../lib/nav";
import { ThemeSwitcher } from "./ThemeSwitcher";

function NavIcon({ name }: { name: string }) {
  if (name === "ballot") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="5" y="3.5" width="14" height="17" rx="2.2" />
        <path d="M8.2 9.2h7.6M8.2 12.6h7.6M8.2 16h5.2" />
        <path d="M9.1 6.4l1.2 1.2 2.4-2.5" />
      </svg>
    );
  }

  if (name === "admin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4.5" y="6" width="15" height="12" rx="2" />
        <path d="M8 12h8M8 15h5" />
        <circle cx="9" cy="9.2" r="0.9" />
      </svg>
    );
  }

  if (name === "odds") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 17.5l4.2-5.1 3.1 3.2L19 7.5" />
        <path d="M14.2 7.5H19v4.8" />
      </svg>
    );
  }

  if (name === "news") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M7.2 9h6.2M7.2 12.2h9.6M7.2 15.3h5.4" />
      </svg>
    );
  }

  if (name === "seats") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.8 16.8c2.2-3.6 5.1-5.4 7.2-5.4s5 1.8 7.2 5.4" />
        <circle cx="12" cy="8.6" r="2.3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.8 11.2L12 5.2l7.2 6V19a1.4 1.4 0 0 1-1.4 1.4H6.2A1.4 1.4 0 0 1 4.8 19z" />
    </svg>
  );
}

export function Header() {
  const today = formatUsLongDate(new Date());
  const router = useRouter();

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <p className="site-header__date">{today}</p>
        <div className="site-header__tools">
          <ThemeSwitcher />
          <span className="site-header__lang">EN</span>
        </div>
      </div>
      <div className="site-header__main">
        <Link className="brand" href="/">
          <span className="brand__mark" aria-hidden="true">
            US
          </span>
          <span className="brand__copy">
            <strong>US Polls</strong>
            <em>House · Senate · 2026</em>
          </span>
        </Link>
        <nav aria-label="Primary" className="site-nav">
          {NAV.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                className={`site-nav-link${item.accent ? " is-accent" : ""}${active ? " is-active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
