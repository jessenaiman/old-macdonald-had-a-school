import Link from "next/link"

import { ResponsiveBrandEmblem } from "@/components/brand/ResponsiveBrandEmblem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const groups = [
  {
    title: "Start with meaning",
    description: "Choose the character, grade, subject, and learning reason before choosing decoration.",
    links: [["Cast and learning roles", "/branding/cast"], ["Grade ownership", "#grades"], ["Subject examples", "#subject-cards"]],
  },
  {
    title: "Assemble the page",
    description: "Use the production page hierarchy and existing responsive compositions.",
    links: [["Page recipe", "#page-recipe"], ["Homepage composition", "#homepage-surface"], ["Controls", "#controls"]],
  },
  {
    title: "Choose visual pieces",
    description: "Select materials by construction and icons by learning purpose.",
    links: [["Materials and assets", "#assets"], ["Icon catalogue", "/branding/icons"], ["Badge composition", "#badge-recipe"]],
  },
  {
    title: "Apply the interface",
    description: "Reuse installed shadcn components and semantic theme roles.",
    links: [["Typography", "#typography"], ["Actions", "#buttons"], ["Palette", "#palette"]],
  },
  {
    title: "Check production rules",
    description: "Confirm ownership, approved assets, accessibility, and responsive behavior.",
    links: [["Asset governance", "#assets"], ["Source files", "#sources"], ["Focused design rules", "/branding#controls"]],
  },
] as const

export function BrandingLookup() {
  return (
    <Card className="material-surface material-cardboard-paper my-6" id="brand-reference-index">
      <CardHeader className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <ResponsiveBrandEmblem className="size-14" />
        <div className="min-w-0">
          <CardTitle className="font-heading text-3xl">Use the system in five decisions</CardTitle>
          <CardDescription className="mt-2 max-w-3xl text-base leading-6">Start with the educational reason, then move through composition, assets, components, and verification. Each link jumps to the authored example that owns the decision.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="grid list-none gap-4 p-0 lg:grid-cols-5">
          {groups.map((group, index) => (
            <li className="min-w-0 border-l-4 border-primary pl-4" key={group.title}>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Decision {index + 1}</p>
              <strong className="font-heading text-xl leading-none">{group.title}</strong>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{group.description}</p>
              <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                {group.links.map(([label, href]) => <li key={href}><Link className="font-bold text-primary underline underline-offset-4" href={href}>{label}</Link></li>)}
              </ul>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter className="border-t">
        <Button asChild><Link href="/branding/cast">Open the cast guide</Link></Button>
      </CardFooter>
    </Card>
  )
}

