import type { PublicNewsCard } from "../news/types";
import type { AttentionCard } from "./attention";
import type { MarketPanel } from "./market";
import type { HubPollDirectory } from "./polls";

export type HubNewsItem = PublicNewsCard;

export type PresidentialHub = HubPollDirectory & {
  generatedOn: string;
  news: HubNewsItem[];
  market: MarketPanel;
  attention: AttentionCard[];
  showAd: boolean;
};

export const EMPTY_MARKET: MarketPanel = {
  hidden: false,
  unavailable: true,
  href: "https://polymarket.com/event/presidential-election-winner-2028",
  asOf: null,
  bars: [],
};
