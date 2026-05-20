/**
 * @cq/tokens — Carrying Quota design token source of truth.
 *
 * ONE structured TS source. The build pipeline (`scripts/build.mjs`) emits
 * THREE artifacts from it:
 *   - dist/tokens.css  — CSS custom properties (`--cq-*`)
 *   - dist/theme.css   — a Tailwind v4 `@theme` block
 *   - dist/index.{js,d.ts} — these typed exports, compiled
 *
 * The 8 token categories the platform contract requires:
 *   spacing · type-scale · color · radius · shadow · motion · breakpoint · z-index
 *
 * Color values are reverse-derived byte-for-byte from src/styles/globals.css
 * — the build never alters a palette value (Constraint 1 / check T3).
 */

export { spacing, spacingScale, type SpacingToken } from "./spacing.js";

export {
  typeScale,
  typeScaleOrder,
  lineHeight,
  tracking,
  fontWeight,
  fontFamily,
  type TypeScaleToken,
  type LineHeightToken,
  type TrackingToken,
  type FontWeightToken,
  type FontFamilyToken,
} from "./type-scale.js";

export {
  color,
  colorOrder,
  colorThemeName,
  type ColorToken,
  type ColorToken_Name,
} from "./color.js";

export { radius, radiusOrder, type RadiusToken } from "./radius.js";

export { shadow, shadowOrder, type ShadowToken } from "./shadow.js";

export {
  motion,
  duration,
  durationOrder,
  easing,
  easingOrder,
  easingCss,
  type DurationToken,
  type EasingToken,
} from "./motion.js";

export {
  breakpoint,
  breakpointOrder,
  type BreakpointToken,
} from "./breakpoint.js";

export { zIndex, zIndexOrder, type ZIndexToken } from "./z-index.js";

/* ── Convenience: the whole token set as one object ──────────────────────── */
import { spacing } from "./spacing.js";
import { typeScale, lineHeight, tracking, fontWeight, fontFamily } from "./type-scale.js";
import { color } from "./color.js";
import { radius } from "./radius.js";
import { shadow } from "./shadow.js";
import { duration, easing } from "./motion.js";
import { breakpoint } from "./breakpoint.js";
import { zIndex } from "./z-index.js";

/** Every token category in one frozen object — handy for tooling + tests. */
export const tokens = {
  spacing,
  typeScale,
  lineHeight,
  tracking,
  fontWeight,
  fontFamily,
  color,
  radius,
  shadow,
  motion: { duration, easing },
  breakpoint,
  zIndex,
} as const;
