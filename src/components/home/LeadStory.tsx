import { motion } from "motion/react";
import { Link } from "react-router";
import { LeadChart, type CompanyComp } from "./LeadChart";

interface LeadStoryProps {
  category: string;
  headline: string;
  dek: string;
  byline: string;
  readTime: string;
  slug: string;
  data: CompanyComp[];
}

export function LeadStory({
  category,
  headline,
  dek,
  byline,
  readTime,
  slug,
  data,
}: LeadStoryProps) {
  return (
    <article className="border-b border-border px-6 pt-14 pb-16 md:px-10 md:pt-16 md:pb-24">
      <div className="mb-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em]">
        <span className="text-accent">↳ This week's data</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{category}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <LeadChart data={data} />
        </div>

        <div className="md:col-span-5">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[32px] font-normal leading-[1.05] tracking-[-0.02em] md:text-[40px]"
          >
            {headline}
          </motion.h2>
          <p className="mt-5 font-serif text-[16px] leading-[1.5] text-muted-foreground md:text-[17px]">
            {dek}
          </p>
          <div className="mt-10 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>
              <span className="text-foreground">{byline}</span> · {readTime}
            </span>
            <Link
              to={`/dispatches/${slug}`}
              className="group inline-flex items-center gap-2 text-foreground transition-colors duration-200 hover:text-accent"
            >
              Continue
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
