#!/usr/bin/env bash
# cq-design-system-foundation.sh
# Measures cq-platform-score (0..19) for the Carrying Quota platform-grade
# design-system-foundation cycle.
#
# Modeled on scripts/benchmarks/design-system.sh (build -> dev server ->
# static greps -> Playwright runtime checks -> score print).
#
# The 19 checks (each +1):
#   Layer 0 — tokens
#     T1  token source: a structured token source module exports all 8
#         categories (spacing, type-scale, color, radius, shadow, motion,
#         breakpoint, z-index) as typed, non-empty data.
#     T2  token build pipeline: ONE build script emits 3 artifacts (CSS custom
#         properties, a Tailwind v4 theme, typed TS exports); all 3 exist
#         non-empty; a second build is byte-identical (idempotent).
#     T3  palette fidelity: every color in the token source is value-equal to
#         the locked src/styles/globals.css palette.
#   Layer 1 — primitives
#     P1  primitive package boundary: packages/ui is an npm-workspace package
#         with its own package.json; it builds; the app resolves the import.
#     P2  token-typed props (compile-time): the bad tsc fixture fails, the
#         good fixture compiles.
#     P3  no untyped className escape: zero raw `className` passthrough in
#         packages/ui source; only `unsafe_className` is allowed.
#     P4  primitive inventory present: every primitive in the inventory is a
#         named export of the ui package.
#   Layer 2 — shell
#     S1  shell is pure chrome: the element wrapping the route outlet applies
#         zero content geometry (static grep + rendered-DOM check).
#   Layer 3 — routes/pieces + geometry ban
#     G1  no-geometry ESLint rule: a raw-geometry fixture makes `npm run lint`
#         exit non-zero; the unsafe_className escape-hatch fixture passes.
#     G2  content surface clean: zero raw geometry across src/routes/** and
#         editorial piece files (the rule passes clean on the real codebase).
#     G3  routes migrated: every route renders through the Page primitive
#         ([data-page-root]); checked at runtime.
#   Piece / data-figure contract
#     D1  editorial piece system: Piece + the editorial content primitives
#         exist as named exports of the ui package.
#     D2  reference interactive data figure: a token-typed interactive data
#         figure exists, consuming only token values, with no new
#         charting-library runtime dependency.
#     D3  embed contract proven: the demo piece renders the reference figure
#         embedded via Figure; the figure mutates on hover/focus; the demo
#         piece DOM is intact; checked at runtime.
#   CI enforcement
#     E1  Storybook: `npm run build-storybook` succeeds; story count >=
#         primitive count.
#     E2  accessibility: the axe-core run (`npm run test:a11y`) reports zero
#         violations.
#     E3  visual baselines: `npm run test:visual` passes against baseline.
#     E4  ADRs + docs: docs/design-decisions.md and docs/design-system.md
#         exist and are non-empty.
#   No regression
#     R1  no regression (baseline-relative guard): `npm run build` is green;
#         hero-composition.sh reports 5/5; design-system.sh's 7 substantive
#         sub-checks (build, tokens, prims, adopt, no_raw_layout, no_raw_type,
#         rhythm) all pass; all routes render h1/h2 with zero console errors.
#         NOTE: design-system.sh's `noregress` sub-check is 0 at baseline
#         (HEAD shipped a 6-row LeadChart; check-system.mjs hardcodes a 10-row
#         assertion; LeadChart internals are out of scope) — R1 does not
#         require it. The route-render regression it would cover is
#         independently asserted by the runtime route check.
#
# Build is the ONLY hard short-circuit: a failed `npm run build` prints
# `cq-platform-score: 0/19 (build failed)` and exits 1. Every other missing
# artifact (no token build, no packages/ui, no ESLint rule, no Storybook, no
# axe, no Playwright visual, no Page/Piece/Figure, no docs) scores that check
# 0 and the benchmark CONTINUES.
#
# Exits 0 iff cq-platform-score == 19; non-zero otherwise.

set -u
set -o pipefail

# ── Repo root: derive from this script's own location so the benchmark runs
#    against whatever checkout / worktree it lives in (NOT a hardcoded path). ─
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$REPO_ROOT" || { echo "cq-platform-score: 0/19 (cannot cd to repo root)"; exit 1; }

N=19
PORT=5181
TMP="$(mktemp -d /tmp/cq-platform.XXXXXX)"
BUILD_LOG="${TMP}/build.log"
DEV_LOG="${TMP}/dev.log"
PLATFORM_CHECKER="scripts/benchmarks/check-platform.mjs"

