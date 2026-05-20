import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid.js";
import { Card } from "../display/Card.js";
import { Text } from "../typography/Text.js";

const meta: Meta<typeof Grid> = { title: "Layout/Grid", component: Grid };
export default meta;
type Story = StoryObj<typeof Grid>;

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <Card key={i} pad="md">
      <Text scale="caption">cell {i + 1}</Text>
    </Card>
  ));

/** Responsive content grid — column count is a token. */
export const ThreeColumn: Story = { args: { cols: 3, gap: "lg", children: cells(6) } };

/** Two-column variant. */
export const TwoColumn: Story = { args: { cols: 2, gap: "md", children: cells(4) } };
