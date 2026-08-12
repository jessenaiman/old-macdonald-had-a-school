import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "./ThemeProvider";
import { SiteHeader } from "./SiteHeader";

const meta = {
  title: "Site controls/Header",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/grade/grade-one" } },
  },
  decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradeOneActive: Story = {};
