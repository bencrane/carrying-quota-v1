import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// The repo root — one level up from this config's `tests/` directory. The
// preview server must run from here (not from `tests/`), or `vite preview`
// looks for `tests/dist/` and serves 404s.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Playwright visual-regression config (check E3).
 *
 * `npm run test:visual` runs `tests/visual.spec.ts` — a per-route +
 * per-piece screenshot diff against the committed baselines under
 * `tests/visual.spec.ts-snapshots/`. It serves the production preview build
 * (deterministic, the shipped artifact) on a dedicated port.
 *
 * The baselines are generated once with `--update-snapshots` and committed;
 * a normal run compares against them and exits non-zero on any pixel drift
 * beyond the configured tolerance.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /visual\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  // The preview server the spec drives — run from the repo root so
  // `vite preview` serves the repo's `dist/`.
  webServer: {
    command: "npx vite preview --port 4184 --strictPort",
    cwd: REPO_ROOT,
    url: "http://localhost:4184/",
    reuseExistingServer: false,
    timeout: 90_000,
  },
  use: {
    baseURL: "http://localhost:4184",
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
  },
  expect: {
    toHaveScreenshot: {
      // Editorial pages carry entrance animations + a marquee; allow a small
      // per-pixel + total-ratio tolerance so the diff is robust without
      // being blind to a real regression.
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
});
