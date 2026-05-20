import { motion } from "motion/react";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { Section } from "@/components/primitives/Section";
import { Text } from "@/components/primitives/Text";
import { cn } from "@/lib/utils";
import { typeClasses } from "@/design/tokens";

interface ComingSoonProps {
  kicker: string;
  title: string;
  description: string;
}

export function ComingSoon({ kicker, title, description }: ComingSoonProps) {
  return (
    <Section variant="primary" gutter="spacious" divide="none" container="narrow">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={cn(typeClasses.caption, "mb-6 flex items-center gap-3 text-muted-foreground")}>
          <span className="h-px w-6 bg-accent" />
          <span className="text-accent">{kicker}</span>
          <span>·</span>
          <span>In production</span>
        </div>
        <Text scale="head" as="h1">
          {title}
        </Text>
        <Text scale="body" tone="muted" as="p" className="mt-6 leading-[1.55]">
          {description}
        </Text>
      </motion.div>

      <div className="mt-16 border-t border-border pt-12">
        <Text scale="body" tone="muted" as="p" className="mb-5 leading-[1.5]">
          Be the first to read when this lands. Tuesday mornings, one email.
        </Text>
        <SubscribeForm socialProof="Free forever · No spam · Unsubscribe anytime" />
      </div>
    </Section>
  );
}
