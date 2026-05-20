import { Piece } from "../editorial/Piece.js";
import { PieceHeader } from "../editorial/PieceHeader.js";
import { Lede } from "../editorial/Lede.js";
import { Prose } from "../editorial/Prose.js";
import { PullQuote } from "../editorial/PullQuote.js";
import { Figure } from "../editorial/Figure.js";
import { Section } from "../layout/Section.js";
import { AppearOnMount } from "../motion/AppearOnMount.js";
import { CompCurveFigure, type CompDatum } from "../figures/CompCurveFigure.js";

/**
 * Representative demo data for the reference figure. A FIXTURE — not real
 * editorial content (the directive's `## Out of scope` keeps real essays out
 * of this cycle). It exists to prove the embed contract and seed the
 * Storybook / Playwright visual baselines.
 */
const DEMO_COMP: readonly CompDatum[] = [
  { company: "Anthropic", ote: 445, base: 195, variable: 250, segment: "Enterprise · AI Infra" },
  { company: "OpenAI", ote: 420, base: 190, variable: 230, segment: "Enterprise · GTM" },
  { company: "Databricks", ote: 385, base: 175, variable: 210, segment: "Enterprise · Data" },
  { company: "Snowflake", ote: 340, base: 160, variable: 180, segment: "Enterprise · Data" },
  { company: "Figma", ote: 330, base: 155, variable: 175, segment: "Enterprise · Design" },
  { company: "Ramp", ote: 310, base: 145, variable: 165, segment: "Mid-Market · Fintech" },
];

const BODY_1 = [
  "The on-target number is the one everyone quotes, and it is the one that hides the most. Two AEs with an identical $400K OTE can be carrying wildly different amounts of risk — the split between guaranteed base and earned variable is where the real story sits, and it is the column recruiters never lead with.",
  "We pulled P75 compensation across six of the most-watched enterprise sales seats in tech. Plotted against each other, the headline OTE figures cluster within a hundred thousand dollars of one another. The breakdown underneath does not.",
];

const BODY_2 = [
  "Hover any row in the figure above and the readout resolves the seat into its parts. The pattern that emerges is consistent: the companies paying the largest total numbers are not paying proportionally larger base salaries. They are widening the variable band — betting on a strong year, and transferring the downside onto the rep.",
  "For an AE reading an offer, the figure is a diligence tool. The bar is the brochure number. The base portion is the floor you actually stand on if the year goes sideways. The gap between them is the size of the bet the company is asking you to take.",
];

/**
 * The demo editorial piece — the proof of the piece / data-figure embed
 * contract (check D3). A realistic editorial structure: header, lede,
 * long-form prose, a pull quote, and the reference interactive data figure
 * embedded through `Figure`.
 *
 * The figure cannot break the `Piece`'s vertical rhythm; the prose around it
 * hand-rolls zero geometry. `[data-piece-root]` ⊃ `[data-figure]` ⊃
 * `[data-reference-figure]` is the embed-contract DOM the benchmark asserts.
 */
export function DemoPiece() {
  return (
    <Section surface="primary" gutter="spacious" divide="none" container={false}>
      <AppearOnMount>
        <Piece measure="prose" rhythm="xl">
          <PieceHeader
            category="The Index · Compensation"
            date="May 19, 2026"
            headline="The OTE number hides the bet. The breakdown shows it."
            dek="Six of tech's most-watched enterprise AE seats, plotted by P75 on-target earnings — and what the base-to-variable split reveals about who is really carrying the risk."
            byline="CQ Research Desk"
            readTime="6 min read"
          />

          <Lede>
            A four-hundred-thousand-dollar OTE is not a four-hundred-thousand-dollar
            offer. It is a question about how much of that number you are willing
            to go and earn — and the answer is different at every company on this
            list.
          </Lede>

          <Prose paragraphs={BODY_1} />

          <Figure
            width="wide"
            caption="P75 on-target earnings by company — total OTE bar, base portion shaded. Hover or focus a row for the full breakdown."
            source="CQ Research Desk · n = 1,400 verified offer letters, dated after March 1 2026"
          >
            {/* The reference data figure, tagged for the embed-contract check. */}
            <div data-reference-figure="">
              <CompCurveFigure
                data={DEMO_COMP}
                title="AE compensation by company — P75 OTE, base vs. variable"
              />
            </div>
          </Figure>

          <Prose paragraphs={BODY_2} />

          <PullQuote cite="— a comp committee lead at a Series-C infra company">
            We did not cut anyone's pay. We moved the dollars from the part we
            guarantee to the part they have to go and win.
          </PullQuote>

          <Prose paragraphs={[
            "That is the quarter in one sentence. The headline held; the structure shifted. The AEs who read the figure — not the brochure — are the ones repricing themselves correctly.",
          ]} />
        </Piece>
      </AppearOnMount>
    </Section>
  );
}
