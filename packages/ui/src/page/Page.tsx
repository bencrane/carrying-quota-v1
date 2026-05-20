import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

export interface PageProps extends UnsafeClassName {
  /**
   * Flush mode. When `true`, `Page` renders a Fragment and stamps
   * `data-page-root` onto its FIRST child element instead of introducing a
   * wrapper `<div>`. Use this for routes whose top-level children are
   * `<Section>` rhythm bands that must stay DIRECT children of `<main>` —
   * so the `main > section` rhythm selector keeps matching. The homepage
   * uses `flush`.
   *
   * When `false` (default), `Page` renders a single `<div data-page-root>`
   * wrapper — the right choice for single-band routes.
   */
  flush?: boolean;
  children: ReactNode;
}

/**
 * The route frame primitive. EVERY route renders through `Page`. It tags its
 * root with `data-page-root` (the G3 contract hook): exactly one
 * `[data-page-root]` per route, and the route's first heading lives inside
 * it.
 *
 * `Page` owns NO content geometry beyond being the root marker — measure and
 * spacing come from `Container` / `Section` / the editorial primitives. The
 * app shell stays pure chrome; `Page` is the boundary between chrome and
 * content.
 */
export function Page({ flush = false, children, unsafe_className }: PageProps) {
  if (flush) {
    // Stamp data-page-root onto the first child element so the rhythm
    // <section> bands remain direct children of <main>.
    const kids = Children.toArray(children);
    let stamped = false;
    const out = kids.map((child) => {
      if (!stamped && isValidElement(child)) {
        stamped = true;
        const el = child as ReactElement<Record<string, unknown>>;
        return cloneElement(el, { "data-page-root": "" });
      }
      return child;
    });
    return <>{out}</>;
  }
  return (
    <div data-page-root="" className={cn(unsafe_className)}>
      {children}
    </div>
  );
}
