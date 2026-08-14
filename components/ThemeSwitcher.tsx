"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "light", label: "Farm day", iconClass: "theme-farm-day" },
  { value: "dark", label: "Lullaby dusk", iconClass: "theme-lullaby-dusk" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const currentTheme = mounted && THEMES.some((item) => item.value === theme) ? theme : "light";
  const current = THEMES.find((item) => item.value === currentTheme) ?? THEMES[0];
  const next = THEMES.find((item) => item.value !== current.value) ?? THEMES[0];

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-12 w-20 p-0"
      onClick={() => setTheme(next.value)}
      aria-label={`Current theme: ${current.label}. Switch to ${next.label}`}
      title={`Switch to ${next.label}`}
    >
      <span className="brand-asset theme-farm-day [--brand-asset-size:4.5rem]" aria-hidden="true" />
    </Button>
  );
}