cleanup() {
  lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
  rm -rf "$TMP" 2>/dev/null || true
}
trap cleanup EXIT

# ── 1. Free the port. ───────────────────────────────────────────────────────
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

# ── 2. Ensure node_modules + Playwright. ────────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo "[cq-platform] installing dependencies (npm install)..." >&2
  npm install >"${TMP}/npm-install.log" 2>&1 || {
    echo "cq-platform-score: 0/${N} (npm install failed)"
    cat "${TMP}/npm-install.log"
    exit 1
  }
fi
if [ ! -d "node_modules/playwright" ] && [ ! -d "node_modules/@playwright" ]; then
  echo "[cq-platform] installing playwright (devDep)..." >&2
  npm i -D playwright >"${TMP}/pw-install.log" 2>&1 || {
    echo "cq-platform-score: 0/${N} (playwright install failed)"
    cat "${TMP}/pw-install.log"
    exit 1
  }
fi
npx playwright install chromium >"${TMP}/pw-browser.log" 2>&1 || {
  echo "[cq-platform] WARN: playwright chromium install reported an error (continuing)" >&2
  cat "${TMP}/pw-browser.log" >&2
}

# ── 3. Build — the ONLY hard short-circuit. ─────────────────────────────────
npm run build >"$BUILD_LOG" 2>&1
BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
  echo "cq-platform-score: 0/${N} (build failed)"
  cat "$BUILD_LOG"
  exit 1
fi
R1_BUILD=1

# ── Score variables (default 0; flipped to 1 only on a clean pass). ─────────
T1=0; T2=0; T3=0
P1=0; P2=0; P3=0; P4=0
S1=0
G1=0; G2=0; G3=0
D1=0; D2=0; D3=0
E1=0; E2=0; E3=0
R1=0

# ── helper: does an npm script exist? ───────────────────────────────────────
has_npm_script() {
  node -e "try{const s=require('${REPO_ROOT}/package.json').scripts||{};process.exit(s['$1']?0:1)}catch(e){process.exit(1)}" 2>/dev/null
}

# ════════════════════════════════════════════════════════════════════════════
# LAYER 0 — TOKENS
# ════════════════════════════════════════════════════════════════════════════

# -- T1: structured token source exports all 8 categories, non-empty. --------
# Token source pinned by contract.md to packages/tokens. The check resolves
# the package and asserts the 8 categories. Missing package -> 0 (no crash).
if [ -f "packages/tokens/package.json" ]; then
  T1_OUT=$(node "scripts/benchmarks/check-platform-static.mjs" t1 2>"${TMP}/t1.err")
  [ "$T1_OUT" = "1" ] && T1=1
  cat "${TMP}/t1.err" >&2
else
  echo "[T1] packages/tokens/package.json does not exist" >&2
fi

# -- T2: one build script emits 3 artifacts; idempotent. ---------------------
# Contract pins the build to `npm run build:tokens`, emitting:
#   packages/tokens/dist/tokens.css   (CSS custom properties)
#   packages/tokens/dist/theme.css    (Tailwind v4 theme)
#   packages/tokens/dist/index.{js,d.ts}  (typed TS exports)
if has_npm_script "build:tokens"; then
  rm -rf packages/tokens/dist 2>/dev/null || true
  npm run build:tokens >"${TMP}/tokens-build-1.log" 2>&1
  TB1=$?
  ART_CSS="packages/tokens/dist/tokens.css"
  ART_THEME="packages/tokens/dist/theme.css"
  # typed TS exports: accept index.d.ts (preferred) or index.ts emitted to dist.
  ART_TS=""
  for cand in packages/tokens/dist/index.d.ts packages/tokens/dist/index.ts \
              packages/tokens/dist/index.js; do
    [ -s "$cand" ] && ART_TS="$cand" && break
  done
  if [ $TB1 -ne 0 ]; then
    echo "[T2] build:tokens (run 1) failed" >&2
    cat "${TMP}/tokens-build-1.log" >&2
  elif [ ! -s "$ART_CSS" ] || [ ! -s "$ART_THEME" ] || [ -z "$ART_TS" ]; then
    echo "[T2] missing/empty artifact after build (css=$( [ -s "$ART_CSS" ] && echo ok || echo MISS ) theme=$( [ -s "$ART_THEME" ] && echo ok || echo MISS ) ts=${ART_TS:-MISS})" >&2
  else
    # Snapshot, rebuild, compare byte-for-byte (idempotence).
    cp "$ART_CSS" "${TMP}/t2-css-a"; cp "$ART_THEME" "${TMP}/t2-theme-a"; cp "$ART_TS" "${TMP}/t2-ts-a"
    npm run build:tokens >"${TMP}/tokens-build-2.log" 2>&1
    TB2=$?
    if [ $TB2 -ne 0 ]; then
      echo "[T2] build:tokens (run 2) failed" >&2
      cat "${TMP}/tokens-build-2.log" >&2
    elif cmp -s "${TMP}/t2-css-a" "$ART_CSS" \
       && cmp -s "${TMP}/t2-theme-a" "$ART_THEME" \
       && cmp -s "${TMP}/t2-ts-a" "$ART_TS"; then
      T2=1
    else
      echo "[T2] token build is NOT idempotent (artifacts differ between runs)" >&2
    fi
  fi
