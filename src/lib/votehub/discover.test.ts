import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { discoverMvpSubjects, isAllowedDiscoveredPoll } from "./discover";

describe("discoverMvpSubjects", () => {
  it("keeps 2026 races and Trump approval, drops 2025 and favorability", () => {
    const discovered = discoverMvpSubjects([
      { subject: "2026 Georgia", poll_types: ["governor", "us-senator"] },
      { subject: "2026 PA-07", poll_types: ["us-representative"] },
      { subject: "2026", poll_types: ["generic-ballot"] },
      { subject: "Donald Trump", poll_types: ["favorability", "approval"] },
      { subject: "2025 New Jersey", poll_types: ["governor"] },
      { subject: "JD Vance", poll_types: ["favorability"] },
      { subject: "Congress", poll_types: ["approval"] },
      { subject: "2028 Democratic", poll_types: ["presidential-primary"] },
    ]);

    assert.deepEqual(
      discovered.map((row) => row.subject).sort(),
      ["2026", "2026 Georgia", "2026 PA-07", "Donald Trump"],
    );
    assert.deepEqual(
      discovered.find((row) => row.subject === "Donald Trump")?.poll_types,
      ["approval"],
    );
  });
});

describe("isAllowedDiscoveredPoll", () => {
  it("allows a poll only for a discovered subject+type pair", () => {
    const allowed = new Set(["us-senator::2026-georgia", "approval::donald-trump"]);
    assert.equal(
      isAllowedDiscoveredPoll({ poll_type: "us-senator", subject: "2026 Georgia" }, allowed),
      true,
    );
    assert.equal(
      isAllowedDiscoveredPoll({ poll_type: "governor", subject: "2026 Georgia" }, allowed),
      false,
    );
  });
});
