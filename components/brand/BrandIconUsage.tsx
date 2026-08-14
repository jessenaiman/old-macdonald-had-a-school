"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BrandIconUsageProps = {
  className: string
  gradeIcon?: string
  label: string
  usage: string
}

export function BrandIconUsage({ className, gradeIcon, label, usage }: BrandIconUsageProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button aria-label={`Show ${label} icon usage`} className="h-auto w-auto p-1" size="icon" type="button" variant="ghost">
            <span aria-hidden="true" className={cn("brand-asset", className)} data-grade-icon={gradeIcon} />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          <code>{usage}</code>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
