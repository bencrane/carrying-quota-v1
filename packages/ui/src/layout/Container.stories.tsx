import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container.js";
import { Box } from "./Box.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Container> = { title: "Layout/Container", component: Container };
export default meta;
type Story = StoryObj<typeof Container>;

/** The content measure — the single owner of horizontal content geometry. */
export const Default: Story = {
  args: {
    width: "default",
    children: (
      <Box surface="card" pad="lg" border="all">
        <Text scale="body">Centered content measure (width=default).</Text>
      </Box>
    ),
  },
};

/** The narrow reading measure for long-form prose. */
export const ProseMeasure: Story = {
  args: {
    width: "prose",
    children: (
      <Box surface="card" pad="lg" border="all">
        <Text scale="body">width=prose — the long-form reading column.</Text>
      </Box>
    ),
  },
};
