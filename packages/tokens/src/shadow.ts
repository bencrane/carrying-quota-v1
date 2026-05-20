/**
 * Shadow / elevation scale. A dark editorial surface uses shadow sparingly —
 * mostly as a faint accent glow (the lead chart's bar glow) rather than
 * drop-shadow depth. Values reference the accent token via its CSS var so a
 * shadow never hard-codes a color.
 */
export const shadow = {
  none: "none",
  glow: "0 0 24px hsl(var(--accent) / 0.25)",
  "glow-soft": "0 0 16px hsl(var(--accent) / 0.12)",
  inset: "inset 0 1px 0 hsl(var(--border))",
  raised: "0 1px 2px hsl(0 0% 0% / 0.4)",
} as const;

export type ShadowToken = keyof typeof shadow;

export const shadowOrder: readonly ShadowToken[] = [
  "none",
  "glow",
  "glow-soft",
  "inset",
  "raised",
];
