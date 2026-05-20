import type { ReactNode } from "react";
import { Stack } from "../layout/Stack.js";
import { Cluster } from "../layout/Cluster.js";
import { Heading } from "../typography/Heading.js";
import { Text } from "../typography/Text.js";
import { Eyebrow } from "../display/Eyebrow.js";
import type { UnsafeClassName } from "../lib/props.js";

export interface PieceHeaderProps extends UnsafeClassName {
  /** Category / section label (e.g. "The Index · Compensation"). */
  category?: string;
  /** Publication date string. */
  date?: string;
  /** The piece headline. */
  headline: ReactNode;
  /** The standfirst / dek. */
  dek?: ReactNode;
  /** Byline (e.g. "CQ Research Desk"). */
  byline?: string;
  /** Read-time string (e.g. "8 min read"). */
  readTime?: string;
}

/**
 * The masthead block of an editorial piece — category + date, headline, dek,
 * and a byline line. A composed editorial primitive: it owns the header's
 * internal rhythm so a piece never hand-rolls its title geometry.
 */
export function PieceHeader({
  category,
  date,
  headline,
  dek,
  byline,
  readTime,
  unsafe_className,
}: PieceHeaderProps) {
  return (
    <header>
      <Stack gap="md" unsafe_className={unsafe_className}>
        {category || date ? (
          <Cluster gap="sm" align="baseline">
            {category ? <Eyebrow>{category}</Eyebrow> : null}
            {date ? (
              <Text scale="caption" tone="muted" as="span">
                {date}
              </Text>
            ) : null}
          </Cluster>
        ) : null}

        <Heading level={1}>{headline}</Heading>

        {dek ? (
          <Text scale="lede" tone="muted">
            {dek}
          </Text>
        ) : null}

        {byline || readTime ? (
          <Cluster gap="sm" align="baseline">
            {byline ? (
              <Text scale="caption" as="span">
                {byline}
              </Text>
            ) : null}
            {readTime ? (
              <Text scale="caption" tone="muted" as="span">
                {readTime}
              </Text>
            ) : null}
          </Cluster>
        ) : null}
      </Stack>
    </header>
  );
}
