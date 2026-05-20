import type { ReactNode } from "react";
import { Section, type SectionGutter, type SectionSurface } from "../layout/Section.js";
import { Stack } from "../layout/Stack.js";
import { Heading, type HeadingLevel } from "../typography/Heading.js";
import { Text } from "../typography/Text.js";
import { Eyebrow } from "../display/Eyebrow.js";
import { AppearOnMount } from "../motion/AppearOnMount.js";
import type { UnsafeClassName } from "../lib/props.js";

export interface PageHeaderProps extends UnsafeClassName {
  /** Small mono section label above the title. */
  eyebrow?: string;
  /** The page title. */
  title: ReactNode;
  /** Heading level for the title. Defaults to 1. */
  level?: HeadingLevel;
  /** Optional standfirst / dek paragraph below the title. */
  dek?: ReactNode;
  /** Section surface. */
  surface?: SectionSurface;
  /** Section gutter. */
  gutter?: SectionGutter;
  /** Content measure passed to the inner Container. */
  container?: "prose" | "narrow" | "default" | "wide";
}

/**
 * The standard route header band — eyebrow + title + dek, inside a `Section`.
 * Renders a `<section>` so it can sit directly under `<main>`. The entrance
 * animation lives INSIDE the section (motion-wrapper rule).
 */
export function PageHeader({
  eyebrow,
  title,
  level = 1,
  dek,
  surface = "primary",
  gutter = "spacious",
  container = "default",
  unsafe_className,
}: PageHeaderProps) {
  return (
    <Section
      surface={surface}
      gutter={gutter}
      divide="bottom"
      container={container}
      unsafe_className={unsafe_className}
    >
      <AppearOnMount>
        <Stack gap="md">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <Heading level={level}>{title}</Heading>
          {dek ? (
            <Text scale="lede" tone="muted">
              {dek}
            </Text>
          ) : null}
        </Stack>
      </AppearOnMount>
    </Section>
  );
}
