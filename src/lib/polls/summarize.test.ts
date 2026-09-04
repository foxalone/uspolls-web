import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StoredPoll } from "../votehub/types";
import { formatMargin, summarizeGenericBallot } from "./summarize";

function poll(partial: Partial<StoredPoll> & Pick<StoredPoll, "answers">): StoredPoll {
  return {
    id: "p1",
    poll_type: "generic-ballot",
    subject: "2026",
    seat_name: null,
    pollster: "Test",
    sample_size: 1000,
    population: "lv",
    start_date: "2026-08-01",
    end_date: "2026-08-03",
    created_at: "2026-08-04",
    sponsors: [],
    internal: false,
    partisan: null,
    url: null,
    source_url: null,
    source: "votehub",
    election_year: 2026,
    race_type: "generic_ballot",
    state: null,
    district: null,
    race_key: "2026-generic-ballot",
    source_hash: "x",
    imported_at: "2026-09-04T00:00:00.000Z",
    updated_at: "2026-09-04T00:00:00.000Z",
    ...partial,
  };
}

describe("summarizeGenericBallot", () => {
  it("averages Dem/Rep from recent polls", () => {
    const summary = summarizeGenericBallot([
      poll({
        id: "a",
        answers: [
          { choice: "Dem", pct: 48 },
          { choice: "Rep", pct: 44 },
        ],
      }),
      poll({
        id: "b",
        answers: [
          { choice: "Democrat", pct: 50 },
          { choice: "Republican", pct: 42 },
        ],
      }),
    ]);
    assert.ok(summary);
    assert.equal(summary?.dem, 49);
    assert.equal(summary?.gop, 43);
    assert.equal(summary?.margin, 6);
    assert.equal(formatMargin(summary?.margin ?? 0), "D+6.0");
  });
});
