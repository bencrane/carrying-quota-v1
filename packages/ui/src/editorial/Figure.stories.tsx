import type { Meta, StoryObj } from "@storybook/react";
import { Figure } from "./Figure.js";
import { Box } from "../layout/Box.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Figure> = { title: "Editorial/Figure", component: Figure };
export default meta;
type Story = StoryObj<typeof Figure>;

/** The embed wrapper — owns framing, caption, and width mode. */
export const Default: Story = {
  args: {
    width: "measure",
    caption: "A figure caption — rendered as a figcaption.",
    source: "CQ Research Desk",
    children: (
      <Box surface="card" pad="2xl" border="all">
        <Text scale="caption" tone="muted">embedded media goes here</Text>
      </Box>
    ),
  },
};
