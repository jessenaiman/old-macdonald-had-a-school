"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  sideOffset = 10,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-[100] min-w-48 overflow-hidden rounded-xl border border-[#d6a845] bg-[#49311f] p-2 text-[#fff8e8] shadow-[0_12px_28px_rgba(3,12,24,.42)] outline-none",
          "bg-[url('/design-assets/web-material-library-v1/leather/individual-tiles/01-old-macdonald-leather-tile-v01.png')] bg-[length:240px_240px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "motion-reduce:animate-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center rounded-lg border border-transparent px-3 py-2 font-[family-name:var(--font-farm-body)] text-sm font-extrabold text-[#fff8e8] outline-none",
        "data-[highlighted]:border-[#e8c15d] data-[highlighted]:bg-[#102f4c] data-[highlighted]:text-white",
        "focus-visible:ring-2 focus-visible:ring-[#f1c95d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#49311f]",
        className
      )}
      {...props}
    />
  )
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
