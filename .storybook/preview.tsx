import type { Preview } from "@storybook/react";
// Load the real Carrying Quota stylesheet — the locked palette + the
// @theme inline block + Tailwind v4 utilities — so every story renders with
// the production design system, not unstyled (validator prediction p3).
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // The addon surfaces violations in the panel; the test:a11y script is
      // the hard gate (check E2).
      test: "todo",
    },
  },
  // Carrying Quota is a dark editorial surface — render every story on it.
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground" style={{ minHeight: "8rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
