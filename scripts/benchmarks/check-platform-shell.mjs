// check-platform-shell.mjs
// S1 runtime probe for the cq-design-system-foundation benchmark: the app
// shell is pure chrome — the element that wraps the routed content applies
// zero content geometry.
//
// Accepts no args. Drives a headless chromium against the dev server.
// Prints exactly one line to stdout: "1" (pass) or "0" (fail).
// Diagnostic detail goes to stderr. Any exception -> "0" (fail-closed); the
// script always exits 0.
//
// Definition of "pure chrome": the <main> element (which wraps the route
// <Outlet/>) must NOT itself impose content geometry —
//   - no finite max-width  (computed max-width is "none")
//   - no horizontal padding (computed padding-left / padding-right are 0px)
//   - no flex/grid gap      (computed column-gap / row-gap are "normal"/0px)
// Chrome utilities (sticky header, min-height, flex column for footer
// pinning) are fine — only CONTENT geometry on the outlet-wrapping element
// is banned. Navbar/Footer geometry is out of scope (they are chrome).

import { chromium } from "playwright";

const BASE = process.env.CQ_BENCH_BASE || "http://localhost:5181";

let browser;
let pass = 0;

try {
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForLoadState("networkidle");

    const probe = await page.evaluate(() => {
      // The shell's content-wrapping element is <main> (it holds <Outlet/>).
      const main = document.querySelector("main");
      if (!main) return { found: false };
      const cs = getComputedStyle(main);
      const px = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : 0;
      };
      return {
        found: true,
        maxWidth: cs.maxWidth, // "none" if unconstrained
        padLeft: px(cs.paddingLeft),
        padRight: px(cs.paddingRight),
        // column-gap / row-gap report "normal" when no gap is set on a
        // non-flex/grid element; a numeric value means a gap is applied.
        colGap: cs.columnGap,
        rowGap: cs.rowGap,
      };
    });

    if (!probe.found) {
      console.error("[s1] no <main> element found");
    } else {
      const problems = [];
      if (probe.maxWidth && probe.maxWidth !== "none") {
        problems.push(`max-width=${probe.maxWidth}`);
      }
      if (probe.padLeft > 0 || probe.padRight > 0) {
        problems.push(
          `horizontal padding (left=${probe.padLeft}px right=${probe.padRight}px)`
        );
      }
      const gapIsNumeric = (g) => {
        if (!g || g === "normal") return false;
        const n = parseFloat(g);
        return Number.isFinite(n) && n > 0;
      };
      if (gapIsNumeric(probe.colGap) || gapIsNumeric(probe.rowGap)) {
        problems.push(`gap (column=${probe.colGap} row=${probe.rowGap})`);
      }
      if (problems.length) {
        console.error(
          `[s1] <main> imposes content geometry — not pure chrome: ${problems.join(
            "; "
          )}`
        );
      } else {
        pass = 1;
      }
    }
  } catch (err) {
    console.error(`[s1] exception: ${err && err.message ? err.message : err}`);
  } finally {
    await page.close();
  }
  await ctx.close();
} catch (err) {
  console.error(`[s1] fatal: ${err && err.message ? err.message : err}`);
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch {
      // ignore
    }
  }
}

console.log(pass ? "1" : "0");
