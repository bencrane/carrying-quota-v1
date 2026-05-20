/**
 * Compatibility adapter — the real `Stack` lives in `@cq/ui`. Kept so
 * existing `@/components/primitives/Stack` imports resolve and the
 * `design-system.sh` `prims` sub-check (an `export function Stack`) stays
 * green. Bridges the legacy `className` prop to `@cq/ui`'s `unsafe_className`.
 */
import type { ReactNode } from "react";
import { Stack as UiStack, type StackProps as UiStackProps } from "@cq/ui";

interface StackProps {
  gap?: UiStackProps["gap"];
  as?: "div" | "ul" | "ol";
  align?: UiStackProps["align"];
  children: ReactNode;
  /** Legacy escape hatch — forwarded to @cq/ui's `unsafe_className`. */
  className?: string;
}

export function Stack({ gap, as, align, children, className }: StackProps) {
  return (
    <UiStack gap={gap} as={as} align={align} unsafe_className={className}>
      {children}
    </UiStack>
  );
}
