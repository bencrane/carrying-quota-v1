import type { ReactNode } from "react";
import { Text, type TextTone, type TextWrap } from "./Text.js";
import type { UnsafeClassName } from "../lib/props.js";

/** Heading levels -> the semantic element + the type role they render. */
const levelTag = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

const levelScale = {
  1: "display",
  2: "head",
  3: "subhead",
  4: "subhead",
} as const;

export type HeadingLevel = keyof typeof levelTag;

export interface HeadingProps extends UnsafeClassName {
  /** Heading level — sets both the semantic tag (`h1`–`h4`) and the type role. */
  level: HeadingLevel;
  /** Color tone. */
  tone?: TextTone;
  /** Text-wrap behavior. Defaults to `balance` — headlines read better balanced. */
  wrap?: TextWrap;
  children: ReactNode;
}

/**
 * Semantic heading primitive. `level` drives BOTH the heading element and the
 * matching display/head/subhead type role — so the document outline and the
 * visual hierarchy never drift apart. Built on `Text`.
 */
export function Heading({
  level,
  tone = "default",
  wrap = "balance",
  children,
  unsafe_className,
}: HeadingProps) {
  return (
    <Text
      scale={levelScale[level]}
      as={levelTag[level]}
      tone={tone}
      wrap={wrap}
      unsafe_className={unsafe_className}
    >
      {children}
    </Text>
  );
}
