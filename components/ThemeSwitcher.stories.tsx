import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeSwitcher } from "./ThemeSwitcher";

const meta = {
  title: "Site controls/Theme switcher",
  component: ThemeSwitcher,
  parameters: { layout: "centered" },
  decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FarmDay: Story = {};
