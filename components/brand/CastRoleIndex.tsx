import Image from "next/image"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CAST, type CastKey } from "@/lib/cast"

export function CastRoleIndex({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="material-surface material-cork mt-8 rounded-2xl border border-border p-4 sm:p-6" aria-labelledby={`cast-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <h3 className="font-heading text-3xl" id={`cast-${title.toLowerCase().replaceAll(" ", "-")}`}>{title}</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  )
}

export function CastRoleIndexItem({
  character,
  role,
  level,
  permitted,
  colorReference,
}: {
  character: CastKey
  role: string
  level: string
  permitted: string
  colorReference: string
}) {
  const member = CAST[character]

  return (
    <Card className={`material-surface material-cardboard-paper cast-${character} relative overflow-visible border-border py-0 text-foreground shadow-md`}>
      <span className="brand-asset fastener-paperclip icon-small absolute -top-4 right-4 z-10" aria-hidden="true" />
      <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)]">
        <div className="character-surface grid min-h-32 place-items-center rounded-l-xl border-r border-border p-2">
          <Image className="size-20 object-contain" src={member.portrait} alt="" width={80} height={80} />
        </div>
        <CardHeader className="min-w-0 gap-1 px-4 py-4">
          <CardTitle className="font-heading text-xl">{member.name}</CardTitle>
          <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
            <span>{member.family}</span>
            <code className={`cast-${character} character-surface rounded-md border border-current/20 px-2 py-1 font-mono text-xs font-black`}>{colorReference}</code>
          </p>
          <div className="mt-3 border-t border-border pt-3 font-body text-sm leading-6">
            <strong className="block text-xs uppercase tracking-wider text-muted-foreground">Role or personality</strong>
            <span>{role}</span>
          </div>
          <div className="mt-3 border-t border-border pt-3 font-body text-sm leading-6">
            <strong className="block text-xs uppercase tracking-wider text-muted-foreground">Level / permitted action</strong>
            <span className="font-bold">{level}</span>
            <small className="mt-1 block text-sm text-muted-foreground">{permitted}</small>
          </div>
        </CardHeader>
      </div>
    </Card>
  )
}
