import type { ReactNode } from "react";
import {
  Section,
  type SectionDivide,
  type SectionGutter,
  type SectionSurface,
} from "../layout/Section.js";
import { Stack } from "../layout/Stack.js";
import { Eyebrow } from "../display/Eyebrow.js";
import type { ContainerWidth } from "../layout/Container.js";
import type { UnsafeClassName } from "../lib/props.js";

export interface PageSectionProps extends UnsafeClassName {
  /** Optional mono label above the section body. */
  eyebrow?: string;
  /** Section surface — drives page rhythm. */
  surface?: SectionSurface;
  /** Top/bottom gutter. */
  gutter?: SectionGutter;
  /** Hairline divide. */
  divide?: SectionDivide;
  /** Inner content measure, or `false` to skip the Container. */
  container?: false | ContainerWidth;
  children: ReactNode;
}

/**
 * A content band within a route. Thin sugar over `Section` that adds an
 * optional `Eyebrow` label and a `Stack` for the body — the common shape a
 * route section takes. Renders `<section>` so it stays a direct child of
 * `<main>` (rhythm selector intact).
 */
export function PageSection({
  eyebrow,
  surface = "primary",
  gutter = "default",
  divide = "bottom",
  container = "default",
  children,
  unsafe_className,
}: PageSectionProps) {
  return (
    <Section
      surface={surface}
      gutter={gutter}
      divide={divide}
      container={container}
      unsafe_className={unsafe_className}
    >
      {eyebrow ? (
        <Stack gap="lg">
          <Eyebrow>{eyebrow}</Eyebrow>
          {children}
        </Stack>
      ) : (
        children
      )}
    </Section>
  );
}
