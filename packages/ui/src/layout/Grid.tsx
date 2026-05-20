import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { gapClass } from "../lib/spacing-classes.js";

/** Desktop column count -> literal responsive grid classes. */
const colsClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
} as const;

/** Cross-axis alignment of grid items. */
const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

export type GridCols = keyof typeof colsClass;

export interface GridProps extends UnsafeClassName {
  /** Desktop column count. Steps down responsively. */
  cols?: GridCols;
  /** Gap between cells — a spacing token. */
  gap?: SpacingToken;
  /** Cross-axis alignment of cells. */
  align?: keyof typeof alignClass;
  children: ReactNode;
}

/**
 * Responsive content grid — the only place card/grid column counts live.
 * Consumers pick a `cols` token; raw `grid-cols-*` strings never reach the
 * content surface.
 */
export function Grid({
  cols = 3,
  gap = "lg",
  align,
  children,
  unsafe_className,
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        colsClass[cols],
        gapClass[gap],
        align && alignClass[align],
        unsafe_className
      )}
    >
      {children}
    </div>
  );
}
