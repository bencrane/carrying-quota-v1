import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook config — pinned to Storybook 8.6 with the @storybook/react-vite
 * builder so it composes cleanly with Vite 6 + React 19 + Tailwind v4
 * (validator prediction p3 — do not take Storybook's latest-major default
 * blindly). Stories live beside the primitives in packages/ui/src.
 */
const config: StorybookConfig = {
  stories: ["../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    // Type-checking is the app build's job; keep the Storybook build fast.
    check: false,
    reactDocgen: "react-docgen",
  },
};

export default config;
