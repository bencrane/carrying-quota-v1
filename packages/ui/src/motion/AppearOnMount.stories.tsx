import type { Meta, StoryObj } from "@storybook/react";
import { AppearOnMount } from "./AppearOnMount.js";
import { Card } from "../display/Card.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof AppearOnMount> = { title: "Motion/AppearOnMount", component: AppearOnMount };
export default meta;
type Story = StoryObj<typeof AppearOnMount>;

/** Entrance wrapper — fades + rises children on mount. */
export const Default: Story = {
  args: {
    children: (
      <Card pad="lg">
        <Text scale="body">This card rose and faded in on mount.</Text>
      </Card>
    ),
  },
};
