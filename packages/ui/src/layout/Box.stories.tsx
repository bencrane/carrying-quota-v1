import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
};
export default meta;
type Story = StoryObj<typeof Box>;

/** The base layout primitive — a single token-styled element. */
export const Default: Story = {
  args: {
    surface: "card",
    pad: "lg",
    border: "all",
    children: <Text scale="body">A Box: token padding, palette surface, hairline border.</Text>,
  },
};

/** Padding is a spacing token; surface is a palette role. */
export const SubtleSurface: Story = {
  args: {
    surface: "muted",
    pad: "xl",
    radius: "none",
    children: <Text scale="caption">surface=muted · pad=xl</Text>,
  },
};
