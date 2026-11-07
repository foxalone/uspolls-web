import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "../lib/language";
import { NAV } from "../lib/nav";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="site-header campaign-header">
      <div className="campaign-header__inner">
        <Link className="brand" href="/" aria-label="US Polls home">
          <span className="brand__mark" aria-hidden="true">US</span>
          <span className="brand__copy">
            <strong>US Polls</strong>
            <em>{language === "en" ? "Presidential race · 2028" : "Carrera presidencial · 2028"}</em>
          </span>
        </Link>

        <nav aria-label={language === "en" ? "Main navigation" : "Navegación principal"} className="campaign-nav">
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
          <div aria-label={language === "en" ? "Language" : "Idioma"} className="language-switch" role="group">
            <button aria-pressed={language === "en"} className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} type="button">EN</button>
            <button aria-pressed={language === "es"} className={language === "es" ? "is-active" : ""} onClick={() => setLanguage("es")} type="button">ES</button>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
