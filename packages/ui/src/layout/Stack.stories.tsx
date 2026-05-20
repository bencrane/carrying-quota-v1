import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./Stack.js";
import { Box } from "./Box.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
};
export default meta;
type Story = StoryObj<typeof Stack>;

const Row = ({ label }: { label: string }) => (
  <Box surface="card" pad="md" border="all">
    <Text scale="caption">{label}</Text>
  </Box>
);

/** Vertical flow — children token-spaced by `gap`. */
export const Default: Story = {
  args: {
    gap: "md",
    children: (
      <>
        <Row label="first" />
        <Row label="second" />
        <Row label="third" />
      </>
    ),
  },
};

/** A wider rhythm step. */
export const SpaciousGap: Story = {
  args: {
    gap: "xl",
    children: (
      <>
        <Row label="gap=xl" />
        <Row label="gap=xl" />
      </>
    ),
  },
};
