import { cn } from "@/lib/utils"

export function BrandIcon({ icon, size = "medium", className }: { icon: string; size?: "micro" | "small" | "medium" | "large"; className?: string }) {
  return <span className={cn("brand-asset", icon, `icon-${size}`, className)} aria-hidden="true" />
}
