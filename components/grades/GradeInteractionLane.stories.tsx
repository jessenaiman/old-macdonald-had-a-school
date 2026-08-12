import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GradeInteractionLane } from "./GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "./grade-config";

const items = [
  { title: "Addition & Subtraction Word Problems", kicker: "Mathematics", summary: "Grade 1 solves concrete one-step problems within 20.", href: "/grade/grade-one/addition-subtraction-word-problems", icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png" },
  { title: "Apply properties of operations", kicker: "Mathematics", summary: "Use counters and number sentences to explore addition.", href: "/grade/grade-one/properties-of-operations", icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png" },
  { title: "Distinguish long from short vowel sounds", kicker: "Literacy & phonics", summary: "Listen for vowel sounds in spoken single-syllable words.", href: "/grade/grade-one/distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral", icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png" },
];

const meta = {
  title: "Grade controls/Shared interaction lane",
  component: GradeInteractionLane,
  parameters: { layout: "fullscreen" },
  args: { summary: "Reading and rhythm", items },
} satisfies Meta<typeof GradeInteractionLane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Daycare: Story = { args: { config: GRADE_INTERACTION_CONFIGS.daycare } };
export const Preschool: Story = { args: { config: GRADE_INTERACTION_CONFIGS["pre-school"] } };
export const Kindergarten: Story = { args: { config: GRADE_INTERACTION_CONFIGS.kindergarten } };
export const GradeOne: Story = { args: { config: GRADE_INTERACTION_CONFIGS["grade-one"] } };
export const GradeTwo: Story = { args: { config: GRADE_INTERACTION_CONFIGS["grade-two"] } };
