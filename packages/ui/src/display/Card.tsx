import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { padClass } from "../lib/spacing-classes.js";

/** Surface -> literal palette class. */
const surfaceClass = {
  card: "bg-card",
  background: "bg-background",
  muted: "bg-muted",
} as const;

/** Border treatment. */
const borderClass = {
  none: "",
  hairline: "border border-border",
} as const;

export interface CardProps extends UnsafeClassName {
  /** Background surface. Defaults to `card`. */
  surface?: keyof typeof surfaceClass;
  /** Border treatment. Defaults to `hairline`. */
  border?: keyof typeof borderClass;
  /** Inner padding — a spacing token. */
  pad?: SpacingToken;
  /**
   * When `true`, applies a subtle hover border-lift — for cards that are
   * links. Defaults to `false`.
   */
  interactive?: boolean;
  children: ReactNode;
}

/**
 * A bounded content surface — the editorial card frame. A hairline-bordered
 * panel with token-typed padding. `interactive` adds a hover affordance for
 * card-as-link usage. Geometry is all tokens; no raw className.
 */
export function Card({
  surface = "card",
  border = "hairline",
  pad = "lg",
  interactive = false,
  children,
  unsafe_className,
}: CardProps) {
  return (
    <div
      className={cn(
        surfaceClass[surface],
        borderClass[border],
        padClass[pad],
        interactive &&
          "transition-colors duration-200 hover:border-foreground/25",
        unsafe_className
      )}
    >
      {children}
    </div>
  );
}
