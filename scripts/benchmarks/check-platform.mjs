// check-platform.mjs
// Runtime (Playwright) checks for the Carrying Quota platform-grade
// design-system-foundation cycle. Drives a headless chromium against the dev
// server on :5181.
//
// Accepts no args. Prints exactly three lines to stdout:
//   G3:        0 | 1   — every route renders through the Page primitive +
//                        renders an h1/h2 with zero console errors
//   D3:        0 | 1   — the demo piece renders the reference interactive
//                        data figure embedded via Figure, the figure mutates
//                        on hover/focus, and the demo-piece DOM is intact
//   R1RUNTIME: 0 | 1   — all routes render h1/h2 with zero console errors
//                        (the runtime half of the no-regression guard)
//
// Diagnostic detail is logged to stderr. Any exception in a check yields 0
// for that check (fail-closed) — the script itself always exits 0 so the
// bash harness can score a missing/broken artifact as 0 and continue.
//
// ROBUSTNESS: at baseline the Page primitive, the demo-piece route, and the
// reference data figure do not exist. Every check below must treat that
// absence as a clean 0, never as a crash.

import { chromium } from "playwright";

const BASE = process.env.CQ_BENCH_BASE || "http://localhost:5181";

// Routes the app exposes today (App.tsx). The demo-piece route is added by
// the executor; it is probed separately by the D3 check via DEMO_PIECE_PATH.
const ROUTES = ["/", "/dispatches", "/index", "/comp", "/goods", "/about"];

// The executor wires the demo piece at this path. If it 404s / renders
// nothing, D3 scores 0 (not a crash).
const DEMO_PIECE_PATH = process.env.CQ_DEMO_PIECE_PATH || "/pieces/demo";

const NAV = { waitUntil: "networkidle", timeout: 25000 };

let browser;
let g3 = 0;
let d3 = 0;
let r1runtime = 0;

