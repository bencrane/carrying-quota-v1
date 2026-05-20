import type { Meta, StoryObj } from "@storybook/react";
import { Cluster } from "./Cluster.js";
import { Badge } from "../display/Badge.js";

const meta: Meta<typeof Cluster> = { title: "Layout/Cluster", component: Cluster };
export default meta;
type Story = StoryObj<typeof Cluster>;

/** Horizontal flow — token-spaced, wrapping. */
export const Default: Story = {
  args: {
    gap: "sm",
    align: "baseline",
    children: (
      <>
        <Badge>Dispatch</Badge>
        <Badge variant="accent">Index</Badge>
        <Badge variant="outline">Goods</Badge>
      </>
    ),
  },
};

/** Distributed to the row ends. */
export const SpaceBetween: Story = {
  args: {
    justify: "between",
    children: (
      <>
        <Badge>Left</Badge>
        <Badge>Right</Badge>
      </>
    ),
  },
};
