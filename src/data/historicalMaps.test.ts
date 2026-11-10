import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ELECTION_RESULTS } from "./electionResults";
import { electorsFor, MAP_CYCLES, olderBlueCodes, olderWinner, type OlderCycle } from "./historicalMaps";
import { US_STATE_SHAPES } from "./usStateShapes";

const CODES = [...new Set([...US_STATE_SHAPES.map((state) => state.code), "dc"])];

describe("historical election maps", () => {
  for (const cycle of MAP_CYCLES) {
    it(`gives every state an elector count in ${cycle} and totals 538`, () => {
      const votes = electorsFor(cycle);
      assert.deepEqual(Object.keys(votes).sort(), [...CODES].sort());
      assert.equal(Object.values(votes).reduce((sum, count) => sum + count, 0), 538);
    });
  }

  it("keeps the census jumps that change the numbers on the map", () => {
    assert.equal(electorsFor("1988").ca, 47);
    assert.equal(electorsFor("1992").ca, 54);
    assert.equal(electorsFor("2000").tx, 32);
    assert.equal(electorsFor("2004").ca, 55);
    assert.equal(electorsFor("2008").tx, 34);
    assert.equal(electorsFor("2012").ny, 29);
    assert.equal(electorsFor("2024").ca, 54);
    assert.equal(electorsFor("2024").tx, 40);
  });

  it("colors the older maps by the certified state winner", () => {
    assert.equal(olderWinner("1988", "ny"), "dukakis");
    assert.equal(olderWinner("1988", "tx"), "bushSr");
    assert.equal(olderWinner("1992", "ar"), "clinton");
    assert.equal(olderWinner("2000", "fl"), "bushJr");
    assert.equal(olderWinner("2004", "nh"), "kerry");
    assert.equal(olderWinner("2008", "in"), "obama");
    assert.equal(olderWinner("2008", "ne"), "mccain");
  });

  it("matches the certified national totals except a noted faithless or district vote", () => {
    for (const result of ELECTION_RESULTS) {
      if (result.year >= 2012) continue;
      const cycle = String(result.year) as OlderCycle;
      const votes = electorsFor(cycle);
      const blue = olderBlueCodes(cycle).reduce((sum, code) => sum + votes[code], 0);
      const shift = cycle === "2008" ? -1 : result.otherElectors?.count ?? 0;
      assert.equal(blue - shift, result.democratElectors, cycle);
      assert.equal(538 - blue + (cycle === "2008" ? -1 : 0), result.republicanElectors, cycle);
    }
  });
});
