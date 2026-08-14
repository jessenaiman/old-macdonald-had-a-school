import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden border font-heading text-sm font-normal tracking-wide whitespace-nowrap shadow-[0_3px_0_color-mix(in_srgb,var(--border)_75%,transparent)] transition-[background-color,color,border-color,box-shadow,transform] before:pointer-events-none before:absolute before:inset-1 before:rounded-[inherit] before:border before:border-dashed before:border-current before:opacity-25 hover:-translate-y-px active:translate-y-0 active:shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>*]:relative [&>*]:z-10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "control-fabric rounded-xl border-current hover:brightness-95",
        destructive:
          "rounded-xl border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "rounded-md border-input bg-background text-foreground [background-image:var(--brand-paper-texture)] [background-size:260px] before:border-solid hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-full border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "rounded-lg border-transparent shadow-none before:hidden hover:bg-accent hover:text-accent-foreground",
        link: "rounded-none border-transparent text-primary shadow-none before:hidden underline-offset-4 hover:translate-y-0 hover:underline",
      },
      size: {
        default: "min-h-11 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "min-h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-11 before:hidden",
        "icon-xs": "size-6 rounded-md before:hidden [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 before:hidden",
        "icon-lg": "size-11 before:hidden",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
