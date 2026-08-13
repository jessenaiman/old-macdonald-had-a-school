"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("material-surface material-cardboard-paper inline-flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-border p-1", className)} {...props} />
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("min-h-11 rounded-lg px-4 font-heading text-sm text-foreground transition-[background-color,color,box-shadow] hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", className)} {...props} />
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("mt-4 min-w-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
