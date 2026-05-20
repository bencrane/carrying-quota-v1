import { Page, DemoPiece } from "@cq/ui";

/**
 * The demo-piece route — `/pieces/demo`. Renders `@cq/ui`'s `DemoPiece`,
 * the representative editorial fixture that proves the piece / data-figure
 * embed contract (check D3): long-form prose + the reference interactive
 * data figure embedded through `Figure`.
 *
 * Rendered through `Page` like every other route; the route file itself
 * carries zero geometry.
 */
export function PieceDemo() {
  return (
    <Page>
      <DemoPiece />
    </Page>
  );
}
