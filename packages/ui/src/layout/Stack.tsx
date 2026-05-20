import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { gapClass } from "../lib/spacing-classes.js";

/** Cross-axis alignment — literal classes. */
const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

export interface StackProps extends UnsafeClassName {
  /** Vertical gap between children — a spacing token. */
  gap?: SpacingToken;
  /** Cross-axis (horizontal) alignment. */
  align?: keyof typeof alignClass;
  /** Element to render. */
  as?: "div" | "ul" | "ol" | "section" | "article";
  children: ReactNode;
}

/**
 * Vertical flow primitive — a flex column with token-spaced children. The
 * single place vertical inter-element rhythm is expressed; consumers pick a
 * `gap` token, never a raw `space-y-*` / `gap-*` utility.
 */
export function Stack({
  gap = "md",
  align,
  as: Tag = "div",
  children,
  unsafe_className,
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex flex-col",
        gapClass[gap],
        align && alignClass[align],
        unsafe_className
      )}
    >
      {children}
    </Tag>
  );
}
