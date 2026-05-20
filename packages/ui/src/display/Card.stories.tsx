import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Card> = { title: "Display/Card", component: Card };
export default meta;
type Story = StoryObj<typeof Card>;

/** A bounded content surface — the editorial card frame. */
export const Default: Story = {
  args: {
    pad: "lg",
    children: <Text scale="body">A hairline-bordered card with token padding.</Text>,
  },
};

/** Interactive variant — hover border-lift for card-as-link. */
export const Interactive: Story = {
  args: {
    pad: "lg",
    interactive: true,
    children: <Text scale="body">interactive=true</Text>,
  },
};
