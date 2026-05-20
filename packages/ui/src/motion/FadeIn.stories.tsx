import type { Meta, StoryObj } from "@storybook/react";
import { FadeIn } from "./FadeIn.js";
import { Card } from "../display/Card.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof FadeIn> = { title: "Motion/FadeIn", component: FadeIn };
export default meta;
type Story = StoryObj<typeof FadeIn>;

/** Opacity-only entrance — a softer companion to AppearOnMount. */
export const Default: Story = {
  args: {
    children: (
      <Card pad="lg">
        <Text scale="body">This card faded in (no vertical motion).</Text>
      </Card>
    ),
  },
};
