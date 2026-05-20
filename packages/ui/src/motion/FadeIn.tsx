import type { ReactNode } from "react";
import { motion } from "motion/react";
import { duration as durationToken, easing } from "@cq/tokens";
import type { DurationToken, UnsafeClassName } from "../lib/props.js";

export interface FadeInProps extends UnsafeClassName {
  /** Entrance duration — a motion duration token. */
  speed?: DurationToken;
  /** Delay (seconds) before the fade begins. */
  delay?: number;
  /**
   * When `true`, the fade triggers as the element scrolls into view (once),
   * instead of on mount. Used for below-the-fold editorial blocks.
   */
  whenInView?: boolean;
  children: ReactNode;
}

/**
 * Opacity-only entrance wrapper — a softer companion to `AppearOnMount` (no
 * vertical motion). Token-typed duration + the `editorial` easing curve.
 * `whenInView` defers the fade to a scroll-into-view trigger.
 *
 * Placement rule: goes INSIDE `Section`, never around it.
 */
export function FadeIn({
  speed = "slower",
  delay = 0,
  whenInView = false,
  children,
  unsafe_className,
}: FadeInProps) {
  const transition = {
    duration: durationToken[speed],
    delay,
    ease: easing.editorial,
  };
  if (whenInView) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={transition}
        className={unsafe_className}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className={unsafe_className}
    >
      {children}
    </motion.div>
  );
}
