import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface CompanyComp {
  company: string;
  ote: number;        // total OTE in $K
  base: number;
  commission: number;
  equity: number;     // 4-year equity in $K
  segment: string;    // e.g. "Enterprise · AI Infra"
}

interface LeadChartProps {
  data: CompanyComp[];
}

export function LeadChart({ data }: LeadChartProps) {
  const max = Math.max(...data.map((d) => d.ote));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-[80px_1fr] items-baseline gap-x-4 pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground md:grid-cols-[160px_1fr]">
        <span>Company</span>
        <span className="flex items-baseline justify-between">
          <span>OTE (P75)</span>
          <span className="text-subtle-foreground">hover for breakdown</span>
        </span>
      </div>

      <div className="border-t border-border">
        {data.map((row, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={row.company}
              className="relative grid grid-cols-[80px_1fr] items-center gap-x-4 border-b border-border py-3 transition-colors duration-200 md:grid-cols-[160px_1fr] md:py-[14px]"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="truncate font-serif text-[14px] italic md:text-[17px]">
                {row.company}
              </span>

              <div className="relative">
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="relative h-[6px] bg-card">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.ote / max) * 100}%` }}
                      transition={{
                        duration: 1.1,
                        delay: 0.15 + i * 0.04,
                        ease: [0.2, 0.7, 0, 1],
                      }}
                      className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_24px_hsl(var(--accent)/0.25)]"
                    />
                  </div>
                  <span className="font-mono text-[11px] tabular-nums text-foreground md:text-[12px]">
                    ${row.ote}K
                  </span>
                </div>

                <AnimatePresence>
                  {isHovered ? (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none absolute left-0 top-5 z-10 hidden border border-border bg-card px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground md:block"
                    >
                      <div className="mb-1 text-foreground">{row.segment}</div>
                      <div className="grid grid-cols-[80px_auto] gap-x-3 tabular-nums">
                        <span>Base</span>
                        <span className="text-foreground">${row.base}K</span>
                        <span>Commission</span>
                        <span className="text-foreground">${row.commission}K</span>
                        <span>Equity (4y)</span>
                        <span className="text-foreground">${row.equity}K</span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
