import type { CandidateKey } from "./electionResults";

export const MAP_CYCLES = ["1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016", "2020", "2024"] as const;
export type MapCycle = (typeof MAP_CYCLES)[number];

export const CYCLE_SIDES: Record<MapCycle, { red: CandidateKey; blue: CandidateKey }> = {
  "1988": { red: "bushSr", blue: "dukakis" },
  "1992": { red: "bushSr", blue: "clinton" },
  "1996": { red: "dole", blue: "clinton" },
  "2000": { red: "bushJr", blue: "gore" },
  "2004": { red: "bushJr", blue: "kerry" },
  "2008": { red: "mccain", blue: "obama" },
  "2012": { red: "romney", blue: "obama" },
  "2016": { red: "trump", blue: "clinton" },
  "2020": { red: "trump", blue: "biden" },
  "2024": { red: "trump", blue: "harris" },
};

// Certified state allocations from the National Archives. A split or faithless
// ballot does not change the number drawn on the state; the state keeps its
// full allocation, as on the 2012–2024 maps.
const ELECTORS_1988: Record<string, number> = {
  al: 9, ak: 3, az: 7, ar: 6, ca: 47, co: 8, ct: 8, de: 3, dc: 3,
  fl: 21, ga: 12, hi: 4, id: 4, il: 24, in: 12, ia: 8, ks: 7, ky: 9,
  la: 10, me: 4, md: 10, ma: 13, mi: 20, mn: 10, ms: 7, mo: 11, mt: 4,
  ne: 5, nv: 4, nh: 4, nj: 16, nm: 5, ny: 36, nc: 13, nd: 3, oh: 23,
  ok: 8, or: 7, pa: 25, ri: 4, sc: 8, sd: 3, tn: 11, tx: 29, ut: 5,
  vt: 3, va: 12, wa: 10, wv: 6, wi: 11, wy: 3,
};

const ELECTORS_1992: Record<string, number> = {
  al: 9, ak: 3, az: 8, ar: 6, ca: 54, co: 8, ct: 8, de: 3, dc: 3,
  fl: 25, ga: 13, hi: 4, id: 4, il: 22, in: 12, ia: 7, ks: 6, ky: 8,
  la: 9, me: 4, md: 10, ma: 12, mi: 18, mn: 10, ms: 7, mo: 11, mt: 3,
  ne: 5, nv: 4, nh: 4, nj: 15, nm: 5, ny: 33, nc: 14, nd: 3, oh: 21,
  ok: 8, or: 7, pa: 23, ri: 4, sc: 8, sd: 3, tn: 11, tx: 32, ut: 5,
  vt: 3, va: 13, wa: 11, wv: 5, wi: 11, wy: 3,
};

const ELECTORS_2004: Record<string, number> = {
  al: 9, ak: 3, az: 10, ar: 6, ca: 55, co: 9, ct: 7, de: 3, dc: 3,
  fl: 27, ga: 15, hi: 4, id: 4, il: 21, in: 11, ia: 7, ks: 6, ky: 8,
  la: 9, me: 4, md: 10, ma: 12, mi: 17, mn: 10, ms: 6, mo: 11, mt: 3,
  ne: 5, nv: 5, nh: 4, nj: 15, nm: 5, ny: 31, nc: 15, nd: 3, oh: 20,
  ok: 7, or: 7, pa: 21, ri: 4, sc: 8, sd: 3, tn: 11, tx: 34, ut: 5,
  vt: 3, va: 13, wa: 11, wv: 5, wi: 10, wy: 3,
};

