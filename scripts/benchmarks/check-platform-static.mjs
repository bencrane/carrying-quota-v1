// check-platform-static.mjs
// Node-side static checks for the cq-design-system-foundation benchmark.
// Usage: node check-platform-static.mjs <check>
//   t1  token source exports all 8 categories, non-empty
//   t3  token color values equal the locked globals.css palette
//   p4  every inventory primitive is a named export of the ui package
//   d1  Piece + the editorial content primitives are named ui exports
//   e1  Storybook story count >= primitive count
//
// Prints exactly "1" (pass) or "0" (fail) to stdout. Diagnostic detail goes
// to stderr. Any exception -> "0" (fail-closed); the script always exits 0
// so the bash harness scores a missing/broken artifact as 0 and continues.
//
// All filesystem access is wrapped — a missing token package, a missing
// packages/ui, a missing Storybook build, etc. each yield a clean "0".

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// REPO_ROOT defaults to two levels up from scripts/benchmarks/. CQ_REPO_ROOT
// overrides it — used by the validator's self-test to point the static checks
// at a synthetic fixture tree. The benchmark itself never sets it, so in
// normal operation this resolves to the real repo/worktree root.
const REPO_ROOT = process.env.CQ_REPO_ROOT
  ? resolve(process.env.CQ_REPO_ROOT)
  : resolve(SCRIPT_DIR, "..", "..");

const CHECK = (process.argv[2] || "").toLowerCase();

/** Print the verdict and exit 0 (always). */
function done(pass) {
  process.stdout.write(pass ? "1" : "0");
  process.exit(0);
}
function fail(msg) {
  if (msg) console.error(msg);
  done(false);
}

// ── package resolution ──────────────────────────────────────────────────────

/** Read + parse a JSON file, or null. */
function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Resolve a workspace package's importable entry file (absolute path).
 * Honors package.json `exports` ("." string or { import / default }), then
 * `module`, then `main`, then conventional src/index.ts(x).
 * Returns null if nothing resolvable exists.
 */
function resolvePackageEntry(pkgDir) {
  const pkgJsonPath = join(pkgDir, "package.json");
  const pkg = readJson(pkgJsonPath);
  if (!pkg) return null;

  const candidates = [];
  const exp = pkg.exports;
  if (typeof exp === "string") {
    candidates.push(exp);
  } else if (exp && typeof exp === "object") {
    const dot = exp["."] ?? exp;
    if (typeof dot === "string") candidates.push(dot);
    else if (dot && typeof dot === "object") {
      for (const k of ["import", "module", "default", "require"]) {
        if (typeof dot[k] === "string") candidates.push(dot[k]);
      }
    }
  }
  if (typeof pkg.module === "string") candidates.push(pkg.module);
  if (typeof pkg.main === "string") candidates.push(pkg.main);
  candidates.push(
    "src/index.ts",
    "src/index.tsx",
    "index.ts",
    "index.tsx",
    "dist/index.js"
  );

  for (const rel of candidates) {
    const abs = join(pkgDir, rel);
    if (existsSync(abs) && statSync(abs).isFile()) return abs;
  }
  return null;
}

/** Recursively collect all .ts/.tsx files under a directory. */
function collectSource(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      out.push(...collectSource(full));
    } else if (/\.tsx?$/.test(e.name) && !/\.d\.ts$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Collect every named export across a package's source tree, by static
 * source scan (no compilation needed — robust to a package that does not
 * build a JS bundle). Recognizes:
 *   export function NAME / export const NAME / export class NAME
 *   export { A, B as C } [from ...]
 *   export * from "./x"  -> follows one level (best-effort)
 */
function collectNamedExports(srcDir) {
  const names = new Set();
  const files = collectSource(srcDir);
  const reDecl =
    /export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/g;
  const reList = /export\s*(?:type\s*)?\{([^}]*)\}/g;
  for (const f of files) {
    let src;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    let m;
    while ((m = reDecl.exec(src))) names.add(m[1]);
    while ((m = reList.exec(src))) {
      for (const piece of m[1].split(",")) {
        const t = piece.trim();
        if (!t) continue;
        // "A as B" exports B; bare "A" exports A.
        const asMatch = t.match(/\bas\s+([A-Za-z_$][\w$]*)/);
        if (asMatch) names.add(asMatch[1]);
        else {
          const bare = t.match(/^([A-Za-z_$][\w$]*)/);
          if (bare) names.add(bare[1]);
        }
      }
    }
  }
  return names;
}

