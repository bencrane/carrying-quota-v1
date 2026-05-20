import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, RadiusToken, ColorToken_Name, UnsafeClassName } from "../lib/props.js";
import { padClass, padXClass, padYClass } from "../lib/spacing-classes.js";

/** Surface backgrounds — literal classes off the locked palette. */
const surfaceClass: Partial<Record<ColorToken_Name, string>> = {
  background: "bg-background",
  card: "bg-card",
  muted: "bg-muted",
  subtle: "bg-subtle",
};

/** Radius steps — literal classes (Carrying Quota is sharp; all map to 0). */
const radiusClass: Record<RadiusToken, string> = {
  none: "rounded-none",
  sm: "rounded-none",
  md: "rounded-none",
  lg: "rounded-none",
  xl: "rounded-none",
  full: "rounded-full",
};

/** Hairline borders. */
const borderClass = {
  none: "",
  all: "border border-border",
  top: "border-t border-border",
  bottom: "border-b border-border",
  y: "border-y border-border",
} as const;

export interface BoxProps extends UnsafeClassName {
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  /** Background surface — a palette role, not a raw color. */
  surface?: keyof typeof surfaceClass;
  /** All-sides padding — a spacing token. */
  pad?: SpacingToken;
  /** Horizontal padding — a spacing token (overrides `pad` on the x axis). */
  padX?: SpacingToken;
  /** Vertical padding — a spacing token (overrides `pad` on the y axis). */
  padY?: SpacingToken;
  /** Corner radius — a radius token. */
  radius?: RadiusToken;
  /** Hairline border placement. */
  border?: keyof typeof borderClass;
  children?: ReactNode;
}

/**
 * The base layout primitive: a single styled element. Every geometry input is
 * a token (`pad`, `radius`) or a palette role (`surface`) — there is no raw
 * `className`. `Box` is what the other layout primitives and most display
 * primitives build on.
 */
export function Box({
  as: Tag = "div",
  surface,
  pad,
  padX,
  padY,
  radius,
  border = "none",
  children,
  unsafe_className,
}: BoxProps) {
  return (
    <Tag
      className={cn(
        surface && surfaceClass[surface],
        pad && padClass[pad],
        padX && padXClass[padX],
        padY && padYClass[padY],
        radius && radiusClass[radius],
        borderClass[border],
        unsafe_className
      )}
    >
      {children}
    </Tag>
  );
}
