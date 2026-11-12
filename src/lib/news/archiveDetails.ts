import type { NewsText } from "./types";

export type ArchiveDetail = {
  body: NewsText;
  original?: string;
  context?: { label: string; href: string };
};

// Editorial summaries for archived stories whose stored records only have a teaser.
export const archiveDetails: Partial<Record<string, ArchiveDetail>> = {
  d42c256d9d8717f7297df97e: {
    original: "https://www.politico.com/news/2026/11/11/hill-republicans-rubio-vance-2028-01160686",
    context: { label: "Associated Press", href: "https://apnews.com/article/9b4e34578509b9debde703d3069324e4" },
    body: {
      en: "After Republicans lost ground in the 2026 midterms, some GOP lawmakers began looking beyond Vice President JD Vance as they considered who might lead the party’s 2028 ticket. Politico reported that a growing group on Capitol Hill wants Secretary of State Marco Rubio to run.\n\nThe push is coming from lawmakers. The Associated Press reported that Rubio and his aides have denied speculation that he plans to leave the administration early to prepare a presidential campaign. The reports describe an effort to recruit him while the Republican field is still taking shape.",
      es: "Tras las pérdidas republicanas en las elecciones legislativas de 2026, algunos congresistas del partido empezaron a considerar alternativas al vicepresidente JD Vance para encabezar la candidatura de 2028. Según Politico, un grupo cada vez mayor en el Capitolio quiere que el secretario de Estado Marco Rubio se presente.\n\nLa iniciativa parte de los legisladores. Associated Press informó que Rubio y sus asesores han rechazado las especulaciones sobre una salida anticipada del Gobierno para preparar una campaña presidencial. El intento de convencerlo se produce mientras aún se perfila la contienda republicana.",
    },
  },
  "24965eb4f014cf7e0edcfeaf": {
    body: {
      en: "Former South Carolina governor Nikki Haley said she will sit out the 2028 presidential race. She told The Hill she plans to stay involved by advocating for policies and backing candidates she agrees with.\n\nHaley served as U.S. ambassador to the United Nations during Donald Trump’s first term and sought the Republican nomination in 2024. She suspended that campaign after Super Tuesday. Her latest comments rule out a repeat run in the next cycle.",
      es: "La exgobernadora de Carolina del Sur, Nikki Haley, dijo que no se presentará a las elecciones presidenciales de 2028. Según The Hill, seguirá participando en política, defendiendo propuestas y apoyando a candidatos con los que coincida.\n\nHaley fue embajadora de Estados Unidos ante las Naciones Unidas durante el primer mandato de Donald Trump y compitió por la nominación republicana en 2024. Suspendió su campaña después del supermartes. Sus declaraciones descartan que vuelva a competir en el próximo ciclo.",
    },
  },
  "0a63e03909e20607626869fc": {
    original: "https://www.washingtonpost.com/politics/2026/11/11/wes-moore-coy-about-2028-presidential-bid-writes-book-healing-nation/",
    context: { label: "Associated Press", href: "https://apnews.com/article/00ad2dccc4596463bb5e18af2199c8a8" },
    body: {
      en: "Maryland Gov. Wes Moore is preparing a book about how the country might address its divisions. Henry Holt plans to publish it in March 2027 under the title Repair: Healing a Divided Nation, The Washington Post and the Associated Press reported.\n\nThe announcement came shortly after Moore won reelection in Maryland. The Post covered it amid questions about his national ambitions, with the governor leaving his plans for the 2028 presidential race open.",
      es: "El gobernador de Maryland, Wes Moore, prepara un libro sobre cómo afrontar las divisiones del país. La editorial Henry Holt prevé publicarlo en marzo de 2027 con el título Repair: Healing a Divided Nation, según The Washington Post y Associated Press.\n\nEl anuncio se produjo poco después de que Moore ganara la reelección en Maryland. The Washington Post lo enmarcó en el debate sobre sus posibles aspiraciones nacionales, mientras el gobernador mantiene abierta la cuestión de sus planes para 2028.",
    },
  },
  f79f6b378974d8f602fbf0ee: {
    original: "https://www.elon.edu/u/news/2026/11/10/elon-university-poll-measures-n-c-attitudes-toward-impeachment-potential-2028-presidential-candidates/",
    body: {
      en: "Elon University asked North Carolina adults to name someone they would be pleased to support for president in 2028. In that open-ended question, 11.7% named JD Vance, 7.9% named Marco Rubio and 7.5% named Kamala Harris. Respondents could name anyone they wanted, including people who are ineligible to run.\n\nYouGov conducted the survey between September 29 and October 8. The final sample included 800 adults in North Carolina, with a margin of error of about four percentage points. The survey also asked separately about impeachment and impressions of individual politicians.",
      es: "La Universidad Elon pidió a adultos de Carolina del Norte que nombraran a alguien a quien les gustaría apoyar para la presidencia en 2028. En esa pregunta abierta, el 11,7 % mencionó a JD Vance, el 7,9 % a Marco Rubio y el 7,5 % a Kamala Harris. Los encuestados podían mencionar a cualquiera, incluidas personas que no pueden presentarse.\n\nYouGov realizó la encuesta entre el 29 de septiembre y el 8 de octubre. La muestra final incluyó a 800 adultos de Carolina del Norte, con un margen de error de unos cuatro puntos porcentuales. También hubo preguntas sobre la destitución de cargos públicos y la opinión sobre figuras políticas.",
    },
  },
  "24fbce1c0b29f9b1810b0773": {
    original: "https://www.texastribune.org/2026/11/11/texas-2028-presidential-election-blue-wave-electoral-votes/",
    body: {
      en: "Democrats won every statewide race in Texas in the 2026 midterms, including the contests for governor and U.S. Senate. The Texas Tribune reported that those wins have prompted politicians and strategists to reassess the state’s role in the 2028 presidential election.\n\nIllinois Gov. JB Pritzker told the Tribune that he expects both parties to invest in Texas. The paper contrasted that outlook with recent presidential campaigns, noting that Donald Trump made no general-election campaign visits to Texas in either 2020 or 2024.",
      es: "Los demócratas ganaron todas las contiendas estatales de Texas en las elecciones legislativas de 2026, incluidas las de gobernador y del Senado federal. The Texas Tribune informó que esas victorias han llevado a políticos y estrategas a reconsiderar el papel de Texas en las presidenciales de 2028.\n\nEl gobernador de Illinois, JB Pritzker, dijo al periódico que espera que ambos partidos inviertan recursos en Texas. El medio contrastó esa expectativa con las últimas campañas presidenciales: Donald Trump no hizo visitas de campaña de las elecciones generales a Texas ni en 2020 ni en 2024.",
    },
  },
  "486ce7773d33a3d330f5cc64": {
    context: { label: "Scripps News", href: "https://www.scrippsnews.com/politics/democrats-are-most-excited-to-support-three-candidates-for-2028" },
    body: {
      en: "A CNN/SSRS survey asked Americans how they felt about the next presidential election. Forty percent said they were looking forward to the 2028 contest, 27% said they were dreading it, and 33% expressed neither reaction.\n\nThe survey was conducted before the November 2026 midterms. The question measured how respondents felt about the upcoming election. The same survey separately asked Americans about potential candidates.",
      es: "Una encuesta de CNN y SSRS preguntó a los estadounidenses cómo se sentían ante las próximas elecciones presidenciales. El 40 % dijo que esperaba con interés la contienda de 2028, el 27 % manifestó inquietud y el 33 % no expresó ninguna de esas dos reacciones.\n\nLa encuesta se realizó antes de las elecciones legislativas de noviembre de 2026. Esa pregunta medía la actitud de los encuestados hacia las próximas elecciones. El sondeo también preguntó por separado sobre posibles candidatos.",
    },
  },
};
