import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import {
  surfaceClasses,
  gutterClasses,
  divideClasses,
  type SurfaceVariant,
  type RhythmGutter,
  type SectionDivide,
} from "@/design/tokens";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SurfaceVariant;
  gutter?: RhythmGutter;
  divide?: SectionDivide;
  container?: false | "narrow" | "default" | "wide";
  children: ReactNode;
}

export function Section({
  variant = "primary",
  gutter = "default",
  divide = "bottom",
  container = "default",
  children,
  className,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={cn(
        surfaceClasses[variant],
        gutterClasses[gutter],
        divideClasses[divide],
        className
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