// ── token-source loading ────────────────────────────────────────────────────

const TOKENS_PKG_DIR = join(REPO_ROOT, "packages", "tokens");

/**
 * Dynamically import the token source module. The token source is TS; we
 * import the BUILT entry if it exists (dist/index.js), else fall back to a
 * naive parse. Returns the module namespace object, or null.
 */
async function loadTokenModule() {
  // Prefer a built JS entry — importable without a TS loader.
  const distJs = join(TOKENS_PKG_DIR, "dist", "index.js");
  if (existsSync(distJs)) {
    try {
      return await import(pathToFileURL(distJs).href);
    } catch (e) {
      console.error(`[static] token dist import failed: ${e && e.message}`);
    }
  }
  // Fall back: resolve the package entry; if it is .js, import it.
  const entry = resolvePackageEntry(TOKENS_PKG_DIR);
  if (entry && extname(entry) === ".js") {
    try {
      return await import(pathToFileURL(entry).href);
    } catch (e) {
      console.error(`[static] token entry import failed: ${e && e.message}`);
    }
  }
  return null;
}

/**
 * Best-effort: extract the token source object shape from raw TS source when
 * no JS build is importable. Returns { categoriesFound: Set, colorValues: [] }
 * or null. This is a fallback so T1/T3 are not blocked purely on build order.
 */
function parseTokenSourceRaw() {
  const entry = resolvePackageEntry(TOKENS_PKG_DIR);
  if (!entry) return null;
  let src;
  try {
    src = readFileSync(entry, "utf8");
  } catch {
    return null;
  }
  // Also pull in sibling source files the entry might re-export.
  const srcDir = join(TOKENS_PKG_DIR, "src");
  let blob = src;
  for (const f of collectSource(existsSync(srcDir) ? srcDir : TOKENS_PKG_DIR)) {
    try {
      blob += "\n" + readFileSync(f, "utf8");
    } catch {
      /* ignore */
    }
  }
  return { blob };
}

// ── globals.css palette extraction ──────────────────────────────────────────

/**
 * Extract the palette from src/styles/globals.css :root — every `--name: VAL;`
 * custom property. Returns a Map name -> normalized value string.
 */
function readGlobalsPalette() {
  const cssPath = join(REPO_ROOT, "src", "styles", "globals.css");
  let css;
  try {
    css = readFileSync(cssPath, "utf8");
  } catch {
    return null;
  }
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) return null;
  const map = new Map();
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(rootMatch[1]))) {
    map.set(m[1].trim(), m[2].trim().replace(/\s+/g, " "));
  }
  return map;
}

