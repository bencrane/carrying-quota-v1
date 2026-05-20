import type { Meta, StoryObj } from "@storybook/react";
import { CompCurveFigure } from "./CompCurveFigure.js";

const meta: Meta<typeof CompCurveFigure> = {
  title: "Figures/CompCurveFigure",
  component: CompCurveFigure,
};
export default meta;
type Story = StoryObj<typeof CompCurveFigure>;

/** The reference interactive data figure — hover/focus a row for the breakdown. */
export const Default: Story = {
  args: {
    data: [
      { company: "Anthropic", ote: 445, base: 195, variable: 250, segment: "Enterprise · AI Infra" },
      { company: "OpenAI", ote: 420, base: 190, variable: 230, segment: "Enterprise · GTM" },
      { company: "Databricks", ote: 385, base: 175, variable: 210, segment: "Enterprise · Data" },
      { company: "Snowflake", ote: 340, base: 160, variable: 180, segment: "Enterprise · Data" },
      { company: "Ramp", ote: 310, base: 145, variable: 165, segment: "Mid-Market · Fintech" },
    ],
  },
};
