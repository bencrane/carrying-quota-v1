import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gapClasses, type Gap } from "@/design/tokens";

const justifyClasses: Record<"start" | "center" | "between" | "end", string> = {
  start:   "justify-start",
  center:  "justify-center",
  between: "justify-between",
  end:     "justify-end",
};

const alignClasses: Record<"start" | "center" | "end" | "baseline", string> = {
  start:    "items-start",
  center:   "items-center",
  end:      "items-end",
  baseline: "items-baseline",
};

interface ClusterProps {
  gap?: Gap;
  justify?: "start" | "center" | "between" | "end";
  align?: "start" | "center" | "end" | "baseline";
  wrap?: boolean;
  children: ReactNode;
  className?: string;
}

export function Cluster({
  gap = "md",
  justify,
  align,
  wrap = true,
  children,
  className,
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex",
        wrap && "flex-wrap",
        gapClasses[gap],
        justify && justifyClasses[justify],
        align && alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}
