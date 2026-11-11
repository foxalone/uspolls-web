import assert from "node:assert/strict";
import test from "node:test";
import type { PresidentialPoll } from "../../data/presidential2028";
import { PRESIDENTIAL_ELECTION_DATE } from "../../data/presidential2028";
import { compareAttention, parsePageviews, seriesEnding } from "./attention";
import {
  certificationDeadline,
  congressCountDay,
  electionDay,
  electoralCollegeDay,
  inaugurationDay,
  NEXT_PRESIDENTIAL_DAY,
  nextConstitutionalStep,
  nyWeekday,
  PRESIDENTIAL_DAY,
  presidentialTimeline,
} from "./dates";
import { parsePolymarketEvent, polymarketHidden } from "./market";
import { orderHomeNews } from "./newsOrder";
import { boundedPollCount, HUB_CHIPS, shapePresidentialPolls } from "./polls";
import type { PublicNewsCard } from "../news/types";

test("presidential dates follow the federal calendar", () => {
  assert.equal(electionDay(2020), "2020-11-03");
  assert.equal(electionDay(2024), "2024-11-05");
  assert.equal(electionDay(2028), "2028-11-07");
  assert.equal(PRESIDENTIAL_DAY, "2028-11-07");
  assert.equal(`${PRESIDENTIAL_DAY}T00:00:00-05:00`, PRESIDENTIAL_ELECTION_DATE);
  assert.equal(nyWeekday(NEXT_PRESIDENTIAL_DAY), "Tue");
  assert.equal(NEXT_PRESIDENTIAL_DAY, "2032-11-02");
  assert.equal(electoralCollegeDay(2024), "2024-12-17");
  assert.equal(electoralCollegeDay(2028), "2028-12-19");
  assert.equal(certificationDeadline(2028), "2028-12-13");
  assert.equal(congressCountDay(2028), "2029-01-06");
  assert.equal(inaugurationDay(2028), "2029-01-20");
});

test("the timeline marks today, leaves undated stages as a window, and moves on after Election Day", () => {
  const before = presidentialTimeline("2026-11-11");
  assert.equal(before[0]?.label, "today");
  assert.equal(before[0]?.today, true);
  assert.equal(before.find((node) => node.label === "primaries")?.when.kind, "window");
  assert.equal(before.find((node) => node.label === "election")?.election, true);
  assert.equal(nextConstitutionalStep("2026-11-11"), null);

  const electionDayNodes = presidentialTimeline("2028-11-07");
  assert.equal(electionDayNodes.some((node) => node.label === "today"), false);
  assert.equal(electionDayNodes.find((node) => node.label === "election")?.today, true);

  const after = presidentialTimeline("2028-12-20");
  assert.equal(after.find((node) => node.label === "electors")?.done, true);
  assert.equal(after.find((node) => node.label === "today")?.today, true);
  assert.equal(nextConstitutionalStep("2028-12-20"), "congress");
});

test("poll links stay inside the presidential race and cap the public count", () => {
  const polls: PresidentialPoll[] = [
    poll("alpha-poll", "Atlas", "2028-09-02"),
    poll("beta-poll", "Atlas", "2028-10-01"),
    poll("gamma-poll", "Beacon", "2028-08-15"),
  ];
  const shaped = shapePresidentialPolls(polls);
  assert.equal(shaped.latest?.pollster, "Atlas");
  assert.deepEqual(shaped.newest.map((item) => item.href), ["/polls/beta-poll", "/polls/alpha-poll", "/polls/gamma-poll"]);
  assert.deepEqual(shaped.pollsters.map((item) => item.href), ["/pollsters/atlas", "/pollsters/beacon"]);
  assert.equal(boundedPollCount(12), "12");
  assert.equal(boundedPollCount(1000), "1,000+");
  assert.equal(HUB_CHIPS.map((chip) => chip.href).join(" "), "/average /candidates /electoral-college /sources");
});

test("a polymarket payload becomes ranked bars and a date flag can hide it", () => {
  const parsed = parsePolymarketEvent([{
    updatedAt: "2026-11-11T15:00:00.000Z",
    markets: [
      { groupItemTitle: "Small", outcomePrices: "[\"0.02\", \"0.98\"]", active: true, closed: false },
      { groupItemTitle: "Leader", outcomePrices: "[\"0.2\", \"0.8\"]", active: true, closed: false },
      { groupItemTitle: "Closed", outcomePrices: "[\"0.9\", \"0.1\"]", active: true, closed: true },
    ],
  }]);
  assert.deepEqual(parsed.bars.map((bar) => bar.name), ["Leader", "Small"]);
  assert.equal(parsed.bars[0]?.percent, 20);
  assert.equal(polymarketHidden("2026-11-11", { POLYMARKET_HIDDEN_UNTIL: "2026-12-01" }), true);
  assert.equal(polymarketHidden("2026-12-01", { POLYMARKET_HIDDEN_UNTIL: "2026-12-01" }), false);
});

test("attention drops a quiet page and compares the two windows", () => {
  assert.equal(compareAttention([10, 10], [10, 10]), null);
  const change = compareAttention([800, 700], [500, 500]);
  assert.equal(change?.change, 50);
  assert.equal(change?.direction, "up");
  const days = parsePageviews({ items: [{ timestamp: "2026111000", views: 12 }] });
  assert.deepEqual(seriesEnding(days, "2026-11-11", 3), [0, 12, 0]);
});

test("a homepage video leads the same eight stories", () => {
  const items = [card("a", 30), card("b", 20, "https://cdn.example/video.mp4"), card("c", 10)];
  assert.deepEqual(orderHomeNews(items).map((item) => item.id), ["b", "a", "c"]);
});

function poll(id: string, pollster: string, endDate: string): PresidentialPoll {
  return {
    id,
    pollster,
    sourceUrl: "https://example.com/poll",
    startDate: endDate,
    endDate,
    sampleSize: 1000,
    population: "likely",
    scope: { en: "National", es: "Nacional", ru: "Страна" },
    question: { en: "President", es: "Presidencia", ru: "Президент" },
    results: [],
  };
}

function card(id: string, sortKey: number, video?: string): PublicNewsCard {
  return {
    id,
    url: `https://example.com/${id}`,
    source: "Reuters",
    publishedAt: "2026-11-08T15:00:00.000Z",
    headline: { en: id, es: id },
    teaser: { en: id, es: id },
    body: { en: "", es: "" },
    topic: "",
    image: null,
    video: video ? { url: video } : null,
    sortKey,
  };
}
