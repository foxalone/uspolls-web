import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapVoteHubPoll, pollNeedsWrite } from "./mapPoll";

const sample = {
  id: "us-202eme1bcacacc",
  poll_type: "us-senator",
  sample_size: 1000,
  population: "lv",
  url: "https://example.com/poll",
  created_at: "2026-03-30",
  start_date: "2026-02-28",
  end_date: "2026-03-02",
  pollster: "Emerson College",
  answers: [
    { choice: "Jon Ossoff", pct: 47.7, party: "D" },
    { choice: "Mike Collins", pct: 43.3 },
  ],
  seat_name: null,
  sponsors: ["Nexstar Media/WGN-TV"],
  internal: false,
  partisan: null,
  subject: "2026 Georgia",
  extra_flag: true,
};

describe("mapVoteHubPoll", () => {
  it("preserves VoteHub fields, answers, and attribution", () => {
    const mapped = mapVoteHubPoll(sample, "2026-09-04T12:00:00.000Z");
    assert.ok(mapped);
    assert.equal(mapped?.id, "us-202eme1bcacacc");
    assert.equal(mapped?.source, "votehub");
    assert.equal(mapped?.source_url, "https://example.com/poll");
    assert.equal(mapped?.url, "https://example.com/poll");
    assert.equal(mapped?.race_key, "2026-senate-ga");
    assert.equal(mapped?.state, "ga");
    assert.equal(mapped?.answers[0]?.party, "D");
    assert.equal(mapped?.extra_flag, true);
    assert.equal(mapped?.imported_at, "2026-09-04T12:00:00.000Z");
  });

  it("does not rewrite an unchanged hash", () => {
    const mapped = mapVoteHubPoll(sample, "2026-09-04T12:00:00.000Z");
    assert.ok(mapped);
    assert.equal(pollNeedsWrite(mapped, { source_hash: mapped.source_hash }), "skip");
    assert.equal(pollNeedsWrite(mapped, undefined), "create");
    assert.equal(pollNeedsWrite(mapped, { source_hash: "old" }), "update");
  });
});
