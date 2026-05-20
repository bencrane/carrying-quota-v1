import type { ReactNode } from "react";
import { motion } from "motion/react";
import { duration as durationToken, easing } from "@cq/tokens";
import type { DurationToken, UnsafeClassName } from "../lib/props.js";

export interface AppearOnMountProps extends UnsafeClassName {
  /** Vertical offset (px) the element rises from. Defaults to 16. */
  y?: number;
  /** Entrance duration — a motion duration token. */
  speed?: DurationToken;
  /** Stagger delay (seconds) — for sequencing siblings. */
  delay?: number;
  children: ReactNode;
}

/**
 * Entrance-animation wrapper — fades + rises its children on mount, using the
 * token-defined `editorial` easing curve. The token-typed replacement for the
 * ad-hoc `motion.div` entrance wrappers the routes used to hand-roll.
 *
 * Placement rule: this goes INSIDE `Section` (a child of the `<section>`),
 * never around it — so the `main > section` rhythm selector keeps matching.
 */
export function AppearOnMount({
  y = 16,
  speed = "slowest",
  delay = 0,
  children,
  unsafe_className,
}: AppearOnMountProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: durationToken[speed],
        delay,
        ease: easing.editorial,
      }}
      className={unsafe_className}
    >
      {children}
    </motion.div>
  );
}
