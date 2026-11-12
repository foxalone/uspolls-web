import Link from "next/link";
import { useEffect, useState } from "react";
import { CandidatePair } from "../src/components/CandidatePair";
import { AllElectionTimeline } from "../src/components/AllElectionTimeline";
import allTimelineStyles from "../src/components/AllElectionTimeline.module.css";
import { Historical2024Board } from "../src/components/Historical2024Board";
import { Us2024ResultsSection } from "../src/components/Us2024Map";
import { Seo } from "../src/components/Seo";
import { useLanguage } from "../src/lib/language";

const copy = {
  en: {
    eyebrow: "Road to Election Day",
    title: "Timeline",
    description: "Presidential results from 1988, national polls from 2012, and the key stages of the 2028 election.",
    tabAll: "All",
    tab2012: "2012 · Romney / Obama",
    tab2016: "2016 · Trump / Clinton",
    tab2020: "2020 · Trump / Biden",
    tab2024: "2024 · Trump / Harris",
    tab2028: "2028",
    typical: "Typical window · dates to be confirmed",
    confirmed: "Confirmed date",
    pastTitle: "Previous timeline",
    mapTitle: "2024 results",
    mapText: "Each state is colored by who won it in 2024. Red is Trump, blue is Harris. The number is that state's electoral votes. Maine and Nebraska also split one vote by district.",
    trump: "Trump",
    romney: "Romney",
    biden: "Biden",
    clinton: "Clinton",
    obama: "Obama",
    harris: "Harris",
    mapTitle2012: "2012 results",
    mapText2012: "Each state is colored by who won it in 2012. Red is Romney, blue is Obama. The number is that state's electoral votes. Maine and Nebraska did not split a vote.",
    mapTitle2016: "2016 results",
    mapText2016: "Each state is colored by who won it in 2016. Red is Trump, blue is Clinton. The number is that state's electoral votes. Maine also split one vote by district.",
    mapTitle2020: "2020 results",
    mapText2020: "Each state is colored by who won it in 2020. Red is Trump, blue is Biden. The number is that state's electoral votes. Maine and Nebraska also split one vote by district.",
    mapBlankTitle: "2028 results",
    mapBlankText: "States stay uncolored until the 2028 results are in. The number is each state's electoral votes.",
    completed: "Completed",
    pastStages: [
      { when: "2023", title: "The field took shape", text: "Candidates announced campaigns and filed with the Federal Election Commission." },
      { when: "January–June 2024", title: "Primaries and caucuses", text: "States and parties chose delegates. Donald Trump and Joe Biden became the presumptive nominees." },
      { when: "July–August 2024", title: "National conventions", text: "Republicans nominated Trump in Milwaukee. After Biden left the race on July 21, Democrats nominated Kamala Harris in Chicago." },
      { when: "September–October 2024", title: "General-election campaign", text: "Trump and Harris campaigned nationally through Election Day." },
      { when: "November 5, 2024", title: "Election Day", text: "Voters cast ballots for president and vice president. Trump won." },
      { when: "December 17, 2024", title: "Electors voted", text: "Presidential electors met in their states and cast the electoral votes." },
      { when: "January 20, 2025", title: "Inauguration", text: "Donald Trump took office for a second term." },
    ],
    pastStages2020: [
      { when: "2019", title: "The field took shape", text: "Democratic candidates announced campaigns. Donald Trump ran for a second term." },
      { when: "January–June 2020", title: "Primaries and caucuses", text: "States and parties chose delegates. Joe Biden became the presumptive nominee after Bernie Sanders suspended his campaign on April 8." },
      { when: "July–August 2020", title: "National conventions", text: "Democrats nominated Joe Biden and Kamala Harris. Republicans nominated Donald Trump and Mike Pence." },
      { when: "September–October 2020", title: "General-election campaign", text: "Trump and Biden campaigned nationally through Election Day." },
      { when: "November 3, 2020", title: "Election Day", text: "Voters cast ballots for president and vice president. Biden won." },
      { when: "December 14, 2020", title: "Electors voted", text: "Presidential electors met in their states and cast the electoral votes." },
      { when: "January 20, 2021", title: "Inauguration", text: "Joe Biden took office." },
    ],
    pastStages2016: [
      { when: "2015", title: "The field took shape", text: "Candidates announced campaigns for the Democratic and Republican nominations." },
      { when: "January–June 2016", title: "Primaries and caucuses", text: "States and parties chose delegates. Donald Trump and Hillary Clinton became the presumptive nominees." },
      { when: "July 2016", title: "National conventions", text: "Republicans nominated Trump and Mike Pence in Cleveland. Democrats nominated Hillary Clinton and Tim Kaine in Philadelphia." },
      { when: "September–October 2016", title: "General-election campaign", text: "Trump and Clinton campaigned nationally through Election Day." },
      { when: "November 8, 2016", title: "Election Day", text: "Voters cast ballots for president and vice president. Trump won the electoral college. Clinton won the popular vote." },
      { when: "December 19, 2016", title: "Electors voted", text: "Presidential electors met in their states and cast the electoral votes." },
      { when: "January 20, 2017", title: "Inauguration", text: "Donald Trump took office." },
    ],
    pastStages2012: [
      { when: "2011", title: "The field took shape", text: "Republican candidates announced campaigns. Barack Obama ran for a second term." },
      { when: "January–June 2012", title: "Primaries and caucuses", text: "States and parties chose delegates. Mitt Romney became the presumptive nominee after Rick Santorum suspended his campaign on April 10." },
      { when: "August–September 2012", title: "National conventions", text: "Republicans nominated Mitt Romney and Paul Ryan in Tampa. Democrats nominated Barack Obama and Joe Biden in Charlotte." },
      { when: "September–October 2012", title: "General-election campaign", text: "Romney and Obama campaigned nationally through Election Day." },
      { when: "November 6, 2012", title: "Election Day", text: "Voters cast ballots for president and vice president. Obama won the electoral college and the popular vote." },
      { when: "December 17, 2012", title: "Electors voted", text: "Presidential electors met in their states and cast the electoral votes." },
      { when: "January 21, 2013", title: "Inauguration", text: "Barack Obama took office for a second term. January 20 fell on a Sunday, so the public ceremony was the next day." },
    ],
    stages: [
      { when: "2027", title: "The field takes shape", text: "Candidates usually announce campaigns and begin formal filings. The Federal Election Commission publishes candidate and committee records.", fixed: false },
      { when: "January–June 2028", title: "Primaries and caucuses", text: "States and parties choose delegates through primaries and caucuses. Each state sets its own schedule and rules.", fixed: false },
      { when: "July–early September 2028", title: "National conventions", text: "Parties formally nominate their presidential and vice-presidential tickets.", fixed: false },
      { when: "September–October 2028", title: "General-election campaign", text: "The nominees campaign nationally and may take part in debates. Debate dates are not yet fixed.", fixed: false },
      { when: "November 7, 2028", title: "Election Day", text: "Voters cast ballots for president and vice president. Congress is also on the ballot, but this site currently follows the presidential race.", fixed: true },
      { when: "December 2028", title: "Electors vote", text: "Presidential electors meet after the state results are certified. The exact 2028 meeting date will be added when official.", fixed: false },
      { when: "January 20, 2029", title: "Inauguration", text: "The next president and vice president are scheduled to take office.", fixed: true },
    ],
    sourceTitle: "Official references",
    sourceText: "The windows above follow USA.gov's description of a typical presidential cycle. We will replace them with state and party dates when published.",
    process: "Presidential election process ↗",
    primaries: "How primaries work ↗",
    inauguration: "Inauguration date ↗",
    polls: "Go to polls →",
  },
  es: {
    eyebrow: "Rumbo al día de las elecciones",
    title: "Línea de tiempo",
    description: "Resultados presidenciales desde 1988, encuestas nacionales desde 2012 y etapas clave de la elección de 2028.",
    tabAll: "Todas",
    tab2012: "2012 · Romney / Obama",
    tab2016: "2016 · Trump / Clinton",
    tab2020: "2020 · Trump / Biden",
    tab2024: "2024 · Trump / Harris",
    tab2028: "2028",
    typical: "Período habitual · fechas por confirmar",
    confirmed: "Fecha confirmada",
    pastTitle: "Línea anterior",
    mapTitle: "Resultados de 2024",
    mapText: "Cada estado tiene el color de quien lo ganó en 2024. Rojo es Trump, azul es Harris. El número son sus votos electorales. Maine y Nebraska además repartieron un voto por distrito.",
    trump: "Trump",
    romney: "Romney",
    biden: "Biden",
    clinton: "Clinton",
    obama: "Obama",
    harris: "Harris",
    mapTitle2012: "Resultados de 2012",
    mapText2012: "Cada estado tiene el color de quien lo ganó en 2012. Rojo es Romney, azul es Obama. El número son sus votos electorales. Maine y Nebraska no repartieron votos.",
    mapTitle2016: "Resultados de 2016",
    mapText2016: "Cada estado tiene el color de quien lo ganó en 2016. Rojo es Trump, azul es Clinton. El número son sus votos electorales. Maine además repartió un voto por distrito.",
    mapTitle2020: "Resultados de 2020",
    mapText2020: "Cada estado tiene el color de quien lo ganó en 2020. Rojo es Trump, azul es Biden. El número son sus votos electorales. Maine y Nebraska además repartieron un voto por distrito.",
    mapBlankTitle: "Resultados de 2028",
    mapBlankText: "Los estados quedan sin color hasta que lleguen los resultados de 2028. El número son los votos electorales de cada estado.",
    completed: "Completado",
    pastStages: [
      { when: "2023", title: "Se perfiló el campo", text: "Los aspirantes anunciaron sus campañas y se registraron ante la Comisión Federal Electoral." },
      { when: "Enero–junio de 2024", title: "Primarias y asambleas", text: "Los estados y partidos eligieron delegados. Donald Trump y Joe Biden quedaron como nominados presuntos." },
      { when: "Julio–agosto de 2024", title: "Convenciones nacionales", text: "Los republicanos nominaron a Trump en Milwaukee. Tras la retirada de Biden el 21 de julio, los demócratas nominaron a Kamala Harris en Chicago." },
      { when: "Septiembre–octubre de 2024", title: "Campaña general", text: "Trump y Harris hicieron campaña a nivel nacional hasta el día de las elecciones." },
      { when: "5 de noviembre de 2024", title: "Día de las elecciones", text: "Los votantes eligieron presidente y vicepresidente. Ganó Trump." },
      { when: "17 de diciembre de 2024", title: "Votación de los electores", text: "Los electores presidenciales se reunieron en sus estados y emitieron los votos electorales." },
      { when: "20 de enero de 2025", title: "Investidura", text: "Donald Trump asumió un segundo mandato." },
    ],
    pastStages2020: [
      { when: "2019", title: "Se perfiló el campo", text: "Los aspirantes demócratas anunciaron sus campañas. Donald Trump buscó un segundo mandato." },
      { when: "Enero–junio de 2020", title: "Primarias y asambleas", text: "Los estados y partidos eligieron delegados. Joe Biden quedó como nominado presunto después de que Bernie Sanders suspendiera su campaña el 8 de abril." },
      { when: "Julio–agosto de 2020", title: "Convenciones nacionales", text: "Los demócratas nominaron a Joe Biden y Kamala Harris. Los republicanos nominaron a Donald Trump y Mike Pence." },
      { when: "Septiembre–octubre de 2020", title: "Campaña general", text: "Trump y Biden hicieron campaña a nivel nacional hasta el día de las elecciones." },
      { when: "3 de noviembre de 2020", title: "Día de las elecciones", text: "Los votantes eligieron presidente y vicepresidente. Ganó Biden." },
      { when: "14 de diciembre de 2020", title: "Votación de los electores", text: "Los electores presidenciales se reunieron en sus estados y emitieron los votos electorales." },
      { when: "20 de enero de 2021", title: "Investidura", text: "Joe Biden asumió el cargo." },
    ],
    pastStages2016: [
      { when: "2015", title: "Se perfiló el campo", text: "Los aspirantes anunciaron sus campañas para las nominaciones demócrata y republicana." },
      { when: "Enero–junio de 2016", title: "Primarias y asambleas", text: "Los estados y partidos eligieron delegados. Donald Trump y Hillary Clinton quedaron como nominados presuntos." },
      { when: "Julio de 2016", title: "Convenciones nacionales", text: "Los republicanos nominaron a Trump y Mike Pence en Cleveland. Los demócratas nominaron a Hillary Clinton y Tim Kaine en Filadelfia." },
      { when: "Septiembre–octubre de 2016", title: "Campaña general", text: "Trump y Clinton hicieron campaña a nivel nacional hasta el día de las elecciones." },
      { when: "8 de noviembre de 2016", title: "Día de las elecciones", text: "Los votantes eligieron presidente y vicepresidente. Trump ganó el colegio electoral. Clinton ganó el voto popular." },
      { when: "19 de diciembre de 2016", title: "Votación de los electores", text: "Los electores presidenciales se reunieron en sus estados y emitieron los votos electorales." },
      { when: "20 de enero de 2017", title: "Investidura", text: "Donald Trump asumió el cargo." },
    ],
    pastStages2012: [
      { when: "2011", title: "Se perfiló el campo", text: "Los aspirantes republicanos anunciaron sus campañas. Barack Obama buscó un segundo mandato." },
      { when: "Enero–junio de 2012", title: "Primarias y asambleas", text: "Los estados y partidos eligieron delegados. Mitt Romney quedó como nominado presunto después de que Rick Santorum suspendiera su campaña el 10 de abril." },
      { when: "Agosto–septiembre de 2012", title: "Convenciones nacionales", text: "Los republicanos nominaron a Mitt Romney y Paul Ryan en Tampa. Los demócratas nominaron a Barack Obama y Joe Biden en Charlotte." },
      { when: "Septiembre–octubre de 2012", title: "Campaña general", text: "Romney y Obama hicieron campaña a nivel nacional hasta el día de las elecciones." },
      { when: "6 de noviembre de 2012", title: "Día de las elecciones", text: "Los votantes eligieron presidente y vicepresidente. Obama ganó el colegio electoral y el voto popular." },
      { when: "17 de diciembre de 2012", title: "Votación de los electores", text: "Los electores presidenciales se reunieron en sus estados y emitieron los votos electorales." },
      { when: "21 de enero de 2013", title: "Investidura", text: "Barack Obama asumió un segundo mandato. El 20 de enero cayó en domingo, así que la ceremonia pública fue al día siguiente." },
    ],
    stages: [
      { when: "2027", title: "Se perfila el campo", text: "Los aspirantes suelen anunciar sus campañas y presentar documentos. La Comisión Federal Electoral publica los registros de candidatos y comités.", fixed: false },
      { when: "Enero–junio de 2028", title: "Primarias y asambleas", text: "Los estados y partidos eligen delegados mediante primarias y asambleas. Cada estado define su calendario y sus reglas.", fixed: false },
      { when: "Julio–principios de septiembre de 2028", title: "Convenciones nacionales", text: "Los partidos nominan formalmente sus fórmulas para presidente y vicepresidente.", fixed: false },
      { when: "Septiembre–octubre de 2028", title: "Campaña general", text: "Los nominados hacen campaña y pueden participar en debates. Sus fechas todavía no están fijadas.", fixed: false },
      { when: "7 de noviembre de 2028", title: "Día de las elecciones", text: "Los votantes eligen presidente y vicepresidente. También se vota por el Congreso, pero este sitio sigue por ahora la carrera presidencial.", fixed: true },
      { when: "Diciembre de 2028", title: "Votación de los electores", text: "Los electores presidenciales se reúnen después de la certificación de los resultados estatales. Añadiremos la fecha exacta cuando sea oficial.", fixed: false },
      { when: "20 de enero de 2029", title: "Investidura", text: "Está previsto que el próximo presidente y vicepresidente asuman sus cargos.", fixed: true },
    ],
    sourceTitle: "Referencias oficiales",
    sourceText: "Los períodos siguen la descripción de USA.gov de un ciclo presidencial habitual. Los sustituiremos por fechas estatales y partidarias cuando se publiquen.",
    process: "Proceso de elección presidencial ↗",
    primaries: "Cómo funcionan las primarias ↗",
    inauguration: "Fecha de investidura ↗",
    polls: "Ir a encuestas →",
  },
  ru: {
    eyebrow: "Путь ко дню выборов",
    title: "Таймлайн",
    description: "Итоги президентских выборов с 1988 года, общенациональные опросы с 2012-го и ключевые этапы выборов 2028 года.",
    tabAll: "Все",
    tab2012: "2012 · Ромни / Обама",
    tab2016: "2016 · Трамп / Клинтон",
    tab2020: "2020 · Трамп / Байден",
    tab2024: "2024 · Трамп / Харрис",
    tab2028: "2028",
    typical: "Обычный период · даты ещё подтвердят",
    confirmed: "Подтверждённая дата",
    pastTitle: "Прошлый таймлайн",
    mapTitle: "Итоги 2024",
    mapText: "Штат окрашен по тому, кто победил в нём в 2024 году. Красный — Трамп, синий — Харрис. Число — голоса выборщиков этого штата. Мэн и Небраска ещё отдали по одному голосу по округу.",
    trump: "Трамп",
    romney: "Ромни",
    biden: "Байден",
    clinton: "Клинтон",
    obama: "Обама",
    harris: "Харрис",
    mapTitle2012: "Итоги 2012",
    mapText2012: "Штат окрашен по тому, кто победил в нём в 2012 году. Красный — Ромни, синий — Обама. Число — голоса выборщиков этого штата. Мэн и Небраска голоса не делили.",
    mapTitle2016: "Итоги 2016",
    mapText2016: "Штат окрашен по тому, кто победил в нём в 2016 году. Красный — Трамп, синий — Клинтон. Число — голоса выборщиков этого штата. Мэн ещё отдал один голос по округу.",
    mapTitle2020: "Итоги 2020",
    mapText2020: "Штат окрашен по тому, кто победил в нём в 2020 году. Красный — Трамп, синий — Байден. Число — голоса выборщиков этого штата. Мэн и Небраска ещё отдали по одному голосу по округу.",
    mapBlankTitle: "Итоги 2028",
    mapBlankText: "Штаты без цвета, пока не появятся итоги 2028 года. Число — голоса выборщиков штата.",
    completed: "Завершено",
    pastStages: [
      { when: "2023", title: "Поле кандидатов сложилось", text: "Кандидаты объявили кампании и подали документы в Федеральную избирательную комиссию." },
      { when: "Январь–июнь 2024", title: "Праймериз и кокусы", text: "Штаты и партии выбрали делегатов. Дональд Трамп и Джо Байден стали предполагаемыми номинантами." },
      { when: "Июль–август 2024", title: "Национальные съезды", text: "Республиканцы выдвинули Трампа в Милуоки. После выхода Байдена 21 июля демократы выдвинули Камалу Харрис в Чикаго." },
      { when: "Сентябрь–октябрь 2024", title: "Кампания всеобщих выборов", text: "Трамп и Харрис вели общенациональную кампанию до дня выборов." },
      { when: "5 ноября 2024", title: "День выборов", text: "Избиратели голосовали за президента и вице-президента. Победил Трамп." },
      { when: "17 декабря 2024", title: "Голосование выборщиков", text: "Президентские выборщики собрались в своих штатах и отдали голоса." },
      { when: "20 января 2025", title: "Инаугурация", text: "Дональд Трамп вступил в должность на второй срок." },
    ],
    pastStages2020: [
      { when: "2019", title: "Поле кандидатов сложилось", text: "Кандидаты от демократов объявили кампании. Дональд Трамп шёл на второй срок." },
      { when: "Январь–июнь 2020", title: "Праймериз и кокусы", text: "Штаты и партии выбрали делегатов. Джо Байден стал предполагаемым номинантом после того, как Берни Сандерс свернул кампанию 8 апреля." },
      { when: "Июль–август 2020", title: "Национальные съезды", text: "Демократы выдвинули Джо Байдена и Камалу Харрис. Республиканцы выдвинули Дональда Трампа и Майка Пенса." },
      { when: "Сентябрь–октябрь 2020", title: "Кампания всеобщих выборов", text: "Трамп и Байден вели общенациональную кампанию до дня выборов." },
      { when: "3 ноября 2020", title: "День выборов", text: "Избиратели голосовали за президента и вице-президента. Победил Байден." },
      { when: "14 декабря 2020", title: "Голосование выборщиков", text: "Президентские выборщики собрались в своих штатах и отдали голоса." },
      { when: "20 января 2021", title: "Инаугурация", text: "Джо Байден вступил в должность." },
    ],
    pastStages2016: [
      { when: "2015", title: "Поле кандидатов сложилось", text: "Кандидаты объявили кампании за выдвижение от демократов и республиканцев." },
      { when: "Январь–июнь 2016", title: "Праймериз и кокусы", text: "Штаты и партии выбрали делегатов. Дональд Трамп и Хиллари Клинтон стали предполагаемыми номинантами." },
      { when: "Июль 2016", title: "Национальные съезды", text: "Республиканцы выдвинули Трампа и Майка Пенса в Кливленде. Демократы выдвинули Хиллари Клинтон и Тима Кейна в Филадельфии." },
      { when: "Сентябрь–октябрь 2016", title: "Кампания всеобщих выборов", text: "Трамп и Клинтон вели общенациональную кампанию до дня выборов." },
      { when: "8 ноября 2016", title: "День выборов", text: "Избиратели голосовали за президента и вице-президента. Трамп победил в коллегии выборщиков. Клинтон победила по голосам избирателей." },
      { when: "19 декабря 2016", title: "Голосование выборщиков", text: "Президентские выборщики собрались в своих штатах и отдали голоса." },
      { when: "20 января 2017", title: "Инаугурация", text: "Дональд Трамп вступил в должность." },
    ],
    pastStages2012: [
      { when: "2011", title: "Поле кандидатов сложилось", text: "Кандидаты от республиканцев объявили кампании. Барак Обама шёл на второй срок." },
      { when: "Январь–июнь 2012", title: "Праймериз и кокусы", text: "Штаты и партии выбрали делегатов. Митт Ромни стал предполагаемым номинантом после того, как Рик Санторум свернул кампанию 10 апреля." },
      { when: "Август–сентябрь 2012", title: "Национальные съезды", text: "Республиканцы выдвинули Митта Ромни и Пола Райана в Тампе. Демократы выдвинули Барака Обаму и Джо Байдена в Шарлотте." },
      { when: "Сентябрь–октябрь 2012", title: "Кампания всеобщих выборов", text: "Ромни и Обама вели общенациональную кампанию до дня выборов." },
      { when: "6 ноября 2012", title: "День выборов", text: "Избиратели голосовали за президента и вице-президента. Обама победил в коллегии выборщиков и по голосам избирателей." },
      { when: "17 декабря 2012", title: "Голосование выборщиков", text: "Президентские выборщики собрались в своих штатах и отдали голоса." },
      { when: "21 января 2013", title: "Инаугурация", text: "Барак Обама вступил в должность на второй срок. 20 января выпало на воскресенье, поэтому публичная церемония прошла на следующий день." },
    ],
    stages: [
      { when: "2027", title: "Поле кандидатов складывается", text: "Кандидаты обычно объявляют кампании и подают документы. Федеральная избирательная комиссия публикует записи о кандидатах и комитетах.", fixed: false },
      { when: "Январь–июнь 2028", title: "Праймериз и кокусы", text: "Штаты и партии выбирают делегатов на праймериз и кокусах. Каждый штат сам задаёт календарь и правила.", fixed: false },
      { when: "Июль — начало сентября 2028", title: "Национальные съезды", text: "Партии официально выдвигают пары кандидатов в президенты и вице-президенты.", fixed: false },
      { when: "Сентябрь–октябрь 2028", title: "Кампания всеобщих выборов", text: "Номинанты ведут общенациональную кампанию и могут участвовать в дебатах. Даты дебатов ещё не назначены.", fixed: false },
      { when: "7 ноября 2028", title: "День выборов", text: "Избиратели голосуют за президента и вице-президента. В тот же день выбирают Конгресс, но этот сайт пока следит за президентской гонкой.", fixed: true },
      { when: "Декабрь 2028", title: "Голосование выборщиков", text: "Президентские выборщики собираются после того, как штаты утвердят результаты. Точную дату 2028 года добавим, когда она станет официальной.", fixed: false },
      { when: "20 января 2029", title: "Инаугурация", text: "Следующие президент и вице-президент должны вступить в должность.", fixed: true },
    ],
    sourceTitle: "Официальные источники",
    sourceText: "Периоды выше следуют описанию обычного президентского цикла на USA.gov. Мы заменим их датами штатов и партий, когда те будут опубликованы.",
    process: "Как проходят президентские выборы ↗",
    primaries: "Как устроены праймериз ↗",
    inauguration: "Дата инаугурации ↗",
    polls: "К опросам →",
  },
} as const;

