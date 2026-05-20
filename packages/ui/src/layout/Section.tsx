import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";
import { Container, type ContainerWidth } from "./Container.js";

/**
 * Surface variants — literal background classes off the locked palette. The
 * homepage rhythm (alternating surfaces) is expressed by alternating these;
 * design-system.sh's `rhythm` sub-check counts distinct `main > section`
 * background colors.
 */
const surfaceClass = {
  primary: "bg-background",
  elevated: "bg-card",
  subtle: "bg-muted",
} as const;

/**
 * Vertical gutters — section-level top/bottom padding. Literal classes; the
 * spacing rhythm of the page lives here, not in raw `py-*` on routes.
 */
const gutterClass = {
  compact: "py-8 md:py-12",
  default: "py-12 md:py-20",
  spacious: "py-16 md:py-28",
} as const;

/** Hairline divides between sections. */
const divideClass = {
  none: "",
  top: "border-t border-border",
  bottom: "border-b border-border",
  both: "border-y border-border",
} as const;

export type SectionSurface = keyof typeof surfaceClass;
export type SectionGutter = keyof typeof gutterClass;
export type SectionDivide = keyof typeof divideClass;

export interface SectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "className" | "color">,
    UnsafeClassName {
  /** Background surface — drives the page's vertical rhythm. */
  surface?: SectionSurface;
  /** Top/bottom gutter — a named rhythm step. */
  gutter?: SectionGutter;
  /** Hairline divide placement. */
  divide?: SectionDivide;
  /** Inner content measure, or `false` to skip the Container entirely. */
  container?: false | ContainerWidth;
  children: ReactNode;
}

/**
 * The page band primitive. Renders `<section>` as its OWN outermost element —
 * never wrapped — so it stays a direct child of `<main>` and the
 * `main > section` rhythm selector keeps matching (Constraint 4/5).
 *
 * Motion-wrapper rule: any `motion.*` entrance wrapper goes INSIDE `Section`
 * (as a child of the rendered `<section>`), never around it.
 *
 * `...rest` forwards `data-*` attributes (e.g. `data-testid="hero"`); the
 * `className` prop is intentionally omitted from the spread — caller classes
 * go through `unsafe_className`.
 */
export function Section({
  surface = "primary",
  gutter = "default",
  divide = "bottom",
  container = "default",
  children,
  unsafe_className,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={cn(
        surfaceClass[surface],
        gutterClass[gutter],
        divideClass[divide],
        unsafe_className
      )}
    >
      {container === false ? (
        children
      ) : (
        <Container width={container}>{children}</Container>
      )}
    </section>
  );
}
