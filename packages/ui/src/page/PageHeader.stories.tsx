import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader.js";

const meta: Meta<typeof PageHeader> = { title: "Page/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;

/** The standard route header band — eyebrow, title, dek. */
export const Default: Story = {
  args: {
    eyebrow: "The Index",
    title: "A live read on the AE labor market.",
    dek: "Original data on comp, attainment, ramp, and tenure — refreshed quarterly.",
  },
};
