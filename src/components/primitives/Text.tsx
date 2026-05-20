/**
 * Compatibility adapter — the real `Text` primitive lives in `@cq/ui`. Kept
 * so existing `@/components/primitives/Text` imports resolve and the
 * `design-system.sh` `prims` sub-check (an `export function Text`) stays
 * green.
 *
 * Bridges the prior type-scale vocabulary to `@cq/ui`'s richer scale: the
 * legacy `hero` role maps to `display`; `caption` / `body` / `lede` / `head`
 * carry over 1:1. The legacy `className` prop forwards to `unsafe_className`.
 */
import type { ElementType, ReactNode } from "react";
import { Text as UiText, type TextScale, type TextTone } from "@cq/ui";

type LegacyScale = "caption" | "body" | "lede" | "head" | "hero";

const scaleMap: Record<LegacyScale, TextScale> = {
  caption: "caption",
  body: "body",
  lede: "lede",
  head: "head",
  hero: "display",
};

interface TextProps {
  scale: LegacyScale;
  as?: ElementType;
  tone?: TextTone;
  children: ReactNode;
  /** Legacy escape hatch — forwarded to @cq/ui's `unsafe_className`. */
  className?: string;
}

export function Text({ scale, as, tone, children, className }: TextProps) {
  return (
    <UiText scale={scaleMap[scale]} as={as} tone={tone} unsafe_className={className}>
      {children}
    </UiText>
  );
}
