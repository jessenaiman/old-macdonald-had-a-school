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

  return (
    <div className="theme-switcher" role="group" aria-label="Colour theme">
      {THEMES.map((item) => (
        <button
          type="button"
          className="theme-choice"
          onClick={() => setTheme(item.value)}
          aria-pressed={currentTheme === item.value}
          title={item.label}
          key={item.value}
        >
          <Image src={item.icon} alt="" width={34} height={34} loading="eager" aria-hidden="true" />
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
