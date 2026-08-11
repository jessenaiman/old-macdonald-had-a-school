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
  const currentTheme = mounted && THEMES.some((item) => item.value === theme) ? theme : "light";

  const current = THEMES.find((item) => item.value === currentTheme) ?? THEMES[0];
  const next = THEMES.find((item) => item.value !== current.value) ?? THEMES[0];

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={() => setTheme(next.value)}
      aria-label={`Switch to ${next.label}`}
      title={`Switch to ${next.label}`}
    >
      <Image src={current.icon} alt="" width={34} height={34} loading="eager" aria-hidden="true" />
      <span className="sr-only">{current.label}</span>
    </button>
  );
}
