import { motion } from "motion/react";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";

interface ComingSoonProps {
  kicker: string;
  title: string;
  description: string;
}

export function ComingSoon({ kicker, title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-24 md:px-10 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span className="h-px w-6 bg-accent" />
          <span className="text-accent">{kicker}</span>
          <span>·</span>
          <span>In production</span>
        </div>
        <h1 className="font-serif text-[40px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[56px]">
          {title}
        </h1>
        <p className="mt-6 max-w-[52ch] font-serif text-[17px] leading-[1.55] text-muted-foreground">
          {description}
        </p>
      </motion.div>

      <div className="mt-16 border-t border-border pt-12">
        <p className="mb-5 max-w-[52ch] font-serif text-[15px] leading-[1.5] text-muted-foreground">
          Be the first to read when this lands. Tuesday mornings, one email.
        </p>
        <SubscribeForm socialProof="Free forever · No spam · Unsubscribe anytime" />
      </div>
    </div>
  );
}
