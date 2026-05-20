import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";
import { Text } from "../typography/Text.js";

/**
 * Figure width modes. The figure's horizontal extent is a TOKEN choice, not a
 * raw width. `inset` and `measure` stay within the piece's reading column;
 * `bleed` breaks out to the full viewport for a wide data figure — but it
 * does so through this primitive, so the prose around it never hand-rolls a
 * negative margin.
 */
const widthClass = {
  /** Slightly inset from the reading measure — a quiet, contained figure. */
  inset: "mx-auto max-w-xl",
  /** The full reading measure of the piece. */
  measure: "w-full",
  /** Breaks out wider than the measure (a roomy data figure). */
  wide: "w-full lg:-mx-16 lg:w-[calc(100%+8rem)]",
} as const;

export type FigureWidth = keyof typeof widthClass;

export interface FigureProps extends UnsafeClassName {
  /** Width mode — a token, not a raw width. Defaults to `measure`. */
  width?: FigureWidth;
  /** The figure caption — rendered as a `<figcaption>`. */
  caption?: ReactNode;
  /** Optional source / credit line beneath the caption. */
  source?: ReactNode;
  /** The embedded media — an image OR an interactive data figure. */
  children: ReactNode;
}

/**
 * The data-viz / image embed wrapper. ANY embedded media in an editorial
 * piece goes through `Figure`. It owns the figure's framing, caption, and
 * width mode.
 *
 * The contract `Figure` enforces:
 *   - a figure embedded via `Figure` CANNOT break the piece's vertical
 *     rhythm — the `Piece`'s `rhythm` gap spaces it like any other block;
 *   - the prose around it CANNOT hand-roll geometry around it — the width
 *     break-out is a token mode here, not a route-level negative margin.
 *
 * Tags its root with `data-figure` (the D3 contract hook).
 */
export function Figure({
  width = "measure",
  caption,
  source,
  children,
  unsafe_className,
}: FigureProps) {
  return (
    <figure data-figure="" className={cn(widthClass[width], unsafe_className)}>
      {children}
      {caption || source ? (
        <figcaption className="mt-3 flex flex-col gap-1">
          {caption ? (
            <Text scale="caption" tone="muted" as="span">
              {caption}
            </Text>
          ) : null}
          {source ? (
            <Text scale="label" tone="muted" as="span">
              {source}
            </Text>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
