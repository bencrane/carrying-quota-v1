// FIXTURE — input to the cq-design-system-foundation benchmark (check G1).
// This file deliberately hand-rolls raw geometry utilities on `className` at
// the top level of JSX. The `cq/no-geometry` ESLint rule MUST flag it, so
// `npx eslint` on this file exits non-zero.
//
// It is NOT part of the app — it is a negative test fixture.

export function GeoBad() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="gap-4">Raw geometry on the content surface — banned.</p>
    </div>
  );
}
