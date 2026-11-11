import { HomeElectionMap } from "../src/components/HomeElectionMap";
import { Seo } from "../src/components/Seo";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    title: "Electoral College",
    description: "The path to 270 electoral votes in the presidential race, with the latest complete state results.",
    eyebrow: "270 to win",
    h1: "Electoral College",
    lead: "A candidate needs at least 270 of 538 electoral votes. The map shows the latest complete state results, not a forecast of 2028.",
  },
  es: {
    title: "Colegio Electoral",
    description: "El camino a 270 votos electorales en la carrera presidencial, con los últimos resultados estatales completos.",
    eyebrow: "270 para ganar",
    h1: "Colegio Electoral",
    lead: "Hacen falta al menos 270 de 538 votos electorales. El mapa muestra los últimos resultados estatales completos, no un pronóstico de 2028.",
  },
  ru: {
    title: "Коллегия выборщиков",
    description: "Путь к 270 голосам выборщиков в президентской гонке и последние полные итоги по штатам.",
    eyebrow: "270 для победы",
    h1: "Коллегия выборщиков",
    lead: "Чтобы победить, нужно не меньше 270 из 538 голосов выборщиков. Карта показывает последние полные итоги по штатам, а не прогноз на 2028 год.",
  },
} as const;

export default function ElectoralCollegePage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Seo title={t.title} description={t.description} path="/electoral-college" />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.lead}</p>
        </section>
        <HomeElectionMap />
      </div>
    </>
  );
}
