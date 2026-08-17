import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CAST, type CastKey } from "@/data/brand/cast-registry"

function CharacterForms({ character }: { character: CastKey }) {
  const member = CAST[character]

  return (
    <div className="flex items-end justify-between gap-2" aria-label={`${member.name} governed artwork forms`}>
      <figure className="m-0 grid justify-items-center gap-1">
        <span className="brand-asset character-face-bust icon-small" data-character={character} role="img" aria-label={`${member.name} transparent 2D face`} />
        <figcaption className="text-center text-[0.625rem] leading-tight text-muted-foreground">Face</figcaption>
      </figure>
      <figure className="m-0 grid justify-items-center gap-1">
        <span className="brand-asset character-face-patch icon-small" data-character={character} role="img" aria-label={`${member.name} 2D face with backing`} />
        <figcaption className="text-center text-[0.625rem] leading-tight text-muted-foreground">Backed</figcaption>
      </figure>
      <figure className="m-0 grid justify-items-center gap-1">
        <Image className="size-10 object-contain" src={member.portrait} alt={`${member.name} transparent full character`} width={40} height={40} />
        <figcaption className="text-center text-[0.625rem] leading-tight text-muted-foreground">Full</figcaption>
      </figure>
      <figure className="m-0 grid justify-items-center gap-1">
        <span className="brand-asset character-embroidered-badge icon-medium" data-character={character} role="img" aria-label={`${member.name} large felt embroidered patch`} />
        <figcaption className="text-center text-[0.625rem] leading-tight text-muted-foreground">Felt</figcaption>
      </figure>
    </div>
  )
}

export function CastRoleIndex({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `cast-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "")}`

  return (
    <section className="grid gap-3" aria-labelledby={id}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-heading text-3xl leading-none" id={id}>{title}</h2>
        <Badge variant="secondary">8 identities</Badge>
      </div>
      <div className="hidden items-end gap-4 border-b border-border px-4 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-[2fr_2fr_3fr_5fr]" aria-hidden="true">
        <span>Identity</span><span>Role or personality</span><span>Level and permitted action</span><span>Governed artwork forms</span>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

export function CastRoleIndexItem({ character, role, level, permitted, interests }: { character: CastKey; role: string; level: string; permitted: string; interests?: string }) {
  const member = CAST[character]

  return (
    <Card className={`cast-${character} grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[2fr_2fr_3fr_5fr] lg:items-center`}>
      <CardHeader className="gap-1 px-0">
        <div className="flex min-w-0 items-center gap-3">
          <span className="character-surface grid size-12 shrink-0 place-items-center rounded-full border border-current/20">
            <Image className="size-10 object-contain" src={member.portrait} alt="" width={40} height={40} />
          </span>
          <div className="min-w-0">
            <CardTitle>{member.name}</CardTitle>
            <CardDescription className="mt-1"><code>cast-{character}</code></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-1 px-0">
        <strong className="text-xs uppercase tracking-wider text-muted-foreground lg:sr-only">Role or personality</strong>
        <span>{role}</span>
        {interests ? <span className="text-sm text-muted-foreground">{interests}</span> : null}
      </CardContent>
      <CardContent className="grid gap-1 px-0">
        <strong className="text-xs uppercase tracking-wider text-muted-foreground lg:sr-only">Level and permitted action</strong>
        <span className="font-semibold">{level}</span>
        <span className="text-sm text-muted-foreground">{permitted}</span>
      </CardContent>
      <CardContent className="px-0"><CharacterForms character={character} /></CardContent>
    </Card>
  )
}
