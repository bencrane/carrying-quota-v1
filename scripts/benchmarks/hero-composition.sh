#!/usr/bin/env bash
# hero-composition.sh
# Measures structural-composition-score (0..5) for the Carrying Quota homepage hero.
# Score:
#   +1 build passes
#   +1 desktop 1440 reads as a >=2-col grid composition
#   +1 desktop 1920 reads as a >=2-col grid composition
#   +1 desktop 2560 reads as a >=2-col grid composition
#   +1 mobile 375 stacks gracefully + form visible in first 800px
# Exits 0 only if score == 5; non-zero otherwise.

set -u
set -o pipefail

PROJECT_ROOT="/Users/benjamincrane/carrying-quota-v1"
cd "$PROJECT_ROOT" || { echo "structural-composition-score: 0/5 (cannot cd to project)"; exit 1; }

PORT=5180
BUILD_LOG="/tmp/cq-build.log"
DEV_LOG="/tmp/cq-dev.log"
CHECKER="scripts/benchmarks/check-hero.mjs"

cleanup() {
  lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
}
trap cleanup EXIT

# 1. Free the port up front.
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

# 2. Ensure Playwright is installed as a dev dep.
if [ ! -d "node_modules/playwright" ]; then
  echo "[hero-composition] installing playwright (devDep)..." >&2
  npm i -D playwright >/tmp/cq-playwright-install.log 2>&1 || {
    echo "structural-composition-score: 0/5 (playwright install failed)"
    cat /tmp/cq-playwright-install.log
    exit 1
  }
  # On macOS, --with-deps requires sudo; the chromium browser downloads cleanly without it.
  npx playwright install chromium >/tmp/cq-playwright-browser.log 2>&1 || {
    echo "structural-composition-score: 0/5 (playwright chromium install failed)"
    cat /tmp/cq-playwright-browser.log
    exit 1
  }
fi

# 3. Build.
npm run build > "$BUILD_LOG" 2>&1
BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
  echo "structural-composition-score: 0/5 (build failed)"
  cat "$BUILD_LOG"
  exit 1
fi
BUILD_PASS=1

# 4. Start dev server in background.
nohup npm run dev > "$DEV_LOG" 2>&1 &
DEV_BG_PID=$!
disown $DEV_BG_PID 2>/dev/null || true
sleep 2

# 5. Wait up to 30s for the server to respond.
ready=0
for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PORT}" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ $ready -ne 1 ]; then
  echo "structural-composition-score: ${BUILD_PASS}/5 (dev server did not start)"
  cat "$DEV_LOG"
  exit 1
fi

# 6. Run the per-width Playwright checks.
S_1440=$(node "$CHECKER" 1440 2>/dev/null | tail -n1)
S_1920=$(node "$CHECKER" 1920 2>/dev/null | tail -n1)
S_2560=$(node "$CHECKER" 2560 2>/dev/null | tail -n1)
S_375=$(node "$CHECKER" 375 2>/dev/null | tail -n1)

# Normalise: treat anything non-"1" as 0.
norm() { case "$1" in 1) echo 1;; *) echo 0;; esac; }
S_1440=$(norm "$S_1440")
S_1920=$(norm "$S_1920")
S_2560=$(norm "$S_2560")
S_375=$(norm "$S_375")

SCORE=$((BUILD_PASS + S_1440 + S_1920 + S_2560 + S_375))

# 7. Kill the dev server.
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true

# 8. Report.
echo "structural-composition-score: ${SCORE}/5"
echo "  build:    ${BUILD_PASS}"
echo "  1440:     ${S_1440}"
echo "  1920:     ${S_1920}"
echo "  2560:     ${S_2560}"
echo "  375 mob:  ${S_375}"

if [ "$SCORE" -eq 5 ]; then
  exit 0
else
  exit 1
fi
