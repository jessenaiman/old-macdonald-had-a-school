import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BrandingControls } from "./CastShowcase";

const meta = {
  title: "Branding/Controls",
  component: BrandingControls,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["ai-generated"],
} satisfies Meta<typeof BrandingControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllControls: Story = {};
