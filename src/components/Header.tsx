import Link from "next/link";
import { useRouter } from "next/router";
import { CHROME, useLanguage, type Language } from "../lib/language";
import { NAV } from "../lib/nav";
import { ThemeSwitcher } from "./ThemeSwitcher";

const PUBLIC_LANGUAGES: Language[] = ["en", "es"];

export function Header() {
  const router = useRouter();
  const { language, setLanguage, ruAllowed } = useLanguage();
  const ui = CHROME[language];
  const languages: Language[] = ruAllowed ? [...PUBLIC_LANGUAGES, "ru"] : PUBLIC_LANGUAGES;

  return (
    <header className="site-header campaign-header">
      <div className="campaign-header__inner">
        <Link className="brand" href="/" aria-label="US Polls home">
          <span className="brand__mark" aria-hidden="true">US</span>
          <span className="brand__copy">
            <strong>US Polls</strong>
            <em>{ui.brand}</em>
          </span>
        </Link>

        <nav aria-label={ui.nav} className="campaign-nav">
          {NAV.map((item) => (
            <Link
              aria-current={router.pathname === item.href ? "page" : undefined}
              className={`campaign-nav__link${router.pathname === item.href ? " is-active" : ""}`}
              href={item.href}
              key={item.href}
            >
              {item[language]}
            </Link>
          ))}
        </nav>

        <div className="campaign-header__tools">
          <div aria-label={ui.language} className="language-switch" role="group">
            {languages.map((code) => (
              <button
                aria-pressed={language === code}
                className={language === code ? "is-active" : ""}
                key={code}
                onClick={() => setLanguage(code)}
                type="button"
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
