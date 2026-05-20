/**
 * Z-index (layering) tokens. A small, named stack so no component invents a
 * magic `z-50`. `sticky` matches the value the app shell's sticky header
 * already uses (`z-50`).
 */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 50,
  overlay: 100,
  modal: 200,
  toast: 300,
} as const;

export type ZIndexToken = keyof typeof zIndex;

export const zIndexOrder: readonly ZIndexToken[] = [
  "base",
  "raised",
  "sticky",
  "overlay",
  "modal",
  "toast",
];
