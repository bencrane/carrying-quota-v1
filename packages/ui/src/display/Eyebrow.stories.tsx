import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow } from "./Eyebrow.js";

const meta: Meta<typeof Eyebrow> = { title: "Display/Eyebrow", component: Eyebrow };
export default meta;
type Story = StoryObj<typeof Eyebrow>;

/** The editorial section label — a small mono kicker. */
export const Default: Story = { args: { children: "This week" } };

/** Muted tone, no marker. */
export const Muted: Story = { args: { children: "Archive", tone: "muted", marker: false } };