else
  echo "[T2] no 'build:tokens' npm script" >&2
fi

# -- T3: token color values equal the locked globals.css palette. ------------
if [ -f "packages/tokens/package.json" ]; then
  T3_OUT=$(node "scripts/benchmarks/check-platform-static.mjs" t3 2>"${TMP}/t3.err")
  [ "$T3_OUT" = "1" ] && T3=1
  cat "${TMP}/t3.err" >&2
else
  echo "[T3] packages/tokens/package.json does not exist" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# LAYER 1 — PRIMITIVES
# ════════════════════════════════════════════════════════════════════════════

# -- P1: packages/ui is an npm-workspace package; builds; app resolves it. ---
UI_PKG_NAME=""
if [ -f "packages/ui/package.json" ]; then
  UI_PKG_NAME=$(node -e "try{process.stdout.write(require('${REPO_ROOT}/packages/ui/package.json').name||'')}catch(e){}" 2>/dev/null)
fi
if [ -z "$UI_PKG_NAME" ]; then
  echo "[P1] packages/ui/package.json missing or has no name" >&2
else
  # the app must declare packages/ui as a dependency (workspace) and import it.
  APP_DECLARES=$(node -e "
    try{
      const p=require('${REPO_ROOT}/package.json');
      const d=Object.assign({},p.dependencies,p.devDependencies);
      process.exit(d['${UI_PKG_NAME}']?0:1);
    }catch(e){process.exit(1)}" 2>/dev/null; echo $?)
  # build the ui package if it exposes a build script (a pure-source workspace
  # consumed by Vite need not build — absence of the script is acceptable).
  UI_BUILD_OK=1
  if node -e "try{const s=require('${REPO_ROOT}/packages/ui/package.json').scripts||{};process.exit(s.build?0:1)}catch(e){process.exit(1)}" 2>/dev/null; then
    ( cd packages/ui && npm run build ) >"${TMP}/ui-build.log" 2>&1 || UI_BUILD_OK=0
    [ $UI_BUILD_OK -ne 0 ] && { echo "[P1] packages/ui build failed" >&2; cat "${TMP}/ui-build.log" >&2; }
  fi
  # the app resolves an import of the package by name (grep src for it).
  APP_IMPORTS=$(grep -rEl "from ['\"]${UI_PKG_NAME}(/[^'\"]*)?['\"]" src 2>/dev/null | head -1)
  if [ "$APP_DECLARES" != "0" ]; then
    echo "[P1] app package.json does not depend on '${UI_PKG_NAME}'" >&2
  elif [ -z "$APP_IMPORTS" ]; then
    echo "[P1] no src file imports from '${UI_PKG_NAME}'" >&2
  elif [ $UI_BUILD_OK -ne 0 ]; then
    : # already logged
  else
    # the production build already succeeded above (R1_BUILD=1), which proves
    # Vite resolved the workspace import. P1 passes.
    P1=1
  fi
fi

# -- P2: token-typed props — bad fixture fails tsc, good fixture compiles. ----
# Fixtures pinned by contract.md:
#   scripts/benchmarks/fixtures/ts-bad/    — uses an off-scale token value
#   scripts/benchmarks/fixtures/ts-good/   — the valid equivalent
# Each fixture dir carries its own tsconfig.json. The check: bad exits != 0,
# good exits 0.
FIX_BAD="scripts/benchmarks/fixtures/ts-bad"
FIX_GOOD="scripts/benchmarks/fixtures/ts-good"
if [ -f "${FIX_BAD}/tsconfig.json" ] && [ -f "${FIX_GOOD}/tsconfig.json" ]; then
  npx tsc -p "$FIX_BAD" --noEmit >"${TMP}/tsc-bad.log" 2>&1
  BAD_EXIT=$?
  npx tsc -p "$FIX_GOOD" --noEmit >"${TMP}/tsc-good.log" 2>&1
  GOOD_EXIT=$?
  if [ $BAD_EXIT -ne 0 ] && [ $GOOD_EXIT -eq 0 ]; then
    P2=1
  else
    echo "[P2] expected bad fixture tsc != 0 (got $BAD_EXIT) and good fixture tsc == 0 (got $GOOD_EXIT)" >&2
    [ $BAD_EXIT -eq 0 ] && { echo "[P2] --- bad fixture compiled but should not have ---" >&2; }
    [ $GOOD_EXIT -ne 0 ] && { echo "[P2] --- good fixture failed: ---" >&2; cat "${TMP}/tsc-good.log" >&2; }
  fi
else
  echo "[P2] tsc fixtures missing (${FIX_BAD}/tsconfig.json, ${FIX_GOOD}/tsconfig.json)" >&2
fi

# -- P3: no untyped className passthrough in packages/ui; only unsafe_className.
if [ -d "packages/ui/src" ]; then
  # Find a bare `className` prop reference in a primitive's prop surface.
  # Allowed: `unsafe_className`, and the internal `cn(...)`/`class=` of the
  # primitive's own render. We flag a prop NAMED exactly `className` —
  # i.e. `className?:` / `className:` / `className,` (destructure) /
  # `className=` passed through from props. The escape hatch is the only
  # token-shaped name allowed, and it is `unsafe_className`.
  CLASSNAME_HITS=$(grep -rnE '(^|[^a-zA-Z_])className[[:space:]]*[:?,]' packages/ui/src 2>/dev/null \
    | grep -vE 'unsafe_className' || true)
  if [ -n "$CLASSNAME_HITS" ]; then
    echo "[P3] untyped 'className' prop surface present in packages/ui (only unsafe_className allowed):" >&2
    echo "$CLASSNAME_HITS" >&2
  else
    P3=1
  fi
else
  echo "[P3] packages/ui/src does not exist" >&2
fi

# -- P4: every inventory primitive is a named export of the ui package. ------
if [ -n "$UI_PKG_NAME" ] && [ -d "packages/ui/src" ]; then
  P4_OUT=$(node "scripts/benchmarks/check-platform-static.mjs" p4 2>"${TMP}/p4.err")
  [ "$P4_OUT" = "1" ] && P4=1
  cat "${TMP}/p4.err" >&2
else
  echo "[P4] packages/ui not present — cannot check inventory exports" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# LAYER 2 — SHELL
# ════════════════════════════════════════════════════════════════════════════

# -- S1: the shell wrapping the route outlet applies zero content geometry. --
# Static half: the file holding the <Outlet/> wrapper must not carry
# content-geometry utilities on that element. Layout lives in
# src/components/layout/Layout.tsx today; the executor may rename it, so the
# check finds whichever src file renders <Outlet and greps the element that
# wraps it.
SHELL_FILE=$(grep -rEl '<Outlet' src 2>/dev/null | head -1)
if [ -z "$SHELL_FILE" ]; then
  echo "[S1] no src file renders <Outlet> — cannot locate the app shell" >&2
else
  # Geometry utilities banned on the shell's content-wrapping element.
  SHELL_GEO=$(grep -nE 'max-w-|[^a-z]px-[0-9]|[^a-z]py-[0-9]|[^a-z]gap-[0-9]|mx-auto|[a-z]+-\[' "$SHELL_FILE" 2>/dev/null || true)
  # The runtime half is asserted by the S1 DOM probe below; the static grep
  # is advisory. We treat S1 as: static grep clean AND DOM probe clean.
  SHELL_GEO_STATIC=0
  [ -z "$SHELL_GEO" ] && SHELL_GEO_STATIC=1
  if [ $SHELL_GEO_STATIC -ne 1 ]; then
    echo "[S1] static: content-geometry utilities present in shell file ${SHELL_FILE}:" >&2
    echo "$SHELL_GEO" >&2
  fi
  # S1 final score is set after the runtime probe (needs the dev server).
fi

# ════════════════════════════════════════════════════════════════════════════
# LAYER 3 — GEOMETRY BAN (static halves)
# ════════════════════════════════════════════════════════════════════════════

# -- G1: the no-geometry ESLint rule fires on raw geometry, passes the hatch. -
# Fixtures pinned by contract.md:
#   scripts/benchmarks/fixtures/eslint-geo-bad.tsx   — raw geometry on JSX
#   scripts/benchmarks/fixtures/eslint-geo-good.tsx  — uses unsafe_className
# The rule is wired into `npm run lint`. The check lints each fixture in
# isolation: bad must exit != 0, good must exit 0.
if has_npm_script "lint"; then
  GEO_BAD="scripts/benchmarks/fixtures/eslint-geo-bad.tsx"
  GEO_GOOD="scripts/benchmarks/fixtures/eslint-geo-good.tsx"
  if [ -f "$GEO_BAD" ] && [ -f "$GEO_GOOD" ]; then
    # Lint the bad fixture alone. `npm run lint -- <path>` forwards the path
    # to eslint. If the project's lint script ignores forwarded args, the
    # executor must instead expose `lint:fixture` — handled below as fallback.
    npx eslint "$GEO_BAD" >"${TMP}/eslint-bad.log" 2>&1
    EB=$?
    npx eslint "$GEO_GOOD" >"${TMP}/eslint-good.log" 2>&1
    EG=$?
    # Also confirm the rule is actually part of `npm run lint` (not just a
    # standalone eslintrc): the lint script must run eslint.
    LINT_RUNS_ESLINT=0
    node -e "
      try{
        const s=require('${REPO_ROOT}/package.json').scripts||{};
        process.exit(/eslint/.test(s.lint||'')?0:1);
      }catch(e){process.exit(1)}" 2>/dev/null && LINT_RUNS_ESLINT=1
    if [ $EB -ne 0 ] && [ $EG -eq 0 ] && [ $LINT_RUNS_ESLINT -eq 1 ]; then
      G1=1
    else
      echo "[G1] expected eslint(bad)!=0 (got $EB), eslint(good)==0 (got $EG), lint-script-runs-eslint=$LINT_RUNS_ESLINT" >&2
      [ $EB -eq 0 ] && { echo "[G1] --- bad fixture passed lint but should have failed ---" >&2; }
      [ $EG -ne 0 ] && { echo "[G1] --- good fixture failed lint: ---" >&2; cat "${TMP}/eslint-good.log" >&2; }
    fi
  else
    echo "[G1] eslint geometry fixtures missing (${GEO_BAD}, ${GEO_GOOD})" >&2
  fi
else
  echo "[G1] no 'lint' npm script" >&2
fi

# -- G2: zero raw geometry across src/routes/** + editorial piece files. -----
# `npm run lint` must pass clean on the real codebase. We additionally grep
# route + piece files for raw geometry as a fast static guard. The geometry
# vocabulary banned on the content surface: mx-auto, max-w-*, px-*, py-*,
# gap-*, arbitrary *-[...].
if has_npm_script "lint"; then
  npm run lint >"${TMP}/lint-real.log" 2>&1
  LINT_REAL=$?
  # static grep over routes + pieces. `pieces` dir is created by the executor;
  # if absent, only routes are scanned. The escape hatch unsafe_className is
  # excluded from the hit set.
  GEO_GLOB_DIRS="src/routes"
  [ -d "src/pieces" ] && GEO_GLOB_DIRS="$GEO_GLOB_DIRS src/pieces"
  [ -d "packages/ui/src/pieces" ] && GEO_GLOB_DIRS="$GEO_GLOB_DIRS packages/ui/src/pieces"
  RAW_GEO=$(grep -rnE 'mx-auto|max-w-|[^a-z]px-[0-9]|[^a-z]py-[0-9]|[^a-z]gap-[0-9]|[a-z]+-\[' $GEO_GLOB_DIRS 2>/dev/null \
    | grep -vE 'unsafe_className' || true)
  if [ $LINT_REAL -eq 0 ] && [ -z "$RAW_GEO" ]; then
    G2=1
  else
    [ $LINT_REAL -ne 0 ] && { echo "[G2] 'npm run lint' failed on the real codebase:" >&2; tail -40 "${TMP}/lint-real.log" >&2; }
    [ -n "$RAW_GEO" ] && { echo "[G2] raw geometry utilities present in route/piece files:" >&2; echo "$RAW_GEO" >&2; }
  fi
else
  echo "[G2] no 'lint' npm script" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# PIECE / DATA-FIGURE CONTRACT (static halves)
# ════════════════════════════════════════════════════════════════════════════

# -- D1: Piece + the editorial content primitives exist as ui exports. -------
if [ -n "$UI_PKG_NAME" ] && [ -d "packages/ui/src" ]; then
  D1_OUT=$(node "scripts/benchmarks/check-platform-static.mjs" d1 2>"${TMP}/d1.err")
  [ "$D1_OUT" = "1" ] && D1=1
  cat "${TMP}/d1.err" >&2
else
  echo "[D1] packages/ui not present — cannot check editorial primitives" >&2
fi

# -- D2: reference interactive data figure — token-typed, no charting dep. ---
# Contract pins the reference figure source to
# packages/ui/src/figures/ (any *.tsx). The check:
#   (a) at least one component file exists under that dir
#   (b) it carries no raw color/size — no text-[..]/p-[..]/w-[..]/bg-[..],
#       no #hex, no rgb()/hsl() literals (color comes from token vars only)
#   (c) package.json `dependencies` introduced no new charting library
#       (subset-of-baseline check — also covered by Constraint 2; D2 re-checks
#       the well-known charting-lib names explicitly).
if [ -d "packages/ui/src/figures" ]; then
  FIG_FILES=$(find packages/ui/src/figures -name '*.tsx' -type f 2>/dev/null)
  if [ -z "$FIG_FILES" ]; then
    echo "[D2] no *.tsx component under packages/ui/src/figures" >&2
  else
    D2_RAW=$(grep -rnE 'text-\[|[^a-z]p-\[|[^a-z]w-\[|[^a-z]h-\[|bg-\[|#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(|[^-]hsl\(' $FIG_FILES 2>/dev/null || true)
    # charting libraries that would constitute a new runtime dep.
    CHART_DEP=$(node -e "
      try{
        const d=require('${REPO_ROOT}/package.json').dependencies||{};
        const banned=['recharts','d3','victory','chart.js','nivo','@nivo/core','visx','@visx/visx','plotly.js','apexcharts','echarts','highcharts','chartjs'];
        const hit=banned.filter(b=>d[b]);
        if(hit.length){console.error('[D2] new charting runtime dep: '+hit.join(','));process.exit(1)}
        process.exit(0);
      }catch(e){process.exit(1)}" 2>"${TMP}/d2-dep.err"; echo $?)
    cat "${TMP}/d2-dep.err" >&2
    if [ -n "$D2_RAW" ]; then
      echo "[D2] reference figure carries raw color/size (must be token-only):" >&2
      echo "$D2_RAW" >&2
    elif [ "$CHART_DEP" != "0" ]; then
      : # already logged
    else
      D2=1
    fi
  fi
else
  echo "[D2] packages/ui/src/figures does not exist" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# CI ENFORCEMENT
# ════════════════════════════════════════════════════════════════════════════

# -- E1: Storybook builds; story count >= primitive count. -------------------
if has_npm_script "build-storybook"; then
  npm run build-storybook >"${TMP}/storybook-build.log" 2>&1
  SB=$?
  if [ $SB -ne 0 ]; then
    echo "[E1] 'npm run build-storybook' failed:" >&2
    tail -40 "${TMP}/storybook-build.log" >&2
  else
    E1_OUT=$(node "scripts/benchmarks/check-platform-static.mjs" e1 2>"${TMP}/e1.err")
    [ "$E1_OUT" = "1" ] && E1=1
    cat "${TMP}/e1.err" >&2
  fi
else
  echo "[E1] no 'build-storybook' npm script" >&2
fi

# -- E2: axe-core run reports zero violations. -------------------------------
# Contract pins the axe run to `npm run test:a11y`, exiting 0 iff zero
# violations across the Storybook stories + the migrated routes + the demo
# piece.
if has_npm_script "test:a11y"; then
  npm run test:a11y >"${TMP}/a11y.log" 2>&1
  AX=$?
  if [ $AX -eq 0 ]; then
    E2=1
  else
    echo "[E2] 'npm run test:a11y' reported violations / failed:" >&2
    tail -40 "${TMP}/a11y.log" >&2
  fi
else
  echo "[E2] no 'test:a11y' npm script" >&2
fi

# -- E3: Playwright visual-regression run passes against baseline. -----------
# Contract pins the visual run to `npm run test:visual`.
if has_npm_script "test:visual"; then
  npm run test:visual >"${TMP}/visual.log" 2>&1
  VS=$?
  if [ $VS -eq 0 ]; then
    E3=1
  else
    echo "[E3] 'npm run test:visual' failed against baseline:" >&2
    tail -40 "${TMP}/visual.log" >&2
  fi
else
  echo "[E3] no 'test:visual' npm script" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# E4 — DOCS / ADRs (no server needed)
# ════════════════════════════════════════════════════════════════════════════
if [ -s "docs/design-decisions.md" ] && [ -s "docs/design-system.md" ]; then
  E4=1
else
  E4=0
  [ ! -s "docs/design-decisions.md" ] && echo "[E4] docs/design-decisions.md missing or empty" >&2
  [ ! -s "docs/design-system.md" ] && echo "[E4] docs/design-system.md missing or empty" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# R1 — NO REGRESSION (static halves): the two prior benchmark scripts.
# ════════════════════════════════════════════════════════════════════════════
# The prior scripts hardcode PROJECT_ROOT=/Users/benjamincrane/carrying-quota-v1
# (the main checkout). To verify the no-regression guard against THIS worktree,
# each prior script is copied to a temp file with PROJECT_ROOT rewritten to
# REPO_ROOT, then the rewritten copy is run. The check-*.mjs helpers they call
# are relative paths resolved after `cd`, so they resolve inside REPO_ROOT.
#
# BASELINE-RELATIVE (validator finding — see ## Validator notes in the
# directive): on the current main HEAD, design-system.sh reports 7/8, NOT 8/8.
# Its `noregress` sub-check hardcodes a 10-row LeadChart assertion in
# check-system.mjs, but HEAD 18b930c shipped a 6-row LeadChart (the "six
# highest-paying seats" home rework). LeadChart internals are explicitly OUT
# OF SCOPE this cycle, so the executor cannot — and must not — move that
# sub-check. R1 is a no-regression GUARD: it requires the executor not to
# regress the site, not to fix a pre-existing out-of-scope drift. Therefore
# R1 requires hero == 5/5 (green at baseline) AND the 7 substantive
# design-system sub-checks (build, tokens, prims, adopt, no_raw_layout,
# no_raw_type, rhythm) all == 1 — exactly the baseline-green set. The
# design-system `noregress` sub-check is NOT required by R1 (it is 0 at
# baseline and frozen by an out-of-scope artifact); the route-render
# regression it would otherwise cover is independently asserted by
# R1RUNTIME (check-platform.mjs) below.
R1_HERO=0
R1_DS=0
HERO_SH="scripts/benchmarks/hero-composition.sh"
DS_SH="scripts/benchmarks/design-system.sh"

# Rewrite a prior script's PROJECT_ROOT to this worktree and run it.
# Echoes the script's stdout; returns the script's exit code.
run_prior_bench_raw() {
  # $1 = path to prior script, $2 = label
  local src="$1" label="$2"
  if [ ! -f "$src" ]; then
    echo "[R1] prior benchmark ${src} not found" >&2
    return 127
  fi
  local rewritten="${TMP}/$(basename "$src")"
  sed -e "s#^PROJECT_ROOT=.*#PROJECT_ROOT=\"${REPO_ROOT}\"#" "$src" >"$rewritten"
  chmod +x "$rewritten"
  bash "$rewritten" 2>"${TMP}/${label}.err"
}

# hero-composition.sh — strict: must report 5/5 (green at baseline).
HERO_OUT=$(run_prior_bench_raw "$HERO_SH" "hero")
HERO_CODE=$?
echo "$HERO_OUT" | sed "s/^/[R1:hero] /" >&2
if [ $HERO_CODE -eq 0 ] && echo "$HERO_OUT" | grep -qF "structural-composition-score: 5/5"; then
  R1_HERO=1
else
  echo "[R1] hero-composition.sh did NOT report 5/5 (exit ${HERO_CODE}) — the executor regressed the hero" >&2
  cat "${TMP}/hero.err" >&2
fi

# design-system.sh — baseline-relative: the 7 substantive sub-checks must all
# be 1. (`noregress` is 0 at baseline due to the out-of-scope 6-row LeadChart;
# R1 does not require it. Route-render regressions are covered by R1RUNTIME.)
DS_OUT=$(run_prior_bench_raw "$DS_SH" "ds")
echo "$DS_OUT" | sed "s/^/[R1:ds] /" >&2
ds_check() {
  # $1 = sub-check label as printed by design-system.sh ("build", "tokens"...)
  printf '%s\n' "$DS_OUT" | grep -E "^[[:space:]]+$1:" | awk '{print $2}' | tr -dc '01' | tail -c1
}
DS_FAIL=0
for sub in build tokens prims adopt no_raw_layout no_raw_type rhythm; do
  v=$(ds_check "$sub")
  if [ "$v" != "1" ]; then
    DS_FAIL=1
    echo "[R1] design-system.sh sub-check '${sub}' = ${v:-MISSING} (expected 1)" >&2
  fi
done
if [ $DS_FAIL -eq 0 ]; then
  R1_DS=1
else
  echo "[R1] design-system.sh substantive sub-checks regressed" >&2
  cat "${TMP}/ds.err" >&2
fi

# ════════════════════════════════════════════════════════════════════════════
# START DEV SERVER for the runtime checks (S1 DOM probe, G3, D3, R1 runtime).
# ════════════════════════════════════════════════════════════════════════════
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1
# vite.config pins the dev server to 5180; run a second instance on $PORT via
# the --port flag so it cannot collide with the prior-benchmark runs above.
nohup npm run dev -- --port ${PORT} --strictPort >"$DEV_LOG" 2>&1 &
DEV_BG_PID=$!
disown $DEV_BG_PID 2>/dev/null || true
sleep 2

ready=0
for i in $(seq 1 40); do
  if curl -sf "http://localhost:${PORT}" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

S1_RUNTIME=0
G3=0
D3=0
R1_RUNTIME=0
if [ $ready -ne 1 ]; then
  echo "[runtime] dev server did not start on :${PORT} within 40s — S1/G3/D3/R1-runtime forced 0" >&2
  cat "$DEV_LOG" >&2
else
  # -- S1 runtime: the element wrapping the route outlet has no content
  #    geometry (no max-width, no horizontal padding, no gap) at 1440px. --
  S1_RUNTIME=$(CQ_BENCH_BASE="http://localhost:${PORT}" \
    node "scripts/benchmarks/check-platform-shell.mjs" 2>"${TMP}/s1.err")
  cat "${TMP}/s1.err" >&2
  S1_RUNTIME=$(printf '%s' "${S1_RUNTIME:-0}" | tr -dc '01' | tail -c1)
  [ -z "$S1_RUNTIME" ] && S1_RUNTIME=0

  # -- G3 + D3 + R1 runtime via the platform checker. --
  CHECK_OUT=$(CQ_BENCH_BASE="http://localhost:${PORT}" \
    node "$PLATFORM_CHECKER" 2>"${TMP}/platform-check.err")
  cat "${TMP}/platform-check.err" >&2
  G3=$(printf '%s\n' "$CHECK_OUT" | grep -E '^G3:' | awk '{print $2}')
  D3=$(printf '%s\n' "$CHECK_OUT" | grep -E '^D3:' | awk '{print $2}')
  R1_RUNTIME=$(printf '%s\n' "$CHECK_OUT" | grep -E '^R1RUNTIME:' | awk '{print $2}')
fi

# kill the dev server.
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true

# ── Normalise every runtime value: anything not "1" is 0. ───────────────────
norm() { case "$1" in 1) echo 1;; *) echo 0;; esac; }
S1_RUNTIME=$(norm "${S1_RUNTIME:-0}")
G3=$(norm "${G3:-0}")
D3=$(norm "${D3:-0}")
R1_RUNTIME=$(norm "${R1_RUNTIME:-0}")

