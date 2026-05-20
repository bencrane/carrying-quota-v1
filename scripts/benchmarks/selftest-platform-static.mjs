// selftest-platform-static.mjs
// Validator self-test for check-platform-static.mjs. Proves each node-side
// static check (t1, t3, p4, d1, e1) is genuinely runnable — i.e. it returns
// "0" when the artifact is absent AND "1" when a correct synthetic artifact
// is present. A check that is permanently "0" regardless of input is a broken
// check; this test catches that.
//
// It builds a synthetic minimal artifact tree in a tmpdir, points
// check-platform-static.mjs at it via CQ_REPO_ROOT, and asserts the verdict.
//
// Usage: node selftest-platform-static.mjs
// Exits 0 iff every check passes both its negative and positive case.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const STATIC_CHECKER = join(SCRIPT_DIR, "check-platform-static.mjs");

let failures = 0;
const log = (s) => process.stdout.write(s + "\n");

/** Run check-platform-static.mjs <check> with CQ_REPO_ROOT=<root>. */
function runCheck(check, root) {
  try {
    const out = execFileSync("node", [STATIC_CHECKER, check], {
      env: { ...process.env, CQ_REPO_ROOT: root },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out.trim();
  } catch (e) {
    // the checker always exits 0; a throw here is unexpected.
    return `THREW:${e && e.message}`;
  }
}

function expect(check, root, want, label) {
  const got = runCheck(check, root);
  if (got === want) {
    log(`  PASS  ${check} ${label} -> ${got}`);
  } else {
    failures++;
    log(`  FAIL  ${check} ${label} -> got '${got}', want '${want}'`);
  }
}

// ── synthetic fixture builders ──────────────────────────────────────────────

/** An empty repo root: no packages/, no docs/. Every check must return "0". */
function buildEmptyRoot() {
  const root = mkdtempSync(join(tmpdir(), "cq-selftest-empty-"));
  // a globals.css so t3 can at least read a palette (the token side is absent).
  mkdirSync(join(root, "src", "styles"), { recursive: true });
  writeFileSync(
    join(root, "src", "styles", "globals.css"),
    ":root {\n  --background: 0 0% 2%;\n  --foreground: 42 23% 94%;\n}\n"
  );
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "x" }));
  return root;
}

/**
 * A complete synthetic root where every static check should return "1":
 *   - packages/tokens with a BUILT dist/index.js exporting the 8 categories,
 *     colors value-equal to globals.css
 *   - packages/ui with every inventory primitive exported + a story per
 *     primitive
 */
function buildGoodRoot() {
  const root = mkdtempSync(join(tmpdir(), "cq-selftest-good-"));

  // globals.css palette — the token color values must match these.
  mkdirSync(join(root, "src", "styles"), { recursive: true });
  const palette = {
    background: "0 0% 2%",
    foreground: "42 23% 94%",
    accent: "72 100% 61%",
    border: "0 0% 10%",
  };
  const rootBlock = Object.entries(palette)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
  writeFileSync(
    join(root, "src", "styles", "globals.css"),
    `:root {\n${rootBlock}\n  --radius: 0;\n}\n`
  );

  // packages/tokens — built JS entry exporting all 8 categories.
  const tokensDist = join(root, "packages", "tokens", "dist");
  mkdirSync(tokensDist, { recursive: true });
  writeFileSync(
    join(root, "packages", "tokens", "package.json"),
    JSON.stringify({
      name: "@cq/tokens",
      main: "dist/index.js",
      exports: { ".": "./dist/index.js" },
    })
  );
  const tokenModule = `
export const spacing = { xs: "0.25rem", sm: "0.5rem", md: "1rem" };
export const typeScale = { body: "1rem", head: "2rem" };
export const color = ${JSON.stringify(palette)};
export const radius = { none: "0" };
export const shadow = { sm: "0 1px 2px rgba(0,0,0,0.1)" };
export const motion = { durations: { fast: "150ms" }, easings: { editorial: "cubic-bezier(0.16,1,0.3,1)" } };
export const breakpoint = { md: "768px", lg: "1024px" };
export const zIndex = { base: 0, header: 50 };
`;
  writeFileSync(join(tokensDist, "index.js"), tokenModule);

  // packages/ui — every inventory primitive exported, one story each.
  const uiSrc = join(root, "packages", "ui", "src");
  mkdirSync(uiSrc, { recursive: true });
  writeFileSync(
    join(root, "packages", "ui", "package.json"),
    JSON.stringify({ name: "@cq/ui", main: "src/index.ts" })
  );
  const primitives = [
    "Box", "Stack", "Cluster", "Grid", "Container", "Section",
    "Page", "PageHeader", "PageSection",
    "Piece", "PieceHeader", "Prose", "Lede", "PullQuote", "Figure",
    "Card", "Eyebrow", "Stat", "Divider", "Badge",
    "Text", "Heading",
  ];
  // one source file + one story file per primitive.
  const indexLines = [];
  for (const p of primitives) {
    writeFileSync(
      join(uiSrc, `${p}.tsx`),
      `export function ${p}() { return null; }\n`
    );
    writeFileSync(
      join(uiSrc, `${p}.stories.tsx`),
      `import { ${p} } from "./${p}";\nexport default { title: "${p}", component: ${p} };\nexport const Default = {};\n`
    );
    indexLines.push(`export { ${p} } from "./${p}";`);
  }
  writeFileSync(join(uiSrc, "index.ts"), indexLines.join("\n") + "\n");

  return root;
}