type TimelineTab = "all" | "2012" | "2016" | "2020" | "2024" | "2028";

export default function CalendarPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [tab, setTab] = useState<TimelineTab>("2028");
  useEffect(() => {
    const node = document.getElementById(`timeline-tab-${tab}`);
    const list = node?.parentElement;
    if (!node || !list?.classList.contains("poll-tabs__rest")) return;
    const view = list.clientWidth;
    let scroll = Math.max(0, node.offsetLeft + node.offsetWidth - view);
    for (const button of list.querySelectorAll("button")) {
      const start = button.offsetLeft;
      const end = start + button.offsetWidth;
      if (start < scroll && end > scroll) {
        scroll = end;
        break;
      }
    }
    if (node.offsetLeft < scroll) scroll = node.offsetLeft;
    list.scrollLeft = scroll;
  }, [tab, language]);
  return (
    <>
      <Seo title={t.title} description={t.description} path="/calendar" />
      <div className="campaign-stack">
        <section className={`campaign-page-intro timeline-intro${tab === "all" ? ` ${allTimelineStyles.allIntro}` : ""}`}>
          <div className="timeline-intro__copy">
            <p className="campaign-kicker"><span className="campaign-kicker__dot" />{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <div className="poll-tabs" role="tablist" aria-label={t.title}>
              <button type="button" role="tab" id="timeline-tab-all" aria-selected={tab === "all"} aria-controls="timeline-panel-all" className={tab === "all" ? "is-active" : undefined} onClick={() => setTab("all")}>{t.tabAll}</button>
              <div className="poll-tabs__rest">
                <button type="button" role="tab" id="timeline-tab-2012" aria-selected={tab === "2012"} aria-controls="timeline-panel-2012" className={tab === "2012" ? "is-active" : undefined} onClick={() => setTab("2012")}>{t.tab2012}</button>
                <button type="button" role="tab" id="timeline-tab-2016" aria-selected={tab === "2016"} aria-controls="timeline-panel-2016" className={tab === "2016" ? "is-active" : undefined} onClick={() => setTab("2016")}>{t.tab2016}</button>
                <button type="button" role="tab" id="timeline-tab-2020" aria-selected={tab === "2020"} aria-controls="timeline-panel-2020" className={tab === "2020" ? "is-active" : undefined} onClick={() => setTab("2020")}>{t.tab2020}</button>
                <button type="button" role="tab" id="timeline-tab-2024" aria-selected={tab === "2024"} aria-controls="timeline-panel-2024" className={tab === "2024" ? "is-active" : undefined} onClick={() => setTab("2024")}>{t.tab2024}</button>
                <button type="button" role="tab" id="timeline-tab-2028" aria-selected={tab === "2028"} aria-controls="timeline-panel-2028" className={tab === "2028" ? "is-active" : undefined} onClick={() => setTab("2028")}>{t.tab2028}</button>
              </div>
            </div>
          </div>
          {tab === "all" ? null : <CandidatePair
            cycle={tab}
            names={{ obama: t.obama, romney: t.romney, trump: t.trump, biden: t.biden, clinton: t.clinton, harris: t.harris }}
            openLabel={language === "ru" ? "Кандидаты ещё не определены" : language === "es" ? "Los candidatos aún no están definidos" : "Nominees are not set yet"}
          />}
        </section>
        {tab === "all" ? (
          <div role="tabpanel" id="timeline-panel-all" aria-labelledby="timeline-tab-all" className={allTimelineStyles.frame}>
            <AllElectionTimeline />
          </div>
        ) : tab === "2012" ? (
          <div role="tabpanel" id="timeline-panel-2012" aria-labelledby="timeline-tab-2012" className="campaign-stack">
            <Historical2024Board key="timeline-2012" variant="timeline" cycle="2012" />
            <Us2024ResultsSection title={t.mapTitle2012} text={t.mapText2012} trump={t.romney} harris={t.obama} cycle="2012" />
            <section className="timeline-list" aria-label={t.pastTitle}>
              <h2 className="timeline-past-title">{t.pastTitle}</h2>
              {t.pastStages2012.map((stage) => (
                <article className="timeline-stage is-done" key={stage.when}>
                  <div className="timeline-stage__rail"><span aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.2 8.4 6.3 11.5 12.8 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
                  <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{t.completed}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
                </article>
              ))}
            </section>
          </div>
        ) : tab === "2016" ? (
          <div role="tabpanel" id="timeline-panel-2016" aria-labelledby="timeline-tab-2016" className="campaign-stack">
            <Historical2024Board key="timeline-2016" variant="timeline" cycle="2016" />
            <Us2024ResultsSection title={t.mapTitle2016} text={t.mapText2016} trump={t.trump} harris={t.clinton} cycle="2016" />
            <section className="timeline-list" aria-label={t.pastTitle}>
              <h2 className="timeline-past-title">{t.pastTitle}</h2>
              {t.pastStages2016.map((stage) => (
                <article className="timeline-stage is-done" key={stage.when}>
                  <div className="timeline-stage__rail"><span aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.2 8.4 6.3 11.5 12.8 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
                  <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{t.completed}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
                </article>
              ))}
            </section>
          </div>
        ) : tab === "2020" ? (
          <div role="tabpanel" id="timeline-panel-2020" aria-labelledby="timeline-tab-2020" className="campaign-stack">
            <Historical2024Board key="timeline-2020" variant="timeline" cycle="2020" />
            <Us2024ResultsSection title={t.mapTitle2020} text={t.mapText2020} trump={t.trump} harris={t.biden} cycle="2020" />
            <section className="timeline-list" aria-label={t.pastTitle}>
              <h2 className="timeline-past-title">{t.pastTitle}</h2>
              {t.pastStages2020.map((stage) => (
                <article className="timeline-stage is-done" key={stage.when}>
                  <div className="timeline-stage__rail"><span aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.2 8.4 6.3 11.5 12.8 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
                  <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{t.completed}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
                </article>
              ))}
            </section>
          </div>
        ) : tab === "2024" ? (
          <div role="tabpanel" id="timeline-panel-2024" aria-labelledby="timeline-tab-2024" className="campaign-stack">
            <Historical2024Board key="timeline-2024" variant="timeline" />
            <Us2024ResultsSection title={t.mapTitle} text={t.mapText} trump={t.trump} harris={t.harris} />
            <section className="timeline-list" aria-label={t.pastTitle}>
              <h2 className="timeline-past-title">{t.pastTitle}</h2>
              {t.pastStages.map((stage) => (
                <article className="timeline-stage is-done" key={stage.when}>
                  <div className="timeline-stage__rail"><span aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.2 8.4 6.3 11.5 12.8 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
                  <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{t.completed}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
                </article>
              ))}
            </section>
          </div>
        ) : (
          <div role="tabpanel" id="timeline-panel-2028" aria-labelledby="timeline-tab-2028" className="campaign-stack">
            <Us2024ResultsSection title={t.mapBlankTitle} text={t.mapBlankText} colored={false} />
            <section className="timeline-list" aria-label={t.title}>
              {t.stages.map((stage, index) => (
                <article className={`timeline-stage${stage.fixed ? " is-confirmed" : ""}`} key={index}>
                  <div className="timeline-stage__rail"><span>{String(index + 1).padStart(2, "0")}</span></div>
                  <div className="timeline-stage__body"><div className="timeline-stage__meta"><span>{stage.when}</span><small>{stage.fixed ? t.confirmed : t.typical}</small></div><h2>{stage.title}</h2><p>{stage.text}</p></div>
                </article>
              ))}
            </section>
            <section className="campaign-panel timeline-sources"><div><p className="campaign-section-label">USA.gov / 2028</p><h2>{t.sourceTitle}</h2><p>{t.sourceText}</p></div><div><a href="https://www.usa.gov/presidential-election-process" rel="noreferrer" target="_blank">{t.process}</a><a href="https://www.usa.gov/primaries-caucuses" rel="noreferrer" target="_blank">{t.primaries}</a><a href="https://www.usa.gov/inauguration" rel="noreferrer" target="_blank">{t.inauguration}</a><Link href="/polls">{t.polls}</Link></div></section>
          </div>
        )}
      </div>
    </>
  );
}

