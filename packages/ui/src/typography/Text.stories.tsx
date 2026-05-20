import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text.js";

const meta: Meta<typeof Text> = { title: "Typography/Text", component: Text };
export default meta;
type Story = StoryObj<typeof Text>;

/** Body copy — the sans reading role. */
export const Body: Story = { args: { scale: "body", children: "Body copy at the sans reading role." } };

/** The serif lede role. */
export const Lede: Story = { args: { scale: "lede", children: "A serif lede — the standfirst role." } };

/** The mono caption role. */
export const Caption: Story = { args: { scale: "caption", children: "Mono caption label" } };
