#!/usr/bin/env bash
# design-system.sh
# Measures design-system-score (0..8) for the Carrying Quota layout-primitive
# + token-system refactor.
#
# Score (each +1):
#   BUILD          npm run build exits 0
#   TOKENS         src/design/tokens.ts exports the 5 union types + 5 class maps
#   PRIMS          the 5 primitive files exist with their named exports
#   ADOPT          the 4 consumer files import + render <Section>
#   NO_RAW_LAYOUT  the 4 consumer files have zero raw layout utilities
#   NO_RAW_TYPE    the 4 consumer files have zero raw type-size utilities
#   RHYTHM         homepage main>section shows >=2 distinct background colors
#   NOREGRESS      all 6 routes render h1/h2 w/o console errors; hero grid +
#                  email + 10-row chart intact
#
# Exits 0 only if score == 8; non-zero otherwise.

set -u
set -o pipefail

PROJECT_ROOT="/Users/benjamincrane/carrying-quota-v1"
cd "$PROJECT_ROOT" || { echo "design-system-score: 0/8 (cannot cd to project)"; exit 1; }

PORT=5180
BUILD_LOG="/tmp/cq-ds-build.log"
DEV_LOG="/tmp/cq-ds-dev.log"
CHECKER="scripts/benchmarks/check-system.mjs"

cleanup() {
  lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
}
trap cleanup EXIT

# ── 1. Free the port. ──────────────────────────────────────────────────────
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

# ── 2. Ensure Playwright is installed (devDep). ────────────────────────────
if [ ! -d "node_modules/playwright" ]; then
  echo "[design-system] installing playwright (devDep)..." >&2
  npm i -D playwright >/tmp/cq-ds-playwright-install.log 2>&1 || {
    echo "design-system-score: 0/8 (playwright install failed)"
    cat /tmp/cq-ds-playwright-install.log
    exit 1
  }
  npx playwright install chromium >/tmp/cq-ds-playwright-browser.log 2>&1 || {
    echo "design-system-score: 0/8 (playwright chromium install failed)"
    cat /tmp/cq-ds-playwright-browser.log
    exit 1
  }
fi

# ── 3. Build. ──────────────────────────────────────────────────────────────
npm run build > "$BUILD_LOG" 2>&1
BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
  echo "design-system-score: 0/8 (build failed)"
  cat "$BUILD_LOG"
  exit 1
fi
BUILD=1

# ── 4. Static checks. ──────────────────────────────────────────────────────
TOKENS_FILE="src/design/tokens.ts"
CONSUMERS=(
  "src/components/home/Hero.tsx"
  "src/components/home/ThisWeek.tsx"
  "src/components/home/IndexTile.tsx"
  "src/components/layout/ComingSoon.tsx"
)
PRIM_DIR="src/components/primitives"

# -- TOKENS: tokens.ts exists and contains every required export name. -------
TOKENS=0
if [ -f "$TOKENS_FILE" ]; then
  TOKENS=1
  for name in SurfaceVariant RhythmGutter SectionDivide TypeScale Gap \
              surfaceClasses gutterClasses divideClasses typeClasses gapClasses; do
    if ! grep -q "$name" "$TOKENS_FILE"; then
      TOKENS=0
      echo "[static] TOKENS: missing export '$name' in $TOKENS_FILE" >&2
    fi
  done
else
  echo "[static] TOKENS: $TOKENS_FILE does not exist" >&2
fi

# -- PRIMS: the 5 primitive files exist, each with its named export fn. ------
PRIMS=1
for prim in Section Container Stack Cluster Text; do
  f="${PRIM_DIR}/${prim}.tsx"
  if [ ! -f "$f" ]; then
    PRIMS=0
    echo "[static] PRIMS: $f does not exist" >&2
  elif ! grep -Eq "export function ${prim}\b" "$f"; then
    PRIMS=0
    echo "[static] PRIMS: $f missing 'export function ${prim}'" >&2
  fi
done

