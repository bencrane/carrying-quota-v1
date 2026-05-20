import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge.js";

const meta: Meta<typeof Badge> = { title: "Display/Badge", component: Badge };
export default meta;
type Story = StoryObj<typeof Badge>;

/** The default outline chip. */
export const Outline: Story = { args: { children: "Dispatch", variant: "outline" } };

/** The accent-filled chip — used sparingly. */
export const Accent: Story = { args: { children: "New", variant: "accent" } };
