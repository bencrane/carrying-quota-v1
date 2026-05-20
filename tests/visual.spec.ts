import { test, expect } from "@playwright/test";

/**
 * Per-route + per-piece visual-regression snapshots (check E3).
 *
 * Each route and the demo piece gets a full-page screenshot, diffed against
 * the committed baseline. Entrance animations are disabled by the config;
 * a short settle wait covers any layout that resolves post-load.
 */

const ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/dispatches", name: "dispatches" },
  { path: "/index", name: "index" },
  { path: "/comp", name: "comp" },
  { path: "/goods", name: "goods" },
  { path: "/about", name: "about" },
  { path: "/pieces/demo", name: "pieces-demo" },
];

for (const route of ROUTES) {
  test(`visual: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await page.waitForLoadState("networkidle");
    // Settle: let any motion wrapper finish its (disabled) entrance + fonts.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      fullPage: true,
    });
  });
}
