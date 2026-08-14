import type { ComponentProps } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const FASTENER_CLASSES = {
  pin: "fastener-push-pin",
  clip: "fastener-paperclip",
  tape: "fastener-masking-tape",
} as const

export type BrandPatchSurface = "sewn" | "pinned"
export type BrandPatchFastener = keyof typeof FASTENER_CLASSES

type BrandPatchCardProps = ComponentProps<typeof Card> & {
  surface?: BrandPatchSurface
  fastener?: BrandPatchFastener
}

/**
 * A shadcn Card composition with a named physical surface.
 *
 * CardHeader/CardContent/CardFooter remain the composition API. Surface and
 * fastener are semantic brand roles; their colors, textile, stitch, and asset
 * treatment are owned by the global theme and asset registry.
 */
export function BrandPatchCard({
  surface = "sewn",
  fastener,
  className,
  children,
  ...props
}: BrandPatchCardProps) {
  return (
    <Card
      data-brand-card={surface}
      className={cn("brand-patch-card", className)}
      {...props}
    >
      {fastener ? (
        <span
          aria-hidden="true"
          className={cn(
            "brand-asset",
            FASTENER_CLASSES[fastener],
            "brand-patch-fastener",
          )}
        />
      ) : null}
      {children}
    </Card>
  )
}
