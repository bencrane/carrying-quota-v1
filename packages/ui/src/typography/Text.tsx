import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/**
 * Editorial type roles. Each role is a fixed bundle of family + size +
 * leading + tracking — literal Tailwind classes that resolve against the
 * type scale defined in the locked globals.css `@theme inline` block
 * (`--text-*`) and `@cq/tokens`.
 *
 * Roles, not raw sizes: a consumer picks `scale="lede"`, never a
 * `text-[20px]` arbitrary. This is what keeps the type system one scale.
 */
const roleClass = {
  /** Mono micro-label — eyebrows, metadata, captions. */
  caption: "font-mono text-2xs uppercase tracking-widest leading-normal",
  /** Mono small label — slightly larger metadata. */
  label: "font-mono text-xs uppercase tracking-wider leading-normal",
  /** Sans body — UI / supporting copy. */
  body: "font-sans text-base leading-relaxed",
  /** Small sans body. */
  bodySm: "font-sans text-sm leading-normal",
  /** Serif lede — the standfirst paragraph after a headline. */
  lede: "font-serif text-lg leading-snug md:text-xl",
  /** Serif sub-head. */
  subhead: "font-serif text-2xl leading-snug tracking-tight",
  /** Serif section heading. */
  head: "font-serif text-3xl leading-tight tracking-tight md:text-4xl",
  /** Serif display headline. */
  display: "font-serif font-light text-5xl leading-none tracking-tighter md:text-7xl",
} as const;

/** Color tone — literal classes off the palette. */
const toneClass = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-subtle-foreground",
  accent: "text-accent",
} as const;

/** Text-wrap behavior. */
const wrapClass = {
  normal: "",
  balance: "text-balance",
  pretty: "text-pretty",
} as const;

export type TextScale = keyof typeof roleClass;
export type TextTone = keyof typeof toneClass;
export type TextWrap = keyof typeof wrapClass;

/** Default element per scale when `as` is not given. */
const defaultTag: Record<TextScale, ElementType> = {
  caption: "span",
  label: "span",
  body: "p",
  bodySm: "p",
  lede: "p",
  subhead: "h3",
  head: "h2",
  display: "h1",
};

export interface TextProps extends UnsafeClassName {
  /** Type role — family + size + leading + tracking, as one token. */
  scale: TextScale;
  /** Element to render. Defaults per scale. */
  as?: ElementType;
  /** Color tone. */
  tone?: TextTone;
  /** Text-wrap behavior. */
  wrap?: TextWrap;
  children: ReactNode;
}

/**
 * The typographic primitive. Every piece of text on the content surface
 * renders through `Text` (or `Heading`); the type role is a token, the size
 * is never a raw arbitrary.
 */
export function Text({
  scale,
  as,
  tone = "default",
  wrap = "normal",
  children,
  unsafe_className,
}: TextProps) {
  const Tag = as ?? defaultTag[scale];
  return (
    <Tag
      className={cn(roleClass[scale], toneClass[tone], wrapClass[wrap], unsafe_className)}
    >
      {children}
    </Tag>
  );
}
