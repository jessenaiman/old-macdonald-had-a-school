import Link from "next/link"
import { Palette, StickyNote } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { ResponsiveBrandEmblem } from "@/components/brand/ResponsiveBrandEmblem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>
type ButtonShape = NonNullable<ComponentProps<typeof Button>["shape"]>

type ReferenceSection = {
  label: string
  href: string
  variant: ButtonVariant
  shape: ButtonShape
  css: string
  className?: string
  subject?: "language" | "math" | "science" | "music" | "arts" | "health"
}

const sections: ReadonlyArray<ReferenceSection> = [
  { label: "Page recipe", href: "#page-recipe", variant: "default", shape: "soft", css: "material-paper-ruled" },
  { label: "Materials & fabrics", href: "#assets", variant: "note", shape: "label", css: "subject-note-paper", subject: "science" },
  { label: "Homepage", href: "#homepage-surface", variant: "default", shape: "tab", css: "material-paper-ruled; --paper-color: var(--theme-paper-rose)", className: "[--paper-color:var(--theme-paper-rose)]" },
  { label: "Logo", href: "#logo-family", variant: "note", shape: "pill", css: "subject-note-paper", subject: "music" },
  { label: "Icons", href: "#icons", variant: "grid", shape: "soft", css: "material-paper-grid; --paper-color: var(--theme-navy); --paper-ink: var(--theme-white)", className: "[--paper-color:var(--theme-navy)] [--paper-ink:var(--theme-white)]" },
  { label: "Icon sizing", href: "#icon-sizes", variant: "grid", shape: "label", css: "material-paper-grid" },
  { label: "Cast", href: "#cast", variant: "outline", shape: "pill", css: "border bg-background" },
  { label: "Subjects", href: "#subject-cards", variant: "default", shape: "square", css: "material-paper-ruled" },
  { label: "Badges", href: "#badge-recipe", variant: "note", shape: "pill", css: "subject-note-paper", subject: "arts" },
  { label: "Typography", href: "#typography", variant: "grid", shape: "tab", css: "material-paper-grid; --paper-color: var(--theme-navy); --paper-ink: var(--theme-white)", className: "[--paper-color:var(--theme-navy)] [--paper-ink:var(--theme-white)]" },
  { label: "Actions", href: "#buttons", variant: "default", shape: "label", css: "material-paper-ruled; --paper-color: var(--theme-paper-rose)", className: "[--paper-color:var(--theme-paper-rose)]" },
  { label: "Controls", href: "#controls", variant: "note", shape: "soft", css: "subject-note-paper", subject: "language" },
  { label: "Grades", href: "#grades", variant: "secondary", shape: "tab", css: "bg-secondary text-secondary-foreground" },
  { label: "Palette", href: "#palette", variant: "outline", shape: "label", css: "border bg-background" },
  { label: "Governance", href: "#governance", variant: "default", shape: "pill", css: "material-paper-ruled" },
]

const assetFolders = [
  ["Blank felt patches", "blank-felt-patches-v1"], ["Brand emblems", "brand-emblem-v1"],
  ["Emblem source sheets", "brand-emblem-v1-review"], ["Classroom fasteners", "classroom-fasteners-v1"],
  ["Additional fasteners", "classroom-fasteners-v2"], ["Fastener source sheets", "classroom-fasteners-v2-review"],
  ["Paper notes", "classroom-paper-notes-v1"], ["Paper-note source sheets", "classroom-paper-notes-v1-review"],
  ["Cork boards v1", "cork-board-kit-v1"], ["Cork boards v2", "cork-board-kit-v2"],
  ["Homepage reference parts", "homepage-reference-parts-v1"], ["Homepage artwork", "homepage-v2"],
  ["Theme patches", "theme-toggle-patches-v1"], ["Material textures", "web-material-library-v1"],
] as const

function ReferenceButton({ label, href, variant, shape, css, className, subject }: ReferenceSection) {
  const subjectProp = subject ? ` data-subject="${subject}"` : ""
  const html = `<Button variant="${variant}" shape="${shape}"${subjectProp} asChild><Link href="${href}">${label}</Link></Button>`
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild className={className} variant={variant} shape={shape} data-subject={subject}><Link href={href}>{label}</Link></Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <span className="grid gap-1"><code className="break-all">{html}</code><code>CSS recipe: {css}</code></span>
      </TooltipContent>
    </Tooltip>
  )
}

