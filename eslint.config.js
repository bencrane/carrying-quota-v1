// ESLint flat config — Carrying Quota.
//
// The load-bearing piece for checks G1 + G2: the custom `cq/no-geometry` rule
// (eslint-rules/no-geometry.js) is wired in here and applied to the content
// surface — route files and editorial piece files. Raw geometry utilities on
// `className` in those files are an error; the `unsafe_className` escape
// hatch is exempt.
//
// `npm run lint` runs `eslint .` (the lint script string contains `eslint`,
// which G1 verifies) and must pass clean on the real codebase (G2).

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import cq from "./eslint-rules/no-geometry.js";

export default tseslint.config(
  // ── Ignored paths ─────────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "**/dist/**",
      "node_modules/**",
      "storybook-static/**",
      "packages/tokens/dist/**",
      "tests/**/__screenshots__/**",
      "tests/**/*-snapshots/**",
    ],
  },

  // ── Base JS/TS rules for all source ───────────────────────────────────────
  {
    files: ["**/*.{ts,tsx,mjs,js}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // The token system is deliberately small; allow inferred types.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // ── React component hygiene (app + primitive source) ──────────────────────
  {
    files: ["src/**/*.{ts,tsx}", "packages/ui/src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
    },
  },

  // ── THE CONTENT SURFACE: the no-geometry rule ─────────────────────────────
  // Routes + editorial pieces + the benchmark's geometry fixtures. Geometry
  // here must flow through token-typed primitive props.
  {
    files: [
      "src/routes/**/*.{ts,tsx}",
      "src/pieces/**/*.{ts,tsx}",
      "packages/ui/src/pieces/**/*.{ts,tsx}",
      "scripts/benchmarks/fixtures/eslint-geo-*.tsx",
    ],
    plugins: { cq },
    rules: {
      "cq/no-geometry": "error",
    },
  },

  // ── tsc fixtures are intentionally minimal — don't lint them ──────────────
  {
    ignores: ["scripts/benchmarks/fixtures/ts-bad/**", "scripts/benchmarks/fixtures/ts-good/**"],
  }
);
