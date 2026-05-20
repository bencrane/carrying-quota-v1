/**
 * Token-step -> literal Tailwind class maps.
 *
 * Primitives translate a `SpacingToken` prop into a class via these maps.
 * Every value is a WHOLE LITERAL class string — never a template
 * interpolation — so Tailwind v4's content scanner sees the complete class
 * name (Constraint 5). The numeric step each token maps to is fixed by the
 * spacing scale in `@cq/tokens` (spacing.ts); they are kept in lockstep here.
 *
 * Scale -> rem (from @cq/tokens spacing.ts):
 *   none 0 · 3xs .125 · 2xs .25 · xs .5 · sm .75 · md 1 · lg 1.5 · xl 2.5
 *   2xl 4 · 3xl 6 · 4xl 9 · 5xl 14
 */

import type { SpacingToken } from "@cq/tokens";

/** `gap-*` for flex/grid containers. */
export const gapClass: Record<SpacingToken, string> = {
  none: "gap-0",
  "3xs": "gap-0.5",
  "2xs": "gap-1",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
  "2xl": "gap-16",
  "3xl": "gap-24",
  "4xl": "gap-36",
  "5xl": "gap-56",
};

/** Vertical padding (`py-*`). */
export const padYClass: Record<SpacingToken, string> = {
  none: "py-0",
  "3xs": "py-0.5",
  "2xs": "py-1",
  xs: "py-2",
  sm: "py-3",
  md: "py-4",
  lg: "py-6",
  xl: "py-10",
  "2xl": "py-16",
  "3xl": "py-24",
  "4xl": "py-36",
  "5xl": "py-56",
};

/** Horizontal padding (`px-*`). */
export const padXClass: Record<SpacingToken, string> = {
  none: "px-0",
  "3xs": "px-0.5",
  "2xs": "px-1",
  xs: "px-2",
  sm: "px-3",
  md: "px-4",
  lg: "px-6",
  xl: "px-10",
  "2xl": "px-16",
  "3xl": "px-24",
  "4xl": "px-36",
  "5xl": "px-56",
};

/** All-sides padding (`p-*`). */
export const padClass: Record<SpacingToken, string> = {
  none: "p-0",
  "3xs": "p-0.5",
  "2xs": "p-1",
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-10",
  "2xl": "p-16",
  "3xl": "p-24",
  "4xl": "p-36",
  "5xl": "p-56",
};

/** Top margin (`mt-*`) — used by editorial flow primitives. */
export const marginTopClass: Record<SpacingToken, string> = {
  none: "mt-0",
  "3xs": "mt-0.5",
  "2xs": "mt-1",
  xs: "mt-2",
  sm: "mt-3",
  md: "mt-4",
  lg: "mt-6",
  xl: "mt-10",
  "2xl": "mt-16",
  "3xl": "mt-24",
  "4xl": "mt-36",
  "5xl": "mt-56",
};
