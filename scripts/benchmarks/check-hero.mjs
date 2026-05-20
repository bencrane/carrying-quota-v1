// check-hero.mjs
// Single-width hero structural check. Prints "0" or "1" to stdout.
// Usage: node check-hero.mjs <width>

import { chromium } from "playwright";

const width = parseInt(process.argv[2], 10);
if (!Number.isFinite(width) || width <= 0) {
  console.error("usage: node check-hero.mjs <width>");
  console.log(0);
  process.exit(0);
}

const height = width < 768 ? 800 : 900;

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto("http://localhost:5180/", { waitUntil: "networkidle", timeout: 20000 });

  const result = await page.evaluate((w) => {
    const hero = document.querySelector('[data-testid="hero"]');
    if (!hero) {
      return { score: 0, reason: "no hero testid" };
    }

    const cs = window.getComputedStyle(hero);
    const gtc = cs.gridTemplateColumns || "none";

    // Mobile path
    if (w < 768) {
      const emailEl = hero.querySelector('[type="email"]') || document.querySelector('[type="email"]');
      const form = emailEl ? emailEl.closest("form") || emailEl : null;
      if (!form) return { score: 0, reason: "no email/form found" };

      const rect = form.getBoundingClientRect();
      const topOffset = rect.top + window.scrollY; // distance from doc top
      const noHScroll = document.documentElement.scrollWidth <= window.innerWidth;
      const visibleInFirstScreen = topOffset < 800 && rect.height > 0;

      if (visibleInFirstScreen && noHScroll) return { score: 1, reason: "mobile ok" };
      return {
        score: 0,
        reason: `mobile fail: topOffset=${topOffset}, noHScroll=${noHScroll}, scrollWidth=${document.documentElement.scrollWidth}, innerWidth=${window.innerWidth}`,
      };
    }

    // Desktop path
    // 1) gridTemplateColumns must resolve to >= 2 non-empty columns.
    const cols = gtc
      .split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => s && s !== "none" && s !== "0px");
    const colCount = cols.length;

    // 2) Find direct children of the hero that occupy the FIRST row.
    const kids = Array.from(hero.children);
    if (kids.length === 0) {
      return { score: 0, reason: "hero has no children" };
    }
    // Some heroes wrap their grid in an inner element. Detect deepest grid container.
    let gridEl = hero;
    if (colCount < 2) {
      // Walk one level: find the deepest descendant whose computed gridTemplateColumns has >= 2 cols.
      const candidates = hero.querySelectorAll("*");
      for (const el of candidates) {
        const ecs = window.getComputedStyle(el);
        if (ecs.display.includes("grid")) {
          const ecols = (ecs.gridTemplateColumns || "")
            .split(/\s+/)
            .filter((s) => s && s !== "none" && s !== "0px");
          if (ecols.length >= 2) {
            gridEl = el;
            break;
          }
        }
      }
    }

    const gridCS = window.getComputedStyle(gridEl);
    const gridCols = (gridCS.gridTemplateColumns || "")
      .split(/\s+/)
      .filter((s) => s && s !== "none" && s !== "0px");
    const gridColCount = gridCols.length;

    const gridKids = Array.from(gridEl.children);
    if (gridKids.length < 2) {
      return {
        score: 0,
        reason: `grid has <2 children (gridColCount=${gridColCount}, kids=${gridKids.length}, gtc='${gtc}')`,
      };
    }

    // First-row children = those whose offsetTop equals the smallest offsetTop among grid children.
    const offsets = gridKids.map((k) => k.offsetTop);
    const minTop = Math.min(...offsets);
    const firstRow = gridKids.filter((k) => k.offsetTop === minTop);

    if (firstRow.length < 2) {
      return {
        score: 0,
        reason: `first row has only ${firstRow.length} child(ren) (gridColCount=${gridColCount})`,
      };
    }

    // Each first-row child must be > 100px wide and visible.
    const widths = firstRow.map((k) => Math.round(k.getBoundingClientRect().width));
    const allWide = firstRow.every((k) => k.getBoundingClientRect().width > 100);

    if (gridColCount >= 2 && allWide) {
      return { score: 1, reason: `desktop ok (cols=${gridColCount}, widths=${widths.join(",")})` };
    }

    return {
      score: 0,
      reason: `desktop fail (gridColCount=${gridColCount}, firstRowWidths=${widths.join(",")})`,
    };
  }, width);

  if (result.reason) {
    console.error(`[check-hero ${width}] ${result.reason}`);
  }
  console.log(result.score === 1 ? 1 : 0);
} catch (err) {
  console.error(`[check-hero ${width}] exception: ${err && err.message ? err.message : err}`);
  console.log(0);
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch {
      // ignore
    }
  }
}