/** Collect console + page errors on a page. */
function trackErrors(page) {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err && err.message ? err.message : err}`);
  });
  return errors;
}

try {
  browser = await chromium.launch({ headless: true });

  // ── R1RUNTIME ────────────────────────────────────────────────────────────
  // Every existing route renders an <h1> or <h2> with zero console errors.
  // This is the runtime half of the no-regression guard (R1). The static half
  // — build + the two prior benchmark scripts — is asserted by the bash
  // harness.
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    let ok = true;
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const errors = trackErrors(page);
      try {
        await page.goto(`${BASE}${route}`, NAV);
        await page.waitForLoadState("networkidle");
        const heading = await page.evaluate(() => {
          const el = document.querySelector("h1, h2");
          return el ? (el.textContent || "").trim().slice(0, 60) : null;
        });
        if (!heading) {
          ok = false;
          console.error(`[r1runtime] ${route}: no h1/h2 found`);
        }
        if (errors.length > 0) {
          ok = false;
          console.error(
            `[r1runtime] ${route}: ${errors.length} console error(s): ` +
              JSON.stringify(errors)
          );
        }
      } catch (err) {
        ok = false;
        console.error(
          `[r1runtime] ${route}: exception: ${
            err && err.message ? err.message : err
          }`
        );
      } finally {
        await page.close();
      }
    }
    r1runtime = ok ? 1 : 0;
    await ctx.close();
  } catch (err) {
    r1runtime = 0;
    console.error(
      `[r1runtime] fatal: ${err && err.message ? err.message : err}`
    );
  }

  // ── G3 ───────────────────────────────────────────────────────────────────
  // Every route renders through the Page primitive. The Page primitive MUST
  // tag its root with data-page-root (executor contract — see contract.md).
  // For each route: exactly one [data-page-root] is present, it is an
  // ancestor of the route's first h1/h2, and the route renders cleanly.
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    let ok = true;
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const errors = trackErrors(page);
      try {
        await page.goto(`${BASE}${route}`, NAV);
        await page.waitForLoadState("networkidle");
        const probe = await page.evaluate(() => {
          const roots = document.querySelectorAll("[data-page-root]");
          const heading = document.querySelector("h1, h2");
          let headingInsideRoot = false;
          if (roots.length === 1 && heading) {
            headingInsideRoot = roots[0].contains(heading);
          }
          return {
            rootCount: roots.length,
            hasHeading: !!heading,
            headingInsideRoot,
          };
        });
        if (probe.rootCount !== 1) {
          ok = false;
          console.error(
            `[g3] ${route}: expected exactly 1 [data-page-root], found ${probe.rootCount}`
          );
        }
        if (!probe.hasHeading) {
          ok = false;
          console.error(`[g3] ${route}: no h1/h2 found`);
        }
        if (probe.rootCount === 1 && probe.hasHeading && !probe.headingInsideRoot) {
          ok = false;
          console.error(
            `[g3] ${route}: route h1/h2 is not inside [data-page-root]`
          );
        }
        if (errors.length > 0) {
          ok = false;
          console.error(
            `[g3] ${route}: ${errors.length} console error(s): ` +
              JSON.stringify(errors)
          );
        }
      } catch (err) {
        ok = false;
        console.error(
          `[g3] ${route}: exception: ${
            err && err.message ? err.message : err
          }`
        );
      } finally {
        await page.close();
      }
    }
    g3 = ok ? 1 : 0;
    await ctx.close();
  } catch (err) {
    g3 = 0;
    console.error(`[g3] fatal: ${err && err.message ? err.message : err}`);
  }

  // ── D3 ───────────────────────────────────────────────────────────────────
  // The demo piece proves the embed contract. Executor contract (contract.md):
  //   - the demo-piece route renders a [data-piece-root]
  //   - inside it, a [data-figure] wraps the reference data figure
  //   - the reference data figure is tagged [data-reference-figure] and is a
  //     descendant of [data-figure]
  //   - the figure is genuinely interactive: hovering/focusing a
  //     [data-figure-interactive] element mutates rendered state, surfaced via
  //     a [data-figure-state] element whose textContent changes
  //   - the demo piece renders an h1/h2 with zero console errors
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    const errors = trackErrors(page);
    let ok = true;
    try {
      await page.goto(`${BASE}${DEMO_PIECE_PATH}`, NAV);
      await page.waitForLoadState("networkidle");

      const structure = await page.evaluate(() => {
        const pieceRoot = document.querySelector("[data-piece-root]");
        const figure = document.querySelector("[data-figure]");
        const refFigure = document.querySelector("[data-reference-figure]");
        const heading = document.querySelector("h1, h2");
        return {
          hasPieceRoot: !!pieceRoot,
          hasFigure: !!figure,
          figureInsidePiece: !!(pieceRoot && figure && pieceRoot.contains(figure)),
          hasRefFigure: !!refFigure,
          refInsideFigure: !!(figure && refFigure && figure.contains(refFigure)),
          hasHeading: !!heading,
        };
      });

      if (!structure.hasPieceRoot) {
        ok = false;
        console.error(`[d3] no [data-piece-root] on ${DEMO_PIECE_PATH}`);
      }
      if (!structure.hasFigure) {
        ok = false;
        console.error(`[d3] no [data-figure] on ${DEMO_PIECE_PATH}`);
      }
      if (structure.hasPieceRoot && structure.hasFigure && !structure.figureInsidePiece) {
        ok = false;
        console.error(`[d3] [data-figure] is not inside [data-piece-root]`);
      }
      if (!structure.hasRefFigure) {
        ok = false;
        console.error(`[d3] no [data-reference-figure] on ${DEMO_PIECE_PATH}`);
      }
      if (structure.hasFigure && structure.hasRefFigure && !structure.refInsideFigure) {
        ok = false;
        console.error(
          `[d3] [data-reference-figure] is not inside [data-figure]`
        );
      }
      if (!structure.hasHeading) {
        ok = false;
        console.error(`[d3] demo piece renders no h1/h2`);
      }

      // Interactivity: hover/focus a [data-figure-interactive] element and
      // assert a [data-figure-state] element's textContent changes.
      if (ok) {
        const interactive = page.locator("[data-figure-interactive]");
        const stateEl = page.locator("[data-figure-state]");
        const interactiveCount = await interactive.count();
        const stateCount = await stateEl.count();
        if (interactiveCount < 1) {
          ok = false;
          console.error(`[d3] no [data-figure-interactive] element`);
        } else if (stateCount < 1) {
          ok = false;
          console.error(`[d3] no [data-figure-state] element`);
        } else {
          const before = (await stateEl.first().textContent()) || "";
          // Try several interactive targets — the one the figure responds to
          // may not be the first.
          let mutated = false;
          const tryCount = Math.min(interactiveCount, 8);
          for (let i = 0; i < tryCount && !mutated; i++) {
            try {
              await interactive.nth(i).hover({ timeout: 3000 });
              await page.waitForTimeout(250);
              const afterHover = (await stateEl.first().textContent()) || "";
              if (afterHover.trim() !== before.trim()) {
                mutated = true;
                break;
              }
              await interactive.nth(i).focus({ timeout: 3000 });
              await page.waitForTimeout(250);
              const afterFocus = (await stateEl.first().textContent()) || "";
              if (afterFocus.trim() !== before.trim()) {
                mutated = true;
              }
            } catch {
              // try the next interactive target
            }
          }
          if (!mutated) {
            ok = false;
            console.error(
              `[d3] hover/focus on [data-figure-interactive] did not change ` +
                `[data-figure-state] (before=${JSON.stringify(before.trim())})`
            );
          }
        }
      }

      if (errors.length > 0) {
        ok = false;
        console.error(
          `[d3] demo piece: ${errors.length} console error(s): ` +
            JSON.stringify(errors)
        );
      }
    } catch (err) {
      ok = false;
      console.error(
        `[d3] exception: ${err && err.message ? err.message : err}`
      );
    } finally {
      await page.close();
    }
    d3 = ok ? 1 : 0;
    await ctx.close();
  } catch (err) {
    d3 = 0;
    console.error(`[d3] fatal: ${err && err.message ? err.message : err}`);
  }
} catch (err) {
  console.error(
    `[check-platform] fatal: ${err && err.message ? err.message : err}`
  );
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch {
      // ignore
    }
  }
}

console.log(`G3: ${g3}`);
console.log(`D3: ${d3}`);
console.log(`R1RUNTIME: ${r1runtime}`);
