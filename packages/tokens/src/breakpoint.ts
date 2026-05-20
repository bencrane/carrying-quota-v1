/**
 * Breakpoint tokens. Tailwind v4's default screen scale, surfaced as typed
 * data so the token build can re-emit it into the Tailwind theme and so
 * primitives can reference a named breakpoint rather than a magic px value.
 */
export const breakpoint = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type BreakpointToken = keyof typeof breakpoint;

export const breakpointOrder: readonly BreakpointToken[] = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
];
