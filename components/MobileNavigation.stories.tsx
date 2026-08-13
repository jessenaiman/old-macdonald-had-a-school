import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNavigation } from "./MobileNavigation";

const meta = {
  title: "Site controls/Mobile navigation",
  component: MobileNavigation,
  parameters: {
    layout: "centered",
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    active: "songs",
  },
} satisfies Meta<typeof MobileNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTeachersActive: Story = {};
