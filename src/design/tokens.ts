export type SurfaceVariant = "primary" | "elevated" | "subtle";
export type RhythmGutter  = "compact" | "default" | "spacious";
export type SectionDivide = "none" | "top" | "bottom" | "both";
export type TypeScale     = "caption" | "body" | "lede" | "head" | "hero";
export type Gap           = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const surfaceClasses: Record<SurfaceVariant, string> = {
  primary:  "bg-background",
  elevated: "bg-card",
  subtle:   "bg-muted",
};
export const gutterClasses: Record<RhythmGutter, string> = {
  compact:  "py-8 md:py-12",
  default:  "py-12 md:py-20",
  spacious: "py-16 md:py-28",
};
export const divideClasses: Record<SectionDivide, string> = {
  none: "", top: "border-t border-border",
  bottom: "border-b border-border", both: "border-y border-border",
};
export const typeClasses: Record<TypeScale, string> = {
  caption: "font-mono text-[10px] uppercase tracking-[0.15em]",
  body:    "font-sans text-[15px] leading-[1.6]",
  lede:    "font-serif text-[18px] leading-[1.5] md:text-[20px]",
  head:    "font-serif text-[28px] leading-[1.1] tracking-[-0.02em] md:text-[40px]",
  hero:    "font-serif font-light text-[clamp(48px,6vw,96px)] leading-[1.0] tracking-[-0.035em]",
};
export const gapClasses: Record<Gap, string> = {
  none: "gap-0", xs: "gap-2", sm: "gap-3", md: "gap-6",
  lg: "gap-10", xl: "gap-16", "2xl": "gap-24",
};
