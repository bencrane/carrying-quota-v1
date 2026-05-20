/**
 * Compatibility adapter. The real `Section` primitive now lives in the
 * extracted `@cq/ui` package (Layer 1 of the platform foundation).
 *
 * This file remains so:
 *   - existing imports of `@/components/primitives/Section` keep resolving;
 *   - the prior `design-system.sh` benchmark's `prims` + `adopt` sub-checks
 *     (which key on this path + an `export function Section`) stay green.
 *
 * It also bridges the prior `variant` prop name to `@cq/ui`'s `surface`, so
 * legacy consumers compile unchanged. New code imports `Section` from
 * `@cq/ui` directly.
 */
import type { ReactNode } from "react";
import { Section as UiSection, type SectionGutter, type SectionDivide } from "@cq/ui";

type LegacySurface = "primary" | "elevated" | "subtle";
type LegacyContainer = false | "narrow" | "default" | "wide";

export interface SectionProps {
  /** Legacy alias for `surface`. */
  variant?: LegacySurface;
  /** Background surface. */
  surface?: LegacySurface;
  gutter?: SectionGutter;
  divide?: SectionDivide;
  container?: LegacyContainer;
  children: ReactNode;
  /** Forwarded data-* attributes (e.g. data-testid, data-page-root). */
  [dataAttr: `data-${string}`]: unknown;
}

export function Section({
  variant,
  surface,
  gutter,
  divide,
  container,
  children,
  ...rest
}: SectionProps) {
  return (
    <UiSection
      surface={surface ?? variant}
      gutter={gutter}
      divide={divide}
      container={container}
      {...rest}
    >
      {children}
    </UiSection>
  );
}
