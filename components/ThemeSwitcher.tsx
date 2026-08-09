"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const THEMES = [
  { value: "light", label: "Farm day", icon: "/design-assets/theme-toggle-patches-v1/sun-patch.png" },
  { value: "dark", label: "Lullaby dusk", icon: "/design-assets/theme-toggle-patches-v1/moon-patch.png" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const currentIndex = Math.max(0, THEMES.findIndex((item) => item.value === theme));
  const current = mounted ? THEMES[currentIndex] : THEMES[0];

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
      <Image src={current.icon} alt="" width={28} height={28} loading="eager" aria-hidden="true" />
      <span className="sr-only">{current.label}</span>
    </button>
  );
}
