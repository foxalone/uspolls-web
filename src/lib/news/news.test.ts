import assert from "node:assert/strict";
import test from "node:test";
import { acceptDecisions, parseDecisions, prepareBatch } from "./decide";
import { parseRss } from "./rss";
import { titleKey } from "./text";
import type { RawNewsItem } from "./types";

const RSS = `<?xml version="1.0"?>
<rss><channel>
<item>
  <title>Trump opens a 2028 campaign committee - Reuters</title>
  <link>https://news.google.com/rss/articles/one</link>
  <pubDate>Sun, 08 Nov 2026 15:00:00 GMT</pubDate>
  <source url="https://www.reuters.com">Reuters</source>
  <description><![CDATA[Trump opened a committee.]]></description>
</item>
<item>
  <title>No link</title>
  <pubDate>Sun, 08 Nov 2026 15:00:00 GMT</pubDate>
</item>
</channel></rss>`;

function item(id: string, title: string, publishedAt = "2026-11-08T15:00:00.000Z"): RawNewsItem {
  return {
    id,
    url: `https://example.com/${id}`,
    title,
    source: "Reuters",
    summary: title,
    publishedAt,
    language: "en",
    titleKey: titleKey(title),
  };
}

test("rss keeps a sourced item and drops an item without a link", () => {
  const items = parseRss(RSS, "en", 10);
  assert.equal(items.length, 1);
  assert.equal(items[0].source, "Reuters");
  assert.equal(items[0].title, "Trump opens a 2028 campaign committee");
  assert.equal(items[0].titleKey, titleKey("Trump opens a 2028 campaign committee"));
});

test("exact title repeats never reach the model", () => {
  const first = item("a", "Trump opens a 2028 committee!");
  const repeat = item("b", "trump opens a 2028 committee", "2026-11-08T16:00:00.000Z");
  const fresh = item("c", "Harris files for the New Hampshire primary", "2026-11-08T14:00:00.000Z");
  const batch = prepareBatch([first, repeat, fresh], new Set(["a"]), new Set([first.titleKey]), 8);
  assert.deepEqual(batch.fresh.map((row) => row.id), ["c"]);
  assert.deepEqual(batch.exactDupes.map((row) => row.id), ["b"]);
});

test("the model can reject a paraphrase and keep a new fact", () => {
  const items = [
    item("n1", "Trump opens a committee"),
    item("n2", "Trump starts a 2028 committee"),
    item("n3", "A national poll puts the Democratic primary at 40 percent"),
  ];
  const raw = JSON.stringify({
    items: [
      { id: "n1", publish: true, duplicate_of: null, headline: { en: "Trump opens a 2028 committee", es: "Trump abre un comité para 2028" }, teaser: { en: "Trump opened a campaign committee.", es: "Trump abrió un comité de campaña." }, people: [{ name: "Donald Trump", nameEn: "Donald Trump" }], topic: "Campaign" },
      { id: "n2", publish: true, duplicate_of: "n1", headline: { en: "Same committee story", es: "La misma historia" }, teaser: { en: "The story repeats the committee opening.", es: "La nota repite la apertura del comité." }, people: [], topic: "Campaign" },
      { id: "n3", publish: true, duplicate_of: "recent-1", headline: { en: "Poll repeats an old number", es: "La encuesta repite una cifra" }, teaser: { en: "The number was already published.", es: "La cifra ya estaba publicada." }, people: [{ nameEn: "not a name" }], topic: "Poll" },
    ],
  });
  const judged = acceptDecisions(items, parseDecisions(raw));
  assert.deepEqual(judged.accepted.map((row) => row.item.id), ["n1"]);
  assert.deepEqual(judged.duplicated, ["n2", "n3"]);
  assert.deepEqual(judged.accepted[0].people, [{ name: "Donald Trump", nameEn: "Donald Trump" }]);
});

test("a broken model reply publishes nothing", () => {
  assert.deepEqual(parseDecisions("not json"), []);
  const judged = acceptDecisions([item("n1", "A filing")], parseDecisions("{\"items\":[{\"id\":\"n1\",\"publish\":true}]}"));
  assert.equal(judged.accepted.length, 0);
  assert.deepEqual(judged.rejected, ["n1"]);
});
