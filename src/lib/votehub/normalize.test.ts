import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isTarget2026Poll, normalizeRace, slugifySubject } from "./normalize";

describe("normalizeRace", () => {
  it("maps 2026 Georgia senate to 2026-senate-ga", () => {
    assert.deepEqual(
      normalizeRace({ poll_type: "us-senator", subject: "2026 Georgia" }),
      {
        election_year: 2026,
        race_type: "senate",
        state: "ga",
        district: null,
        qualifier: null,
        race_key: "2026-senate-ga",
      },
    );
  });

  it("maps 2026 PA-07 house to 2026-house-pa-07", () => {
    assert.deepEqual(
      normalizeRace({ poll_type: "us-representative", subject: "2026 PA-07" }),
      {
        election_year: 2026,
        race_type: "house",
        state: "pa",
        district: "07",
        qualifier: null,
        race_key: "2026-house-pa-07",
      },
    );
  });

  it("maps 2026 Michigan governor to 2026-governor-mi", () => {
    assert.deepEqual(
      normalizeRace({ poll_type: "governor", subject: "2026 Michigan" }),
      {
        election_year: 2026,
        race_type: "governor",
        state: "mi",
        district: null,
        qualifier: null,
        race_key: "2026-governor-mi",
      },
    );
  });

  it("maps 2026 generic ballot", () => {
    assert.deepEqual(normalizeRace({ poll_type: "generic-ballot", subject: "2026" }), {
      election_year: 2026,
      race_type: "generic_ballot",
      state: null,
      district: null,
      qualifier: null,
      race_key: "2026-generic-ballot",
    });
  });

  it("maps Donald Trump approval", () => {
    assert.deepEqual(normalizeRace({ poll_type: "approval", subject: "Donald Trump" }), {
      election_year: null,
      race_type: "presidential_approval",
      state: null,
      district: null,
      qualifier: null,
      race_key: "trump-approval",
    });
  });

  it("keeps senate primaries on a distinct race_key", () => {
    assert.equal(
      normalizeRace({ poll_type: "us-senator", subject: "2026 Texas Democratic" })?.race_key,
      "2026-senate-tx-democratic",
    );
  });

  it("pads single-digit house districts and can use seat_name", () => {
    assert.equal(
      normalizeRace({
        poll_type: "us-representative",
        subject: "2026 Alaska",
        seat_name: "AK-1",
      })?.race_key,
      "2026-house-ak-01",
    );
  });
});

describe("isTarget2026Poll", () => {
  it("accepts 2026 races and Trump approval", () => {
    assert.equal(isTarget2026Poll({ poll_type: "us-senator", subject: "2026 Georgia" }), true);
    assert.equal(isTarget2026Poll({ poll_type: "approval", subject: "donald-trump" }), true);
  });

  it("rejects 2025 races, favorability, and unrelated approval", () => {
    assert.equal(isTarget2026Poll({ poll_type: "governor", subject: "2025 New Jersey" }), false);
    assert.equal(isTarget2026Poll({ poll_type: "favorability", subject: "Donald Trump" }), false);
    assert.equal(isTarget2026Poll({ poll_type: "approval", subject: "Congress" }), false);
  });
});

describe("slugifySubject", () => {
  it("treats spaces and dashes as equivalent", () => {
    assert.equal(slugifySubject("Donald Trump"), "donald-trump");
    assert.equal(slugifySubject("donald-trump"), "donald-trump");
  });
});
