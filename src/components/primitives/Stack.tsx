import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gapClasses, type Gap } from "@/design/tokens";

interface StackProps {
  gap?: Gap;
  as?: "div" | "ul" | "ol";
  children: ReactNode;
  className?: string;
}

export function Stack({ gap = "md", as: Tag = "div", children, className }: StackProps) {
  return (
    <Tag className={cn("flex flex-col", gapClasses[gap], className)}>
      {children}
    </Tag>
  );
}