function RuleButton({ description, href, icon, label, recipe, subject }: { description: string; href: string; icon: ReactNode; label: string; recipe: string; subject: "language" | "math" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild className="h-auto min-h-24 w-full justify-start gap-3 whitespace-normal px-8 py-5 text-left" data-subject={subject} shape="label" variant="note">
          <Link href={href}>{icon}<span className="grid gap-1"><strong className="font-display text-base">{label}</strong><span className="text-sm leading-5">{description}</span></span></Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm"><code>{recipe}</code></TooltipContent>
    </Tooltip>
  )
}

export function BrandingLookup() {
  return (
    <Card className="material-surface material-cardboard-paper my-6" id="brand-reference-index">
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3"><ResponsiveBrandEmblem /><div className="min-w-0"><CardTitle className="text-3xl">Brand reference index</CardTitle><CardDescription>Find the authored example first, then reuse its production component and allowed assets.</CardDescription></div></div>
        <div className="flex flex-wrap gap-2" aria-label="Primary brand reference actions">
          <Button asChild><Link href="#page-recipe">Default branded action</Link></Button>
          <Button asChild shape="soft"><Link href="#assets">Browse visual assets</Link></Button>
          <Button asChild variant="construction" shape="label"><Link href="/branding/DESIGN_SYSTEM.md">Component rules</Link></Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sections">
          <TabsList className="flex h-auto w-full flex-wrap justify-start"><TabsTrigger value="sections">Button reference</TabsTrigger><TabsTrigger value="assets">Asset folders</TabsTrigger><TabsTrigger value="ownership">Code ownership</TabsTrigger></TabsList>
          <TabsContent value="sections" className="grid gap-4">
            <p className="max-w-3xl text-sm text-muted-foreground">Every link below uses the shared shadcn Button. Hover or focus a button to read its exact component HTML and semantic CSS recipe.</p>
            <TooltipProvider>
              <div className="grid gap-3 md:grid-cols-2">
                <RuleButton description="Readable controls use paper, construction paper, or a transparent-edged note—not upholstery or the board beneath it." href="#buttons" icon={<StickyNote className="size-8" />} label="Put words on paper" recipe={'<Button variant="note" shape="label" data-subject="language">…</Button>'} subject="language" />
                <RuleButton description="Change --paper-color and --paper-ink; keep the ruled or graph texture, spacing, focus ring, and shared Button behavior." href="#palette" icon={<Palette className="size-8" />} label="Tint the paper, not the component" recipe={'<Button className="[--paper-color:var(--theme-paper-rose)]">…</Button>'} subject="math" />
              </div>
              <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Brand reference sections">{sections.map((section) => <ReferenceButton {...section} key={section.href} />)}</nav>
            </TooltipProvider>
          </TabsContent>
          <TabsContent value="assets">
            <p className="mb-4 max-w-3xl leading-7">Everything under <code>public/design-assets/</code> is available for discovery and use. Contact sheets support discovery; when an individual export is missing, separate it with Canva Magic Layers, export it for the web, and inspect clipping and transparency before use.</p>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{assetFolders.map(([label, folder]) => <li className="min-w-0 border-b border-border pb-2" key={folder}><strong className="block">{label}</strong><code className="break-all text-xs">public/design-assets/{folder}/</code></li>)}</ul>
          </TabsContent>
          <TabsContent value="ownership"><dl className="grid gap-4 md:grid-cols-2"><div><dt className="font-bold">Theme and Tailwind</dt><dd><code>app/globals.css</code></dd></div><div><dt className="font-bold">Asset connections</dt><dd><code>app/brand-assets.css</code></dd></div><div><dt className="font-bold">Shared behavior</dt><dd><code>components/ui/</code></dd></div><div><dt className="font-bold">Production compositions</dt><dd><code>components/home/</code>, <code>components/grades/</code>, and route components</dd></div></dl></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
