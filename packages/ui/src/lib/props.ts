/**
 * Shared primitive prop contract.
 *
 * Two hard rules, enforced package-wide:
 *
 *  1. NO untyped `className` passthrough. A primitive never exposes a prop
 *     named `className`. The ONLY caller-facing class-injection point is the
 *     explicit `unsafe_className` prop (`UnsafeClassName` below). Internally a
 *     primitive composes literal class strings via `cn()` — that is fine.
 *
 *  2. Geometry/scale props are TOKEN-TYPED. A spacing prop is typed
 *     `SpacingToken`, not `string`; the compiler rejects an off-scale value
 *     (check P2). The token unions are re-exported here from `@cq/tokens` so
 *     every primitive imports them from one place.
 */

import type {
  SpacingToken,
  TypeScaleToken,
  LineHeightToken,
  TrackingToken,
  FontWeightToken,
  FontFamilyToken,
  RadiusToken,
  ShadowToken,
  ColorToken_Name,
  DurationToken,
  EasingToken,
  BreakpointToken,
  ZIndexToken,
} from "@cq/tokens";

export type {
  SpacingToken,
  TypeScaleToken,
  LineHeightToken,
  TrackingToken,
  FontWeightToken,
  FontFamilyToken,
  RadiusToken,
  ShadowToken,
  ColorToken_Name,
  DurationToken,
  EasingToken,
  BreakpointToken,
  ZIndexToken,
};

/**
 * The escape hatch. A primitive that genuinely needs caller-supplied classes
 * accepts THIS prop — never a bare `className`. The name is deliberately
 * loud: it signals an un-typed, un-checked override and the `no-geometry`
 * ESLint rule excludes lines that use it.
 */
export interface UnsafeClassName {
  /**
   * Escape hatch for caller-supplied utility classes. Untyped and unchecked —
   * use a token-typed prop instead wherever one exists. Merged last via
   * `cn()`, so it wins Tailwind conflicts.
   */
  unsafe_className?: string;
}

/** Polymorphic element-tag prop — restricted to a caller-supplied union. */
export type AsProp<T extends string> = { as?: T };

/** Semantic color-role names a primitive's `tone`/`surface` props accept. */
export type ColorRole = ColorToken_Name;
