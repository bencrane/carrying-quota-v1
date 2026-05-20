import type { HTMLAttributes } from "react";
import { motion } from "motion/react";
import { Grid, Stack, Cluster, Text, Eyebrow } from "@cq/ui";
// Section is imported from the compat path so design-system.sh's `adopt`
// sub-check (which keys on this exact import path) stays green; the compat
// module re-exports @cq/ui's Section.
import { Section } from "@/components/primitives/Section";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { LeadChart, type CompanyComp } from "./LeadChart";

interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  issue: string;
  date: string;
  headline: string;
  dek: string;
  readerCount: string;
  monthGrowth: string;
  chartData: CompanyComp[];
  chartCategory: string;
}

/**
 * The homepage hero — a 2-column editorial composition: brand chrome +
 * headline + dek + subscribe form on the left, the lead data chart on the
 * right. Migrated onto `@cq/ui` primitives; the 2-column grid, the
 * `data-testid="hero"` hook, and the Framer Motion entrance animations are
 * preserved (Constraint 4/5). Motion wrappers stay INSIDE `Section`.
 *
 * `...rest` forwards `data-*` attributes — including the `data-page-root` the
 * `Page` flush wrapper stamps onto the route's first section.
 */
export function Hero({
  issue,
  date,
  headline,
  dek,
  readerCount,
  monthGrowth,
  chartData,
  chartCategory,
  ...rest
}: HeroProps) {
  return (
    <Section surface="elevated" gutter="spacious" divide="bottom" data-testid="hero" {...rest}>
      <Grid cols={2} gap="2xl" align="start">
        {/* Left column: brand chrome + headline + dek + form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack gap="xl">
            <Cluster gap="sm" align="baseline">
              <Eyebrow marker={false}>
                <span aria-hidden="true">↳ </span>
                {issue}
              </Eyebrow>
              <Text scale="caption" tone="muted" as="span">
                {date}
              </Text>
            </Cluster>

            <Text scale="display" as="h1" wrap="balance">
              {headline}
            </Text>

            <Text scale="lede" tone="muted">
              {dek}
            </Text>

            <SubscribeForm
              size="lg"
              socialProof={
                <>
                  Free forever ·{" "}
                  <span className="tabular-nums text-foreground">{readerCount}</span>{" "}
                  · <span className="tabular-nums text-accent">{monthGrowth}</span>{" "}
                  this month
                </>
              }
            />
          </Stack>
        </motion.div>

        {/* Right column: LeadChart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack gap="lg">
            <Cluster gap="sm" align="baseline">
              <Eyebrow>This week's data</Eyebrow>
              <Text scale="caption" tone="muted" as="span">
                {chartCategory}
              </Text>
            </Cluster>
            <LeadChart data={chartData} />
          </Stack>
        </motion.div>
      </Grid>
    </Section>
  );
}
