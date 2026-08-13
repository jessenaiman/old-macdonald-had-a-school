import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CAST, type CastKey } from "@/lib/cast"

export function CastRoleIndex({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8" aria-labelledby={`cast-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <h3 className="font-heading text-3xl" id={`cast-${title.toLowerCase().replaceAll(" ", "-")}`}>{title}</h3>
      <div className="mt-4 grid gap-3">{children}</div>
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
    <Card className={`cast-${character} overflow-hidden py-0`}>
      <div className="flex min-w-0 flex-wrap items-stretch">
        <div className="character-surface grid min-h-28 min-w-24 flex-[0_1_8rem] place-items-center border-r border-border p-2">
          <Image className="size-20 object-contain" src={member.portrait} alt="" width={80} height={80} />
        </div>
        <CardHeader className="min-w-48 flex-[1_1_15rem] gap-1 px-4 py-3">
          <CardTitle className="font-heading text-xl">{member.name}</CardTitle>
          <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
            <span>{member.family}</span>
            <code className={`cast-${character} character-surface rounded-md border border-current/20 px-2 py-1 font-mono text-xs font-black`}>{colorReference}</code>
          </p>
        </CardHeader>
        <CardContent className="min-w-48 flex-[1_1_18rem] px-4 py-3">
          <strong className="block text-xs uppercase tracking-wider text-muted-foreground">Role or personality</strong>
          <span>{role}</span>
        </CardContent>
        <CardContent className="min-w-56 flex-[1_1_22rem] px-4 py-3">
          <strong className="block text-xs uppercase tracking-wider text-muted-foreground">Level / permitted action</strong>
          <span className="font-bold">{level}</span>
          <small className="mt-1 block text-sm text-muted-foreground">{permitted}</small>
        </CardContent>
      </div>
    </Card>
  )
}
