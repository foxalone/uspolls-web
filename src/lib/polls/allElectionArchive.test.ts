import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allElectionEntryCount, listAllElectionPage } from "./allElectionArchive";

function label(entry: ReturnType<typeof listAllElectionPage>["entries"][number]) {
  if (entry.kind === "result") return `result:${entry.result.year}`;
  if (entry.kind === "news") return "news";
  return `poll:${entry.cycle}:${entry.recordedOn}`;
}

describe("all election archive", () => {
  it("keeps 1988–2008 as results only, then starts the 2012 polls", () => {
    const page = listAllElectionPage(8);
    assert.deepEqual(page.entries.map(label), [
      "result:1988",
      "result:1992",
      "result:1996",
      "result:2000",
      "result:2004",
      "result:2008",
      "poll:2012:2012-09-06",
      "poll:2012:2012-09-07",
    ]);
  });

  it("ends on the 2024 result and places the dropout news before later polls", () => {
    const total = allElectionEntryCount();
    let offset: number | null = total;
    let newsFollows = false;
    let sawNews = false;
    while (offset !== null) {
      const page = listAllElectionPage(offset);
      if (offset === total) {
        const end = page.entries.at(-1);
        assert.equal(end?.kind, "result");
        if (end?.kind === "result") assert.equal(end.result.year, 2024);
      }
      const newsAt = page.entries.findIndex((entry) => entry.kind === "news");
      if (newsAt >= 0) {
        sawNews = true;
        const next = page.entries[newsAt + 1];
        newsFollows = Boolean(next && next.recordedOn >= "2024-07-21");
      }
      offset = page.nextOffset;
    }
    assert.equal(sawNews, true);
    assert.equal(newsFollows, true);
  });

  it("filters the whole archive by final results or one pollster", () => {
    const results = listAllElectionPage(undefined, "result");
    assert.ok(results);
    assert.deepEqual(results.entries.map(label), ["result:1988", "result:1992", "result:1996", "result:2000", "result:2004", "result:2008", "result:2012", "result:2016", "result:2020", "result:2024"]);
    const youGov = listAllElectionPage(undefined, "YouGov");
    assert.ok(youGov);
    assert.ok(youGov.entries.length > 0);
    assert.ok(youGov.entries.every((entry) => entry.kind === "poll" && entry.poll.pollster === "YouGov"));
    assert.equal(listAllElectionPage(undefined, "Not a pollster"), null);
    assert.ok(youGov.pollsterCounts.some((item) => item.pollster === "YouGov" && item.count === youGov.total));
  });
});
