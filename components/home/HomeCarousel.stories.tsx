import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeCarousel } from "./HomeCarousel";

const meta = {
  title: "Home controls/Feature carousel",
  component: HomeCarousel,
  parameters: { layout: "centered" },
} satisfies Meta<typeof HomeCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};
export const Selected: Story = { args: { selected: true } };
