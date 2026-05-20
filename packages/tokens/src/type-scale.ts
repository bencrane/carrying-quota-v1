/**
 * Type scale — modular (1.250, major third), reverse-derived from the
 * `--text-*` custom properties in src/styles/globals.css. The rem values
 * here are byte-identical to that locked block; the build pipeline emits
 * them, it does not invent them.
 */
export const typeScale = {
  "2xs": "0.625rem",
  xs: "0.75rem",
  sm: "0.8125rem",
  base: "1rem",
  lg: "1.25rem",
  xl: "1.5625rem",
  "2xl": "1.953rem",
  "3xl": "2.441rem",
  "4xl": "3.052rem",
  "5xl": "3.815rem",
  "6xl": "4.768rem",
  "7xl": "5.96rem",
  "8xl": "7.451rem",
} as const;

export type TypeScaleToken = keyof typeof typeScale;

/** Line-height steps — unitless, paired with the size scale by primitives. */
export const lineHeight = {
  none: "1",
  tight: "1.1",
  snug: "1.25",
  normal: "1.5",
  relaxed: "1.6",
  loose: "1.75",
} as const;

export type LineHeightToken = keyof typeof lineHeight;

/** Letter-spacing (tracking) steps. */
export const tracking = {
  tighter: "-0.035em",
  tight: "-0.02em",
  normal: "0em",
  wide: "0.08em",
  wider: "0.12em",
  widest: "0.15em",
} as const;

export type TrackingToken = keyof typeof tracking;

/** Font-weight steps. */
export const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
} as const;

export type FontWeightToken = keyof typeof fontWeight;

/**
 * Font families — reverse-derived from the `--font-*` declarations in the
 * locked globals.css `@theme inline` block.
 */
export const fontFamily = {
  sans: '"Inter Tight", -apple-system, "Segoe UI", system-ui, sans-serif',
  serif: '"Fraunces", "Iowan Old Style", "Apple Garamond", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;

export type FontFamilyToken = keyof typeof fontFamily;

export const typeScaleOrder: readonly TypeScaleToken[] = [
  "2xs",
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
];
