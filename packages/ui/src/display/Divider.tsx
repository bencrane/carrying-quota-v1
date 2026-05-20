import { cn } from "../lib/cn.js";
import type { SpacingToken, UnsafeClassName } from "../lib/props.js";
import { marginTopClass } from "../lib/spacing-classes.js";

/** Divider treatment. */
const toneClass = {
  /** Solid hairline. */
  hairline: "h-px bg-border",
  /** Hairline that fades to transparent at both ends — editorial break. */
  faded:
    "h-px bg-[linear-gradient(to_right,transparent,hsl(var(--border)),transparent)]",
} as const;

export interface DividerProps extends UnsafeClassName {
  /** Visual treatment. Defaults to `hairline`. */
  tone?: keyof typeof toneClass;
  /** Top margin — a spacing token. */
  spaceAbove?: SpacingToken;
  /** Bottom margin — a spacing token. */
  spaceBelow?: SpacingToken;
}

const marginBottomClass: Record<SpacingToken, string> = {
  none: "mb-0",
  "3xs": "mb-0.5",
  "2xs": "mb-1",
  xs: "mb-2",
  sm: "mb-3",
  md: "mb-4",
  lg: "mb-6",
  xl: "mb-10",
  "2xl": "mb-16",
  "3xl": "mb-24",
  "4xl": "mb-36",
  "5xl": "mb-56",
};

/**
 * A horizontal rule primitive. The `faded` tone reproduces the site's
 * editorial `.rule` break (a hairline that fades to transparent). Vertical
 * breathing room is token-typed via `spaceAbove` / `spaceBelow`.
 *
 * NOTE: the `faded` gradient is the one place the package uses an arbitrary
 * Tailwind value — it is a gradient definition, not content geometry, and it
 * lives inside the primitive (off the content surface). The color still flows
 * from the `--border` token var.
 */
export function Divider({
  tone = "hairline",
  spaceAbove,
  spaceBelow,
  unsafe_className,
}: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        "w-full",
        toneClass[tone],
        spaceAbove && marginTopClass[spaceAbove],
        spaceBelow && marginBottomClass[spaceBelow],
        unsafe_className
      )}
    />
  );
}