// ════════════════════════════════════════════════════════════════════════════
// CHECK: t1 — token source exports all 8 categories, non-empty.
// ════════════════════════════════════════════════════════════════════════════
async function checkT1() {
  if (!existsSync(join(TOKENS_PKG_DIR, "package.json"))) {
    return fail("[t1] packages/tokens/package.json does not exist");
  }
  // The 8 required categories. Accept reasonable name variants for each.
  const categories = {
    spacing: ["spacing", "space", "spaces"],
    typeScale: ["type", "typescale", "typeScale", "typography", "fontsize", "fontSize", "text"],
    color: ["color", "colors", "palette"],
    radius: ["radius", "radii", "rounded"],
    shadow: ["shadow", "shadows", "elevation"],
    motion: ["motion", "duration", "durations", "easing", "easings", "transition"],
    breakpoint: ["breakpoint", "breakpoints", "screens"],
    zIndex: ["zindex", "zIndex", "z", "layers", "elevationindex"],
  };

  const mod = await loadTokenModule();
  if (mod) {
    // Inspect the module namespace: every exported key, lowercased.
    const keys = Object.keys(mod);
    const lowerKeys = keys.map((k) => k.toLowerCase());
    const missing = [];
    for (const [cat, variants] of Object.entries(categories)) {
      const hit = keys.find((k, i) =>
        variants.some((v) => lowerKeys[i].includes(v.toLowerCase()))
      );
      if (!hit) {
        missing.push(cat);
        continue;
      }
      // The exported value must be a non-empty object/array.
      const val = mod[hit];
      const nonEmpty =
        (Array.isArray(val) && val.length > 0) ||
        (val && typeof val === "object" && Object.keys(val).length > 0);
      if (!nonEmpty) missing.push(`${cat} (export '${hit}' is empty)`);
    }
    if (missing.length) {
      return fail(`[t1] token source missing/empty categories: ${missing.join(", ")}`);
    }
    return done(true);
  }

  // Fallback: raw source scan. Each category name-variant must appear AND the
  // source must contain object/array literal data (not just type aliases).
  const raw = parseTokenSourceRaw();
  if (!raw) return fail("[t1] cannot load or parse the token source module");
  const blob = raw.blob;
  const lower = blob.toLowerCase();
  const missing = [];
  for (const [cat, variants] of Object.entries(categories)) {
    const found = variants.some((v) => lower.includes(v.toLowerCase()));
    if (!found) missing.push(cat);
  }
  // Require at least one structured-data literal (object or array assignment).
  const hasData = /(?:export\s+const\s+[A-Za-z_$][\w$]*\s*[:=][^=]*[{[])/.test(blob);
  if (missing.length) {
    return fail(`[t1] token source missing categories (raw scan): ${missing.join(", ")}`);
  }
  if (!hasData) {
    return fail("[t1] token source has no structured-data literal (types only?)");
  }
  return done(true);
}

// ════════════════════════════════════════════════════════════════════════════
// CHECK: t3 — token color values equal the locked globals.css palette.
// ════════════════════════════════════════════════════════════════════════════
async function checkT3() {
  const palette = readGlobalsPalette();
  if (!palette || palette.size === 0) {
    return fail("[t3] cannot read the globals.css :root palette");
  }
  // Palette color tokens — the HSL-triplet surface/brand/semantic entries.
  // (--radius is not a color; exclude it.)
  const colorNames = [...palette.keys()].filter((n) => n !== "radius");

  const mod = await loadTokenModule();
  let tokenColorValues = null;

  if (mod) {
    // Find the color export and flatten its leaf string values.
    const keys = Object.keys(mod);
    const colorKey = keys.find((k) =>
      ["color", "colors", "palette"].some((v) => k.toLowerCase().includes(v))
    );
    if (colorKey && mod[colorKey] && typeof mod[colorKey] === "object") {
      tokenColorValues = [];
      const walk = (v) => {
        if (v == null) return;
        if (typeof v === "string" || typeof v === "number") {
          tokenColorValues.push(String(v).trim().replace(/\s+/g, " "));
        } else if (typeof v === "object") {
          for (const child of Object.values(v)) walk(child);
        }
      };
      walk(mod[colorKey]);
    }
  }

  if (!tokenColorValues) {
    // Fallback: scan raw token source for the palette values verbatim.
    const raw = parseTokenSourceRaw();
    if (!raw) return fail("[t3] cannot load token source to check palette fidelity");
    tokenColorValues = null;
    // We will check each palette value appears literally in the blob.
    const blob = raw.blob;
    const missing = [];
    for (const name of colorNames) {
      const val = palette.get(name);
      if (!val) continue;
      // Accept the raw triplet "H S% L%", or wrapped "hsl(H S% L%)".
      const triplet = val;
      const inBlob =
        blob.includes(triplet) ||
        blob.replace(/\s+/g, " ").includes(triplet);
      if (!inBlob) missing.push(`${name} (${val})`);
    }
    if (missing.length) {
      return fail(
        `[t3] palette value(s) absent from token source: ${missing.slice(0, 6).join("; ")}` +
          (missing.length > 6 ? ` … +${missing.length - 6} more` : "")
      );
    }
    return done(true);
  }

  // Module path: every palette color value must be present among the token
  // color leaf values (string-equal after whitespace normalization).
  const tokenSet = new Set(tokenColorValues);
  const missing = [];
  for (const name of colorNames) {
    const val = palette.get(name);
    if (!val) continue;
    const norm = val.replace(/\s+/g, " ").trim();
    const present =
      tokenSet.has(norm) ||
      tokenSet.has(`hsl(${norm})`) ||
      [...tokenSet].some((tv) => tv.replace(/\s+/g, " ").includes(norm));
    if (!present) missing.push(`${name} (${val})`);
  }
  if (missing.length) {
    return fail(
      `[t3] token color values do not match the locked palette: ` +
        `${missing.slice(0, 6).join("; ")}` +
        (missing.length > 6 ? ` … +${missing.length - 6} more` : "")
    );
  }
  return done(true);
}

// ════════════════════════════════════════════════════════════════════════════
// Inventory shared by p4 / d1.
// ════════════════════════════════════════════════════════════════════════════
// The minimum-required primitive inventory from the directive.
const INVENTORY = {
  layout: ["Box", "Stack", "Cluster", "Grid", "Container", "Section"],
  page: ["Page", "PageHeader", "PageSection"],
  editorial: ["Piece", "PieceHeader", "Prose", "Lede", "PullQuote", "Figure"],
  display: ["Card", "Eyebrow", "Stat", "Divider", "Badge"],
  typography: ["Text", "Heading"],
};
const ALL_PRIMITIVES = Object.values(INVENTORY).flat();
const EDITORIAL_PRIMITIVES = INVENTORY.editorial;

const UI_PKG_DIR = join(REPO_ROOT, "packages", "ui");
const UI_SRC_DIR = join(UI_PKG_DIR, "src");

// ════════════════════════════════════════════════════════════════════════════
// CHECK: p4 — every inventory primitive is a named export of the ui package.
// ════════════════════════════════════════════════════════════════════════════
function checkP4() {
  if (!existsSync(join(UI_PKG_DIR, "package.json"))) {
    return fail("[p4] packages/ui/package.json does not exist");
  }
  if (!existsSync(UI_SRC_DIR)) {
    return fail("[p4] packages/ui/src does not exist");
  }
  const exported = collectNamedExports(UI_SRC_DIR);
  const missing = ALL_PRIMITIVES.filter((p) => !exported.has(p));
  if (missing.length) {
    return fail(`[p4] ui package missing primitive exports: ${missing.join(", ")}`);
  }
  return done(true);
}

// ════════════════════════════════════════════════════════════════════════════
// CHECK: d1 — Piece + the editorial content primitives are named ui exports.
// ════════════════════════════════════════════════════════════════════════════
function checkD1() {
  if (!existsSync(join(UI_PKG_DIR, "package.json"))) {
    return fail("[d1] packages/ui/package.json does not exist");
  }
  if (!existsSync(UI_SRC_DIR)) {
    return fail("[d1] packages/ui/src does not exist");
  }
  const exported = collectNamedExports(UI_SRC_DIR);
  const missing = EDITORIAL_PRIMITIVES.filter((p) => !exported.has(p));
  if (missing.length) {
    return fail(`[d1] ui package missing editorial primitive exports: ${missing.join(", ")}`);
  }
  return done(true);
}

// ════════════════════════════════════════════════════════════════════════════
// CHECK: e1 — Storybook story count >= primitive count.
// ════════════════════════════════════════════════════════════════════════════
function checkE1() {
  // Stories pinned by contract.md to *.stories.tsx anywhere under packages/ui.
  if (!existsSync(UI_SRC_DIR)) {
    return fail("[e1] packages/ui/src does not exist — no stories");
  }
  const storyFiles = collectSource(UI_SRC_DIR).filter((f) =>
    /\.stories\.tsx?$/.test(f)
  );
  // Count distinct stories: a story file declares a default export (the meta);
  // count one story unit per *.stories file as the floor. (A file may hold
  // multiple named-export stories — we count files, the conservative floor.)
  const storyCount = storyFiles.length;
  const primCount = ALL_PRIMITIVES.length;
  if (storyCount < primCount) {
    return fail(
      `[e1] story count ${storyCount} < primitive count ${primCount} ` +
        `(need >=1 *.stories.tsx per primitive)`
    );
  }
  return done(true);
}

// ── dispatch ────────────────────────────────────────────────────────────────
try {
  switch (CHECK) {
    case "t1":
      await checkT1();
      break;
    case "t3":
      await checkT3();
      break;
    case "p4":
      checkP4();
      break;
    case "d1":
      checkD1();
      break;
    case "e1":
      checkE1();
      break;
    default:
      fail(`[static] unknown check '${CHECK}'`);
  }
} catch (e) {
  fail(`[static] ${CHECK}: exception: ${e && e.message ? e.message : e}`);
}
