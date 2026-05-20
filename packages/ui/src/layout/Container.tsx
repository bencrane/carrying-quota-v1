import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/**
 * Content measure widths — literal classes. `Container` is the single owner
 * of horizontal content geometry (`max-width` + side padding); routes and
 * pieces never hand-roll `max-w-*` / `px-*`. The values are named measures,
 * not magic pixel arbitraries.
 */
const widthClass = {
  /** Reading measure — long-form prose (~66ch territory). */
  prose: "max-w-2xl",
  /** Narrow editorial column. */
  narrow: "max-w-3xl",
  /** Default page measure. */
  default: "max-w-6xl",
  /** Wide measure — dashboards / dense grids. */
  wide: "max-w-7xl",
  /** Full available width — no measure cap (still padded). */
  full: "max-w-none",
} as const;

export type ContainerWidth = keyof typeof widthClass;

export interface ContainerProps extends UnsafeClassName {
  /** Content measure. */
  width?: ContainerWidth;
  /** Drop the horizontal padding (a full-bleed child supplies its own). */
  bleed?: boolean;
  children: ReactNode;
}

/**
 * Centered content measure. Owns `max-width` + horizontal page padding so the
 * app shell stays pure chrome and the content surface carries zero raw
 * geometry. The horizontal padding here is intentional and lives ONLY in this
 * primitive.
 */
export function Container({
  width = "default",
  bleed = false,
  children,
  unsafe_className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        widthClass[width],
        bleed ? "px-0" : "px-5 sm:px-8 lg:px-10",
        unsafe_className
      )}
    >
      {children}
    </div>
  );
}
