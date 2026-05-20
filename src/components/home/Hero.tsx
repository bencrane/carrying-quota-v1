import { motion } from "motion/react";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { LeadChart, type CompanyComp } from "./LeadChart";

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
    <section
      data-testid="hero"
      className="border-b border-border px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
        {/* Left column: brand chrome + headline + dek + form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7"
        >
          <div className="mb-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="text-accent">↳</span>
            <span>{issue}</span>
            <span>·</span>
            <span>{date}</span>
          </div>

          <h1 className="font-serif font-light leading-[1.0] tracking-[-0.035em] text-balance text-[clamp(48px,6vw,96px)]">
            {headline}
          </h1>

          <p className="mt-8 max-w-[52ch] font-serif text-[18px] leading-[1.5] text-foreground md:text-[20px]">
            {dek}
          </p>

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
          <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em]">
            <span className="text-accent">↳ This week's data</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{chartCategory}</span>
          </div>
          <LeadChart data={chartData} />
        </motion.div>
      </div>
    </section>
  );
}
