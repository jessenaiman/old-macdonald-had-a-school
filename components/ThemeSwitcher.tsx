"use client";

import { useTheme } from "next-themes";
import { LuMoonStar, LuPalette, LuSunMedium } from "react-icons/lu";
import { useSyncExternalStore } from "react";

const THEMES = [
  { value: "farm-day", label: "Farm day", Icon: LuSunMedium },
  { value: "lullaby-dusk", label: "Lullaby dusk", Icon: LuMoonStar },
  { value: "storybook-focus", label: "Storybook focus", Icon: LuPalette },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const currentIndex = Math.max(0, THEMES.findIndex((item) => item.value === theme));
  const current = mounted ? THEMES[currentIndex] : THEMES[0];
  const Icon = current.Icon;

  function cycleTheme() {
    setTheme(THEMES[(currentIndex + 1) % THEMES.length].value);
  }

  return (
    <button
      type="button"
      className="theme-button"
      onClick={cycleTheme}
      aria-label={`Colour theme: ${current.label}. Activate to change theme.`}
      title={`Colour theme: ${current.label}`}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{current.label}</span>
    </button>
  );
}
