import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { Container, type ContainerWidth } from "../layout/Container.js";
import { gapClass } from "../lib/spacing-classes.js";

export interface PieceProps extends UnsafeClassName {
  /**
   * Reading measure for the piece body. Defaults to `prose` — the long-form
   * reading column. A figure can opt into a wider measure via `Figure`'s
   * `width` mode without the piece itself widening.
   */
  measure?: ContainerWidth;
  /**
   * Vertical rhythm between editorial blocks (paragraphs, figures, quotes).
   * A spacing token — the single knob for inter-block spacing in a piece.
   */
  rhythm?: SpacingToken;
  children: ReactNode;
}

/**
 * The editorial container — the unit of enforcement for a long-form piece,
 * the analogue of `Page` for a route. It owns:
 *   - the reading measure (line length) via `Container`
 *   - the vertical rhythm between editorial blocks
 *
 * A `Figure` embedded inside a `Piece` CANNOT break this rhythm, and the
 * prose around it CANNOT hand-roll geometry — every block flows through the
 * `Piece`'s token-spaced column.
 *
 * Tags its root with `data-piece-root` (the D3 contract hook).
 */
export function Piece({
  measure = "prose",
  rhythm = "xl",
  children,
  unsafe_className,
}: PieceProps) {
  return (
    <article data-piece-root="" className={cn(unsafe_className)}>
      <Container width={measure}>
        <div className={cn("flex flex-col", gapClass[rhythm])}>{children}</div>
      </Container>
    </article>
  );
}
