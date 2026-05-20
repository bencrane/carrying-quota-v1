import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading.js";

const meta: Meta<typeof Heading> = { title: "Typography/Heading", component: Heading };
export default meta;
type Story = StoryObj<typeof Heading>;

/** The display headline — h1. */
export const Display: Story = { args: { level: 1, children: "The AE labor market, on the record." } };

/** A section heading — h2. */
export const Section: Story = { args: { level: 2, children: "Dispatches from the floor" } };