# -- ADOPT: each consumer imports Section from the canonical path + uses it. -
ADOPT=1
for f in "${CONSUMERS[@]}"; do
  if [ ! -f "$f" ]; then
    ADOPT=0
    echo "[static] ADOPT: $f does not exist" >&2
    continue
  fi
  if ! grep -Eq "import .*\bSection\b.* from ['\"]@/components/primitives/Section['\"]" "$f"; then
    ADOPT=0
    echo "[static] ADOPT: $f does not import Section from @/components/primitives/Section" >&2
  fi
  if ! grep -q "<Section" "$f"; then
    ADOPT=0
    echo "[static] ADOPT: $f does not render <Section" >&2
  fi
done

# -- NO_RAW_LAYOUT: zero raw layout utilities across the 4 consumer files. ---
NO_RAW_LAYOUT=1
RAW_LAYOUT_HITS=$(grep -nE 'px-6|md:px-10|max-w-\[|py-[0-9]|md:py-[0-9]' "${CONSUMERS[@]}" 2>/dev/null || true)
if [ -n "$RAW_LAYOUT_HITS" ]; then
  NO_RAW_LAYOUT=0
  echo "[static] NO_RAW_LAYOUT: raw layout utilities present:" >&2
  echo "$RAW_LAYOUT_HITS" >&2
fi

# -- NO_RAW_TYPE: zero raw type-size utilities across the 4 consumer files. --
NO_RAW_TYPE=1
RAW_TYPE_HITS=$(grep -nE 'text-\[[0-9]|text-\[clamp' "${CONSUMERS[@]}" 2>/dev/null || true)
if [ -n "$RAW_TYPE_HITS" ]; then
  NO_RAW_TYPE=0
  echo "[static] NO_RAW_TYPE: raw type-size utilities present:" >&2
  echo "$RAW_TYPE_HITS" >&2
fi

# ── 5. Start dev server. ───────────────────────────────────────────────────
nohup npm run dev > "$DEV_LOG" 2>&1 &
DEV_BG_PID=$!
disown $DEV_BG_PID 2>/dev/null || true
sleep 2

ready=0
for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PORT}" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

RHYTHM=0
NOREGRESS=0
if [ $ready -ne 1 ]; then
  echo "[runtime] dev server did not start within 30s — RHYTHM/NOREGRESS forced to 0" >&2
  cat "$DEV_LOG" >&2
else
  # ── 6. Runtime checks. ───────────────────────────────────────────────────
  CHECK_OUT=$(node "$CHECKER" 2>/tmp/cq-ds-check.err)
  RHYTHM=$(printf '%s\n' "$CHECK_OUT" | grep -E '^RHYTHM:' | awk '{print $2}')
  NOREGRESS=$(printf '%s\n' "$CHECK_OUT" | grep -E '^NOREGRESS:' | awk '{print $2}')
  # stderr from the checker is useful diagnostic — surface it.
  cat /tmp/cq-ds-check.err >&2
fi

# Normalise: anything non-"1" is 0.
norm() { case "$1" in 1) echo 1;; *) echo 0;; esac; }
RHYTHM=$(norm "${RHYTHM:-0}")
NOREGRESS=$(norm "${NOREGRESS:-0}")

# ── 7. Kill the dev server. ────────────────────────────────────────────────
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true

# ── 8. Score + report. ─────────────────────────────────────────────────────
SCORE=$((BUILD + TOKENS + PRIMS + ADOPT + NO_RAW_LAYOUT + NO_RAW_TYPE + RHYTHM + NOREGRESS))

echo "design-system-score: ${SCORE}/8"
echo "  build:          ${BUILD}"
echo "  tokens:         ${TOKENS}"
echo "  prims:          ${PRIMS}"
echo "  adopt:          ${ADOPT}"
echo "  no_raw_layout:  ${NO_RAW_LAYOUT}"
echo "  no_raw_type:    ${NO_RAW_TYPE}"
echo "  rhythm:         ${RHYTHM}"
echo "  noregress:      ${NOREGRESS}"

if [ "$SCORE" -eq 8 ]; then
  exit 0
else
  exit 1
fi
