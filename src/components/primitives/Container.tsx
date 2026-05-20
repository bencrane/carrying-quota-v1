import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const widthClasses: Record<"narrow" | "default" | "wide", string> = {
  narrow:  "max-w-[820px]",
  default: "max-w-[1280px]",
  wide:    "max-w-[1600px]",
};

interface ContainerProps {
  width?: "narrow" | "default" | "wide";
  children: ReactNode;
  className?: string;
}

export function Container({ width = "default", children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10", widthClasses[width], className)}>
      {children}
    </div>
  );
}
