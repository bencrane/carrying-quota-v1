/**
 * Compatibility adapter — the real `Grid` primitive lives in `@cq/ui`. Kept
 * so the existing `@/components/primitives/Grid` import in LatestGrid keeps
 * resolving. Bridges the legacy `className` prop to `unsafe_className`.
 */
import type { ReactNode } from "react";
import { Grid as UiGrid, type GridCols, type GridProps as UiGridProps } from "@cq/ui";

interface GridProps {
  cols?: GridCols;
  gap?: UiGridProps["gap"];
  children: ReactNode;
  /** Legacy escape hatch — forwarded to @cq/ui's `unsafe_className`. */
  className?: string;
}

export function Grid({ cols, gap, children, className }: GridProps) {
  return (
    <UiGrid cols={cols} gap={gap} unsafe_className={className}>
      {children}
    </UiGrid>
  );
}
