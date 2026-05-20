import type { Meta, StoryObj } from "@storybook/react";
import { PieceHeader } from "./PieceHeader.js";

const meta: Meta<typeof PieceHeader> = { title: "Editorial/PieceHeader", component: PieceHeader };
export default meta;
type Story = StoryObj<typeof PieceHeader>;

/** The masthead block of an editorial piece. */
export const Default: Story = {
  args: {
    category: "The Index · Compensation",
    date: "May 19, 2026",
    headline: "Where AEs make the most, right now.",
    dek: "The highest-paying enterprise sales seats in tech this quarter, ranked by P75 OTE.",
    byline: "CQ Research Desk",
    readTime: "8 min read",
  },
};
