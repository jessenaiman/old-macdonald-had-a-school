import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const FASTENERS = {
  pin: "fastener-push-pin",
  clip: "fastener-paperclip",
  tape: "fastener-masking-tape",
} as const

export type WorkingWallFastener = keyof typeof FASTENERS

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
      <span className="material-surface material-cardboard-paper col-start-2 rounded-md px-2.5 py-1.5 text-sm leading-5 text-foreground">{description}</span>
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
