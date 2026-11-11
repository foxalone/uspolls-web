import Link from "next/link";
import { Seo } from "../../src/components/Seo";
import { RACE_ENTITIES } from "../../src/lib/home/entities";
import { useLanguage } from "../../src/lib/language";

const copy = {
  en: {
    title: "2028 presidential candidates and parties",
    description: "Parties and people in the public conversation about the 2028 presidential race. Not an official ballot.",
    eyebrow: "Candidates",
    h1: "2028 candidates and parties",
    lead: "These names draw public attention around the presidential race. A listing here is not an official ballot, a filing, or an endorsement.",
    kind: { party: "Party", republican: "Republican", democrat: "Democrat" },
  },
  es: {
    title: "Candidatos y partidos presidenciales 2028",
    description: "Partidos y personas en la conversación pública sobre la carrera presidencial de 2028. No es una papeleta oficial.",
    eyebrow: "Candidatos",
    h1: "Candidatos y partidos de 2028",
    lead: "Estos nombres concentran la atención pública sobre la carrera presidencial. Aparecer aquí no es una papeleta oficial, un registro ni un respaldo.",
    kind: { party: "Partido", republican: "Republicano", democrat: "Demócrata" },
  },
  ru: {
    title: "Кандидаты и партии президентской гонки 2028",
    description: "Партии и люди в публичном разговоре о президентской гонке 2028 года. Это не официальный бюллетень.",
    eyebrow: "Кандидаты",
    h1: "Кандидаты и партии 2028 года",
    lead: "Эти имена собирают общественное внимание вокруг президентской гонки. Запись здесь — не бюллетень, не регистрация и не поддержка.",
    kind: { party: "Партия", republican: "Республиканец", democrat: "Демократ" },
  },
} as const;

export default function CandidatesPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Seo title={t.title} description={t.description} path="/candidates" />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.lead}</p>
        </section>
        <ul className="hub-directory campaign-panel">
          {RACE_ENTITIES.map((entity) => (
            <li key={entity.slug}>
              <Link href={`/candidates/${entity.slug}`} prefetch={false}>{entity.name}</Link>
              <span> · {t.kind[entity.kind]}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
