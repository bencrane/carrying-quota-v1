/**
 * Motion tokens — durations + easing curves. The easing curves are
 * reverse-derived from the `--ease-*` declarations in the locked
 * globals.css `@theme inline` block; `editorial` is the signature curve the
 * existing Framer Motion entrance animations already use
 * (`[0.16, 1, 0.3, 1]`).
 *
 * The motion category satisfies the token-source contract's "motion
 * (duration + easing)" requirement: `motion.duration` + `motion.easing`.
 */

/** Transition / animation durations, in seconds (Framer-Motion friendly). */
export const duration = {
  instant: 0,
  fast: 0.15,
  base: 0.2,
  slow: 0.5,
  slower: 0.7,
  slowest: 0.9,
} as const;

export type DurationToken = keyof typeof duration;

/**
 * Easing curves. `editorial` matches the cubic-bezier the site's motion
 * wrappers use; `outExpo` matches `--ease-out-expo`. The 4-tuple form is
 * what Framer Motion's `ease` prop consumes directly.
 */
export const easing = {
  editorial: [0.16, 1, 0.3, 1],
  outExpo: [0.19, 1, 0.22, 1],
  bar: [0.2, 0.7, 0, 1],
  linear: [0, 0, 1, 1],
} as const;

export type EasingToken = keyof typeof easing;

/** CSS `cubic-bezier(...)` string form of each easing curve. */
export const easingCss: Record<EasingToken, string> = {
  editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
  outExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
  bar: "cubic-bezier(0.2, 0.7, 0, 1)",
  linear: "cubic-bezier(0, 0, 1, 1)",
};

/** The grouped motion token namespace. */
export const motion = {
  duration,
  easing,
  easingCss,
} as const;

export const durationOrder: readonly DurationToken[] = [
  "instant",
  "fast",
  "base",
  "slow",
  "slower",
  "slowest",
];

export const easingOrder: readonly EasingToken[] = [
  "editorial",
  "outExpo",
  "bar",
  "linear",
];
