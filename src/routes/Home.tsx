import { Hero } from "@/components/home/Hero";
import { LeadStory } from "@/components/home/LeadStory";
import { Ticker } from "@/components/editorial/Ticker";
import { ThisWeek } from "@/components/home/ThisWeek";
import { IndexTile } from "@/components/home/IndexTile";
import {
  hero,
  leadStory,
  tickerItems,
  thisWeek,
  indexTile,
} from "@/data/home";

export function Home() {
  return (
    <>
      <Hero {...hero} />
      <LeadStory {...leadStory} />
      <Ticker items={tickerItems} />
      <ThisWeek items={thisWeek} />
      <IndexTile {...indexTile} />
    </>
  );
}
