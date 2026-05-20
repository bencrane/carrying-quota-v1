import type { Meta, StoryObj } from "@storybook/react";
import { PageSection } from "./PageSection.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof PageSection> = { title: "Page/PageSection", component: PageSection };
export default meta;
type Story = StoryObj<typeof PageSection>;

/** A content band within a route — optional eyebrow + body. */
export const Default: Story = {
  args: {
    eyebrow: "Latest",
    surface: "elevated",
    children: <Text scale="body">A page section's body content.</Text>,
  },
};
