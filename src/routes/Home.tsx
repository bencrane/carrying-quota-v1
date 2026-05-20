import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/editorial/Ticker";
import { ThisWeek } from "@/components/home/ThisWeek";
import { IndexTile } from "@/components/home/IndexTile";
import { LatestGrid } from "@/components/home/LatestGrid";
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
      <Hero
        {...hero}
        chartData={leadStory.data}
        chartCategory={leadStory.category}
      />
      <Ticker items={tickerItems} />
      <ThisWeek items={thisWeek} />
      <IndexTile {...indexTile} />
      <LatestGrid />
    </>
  );
}
