import type { Meta, StoryObj } from "@storybook/react";
import { DemoPiece } from "./DemoPiece.js";

const meta: Meta<typeof DemoPiece> = {
  title: "Pieces/DemoPiece",
  component: DemoPiece,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof DemoPiece>;

/** The embed-contract proof — prose + the reference figure via Figure. */
export const Default: Story = {};
