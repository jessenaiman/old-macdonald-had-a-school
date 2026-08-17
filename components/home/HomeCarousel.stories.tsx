import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeCarousel } from "./HomeCarousel";

const meta = {
  title: "Home controls/Feature carousel",
  component: HomeCarousel,
  parameters: { layout: "centered" },
  args: {
    slides: [
      {
        assetClass: "home-scene-class-gathering",
        alt: "Old MacDonald and the class gathered for outdoor music",
        label: "Browse curriculum topics",
        href: "/topics",
      },
    ],
    title: "From the school to your lesson plan",
    ariaLabel: "Featured teaching resources",
    pickerLabel: "Choose a featured scene",
  },
} satisfies Meta<typeof HomeCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};
