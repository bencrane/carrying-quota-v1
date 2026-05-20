import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";
import { Text } from "../typography/Text.js";

export interface PullQuoteProps extends UnsafeClassName {
  /** The quoted line. */
  children: ReactNode;
  /** Optional attribution beneath the quote. */
  cite?: ReactNode;
}

/**
 * An editorial pull quote — an oversized serif line set off from the prose
 * by an accent rule, with optional attribution. A fixed editorial block; it
 * breaks the reading flow deliberately but stays inside the `Piece`'s
 * token rhythm.
 */
export function PullQuote({ children, cite, unsafe_className }: PullQuoteProps) {
  return (
    <figure
      className={cn(
        "border-l-2 border-accent pl-6 md:pl-8",
        unsafe_className
      )}
    >
      <blockquote>
        <Text scale="subhead" as="p" wrap="pretty">
          {children}
        </Text>
      </blockquote>
      {cite ? (
        <figcaption className="mt-3">
          <Text scale="caption" tone="muted" as="span">
            {cite}
          </Text>
        </figcaption>
      ) : null}
    </figure>
  );
}
