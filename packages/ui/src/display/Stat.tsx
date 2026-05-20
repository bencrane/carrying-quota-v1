import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";
import { Text } from "../typography/Text.js";

/** Trend direction -> mark + palette class. */
const trendClass = {
  up: { mark: "▲", cls: "text-accent" },
  down: { mark: "▼", cls: "text-destructive" },
  flat: { mark: "■", cls: "text-muted-foreground" },
} as const;

export type StatTrend = keyof typeof trendClass;

/** Display size of the headline value. */
const valueScale = {
  md: "subhead",
  lg: "head",
  xl: "display",
} as const;

export interface StatProps extends UnsafeClassName {
  /** The headline figure (e.g. "63%", "$445K"). */
  value: ReactNode;
  /** Label beneath the value. */
  label: ReactNode;
  /** Optional change figure (e.g. "8pp YoY"). */
  delta?: ReactNode;
  /** Trend direction — drives the delta's mark + color. */
  trend?: StatTrend;
  /** Headline size. Defaults to `lg`. */
  size?: keyof typeof valueScale;
}

/**
 * A single data-point display — a big figure, a label, and an optional
 * signed delta. The editorial unit for "the number" in an index tile or a
 * piece's stat callout. Trend color is semantic (token-driven), never raw.
 */
export function Stat({
  value,
  label,
  delta,
  trend = "flat",
  size = "lg",
  unsafe_className,
}: StatProps) {
  const t = trendClass[trend];
  return (
    <div className={cn("flex flex-col gap-2", unsafe_className)}>
      <div className="flex items-baseline gap-3">
        <Text scale={valueScale[size]} as="span">
          {value}
        </Text>
        {delta ? (
          <span
            className={cn(
              "font-mono text-2xs uppercase tracking-wider tabular-nums",
              t.cls
            )}
          >
            <span aria-hidden="true">{t.mark} </span>
            {delta}
          </span>
        ) : null}
      </div>
      <Text scale="caption" tone="muted" as="span">
        {label}
      </Text>
    </div>
  );
}
