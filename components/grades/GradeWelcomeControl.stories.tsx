import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GradeWelcomeControl } from "./GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "./grade-config";

const meta = {
  title: "Grade controls/Welcome and teacher note",
  component: GradeWelcomeControl,
  parameters: { layout: "fullscreen" },
  args: { summary: "Reading and rhythm", primaryHref: "/grade/grade-one/addition-subtraction-word-problems" },
} satisfies Meta<typeof GradeWelcomeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Daycare: Story = { args: { config: GRADE_INTERACTION_CONFIGS.daycare } };
export const Preschool: Story = { args: { config: GRADE_INTERACTION_CONFIGS["pre-school"] } };
export const Kindergarten: Story = { args: { config: GRADE_INTERACTION_CONFIGS.kindergarten } };
export const GradeOne: Story = { args: { config: GRADE_INTERACTION_CONFIGS["grade-one"] } };
export const GradeTwo: Story = { args: { config: GRADE_INTERACTION_CONFIGS["grade-two"] } };
