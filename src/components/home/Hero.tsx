import { motion } from "motion/react";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { LeadChart, type CompanyComp } from "./LeadChart";
import { Section } from "@/components/primitives/Section";
import { Text } from "@/components/primitives/Text";

interface HeroProps {
  issue: string;
  date: string;
  headline: string;
  dek: string;
  readerCount: string;
  monthGrowth: string;
  chartData: CompanyComp[];
  chartCategory: string;
}

export function Hero({
  issue,
  date,
  headline,
  dek,
  readerCount,
  monthGrowth,
  chartData,
  chartCategory,
}: HeroProps) {
  return (
    <Section
      variant="elevated"
      gutter="spacious"
      divide="bottom"
      data-testid="hero"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
        {/* Left column: brand chrome + headline + dek + form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7"
        >
          <div className="mb-10">
            <Text scale="caption" tone="muted" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-accent">↳</span>
              <span>{issue}</span>
              <span>·</span>
              <span>{date}</span>
            </Text>
          </div>

          <Text scale="hero" className="text-balance">
            {headline}
          </Text>

          <div className="mt-8 max-w-[52ch]">
            <Text scale="lede">
              {dek}
            </Text>
          </div>

          <div className="mt-10">
            <SubscribeForm
              size="lg"
              socialProof={
                <>
                  Free forever ·{" "}
                  <span className="tabular-nums text-foreground">{readerCount}</span>{" "}
                  ·{" "}
                  <span className="tabular-nums text-accent">{monthGrowth}</span>{" "}
                  this month
                </>
              }
            />
          </div>
        </motion.div>

        {/* Right column: LeadChart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5"
        >
          <div className="mb-6">
            <Text scale="caption" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-accent">↳ This week's data</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{chartCategory}</span>
            </Text>
          </div>
          <LeadChart data={chartData} />
        </motion.div>
      </div>
    </Section>
  );
}
