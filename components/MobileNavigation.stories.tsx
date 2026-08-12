import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNavigation } from "./MobileNavigation";
import { GRADE_NAV_ITEMS } from "./site-navigation";

const meta = {
  title: "Site controls/Mobile navigation",
  component: MobileNavigation,
  parameters: {
    layout: "centered",
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    active: "grade-one",
    grades: GRADE_NAV_ITEMS,
  },
} satisfies Meta<typeof MobileNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradeOneActive: Story = {};
