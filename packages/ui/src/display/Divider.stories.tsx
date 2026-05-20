import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider.js";

const meta: Meta<typeof Divider> = { title: "Display/Divider", component: Divider };
export default meta;
type Story = StoryObj<typeof Divider>;

/** A solid hairline rule. */
export const Hairline: Story = { args: { tone: "hairline" } };

/** The editorial faded rule — fades to transparent at both ends. */
export const Faded: Story = { args: { tone: "faded" } };
