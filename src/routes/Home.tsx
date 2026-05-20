import { Page } from "@cq/ui";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/editorial/Ticker";
import { ThisWeek } from "@/components/home/ThisWeek";
import { IndexTile } from "@/components/home/IndexTile";
import { LatestGrid } from "@/components/home/LatestGrid";
import { hero, leadStory, tickerItems, thisWeek, indexTile } from "@/data/home";

/**
 * The homepage. Rendered through `Page` in `flush` mode: `Page` stamps
 * `data-page-root` onto the first child (the Hero's `<section>`) WITHOUT
 * introducing a wrapper element — so every band stays a direct child of
 * `<main>` and the `main > section` rhythm selector keeps matching
 * (Constraint 4/5; G3 + R1).
 *
 * This route file carries zero geometry — every band is a primitive-composed
 * component.
 */
export function Home() {
  return (
    <Page flush>
      <Hero
        {...hero}
        chartData={leadStory.data}
        chartCategory={leadStory.category}
      />
      <Ticker items={tickerItems} />
      <ThisWeek items={thisWeek} />
      <IndexTile {...indexTile} />
      <LatestGrid />
    </Page>
  );
}
