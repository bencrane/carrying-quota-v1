/**
 * Color tokens — reverse-derived, byte-for-byte, from the `:root` palette in
 * src/styles/globals.css. Each leaf `hsl` field is the raw HSL triplet
 * ("H S% L%") exactly as declared in that locked block, so the build
 * pipeline's emitted artifacts reproduce the palette without altering a
 * single value (Constraint 1 — palette locked; check T3 — palette fidelity).
 *
 * The triplet form lets primitives compose alpha: `hsl(var(--cq-color-…) /
 * <alpha>)`. The `var` field is the CSS custom-property name a primitive
 * references via Tailwind's `--color-*` theme tokens.
 *
 * DO NOT edit a triplet here without editing globals.css in lockstep — and
 * globals.css is byte-locked this cycle, so these values are frozen.
 */

export interface ColorToken {
  /** Raw HSL triplet "H S% L%" — identical to the globals.css :root value. */
  readonly hsl: string;
  /** The globals.css custom-property name this token mirrors. */
  readonly cssVar: string;
}

const t = (hsl: string, cssVar: string): ColorToken => ({ hsl, cssVar });

/**
 * The color scale. Leaf `.hsl` values mirror globals.css `:root` exactly.
 * Grouped by role; the build pipeline flattens this in stable order.
 */
export const color = {
  /* Surfaces — near-black, warmer cream foreground */
  background: t("0 0% 2%", "--background"),
  foreground: t("42 23% 94%", "--foreground"),
  card: t("0 0% 5%", "--card"),
  cardForeground: t("42 23% 94%", "--card-foreground"),
  popover: t("0 0% 5%", "--popover"),
  popoverForeground: t("42 23% 94%", "--popover-foreground"),
  muted: t("0 0% 10%", "--muted"),
  mutedForeground: t("40 8% 51%", "--muted-foreground"),
  subtle: t("0 0% 5%", "--subtle"),
  subtleForeground: t("40 8% 38%", "--subtle-foreground"),

  /* Hairlines */
  border: t("0 0% 10%", "--border"),
  input: t("0 0% 10%", "--input"),
  ring: t("72 100% 61%", "--ring"),

  /* Brand — electric lime, used like a highlighter */
  primary: t("72 100% 61%", "--primary"),
  primaryForeground: t("0 0% 2%", "--primary-foreground"),
  accent: t("72 100% 61%", "--accent"),
  accentForeground: t("0 0% 2%", "--accent-foreground"),
  secondary: t("0 0% 10%", "--secondary"),
  secondaryForeground: t("42 23% 94%", "--secondary-foreground"),

  /* Semantic */
  destructive: t("0 100% 68%", "--destructive"),
  destructiveForeground: t("0 0% 2%", "--destructive-foreground"),
  success: t("72 100% 61%", "--success"),
  warning: t("38 92% 50%", "--warning"),
} as const;

export type ColorToken_Name = keyof typeof color;

/** Stable flatten order for the build pipeline. */
export const colorOrder: readonly ColorToken_Name[] = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "muted",
  "mutedForeground",
  "subtle",
  "subtleForeground",
  "border",
  "input",
  "ring",
  "primary",
  "primaryForeground",
  "accent",
  "accentForeground",
  "secondary",
  "secondaryForeground",
  "destructive",
  "destructiveForeground",
  "success",
  "warning",
];

/**
 * Tailwind `--color-*` theme token name for a color — the name a primitive's
 * class string references (e.g. `bg-background`, `text-foreground`). Kebab.
 */
export const colorThemeName: Record<ColorToken_Name, string> = {
  background: "background",
  foreground: "foreground",
  card: "card",
  cardForeground: "card-foreground",
  popover: "popover",
  popoverForeground: "popover-foreground",
  muted: "muted",
  mutedForeground: "muted-foreground",
  subtle: "subtle",
  subtleForeground: "subtle-foreground",
  border: "border",
  input: "input",
  ring: "ring",
  primary: "primary",
  primaryForeground: "primary-foreground",
  accent: "accent",
  accentForeground: "accent-foreground",
  secondary: "secondary",
  secondaryForeground: "secondary-foreground",
  destructive: "destructive",
  destructiveForeground: "destructive-foreground",
  success: "success",
  warning: "warning",
};
