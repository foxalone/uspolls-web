import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firestoreDocumentId } from "./repository";

describe("firestoreDocumentId", () => {
  it("encodes slashes so VoteHub ids are valid Firestore paths", () => {
    assert.equal(firestoreDocumentId("gen202co/gegk2uur"), "gen202co%2Fgegk2uur");
    assert.equal(firestoreDocumentId("us-202eme1bcacacc"), "us-202eme1bcacacc");
  });
});
