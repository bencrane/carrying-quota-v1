import type { Meta, StoryObj } from "@storybook/react";
import { PullQuote } from "./PullQuote.js";

const meta: Meta<typeof PullQuote> = { title: "Editorial/PullQuote", component: PullQuote };
export default meta;
type Story = StoryObj<typeof PullQuote>;

/** An editorial pull quote — oversized serif, accent rule, attribution. */
export const Default: Story = {
  args: {
    children:
      "We did not cut anyone's pay. We moved the dollars from the part we guarantee to the part they have to go and win.",
    cite: "— a comp committee lead at a Series-C infra company",
  },
};
