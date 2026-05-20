import { Page, PageHeader, PageSection, Figure, CompIndexTable } from "@cq/ui";
import { compIndex, compIndexMeta } from "@/data/comp-index";

/**
 * `/index` — The Index. The interactive AE compensation data product: a
 * `Page`-framed route presenting `CompIndexTable` (the sortable, segment-
 * filterable, row-expandable compensation explorer) through `Figure`.
 *
 * The route file is a pure composition of `@cq/ui` primitives — zero
 * hand-rolled geometry (checks G2/G3 + the no-geometry ESLint rule). The
 * figure's width and placement are governed by `Figure`, the same primitive
 * the homepage hero routes its compensation chart through — so the preview
 * and the full product are members of one family.
 */
export function IndexRoute() {
  return (
    <Page>
      <PageHeader
        eyebrow={compIndexMeta.eyebrow}
        title={compIndexMeta.title}
        dek={compIndexMeta.dek}
      />
      <PageSection
        eyebrow="Explore the index"
        surface="elevated"
        gutter="spacious"
        divide="none"
      >
        <Figure caption={compIndexMeta.caption} source={compIndexMeta.source}>
          <CompIndexTable data={compIndex} />
        </Figure>
      </PageSection>
    </Page>
  );
}
