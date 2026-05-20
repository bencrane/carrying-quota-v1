/**
 * Compatibility adapter — the real `Cluster` lives in `@cq/ui`. Kept so
 * existing `@/components/primitives/Cluster` imports resolve and the
 * `design-system.sh` `prims` sub-check (an `export function Cluster`) stays
 * green. Bridges the legacy `className` prop to `@cq/ui`'s `unsafe_className`.
 */
import type { ReactNode } from "react";
import { Cluster as UiCluster, type ClusterProps as UiClusterProps } from "@cq/ui";

interface ClusterProps {
  gap?: UiClusterProps["gap"];
  justify?: UiClusterProps["justify"];
  align?: UiClusterProps["align"];
  wrap?: boolean;
  children: ReactNode;
  /** Legacy escape hatch — forwarded to @cq/ui's `unsafe_className`. */
  className?: string;
}

export function Cluster({ gap, justify, align, wrap, children, className }: ClusterProps) {
  return (
    <UiCluster
      gap={gap}
      justify={justify}
      align={align}
      wrap={wrap}
      unsafe_className={className}
    >
      {children}
    </UiCluster>
  );
}
