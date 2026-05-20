import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/** Tone -> literal palette classes. */
const toneClass = {
  accent: "text-accent",
  muted: "text-muted-foreground",
  default: "text-foreground",
} as const;

export interface EyebrowProps extends UnsafeClassName {
  /** Color tone. Defaults to `accent` — the editorial section-label look. */
  tone?: keyof typeof toneClass;
  /**
   * When `true`, prefixes the signature `↳` editorial mark. Defaults to
   * `true`.
   */
  marker?: boolean;
  children: ReactNode;
}

/**
 * The editorial section label — a small mono, upper-case, wide-tracked kicker
 * (`↳ This week`). The canonical hierarchy cue above a heading or section.
 */
export function Eyebrow({
  tone = "accent",
  marker = true,
  children,
  unsafe_className,
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "font-mono text-2xs uppercase tracking-widest",
        toneClass[tone],
        unsafe_className
      )}
    >
      {marker ? <span aria-hidden="true">↳ </span> : null}
      {children}
    </span>
  );
}
