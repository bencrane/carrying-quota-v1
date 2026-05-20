// check-system.mjs
// Runtime checks for the Carrying Quota design-system refactor.
// Accepts no args. Drives a headless chromium against the dev server on :5180.
// Prints exactly two lines to stdout:
//   RHYTHM:    0 | 1
//   NOREGRESS: 0 | 1
// Diagnostic detail is logged to stderr. Any exception in a check yields 0
// for that check (fail-closed) — the script itself always exits 0.

import { chromium } from "playwright";

const BASE = "http://localhost:5180";
const ROUTES = ["/", "/dispatches", "/index", "/comp", "/goods", "/about"];

let browser;
let rhythm = 0;
let noregress = 0;

try {
  browser = await chromium.launch({ headless: true });

  // ── RHYTHM ────────────────────────────────────────────────────────────
  // Homepage: collect the computed background-color of each direct-child
  // <section> of <main>. >= 2 distinct values => surface rhythm exists.
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForLoadState("networkidle");

    const bgs = await page.evaluate(() =>
      [...document.querySelectorAll("main > section")].map(
        (s) => getComputedStyle(s).backgroundColor
      )
    );
    const distinct = new Set(bgs);
    if (distinct.size >= 2) {
      rhythm = 1;
    }
    console.error(
      `[rhythm] main>section count=${bgs.length} bgs=${JSON.stringify(
        bgs
      )} distinct=${distinct.size}`
    );
    await ctx.close();
  } catch (err) {
    rhythm = 0;
    console.error(`[rhythm] exception: ${err && err.message ? err.message : err}`);
  }

  // ── NOREGRESS ─────────────────────────────────────────────────────────
  // For each of the 6 routes: render an <h1> or <h2>, zero console errors.
  // On "/" additionally: hero is a >=2-column grid at 1440px, the email
  // input sits within the first 900px from doc top, and the lead chart
  // renders exactly 10 rows.
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    let ok = true;

    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(`pageerror: ${err && err.message ? err.message : err}`);
      });

      try {
        await page.goto(`${BASE}${route}`, {
          waitUntil: "networkidle",
          timeout: 25000,
        });
        await page.waitForLoadState("networkidle");

        const heading = await page.evaluate(() => {
          const el = document.querySelector("h1, h2");
          return el ? (el.textContent || "").trim().slice(0, 60) : null;
        });
        if (!heading) {
          ok = false;
          console.error(`[noregress] ${route}: no h1/h2 found`);
        }

        if (consoleErrors.length > 0) {
          ok = false;
          console.error(
            `[noregress] ${route}: ${consoleErrors.length} console error(s): ${JSON.stringify(
              consoleErrors
            )}`
          );
        }

        if (route === "/") {
          const home = await page.evaluate(() => {
            const out = {};

            // Hero: a >=2-column grid somewhere within [data-testid="hero"].
            const hero = document.querySelector('[data-testid="hero"]');
            if (!hero) {
              out.heroCols = 0;
              out.heroReason = "no hero testid";
            } else {
              const colsOf = (el) =>
                (getComputedStyle(el).gridTemplateColumns || "")
                  .split(/\s+/)
                  .filter((s) => s && s !== "none" && s !== "0px").length;
              let best = colsOf(hero);
              for (const el of hero.querySelectorAll("*")) {
                if (getComputedStyle(el).display.includes("grid")) {
                  best = Math.max(best, colsOf(el));
                }
              }
              out.heroCols = best;
            }

            // Email input distance from document top.
            const email = document.querySelector('[type="email"]');
            if (!email) {
              out.emailTop = Infinity;
            } else {
              const r = email.getBoundingClientRect();
              out.emailTop = r.top + window.scrollY;
            }

            // Lead chart row count: each row carries exactly one accent bar.
            const chart = document.querySelector('[data-testid="lead-chart"]');
            if (!chart) {
              out.chartRows = -1;
            } else {
              out.chartRows = chart.querySelectorAll(".bg-accent").length;
            }

            return out;
          });

          if (!(home.heroCols >= 2)) {
            ok = false;
            console.error(
              `[noregress] / : hero not >=2-col grid (cols=${home.heroCols}${
                home.heroReason ? ", " + home.heroReason : ""
              })`
            );
          }
          if (!(home.emailTop < 900)) {
            ok = false;
            console.error(
              `[noregress] / : email input not within 900px (top=${home.emailTop})`
            );
          }
          if (home.chartRows !== 10) {
            ok = false;
            console.error(
              `[noregress] / : lead chart row count=${home.chartRows} (expected 10)`
            );
          }
        }
      } catch (err) {
        ok = false;
        console.error(
          `[noregress] ${route}: exception: ${err && err.message ? err.message : err}`
        );
      } finally {
        await page.close();
      }
    }

    noregress = ok ? 1 : 0;
    await ctx.close();
  } catch (err) {
    noregress = 0;
    console.error(`[noregress] exception: ${err && err.message ? err.message : err}`);
  }
} catch (err) {
  console.error(`[check-system] fatal: ${err && err.message ? err.message : err}`);
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch {
      // ignore
    }
  }
}

console.log(`RHYTHM: ${rhythm}`);
console.log(`NOREGRESS: ${noregress}`);
