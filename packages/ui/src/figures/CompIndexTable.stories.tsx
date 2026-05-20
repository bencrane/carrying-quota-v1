import type { Meta, StoryObj } from "@storybook/react";
import { CompIndexTable } from "./CompIndexTable.js";

const meta: Meta<typeof CompIndexTable> = {
  title: "Figures/CompIndexTable",
  component: CompIndexTable,
};
export default meta;
type Story = StoryObj<typeof CompIndexTable>;

/** The interactive compensation index — sort a column, filter a segment, open a row. */
export const Default: Story = {
  args: {
    data: [
      { company: "Anthropic", segment: "Enterprise · AI Infra", ote: 445, base: 200, variable: 245, equity: 320 },
      { company: "OpenAI", segment: "Enterprise · AI Infra", ote: 420, base: 195, variable: 225, equity: 295 },
      { company: "Databricks", segment: "Enterprise · Data", ote: 385, base: 178, variable: 207, equity: 240 },
      { company: "Snowflake", segment: "Enterprise · Data", ote: 340, base: 162, variable: 178, equity: 185 },
      { company: "Figma", segment: "Enterprise · Design", ote: 330, base: 156, variable: 174, equity: 150 },
      { company: "Ramp", segment: "Mid-Market · Fintech", ote: 310, base: 148, variable: 162, equity: 135 },
    ],
  },
};
