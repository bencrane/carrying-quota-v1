import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/** Badge variants — literal palette classes. */
const variantClass = {
  /** Outline hairline badge — the default editorial chip. */
  outline: "border border-border text-muted-foreground",
  /** Accent-filled badge — used sparingly, like a highlighter. */
  accent: "bg-accent text-accent-foreground",
  /** Solid foreground-on-card badge. */
  solid: "bg-card text-foreground border border-border",
  /** Destructive / negative-signal badge. */
  destructive: "border border-border text-destructive",
} as const;

export type BadgeVariant = keyof typeof variantClass;

export interface BadgeProps extends UnsafeClassName {
  /** Visual variant. */
  variant?: BadgeVariant;
  children: ReactNode;
}

/**
 * A small inline status / category chip. Mono, upper-case, wide-tracked —
 * consistent with the editorial label system. All color flows from the
 * palette; there is no raw color prop.
 */
export function Badge({ variant = "outline", children, unsafe_className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-2xs uppercase tracking-wider",
        variantClass[variant],
        unsafe_className
      )}
    >
      {children}
    </span>
  );
}
