import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./Section.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Section> = { title: "Layout/Section", component: Section };
export default meta;
type Story = StoryObj<typeof Section>;

/** A page band — surface drives the homepage's vertical rhythm. */
export const Elevated: Story = {
  args: {
    surface: "elevated",
    gutter: "default",
    children: <Text scale="head" as="h2">An elevated section band</Text>,
  },
};

/** The primary surface. */
export const Primary: Story = {
  args: {
    surface: "primary",
    gutter: "compact",
    children: <Text scale="body">surface=primary · gutter=compact</Text>,
  },
};
