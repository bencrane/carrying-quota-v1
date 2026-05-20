import type { Meta, StoryObj } from "@storybook/react";
import { Lede } from "./Lede.js";

const meta: Meta<typeof Lede> = { title: "Editorial/Lede", component: Lede };
export default meta;
type Story = StoryObj<typeof Lede>;

/** The opening standfirst paragraph — serif, larger than body. */
export const Default: Story = {
  args: {
    children:
      "A four-hundred-thousand-dollar OTE is not a four-hundred-thousand-dollar offer — it is a question about how much of that number you are willing to go and earn.",
  },
};
