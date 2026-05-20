import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "./Page.js";
import { Section } from "../layout/Section.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Page> = { title: "Page/Page", component: Page };
export default meta;
type Story = StoryObj<typeof Page>;

/** The route frame — tags its root with data-page-root. */
export const Default: Story = {
  args: {
    children: (
      <Section surface="primary" gutter="compact">
        <Text scale="head" as="h1">A route rendered through Page</Text>
      </Section>
    ),
  },
};