// ── run ─────────────────────────────────────────────────────────────────────
log("self-test: check-platform-static.mjs");

const emptyRoot = buildEmptyRoot();
const goodRoot = buildGoodRoot();

try {
  log("[negative cases — absent artifacts must score 0]");
  for (const c of ["t1", "t3", "p4", "d1", "e1"]) {
    expect(c, emptyRoot, "0", "(empty root)");
  }

  log("[positive cases — correct artifacts must score 1]");
  for (const c of ["t1", "t3", "p4", "d1", "e1"]) {
    expect(c, goodRoot, "1", "(good root)");
  }

  // negative variant: a token source whose color value DRIFTS from globals.css
  // must fail t3 (proves t3 actually compares values, not just presence).
  const driftRoot = mkdtempSync(join(tmpdir(), "cq-selftest-drift-"));
  cpSync(goodRoot, driftRoot, { recursive: true });
  // rewrite the token color export with a wrong accent value.
  const driftModule = `
export const spacing = { md: "1rem" };
export const typeScale = { body: "1rem" };
export const color = { background: "0 0% 2%", foreground: "42 23% 94%", accent: "999 99% 99%", border: "0 0% 10%" };
export const radius = { none: "0" };
export const shadow = { sm: "x" };
export const motion = { durations: { fast: "150ms" } };
export const breakpoint = { md: "768px" };
export const zIndex = { base: 0 };
`;
  writeFileSync(
    join(driftRoot, "packages", "tokens", "dist", "index.js"),
    driftModule
  );
  expect("t3", driftRoot, "0", "(drifted palette value)");
  rmSync(driftRoot, { recursive: true, force: true });

  // negative variant: a ui package MISSING one primitive export must fail p4.
  const incompleteRoot = mkdtempSync(join(tmpdir(), "cq-selftest-incomplete-"));
  cpSync(goodRoot, incompleteRoot, { recursive: true });
  // drop Figure from the index re-exports.
  const uiIndex = join(incompleteRoot, "packages", "ui", "src", "index.ts");
  writeFileSync(
    uiIndex,
    [
      "Box", "Stack", "Cluster", "Grid", "Container", "Section",
      "Page", "PageHeader", "PageSection",
      "Piece", "PieceHeader", "Prose", "Lede", "PullQuote", // Figure dropped
      "Card", "Eyebrow", "Stat", "Divider", "Badge",
      "Text", "Heading",
    ]
      .map((p) => `export { ${p} } from "./${p}";`)
      .join("\n") + "\n"
  );
  // also remove the Figure source file so collectNamedExports cannot find it.
  rmSync(join(incompleteRoot, "packages", "ui", "src", "Figure.tsx"), {
    force: true,
  });
  expect("p4", incompleteRoot, "0", "(ui missing Figure export)");
  expect("d1", incompleteRoot, "0", "(ui missing Figure export)");
  rmSync(incompleteRoot, { recursive: true, force: true });
} finally {
  rmSync(emptyRoot, { recursive: true, force: true });
  rmSync(goodRoot, { recursive: true, force: true });
}

if (failures === 0) {
  log("\nself-test: ALL PASS — every static check is runnable (flips 0->1).");
  process.exit(0);
} else {
  log(`\nself-test: ${failures} FAILURE(S) — a static check is not runnable.`);
  process.exit(1);
}
