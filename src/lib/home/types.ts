import type { PublicNewsCard } from "../news/types";
import type { AttentionCard } from "./attention";
import type { MarketPanel } from "./market";
import type { HomePollDirectory } from "./polls";

export type PresidentialHome = HomePollDirectory & {
  generatedOn: string;
  news: PublicNewsCard[];
  market: MarketPanel;
  attention: AttentionCard[];
};

export const EMPTY_MARKET: MarketPanel = {
  hidden: false,
  unavailable: true,
  href: "https://polymarket.com/event/presidential-election-winner-2028",
  asOf: null,
  bars: [],
};