# -- S1 final: static grep clean AND runtime DOM probe clean. -----------------
if [ -n "${SHELL_FILE:-}" ] && [ "${SHELL_GEO_STATIC:-0}" = "1" ] && [ "$S1_RUNTIME" = "1" ]; then
  S1=1
else
  S1=0
fi

# -- R1 final: build green AND both prior scripts fully green AND runtime ok. -
if [ "$R1_BUILD" = "1" ] && [ "$R1_HERO" = "1" ] && [ "$R1_DS" = "1" ] && [ "$R1_RUNTIME" = "1" ]; then
  R1=1
else
  R1=0
fi

# ── Score + report. ─────────────────────────────────────────────────────────
SCORE=$((T1 + T2 + T3 + P1 + P2 + P3 + P4 + S1 + G1 + G2 + G3 + D1 + D2 + D3 + E1 + E2 + E3 + E4 + R1))

echo "cq-platform-score: ${SCORE}/${N}"
echo "  T1 token-source:        ${T1}"
echo "  T2 token-build:         ${T2}"
echo "  T3 palette-fidelity:    ${T3}"
echo "  P1 ui-package:          ${P1}"
echo "  P2 token-typed-props:   ${P2}"
echo "  P3 no-className-escape: ${P3}"
echo "  P4 primitive-inventory: ${P4}"
echo "  S1 shell-pure-chrome:   ${S1}"
echo "  G1 no-geometry-rule:    ${G1}"
echo "  G2 content-surface:     ${G2}"
echo "  G3 routes-migrated:     ${G3}"
echo "  D1 piece-system:        ${D1}"
echo "  D2 reference-figure:    ${D2}"
echo "  D3 embed-contract:      ${D3}"
echo "  E1 storybook:           ${E1}"
echo "  E2 accessibility:       ${E2}"
echo "  E3 visual-baselines:    ${E3}"
echo "  E4 adrs-docs:           ${E4}"
echo "  R1 no-regression:       ${R1}"

if [ "$SCORE" -eq "$N" ]; then
  exit 0
else
  exit 1
fi
