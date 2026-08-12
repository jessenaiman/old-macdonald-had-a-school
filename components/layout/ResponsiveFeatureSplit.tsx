import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type FeatureSplitRatio = "balanced" | "primary" | "secondary" | "feature";

const ratioClasses: Record<FeatureSplitRatio, string> = {
  balanced: "lg:!grid-cols-2",
  primary: "lg:!grid-cols-[minmax(0,3fr)_minmax(17rem,2fr)]",
  secondary: "lg:!grid-cols-[minmax(17rem,2fr)_minmax(0,3fr)]",
  feature: "md:!grid-cols-2",
};

type ResponsiveFeatureSplitProps = ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
  ratio?: FeatureSplitRatio;
  children: ReactNode;
};

/**
 * Shared responsive geometry for two-part feature areas.
 * Pages retain full ownership of the content and visual treatment in each slot.
 */
export function ResponsiveFeatureSplit({
  asChild = false,
  ratio = "primary",
  className,
  children,
  ...props
}: ResponsiveFeatureSplitProps) {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={cn(
        "grid min-w-0 grid-cols-1 items-center gap-4 *:min-w-0",
        ratioClasses[ratio],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
