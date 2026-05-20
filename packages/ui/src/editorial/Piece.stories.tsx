import type { Meta, StoryObj } from "@storybook/react";
import { Piece } from "./Piece.js";
import { PieceHeader } from "./PieceHeader.js";
import { Prose } from "./Prose.js";

const meta: Meta<typeof Piece> = { title: "Editorial/Piece", component: Piece };
export default meta;
type Story = StoryObj<typeof Piece>;

/** The editorial container — owns measure + inter-block rhythm. */
export const Default: Story = {
  args: {
    children: (
      <>
        <PieceHeader headline="A representative editorial piece" byline="CQ Research Desk" />
        <Prose paragraphs={["The Piece primitive owns the reading measure and the vertical rhythm between editorial blocks."]} />
      </>
    ),
  },
};
