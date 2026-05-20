import { Link } from "react-router";
import { motion } from "motion/react";
import { Text } from "@/components/primitives/Text";
import { Stack } from "@/components/primitives/Stack";
import { Cluster } from "@/components/primitives/Cluster";
import { AbstractBanner } from "@/components/editorial/AbstractBanner";
import type { DispatchCard } from "@/data/dispatches";

interface ArticleCardProps {
  piece: DispatchCard;
  index?: number;
}

/**
 * Editorial card — image banner, kicker, headline, dek, byline. The whole
 * card is a link to the piece's own page. New pieces drop in as data;
 * this is the shape they render through.
 */
export function ArticleCard({ piece, index = 0 }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link to={`/dispatches/${piece.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden border border-border bg-card transition-colors duration-300 group-hover:border-foreground/20">
          <AbstractBanner
            seed={index}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <Stack gap="sm" className="pt-5">
          <Cluster gap="sm" align="baseline">
            <Text scale="caption" tone="accent" as="span">
              {piece.category}
            </Text>
            <Text scale="caption" tone="muted" as="span">
              {piece.date}
            </Text>
          </Cluster>
          <Text
            scale="lede"
            as="h3"
            className="text-balance leading-[1.2] text-foreground transition-colors duration-200 group-hover:text-accent"
          >
            {piece.title}
          </Text>
          <Text scale="body" tone="muted" as="p" className="line-clamp-2">
            {piece.dek}
          </Text>
          <Text scale="caption" tone="muted" as="span" className="pt-1">
            {piece.byline}
          </Text>
        </Stack>
      </Link>
    </motion.div>
  );
}
