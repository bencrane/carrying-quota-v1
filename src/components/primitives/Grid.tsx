import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type Gap, gapClasses } from "@/design/tokens";

type GridCols = 2 | 3 | 4;

const colClasses: Record<GridCols, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

interface GridProps {
  /** Desktop column count. Steps down to 2 on tablet, 1 on mobile. */
  cols?: GridCols;
  gap?: Gap;
  children: ReactNode;
  className?: string;
}

/**
 * Responsive content grid. The only place card/grid column counts live —
 * consumers pick a `cols` token, not a raw `grid-cols-*` string.
 */
export function Grid({ cols = 3, gap = "lg", children, className }: GridProps) {
  return (
    <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
