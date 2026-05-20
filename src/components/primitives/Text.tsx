import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { typeClasses, type TypeScale } from "@/design/tokens";

const toneClasses: Record<"default" | "muted" | "accent", string> = {
  default: "text-foreground",
  muted:   "text-muted-foreground",
  accent:  "text-accent",
};

const defaultTags: Record<TypeScale, ElementType> = {
  hero:    "h1",
  head:    "h2",
  lede:    "p",
  body:    "p",
  caption: "span",
};

interface TextProps {
  scale: TypeScale;
  as?: ElementType;
  tone?: "default" | "muted" | "accent";
  children: ReactNode;
  className?: string;
}

export function Text({ scale, as, tone = "default", children, className }: TextProps) {
  const Tag = as ?? defaultTags[scale];
  return (
    <Tag className={cn(typeClasses[scale], toneClasses[tone], className)}>
      {children}
    </Tag>
  );
}
