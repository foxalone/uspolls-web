import type { HomePollSnapshot } from "../lib/polls/summarize";
import { HomeHero } from "./HomeHero";
import { HomeTodayChanges } from "./HomeTodayChanges";

type HomePageProps = {
  polls: HomePollSnapshot;
};

export function HomePage({ polls }: HomePageProps) {
  return (
    <div className="home-stack">
      <HomeHero />
      <HomeTodayChanges polls={polls} />
    </div>
  );
}
