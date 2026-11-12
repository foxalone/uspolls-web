import Link from "next/link";
import { Seo } from "../src/components/Seo";
import { PRESIDENTIAL_POLLS } from "../src/data/presidential2028";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    title: "2028 presidential poll average",
    description: "How VotePulse will average comparable national polls for the 2028 presidential race.",
    eyebrow: "Poll average",
    h1: "2028 presidential poll average",
    lead: "An average waits until the polls ask the same presidential question of the same kind of voter. Different candidates, states, and populations stay separate.",
    empty: "There are not enough comparable verified polls to publish an average.",
    list: "Verified polls",
  },
  es: {
    title: "Promedio de encuestas presidenciales 2028",
    description: "Cómo VotePulse promediará encuestas nacionales comparables de la carrera presidencial de 2028.",
    eyebrow: "Promedio",
    h1: "Promedio presidencial de 2028",
    lead: "El promedio espera a que las encuestas hagan la misma pregunta presidencial al mismo tipo de votante. Candidatos, estados y poblaciones distintos se quedan separados.",
    empty: "No hay suficientes encuestas verificadas y comparables para publicar un promedio.",
    list: "Encuestas verificadas",
  },
  ru: {
    title: "Среднее президентских опросов 2028",
    description: "Как VotePulse будет усреднять сопоставимые общенациональные опросы президентской гонки 2028 года.",
    eyebrow: "Среднее",
    h1: "Среднее опросов президентской гонки 2028",
    lead: "Среднее появится, когда опросы задают один и тот же президентский вопрос одной и той же группе избирателей. Разные кандидаты, штаты и совокупности не смешиваются.",
    empty: "Сопоставимых проверенных опросов ещё недостаточно для среднего.",
    list: "Проверенные опросы",
  },
} as const;

export default function AveragePage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <>
      <Seo title={t.title} description={t.description} path="/average" />
      <div className="campaign-stack">
        <section className="campaign-page-intro">
          <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.lead}</p>
        </section>
        <section className="campaign-panel">
          <p>{t.empty}</p>
          {PRESIDENTIAL_POLLS.length > 0 ? (
            <>
              <h2>{t.list}</h2>
              <ul className="hub-directory">
                {PRESIDENTIAL_POLLS.map((poll) => (
                  <li key={poll.id}><Link href={`/polls/${poll.id}`} prefetch={false}>{poll.pollster}</Link></li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>
    </>
  );
}
