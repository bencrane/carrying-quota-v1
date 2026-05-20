/**
 * Spacing scale — the single source of vertical/horizontal rhythm.
 *
 * A geometric-ish progression in rem. Primitives expose spacing props typed
 * to `SpacingToken`; the compiler rejects any off-scale value. Tailwind's own
 * numeric spacing utilities (`gap-6`, `px-10`, …) are NOT used on the content
 * surface — geometry flows through these named steps.
 */
export const spacing = {
  none: "0rem",
  "3xs": "0.125rem",
  "2xs": "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2.5rem",
  "2xl": "4rem",
  "3xl": "6rem",
  "4xl": "9rem",
  "5xl": "14rem",
} as const;

export type SpacingToken = keyof typeof spacing;

/** Ordered scale steps — used by the build pipeline for stable key order. */
export const spacingScale: readonly SpacingToken[] = [
  "none",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
];
