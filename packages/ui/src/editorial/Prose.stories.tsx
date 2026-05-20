import type { Meta, StoryObj } from "@storybook/react";
import { Prose } from "./Prose.js";

const meta: Meta<typeof Prose> = { title: "Editorial/Prose", component: Prose };
export default meta;
type Story = StoryObj<typeof Prose>;

/** A long-form body block — token-styled paragraphs. */
export const Default: Story = {
  args: {
    paragraphs: [
      "Prose renders token-styled paragraphs at the reading type role, spaced by a single gap token.",
      "Measure is owned by the enclosing Piece; Prose owns only paragraph styling and inter-paragraph rhythm.",
    ],
  },
};
