/**
 * Radius scale. Carrying Quota is a sharp, editorial system — `--radius: 0`
 * in the locked globals.css, and the `--radius-{sm,md,lg,xl}` theme tokens
 * all resolve to it. These steps mirror that: every value is `0` today, but
 * the scale exists as a typed surface so a future softening is a one-line
 * token change rather than a codebase-wide find/replace.
 */
export const radius = {
  none: "0",
  sm: "0",
  md: "0",
  lg: "0",
  xl: "0",
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;

export const radiusOrder: readonly RadiusToken[] = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "full",
];
