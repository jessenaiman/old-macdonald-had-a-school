import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonPrintActions } from "./LessonPrintActions";

const meta = {
  title: "Lesson controls/Print action",
  component: LessonPrintActions,
  parameters: { layout: "centered" },
} satisfies Meta<typeof LessonPrintActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeacherPlan: Story = { args: { label: "Print teacher plan" } };
