import Link from "next/link";
import { useRouter } from "next/router";
import { CHROME, useLanguage, type Language } from "../lib/language";
import { SITE_NAME } from "../lib/site";
import { NAV } from "../lib/nav";
import { HoldMenu } from "./HoldMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";

const LANGUAGE_NAME: Record<Language, string> = {
  en: "English",
  es: "Español",
  ru: "Русский",
};

const PUBLIC_LANGUAGES: Language[] = ["en", "es"];

export function Header() {
  const router = useRouter();
  const { language, setLanguage, ruAllowed } = useLanguage();
  const ui = CHROME[language];
  const languages: Language[] = ruAllowed ? [...PUBLIC_LANGUAGES, "ru"] : PUBLIC_LANGUAGES;

  return (
    <header className="site-header campaign-header">
      <div className="campaign-header__inner">
        <Link className="brand" href="/" aria-label={ui.home}>
          <span className="brand__mark" aria-hidden="true">VP</span>
          <span className="brand__copy">
            <strong>{SITE_NAME}</strong>
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
          <div aria-label={ui.language} className="language-switch language-switch--full" role="group">
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
          <HoldMenu
            className="hold-menu--language"
            current={language}
            label={ui.language}
            onSelect={setLanguage}
            options={languages.map((code) => ({
              id: code,
              label: LANGUAGE_NAME[code],
              content: code.toUpperCase(),
            }))}
          />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
