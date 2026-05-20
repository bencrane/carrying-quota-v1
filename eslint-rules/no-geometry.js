/**
 * ESLint rule: `cq/no-geometry`.
 *
 * Bans raw geometry utilities on `className` JSX attributes in route + piece
 * files (the content surface). Geometry on the content surface must come from
 * a primitive's token-typed prop — never a hand-rolled Tailwind class.
 *
 * Banned vocabulary (on a `className` string literal):
 *   - `mx-auto`               horizontal auto-centering
 *   - `max-w-*`               content measure caps
 *   - `px-*` / `py-*` / `p-*` padding
 *   - `gap-*`                 flex/grid gaps
 *   - any arbitrary value     `something-[…]`
 *
 * NOT banned:
 *   - the `unsafe_className` attribute (the explicit, loud escape hatch);
 *   - anything outside the configured content-surface files (this plugin is
 *     scoped to route + piece globs in eslint.config.js — primitives in
 *     packages/ui and chrome in src/components/layout are never linted by it).
 *
 * The rule keys on the ATTRIBUTE name `className` with a string-literal (or
 * literal-only template) value, so it catches exactly the hand-rolled-geometry
 * case the contract's G1/G2 checks assert.
 */

/** Regexes for each banned geometry token. Matched against whole class words. */
const BANNED = [
  { re: /(^|[^\w-])mx-auto(?![\w-])/, name: "mx-auto" },
  { re: /(^|[^\w-])max-w-[\w[\].%/-]+/, name: "max-w-*" },
  { re: /(^|[^\w-])p-\d/, name: "p-* padding" },
  { re: /(^|[^\w-])px-\d/, name: "px-* padding" },
  { re: /(^|[^\w-])py-\d/, name: "py-* padding" },
  { re: /(^|[^\w-])gap-\d/, name: "gap-* spacing" },
  { re: /(^|[^\w-])gap-x-\d/, name: "gap-x-* spacing" },
  { re: /(^|[^\w-])gap-y-\d/, name: "gap-y-* spacing" },
  // Arbitrary Tailwind values: `utility-[…]`. Excludes data-/aria- attr-likes.
  { re: /(^|[^\w-])[a-z]+-\[[^\]]+\]/, name: "arbitrary value *-[…]" },
];

/** Scan a class string; return the first banned token found, or null. */
function findBanned(value) {
  for (const { re, name } of BANNED) {
    if (re.test(value)) return name;
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ban raw geometry utilities on className in route/piece files; geometry comes from token-typed primitive props.",
    },
    schema: [],
    messages: {
      banned:
        "Raw geometry utility '{{token}}' on className is not allowed on the content surface. " +
        "Use a layout primitive's token-typed prop (Container/Section/Stack/Cluster/Grid/Box), " +
        "or the explicit `unsafe_className` escape hatch if there is genuinely no token for it.",
    },
  },
  create(context) {
    /** Check a literal class string and report if it carries banned geometry. */
    function checkString(value, node) {
      const token = findBanned(value);
      if (token) {
        context.report({ node, messageId: "banned", data: { token } });
      }
    }

    return {
      JSXAttribute(node) {
        // Only the `className` attribute. `unsafe_className` is the sanctioned
        // escape hatch and is intentionally exempt.
        if (!node.name || node.name.name !== "className") return;
        const value = node.value;
        if (!value) return;

        // className="literal string"
        if (value.type === "Literal" && typeof value.value === "string") {
          checkString(value.value, value);
          return;
        }

        // className={ ... } — inspect the expression.
        if (value.type === "JSXExpressionContainer") {
          const expr = value.expression;
          // className={"literal"}
          if (expr.type === "Literal" && typeof expr.value === "string") {
            checkString(expr.value, expr);
            return;
          }
          // className={`template`} — check the static cooked text of each quasi.
          if (expr.type === "TemplateLiteral") {
            for (const quasi of expr.quasis) {
              const cooked = quasi.value && quasi.value.cooked;
              if (typeof cooked === "string") checkString(cooked, quasi);
            }
            return;
          }
          // className={cn("literal", ...)} / clsx(...) — scan string-literal args.
          if (
            expr.type === "CallExpression" &&
            expr.callee &&
            expr.callee.type === "Identifier"
          ) {
            for (const arg of expr.arguments) {
              if (arg.type === "Literal" && typeof arg.value === "string") {
                checkString(arg.value, arg);
              }
              if (arg.type === "TemplateLiteral") {
                for (const quasi of arg.quasis) {
                  const cooked = quasi.value && quasi.value.cooked;
                  if (typeof cooked === "string") checkString(cooked, quasi);
                }
              }
            }
          }
        }
      },
    };
  },
};

const plugin = {
  meta: { name: "cq", version: "1.0.0" },
  rules: { "no-geometry": rule },
};

export default plugin;
