import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The class-merge helper every primitive uses. Resolves Tailwind conflicts
 * (last-wins) so an `unsafe_className` override behaves predictably.
 *
 * This is an INTERNAL utility. Primitives compose their own literal class
 * strings here; they do NOT expose a `className` prop. The only caller-facing
 * class injection point is the explicit `unsafe_className` prop.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
