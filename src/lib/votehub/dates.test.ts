import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveSyncFromDate, subtractDays } from "./dates";

describe("resolveSyncFromDate", () => {
  it("bootstraps from 2025-01-01", () => {
    assert.deepEqual(resolveSyncFromDate({ bootstrap: true }), {
      fromDate: "2025-01-01",
      mode: "bootstrap",
    });
  });

  it("uses last successful sync minus 3 days", () => {
    assert.deepEqual(
      resolveSyncFromDate({
        sync: {
          last_successful_sync: "2026-09-04T10:00:00.000Z",
          last_attempt: "2026-09-04T10:00:00.000Z",
          polls_processed: 10,
          polls_created: 1,
          polls_updated: 0,
          polls_skipped: 9,
          polls_rejected: 0,
          races_updated: 1,
          from_date: "2026-09-01",
          mode: "incremental",
          status: "success",
          error: null,
        },
      }),
      { fromDate: "2026-09-01", mode: "incremental" },
    );
  });
});

describe("subtractDays", () => {
  it("stays on the UTC calendar date", () => {
    assert.equal(subtractDays("2026-03-01", 3), "2026-02-26");
  });
});
