import type { Meta, StoryObj } from "@storybook/react";
import { Stat } from "./Stat.js";

const meta: Meta<typeof Stat> = { title: "Display/Stat", component: Stat };
export default meta;
type Story = StoryObj<typeof Stat>;

/** A single data point — figure, label, signed delta. */
export const Down: Story = {
  args: { value: "63%", label: "AE attainment · Q1 2026", delta: "8pp YoY", trend: "down" },
};

/** A positive-trend stat. */
export const Up: Story = {
  args: { value: "$445K", label: "Anthropic AE OTE", delta: "18% YoY", trend: "up" },
};
