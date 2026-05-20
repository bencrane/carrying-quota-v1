import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { gapClass } from "../lib/spacing-classes.js";
import { Text } from "../typography/Text.js";

export interface ProseProps extends UnsafeClassName {
  /**
   * Body paragraphs. If `paragraphs` is given, each string renders as a
   * token-styled `<p>`; otherwise `children` is rendered verbatim (for rich
   * inline composition).
   */
  paragraphs?: readonly string[];
  /** Inter-paragraph gap — a spacing token. */
  gap?: SpacingToken;
  children?: ReactNode;
}

/**
 * A long-form body block — token-styled paragraphs at the reading type role,
 * spaced by a single `gap` token. The prose layer of the editorial system:
 * paragraphs flow here, they never hand-roll their own `<p>` geometry.
 *
 * Measure (line length) is owned by the enclosing `Piece` — `Prose` only
 * owns paragraph styling + inter-paragraph rhythm.
 */
export function Prose({
  paragraphs,
  gap = "md",
  children,
  unsafe_className,
}: ProseProps) {
  return (
    <div className={cn("flex flex-col", gapClass[gap], unsafe_className)}>
      {paragraphs
        ? paragraphs.map((para, i) => (
            <Text key={i} scale="body" wrap="pretty">
              {para}
            </Text>
          ))
        : children}
    </div>
  );
}
