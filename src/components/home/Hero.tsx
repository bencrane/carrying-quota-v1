import { motion } from "motion/react";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";

interface HeroProps {
  issue: string;
  date: string;
  headline: string;
  dek: string;
  readerCount: string;
  monthGrowth: string;
}

export function Hero({
  issue,
  date,
  headline,
  dek,
  readerCount,
  monthGrowth,
}: HeroProps) {
  return (
    <section className="border-b border-border px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[920px]"
      >
        <div className="mb-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span className="text-accent">↳</span>
          <span>{issue}</span>
          <span>·</span>
          <span>{date}</span>
        </div>

        <h1 className="font-serif font-light leading-[1.02] tracking-[-0.03em] text-balance text-[clamp(40px,6.5vw,76px)]">
          {headline}
        </h1>

        <p className="mt-8 max-w-[58ch] font-serif text-[18px] leading-[1.5] text-foreground md:text-[20px]">
          {dek}
        </p>

        <div className="mt-12">
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
    </section>
  );
}
