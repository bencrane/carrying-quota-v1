/**
 * Compatibility adapter — the real `Container` lives in `@cq/ui`. Kept so
 * existing `@/components/primitives/Container` imports resolve and the
 * `design-system.sh` `prims` sub-check (an `export function Container`) stays
 * green. Bridges the legacy `className` prop to `@cq/ui`'s `unsafe_className`.
 */
import type { ReactNode } from "react";
import { Container as UiContainer, type ContainerWidth } from "@cq/ui";

interface ContainerProps {
  width?: ContainerWidth;
  children: ReactNode;
  /** Legacy escape hatch — forwarded to @cq/ui's `unsafe_className`. */
  className?: string;
}

export function Container({ width, children, className }: ContainerProps) {
  return (
    <UiContainer width={width} unsafe_className={className}>
      {children}
    </UiContainer>
  );
}