const ELECTORS_2012: Record<string, number> = {
  al: 9, ak: 3, az: 11, ar: 6, ca: 55, co: 9, ct: 7, de: 3, dc: 3,
  fl: 29, ga: 16, hi: 4, id: 4, il: 20, in: 11, ia: 6, ks: 6, ky: 8,
  la: 8, me: 4, md: 10, ma: 11, mi: 16, mn: 10, ms: 6, mo: 10, mt: 3,
  ne: 5, nv: 6, nh: 4, nj: 14, nm: 5, ny: 29, nc: 15, nd: 3, oh: 18,
  ok: 7, or: 7, pa: 20, ri: 4, sc: 9, sd: 3, tn: 11, tx: 38, ut: 6,
  vt: 3, va: 13, wa: 12, wv: 5, wi: 10, wy: 3,
};

const ELECTORS_2024: Record<string, number> = {
  al: 9, ak: 3, az: 11, ar: 6, ca: 54, co: 10, ct: 7, de: 3, dc: 3,
  fl: 30, ga: 16, hi: 4, id: 4, il: 19, in: 11, ia: 6, ks: 6, ky: 8,
  la: 8, me: 4, md: 10, ma: 11, mi: 15, mn: 10, ms: 6, mo: 10, mt: 4,
  ne: 5, nv: 6, nh: 4, nj: 14, nm: 5, ny: 28, nc: 16, nd: 3, oh: 17,
  ok: 7, or: 8, pa: 19, ri: 4, sc: 9, sd: 3, tn: 11, tx: 40, ut: 6,
  vt: 3, va: 13, wa: 12, wv: 4, wi: 10, wy: 3,
};

export function electorsFor(cycle: MapCycle): Record<string, number> {
  if (cycle === "1988") return ELECTORS_1988;
  if (cycle === "2004" || cycle === "2008") return ELECTORS_2004;
  if (cycle === "2012" || cycle === "2016" || cycle === "2020") return ELECTORS_2012;
  if (cycle === "2024") return ELECTORS_2024;
  return ELECTORS_1992;
}

// States whose electoral votes went to the Democrat. Nebraska in 2008 is not
// listed: McCain won the state, and one district vote is described in the note.
const BLUE_STATES: Record<Exclude<MapCycle, "2012" | "2016" | "2020" | "2024">, readonly string[]> = {
  "1988": ["dc", "hi", "ia", "ma", "mn", "ny", "or", "ri", "wa", "wi", "wv"],
  "1992": ["ar", "ca", "co", "ct", "de", "dc", "ga", "hi", "il", "ia", "ky", "la", "me", "md", "ma", "mi", "mn", "mo", "mt", "nv", "nh", "nj", "nm", "ny", "oh", "or", "pa", "ri", "tn", "vt", "wa", "wv", "wi"],
  "1996": ["az", "ar", "ca", "ct", "de", "dc", "fl", "hi", "il", "ia", "ky", "la", "me", "md", "ma", "mi", "mn", "mo", "nv", "nh", "nj", "nm", "ny", "oh", "or", "pa", "ri", "tn", "vt", "wa", "wv", "wi"],
  "2000": ["ca", "ct", "de", "dc", "hi", "il", "ia", "me", "md", "ma", "mi", "mn", "nj", "nm", "ny", "or", "pa", "ri", "vt", "wa", "wi"],
  "2004": ["ca", "ct", "de", "dc", "hi", "il", "me", "md", "ma", "mi", "mn", "nh", "nj", "ny", "or", "pa", "ri", "vt", "wa", "wi"],
  "2008": ["ca", "co", "ct", "de", "dc", "fl", "hi", "il", "in", "ia", "me", "md", "ma", "mi", "mn", "nv", "nh", "nj", "nm", "ny", "nc", "oh", "or", "pa", "ri", "vt", "va", "wa", "wi"],
};

export type OlderCycle = Exclude<MapCycle, "2012" | "2016" | "2020" | "2024">;

export function olderBlueCodes(cycle: OlderCycle) {
  return BLUE_STATES[cycle];
}

export function olderWinner(cycle: OlderCycle, code: string): CandidateKey {
  const sides = CYCLE_SIDES[cycle];
  return BLUE_STATES[cycle].includes(code) ? sides.blue : sides.red;
}
