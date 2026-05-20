import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { gapClass } from "../lib/spacing-classes.js";

/**
 * Main-axis distribution — literal lookup map (Constraint 5: no
 * template-string classes; Tailwind's scanner needs whole class names).
 */
const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
} as const;

/** Cross-axis alignment — literal lookup map. */
const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
} as const;

export interface ClusterProps extends UnsafeClassName {
  /** Gap between children — a spacing token. */
  gap?: SpacingToken;
  /** Main-axis distribution. */
  justify?: keyof typeof justifyClass;
  /** Cross-axis alignment. */
  align?: keyof typeof alignClass;
  /** Whether children wrap onto multiple rows. Defaults to `true`. */
  wrap?: boolean;
  children: ReactNode;
}

/**
 * Horizontal flow primitive — a flex row with token-spaced children. Wrapping
 * by default. `justify` / `align` resolve through literal class maps.
 */
export function Cluster({
  gap = "md",
  justify,
  align,
  wrap = true,
  children,
  unsafe_className,
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex",
        wrap && "flex-wrap",
        gapClass[gap],
        justify && justifyClass[justify],
        align && alignClass[align],
        unsafe_className
      )}
    >
      {children}
    </div>
  );
}
