import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const FASTENERS = {
  pin: "fastener-push-pin",
  clip: "fastener-paperclip",
  tape: "fastener-masking-tape",
} as const

export type WorkingWallFastener = keyof typeof FASTENERS

export function WorkspaceTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      data-slot="workspace-tabs-list"
      className={cn(
        "flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 xl:flex-col xl:items-stretch",
        className,
      )}
      {...props}
    />
  )
}

export function WorkspaceTabTrigger({
  index,
  className,
  children,
  ...props
}: ComponentProps<typeof TabsTrigger> & { index: number }) {
  return (
    <TabsTrigger
      data-slot="workspace-tab-trigger"
      className={cn(
        "group grow justify-start gap-2 rounded-lg border-border/70 bg-background/75 px-3 data-[state=active]:bg-[var(--grade-color)] data-[state=active]:text-[var(--grade-ink)] xl:w-full",
        className,
      )}
      {...props}
    >
      <span
        className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-[.625rem] font-black tabular-nums"
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>
      <span>{children}</span>
    </TabsTrigger>
  )
}

export type WorkingWallPathCardProps = {
  active?: boolean
  description: string
  href?: string
  iconClass: string
  kicker: string
  onSelect?: () => void
  title: string
}

export function WorkingWallPathCard({
  active,
  description,
  href,
  iconClass,
  kicker,
  onSelect,
  title,
}: WorkingWallPathCardProps) {
  const content = (
    <>
      <span
        className="brand-asset fastener-push-pin icon-small absolute -top-2 right-2"
        aria-hidden="true"
      />
      <span
        className={cn("brand-asset icon-medium col-start-1 row-span-4 self-start", iconClass)}
        aria-hidden="true"
      />
      <span className="col-start-2 grade-surface w-fit rounded-md px-2 py-1 text-xs font-black uppercase tracking-widest">
        {kicker}
      </span>
      <strong className="col-start-2 font-body text-lg font-semibold leading-tight text-balance">
        {title}
      </strong>
      <span className="col-start-2 text-sm leading-5 text-foreground/80">{description}</span>
      <span className="col-start-2 self-end text-sm font-bold underline underline-offset-4">
        View path →
      </span>
    </>
  )
  const className =
    "grade-surface working-wall-patch relative grid h-auto min-h-36 min-w-0 grid-cols-[4.75rem_minmax(0,1fr)] grid-rows-[auto_auto_1fr_auto] items-start gap-x-4 gap-y-1 whitespace-normal rounded-xl border p-4 text-left transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 data-[active=true]:ring-3 data-[active=true]:ring-ring/60"

  return href ? (
    <Button asChild className={className} variant="ghost">
      <Link href={href} onClick={onSelect} data-active={active || undefined}>
        {content}
      </Link>
    </Button>
  ) : (
    <Button
      className={className}
      variant="ghost"
      onClick={onSelect}
      data-active={active || undefined}
      type="button"
    >
      {content}
    </Button>
  )
}

export function WorkingWallNote({
  fastener = "pin",
  heading,
  children,
  className,
  ...props
}: ComponentProps<typeof Card> & {
  fastener?: WorkingWallFastener
  heading: ReactNode
}) {
  return (
    <Card
      data-slot="working-wall-note"
      className={cn("working-wall-note relative gap-3", className)}
      {...props}
    >
      <span
        className={cn(
          "brand-asset icon-small pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2",
          FASTENERS[fastener],
        )}
        aria-hidden="true"
      />
      <CardHeader className="pt-8">
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function WorkingWallBoard({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="working-wall-board"
      className={cn("working-wall-board flex min-w-0 flex-col gap-5 p-4", className)}
      {...props}
    />
  )
}

export function WorkingWallSeparator({
  treatment = "dashed",
  className,
  ...props
}: ComponentProps<typeof Separator> & {
  treatment?: "dashed" | "paper" | "space" | "board"
}) {
  return (
    <Separator
      data-slot="working-wall-separator"
      data-treatment={treatment}
      className={cn(
        treatment === "dashed" && "h-0 border-t border-dashed bg-transparent",
        treatment === "paper" &&
          "h-3 bg-transparent bg-[image:var(--asset-paper-note-mobile)] bg-[length:100%_100%] bg-center bg-no-repeat",
        treatment === "space" && "h-8 bg-transparent",
        treatment === "board" && "h-2 rounded-full bg-[var(--theme-wood)]",
        className,
      )}
      {...props}
    />
  )
}

export function MaterialSwatch({
  label,
  materialClass,
  className,
  ...props
}: ComponentProps<"figure"> & {
  label: string
  materialClass: string
}) {
  return (
    <figure
      data-slot="material-swatch"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <div
        className={cn("min-h-24 rounded-lg border border-border", materialClass)}
        aria-hidden="true"
      />
      <figcaption className="text-sm font-bold">{label}</figcaption>
    </figure>
  )
}
