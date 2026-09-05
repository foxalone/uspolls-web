import {
  GENERIC_BALLOT_RACE_KEY,
  POLLS_ISR_REVALIDATE_SECONDS,
  TRUMP_APPROVAL_RACE_KEY,
} from "../votehub/constants";
import type { RaceIndexDoc, StoredPoll } from "../votehub/types";
import {
  getCachedPollsByRaceKey,
  getCachedPollsByRaceType,
  getCachedRacesByType,
} from "./cachedQuery";
import {
  emptyHomePollSnapshot,
  summarizeApproval,
  summarizeGenericBallot,
  toPublicPollRow,
  type HomePollSnapshot,
} from "./summarize";

export { POLLS_ISR_REVALIDATE_SECONDS, emptyHomePollSnapshot };
export type { HomePollSnapshot };

export async function getHomePollsStaticProps() {
  try {
    const polls = await getHomePollSnapshot();
    return {
      props: { polls },
      revalidate: POLLS_ISR_REVALIDATE_SECONDS,
    };
  } catch {
    return {
      props: { polls: emptyHomePollSnapshot() },
      revalidate: 60,
    };
  }
}

function mergeLatest(groups: StoredPoll[][], limit: number) {
  const byId = new Map<string, StoredPoll>();
  for (const group of groups) {
    for (const poll of group) byId.set(poll.id, poll);
  }
  return [...byId.values()]
    .sort((a, b) => (b.end_date || "").localeCompare(a.end_date || ""))
    .slice(0, limit)
    .map(toPublicPollRow);
}

function countRaces(races: RaceIndexDoc[]) {
  return races.length;
}

export async function getHomePollSnapshot(): Promise<HomePollSnapshot> {
  const [generic, trump, senate, house, governor, senateRaces, houseRaces, govRaces] =
    await Promise.all([
      getCachedPollsByRaceKey(GENERIC_BALLOT_RACE_KEY, 15),
      getCachedPollsByRaceKey(TRUMP_APPROVAL_RACE_KEY, 15),
      getCachedPollsByRaceType("senate", 8),
      getCachedPollsByRaceType("house", 8),
      getCachedPollsByRaceType("governor", 6),
      getCachedRacesByType("senate", 80),
      getCachedRacesByType("house", 200),
      getCachedRacesByType("governor", 60),
    ]);

  return {
    genericBallot: summarizeGenericBallot(generic),
    trumpApproval: summarizeApproval(trump),
    latest: mergeLatest([generic.slice(0, 4), trump.slice(0, 3), senate, house, governor], 16),
    raceCounts: {
      senate: countRaces(senateRaces),
      house: countRaces(houseRaces),
      governor: countRaces(govRaces),
    },
  };
}
