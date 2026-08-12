import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TypographySpread } from "./CastShowcase";

const meta = {
  title: "Branding/Typography",
  component: TypographySpread,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TypographySpread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeRoles: Story = {};
