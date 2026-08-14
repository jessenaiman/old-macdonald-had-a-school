import Link from "next/link"

import { ResponsiveBrandEmblem } from "@/components/brand/ResponsiveBrandEmblem"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const assetFamilies = [
  ["Blank felt patches", "public/design-assets/blank-felt-patches-v1/", "Blank shapes for badges, portraits, labels, and attached objects."],
  ["Brand emblem exports", "public/design-assets/brand-emblem-v1/", "Size-specific emblem files for metadata, navigation, cards, and larger media."],
  ["Brand emblem review", "public/design-assets/brand-emblem-v1-review/", "Comparison sheets and review material for discovering the emblem family."],
  ["Classroom fasteners v1", "public/design-assets/classroom-fasteners-v1/", "Pins, clips, tape, buttons, and separated attachment pieces."],
  ["Classroom fasteners v2", "public/design-assets/classroom-fasteners-v2/", "Additional attachment artwork and separated exports."],
  ["Fastener review", "public/design-assets/classroom-fasteners-v2-review/", "Review sheets for comparing the second fastener family."],
  ["Classroom paper notes", "public/design-assets/classroom-paper-notes-v1/", "Blank note shapes for live HTML headings, copy, and links."],
  ["Paper-note review", "public/design-assets/classroom-paper-notes-v1-review/", "Review sheets for finding and comparing paper-note shapes."],
  ["Cork board kit v1", "public/design-assets/cork-board-kit-v1/", "Earlier cork-board tiles and board references."],
  ["Cork board kit v2", "public/design-assets/cork-board-kit-v2/", "Current repeatable cork tiles and board-sized derivatives."],
  ["Homepage reference parts", "public/design-assets/homepage-reference-parts-v1/", "Separated pieces and references used to inspect homepage composition."],
  ["Homepage v2", "public/design-assets/homepage-v2/", "Homepage artwork and composition references from the second family."],
  ["Theme-toggle patches", "public/design-assets/theme-toggle-patches-v1/", "The full sun and moon felt artwork used by the shared theme control."],
  ["Web material library", "public/design-assets/web-material-library-v1/", "Cardboard, construction paper, felt, woven cloth, thread, and leather tiles. Cork is stored in the cork-board kits."],
] as const

const productionReferences = [
  ["Homepage composition", "/", "components/home/HomePage.tsx", "Hero, lesson notes, subject board, and folk-arts links."],
  ["Grade workspace", "/grade/grade-one", "components/grades/", "Shared grade navigation, teacher note, lesson controls, and work stage."],
  ["Lessons", "/lessons", "app/lessons/page.tsx", "Production cards, empty states, and lesson navigation."],
  ["Topics", "/topics", "app/topics/TopicsClient.tsx", "Production topic browsing and topic-card composition."],
  ["Songs", "/songs", "app/songs/page.tsx", "Production song catalogue, cards, filters, and detail navigation."],
  ["Search", "/search", "app/search/page.tsx", "Production fields, tabs, results, and actions."],
  ["About", "/about", "components/about/AboutProductPage.tsx", "Production explanatory content and calls to action."],
  ["Shared navigation", "/", "components/SiteHeader.tsx + components/MobileNavigation.tsx", "Desktop and mobile navigation, responsive emblem, grade access, and search entry."],
  ["Shared footer", "/", "components/SiteFooter.tsx", "Production footer links and material treatment."],
  ["Theme control", "/", "components/ThemeSwitcher.tsx", "Production day and dusk control using the authored felt sun and moon patches."],
] as const

export function BrandingLookup() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <section aria-labelledby="start-here" className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-bold text-muted-foreground">Start here</p>
          <h2 id="start-here" className="font-heading text-3xl sm:text-4xl">Build from the existing website</h2>
          <p className="mt-2 max-w-3xl text-pretty leading-7">
            Check the asset library, open the real production component, then compose it with Tailwind and the installed shadcn primitives. Everything under <code>public/design-assets/</code> is available for discovery and use. <code>brand-assets.css</code> records a current connection; it is not a permission list.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="#assets">Find an asset</Link></Button>
          <Button asChild variant="secondary"><Link href="#production">Reuse a production pattern</Link></Button>
          <Button asChild variant="outline"><Link href="/branding/DESIGN_SYSTEM.md">Read component rules</Link></Button>
        </div>
      </section>

      <Separator />

      <section id="assets" aria-labelledby="assets-title" className="scroll-mt-24">
        <h2 id="assets-title" className="font-heading text-3xl">Asset families</h2>
        <p className="mt-2 max-w-3xl leading-7">Use the folder descriptions to discover what exists. For a filterable inventory, use <code>docs/design-asset-master-list.csv</code> or <code>.json</code>; for human browsing, use <code>docs/DESIGN_ASSET_MASTER_LIST.md</code>.</p>
        <p className="mt-2 max-w-3xl leading-7">Contact sheets and review sheets are discovery sources, not forbidden files. When only a large sheet contains the needed piece, use Canva Magic Layers to separate it, export a web-ready individual, then inspect and correct clipping and transparency before connecting it to production.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assetFamilies.map(([title, path, description]) => (
            <Card key={path}>
              <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
              <CardContent><code className="break-all text-xs">{path}</code></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section id="production" aria-labelledby="production-title" className="scroll-mt-24">
        <h2 id="production-title" className="font-heading text-3xl">Production patterns to reuse</h2>
        <p className="mt-2 max-w-3xl leading-7">These routes are the visual references. Reuse their owning components; do not rebuild a branding-only imitation.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {productionReferences.map(([title, href, source, description]) => (
            <Card key={href}>
              <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <code className="break-all text-xs">{source}</code>
                <Button asChild variant="outline"><Link href={href}>Open the real page</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section id="logo" aria-labelledby="logo-title" className="scroll-mt-24">
        <h2 id="logo-title" className="font-heading text-3xl">Responsive logo and browser icons</h2>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><ResponsiveBrandEmblem /> One emblem, size-specific exports</CardTitle>
            <CardDescription>The shared header uses the 44px mark and switches to the simplified 32px mark below Tailwind&apos;s <code>sm</code> breakpoint. Browser metadata uses dedicated 16px and 32px exports instead of shrinking the detailed artwork.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <code className="break-all">components/brand/ResponsiveBrandEmblem.tsx</code>
            <code className="break-all">public/design-assets/brand-emblem-v1/</code>
            <code className="break-all">app/layout.tsx → metadata.icons</code>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="ownership" aria-labelledby="ownership-title">
        <h2 id="ownership-title" className="font-heading text-3xl">Where each decision belongs</h2>
        <ul className="mt-3 grid gap-2 leading-7">
          <li><code>app/globals.css</code> — Tailwind/shadcn theme tokens and reusable material recipes.</li>
          <li><code>app/brand-assets.css</code> — public asset paths connected to semantic classes or tokens.</li>
          <li><code>components/ui/</code> — shared interactive behavior and variants.</li>
          <li><code>components/home/</code>, <code>components/grades/</code>, and route components — real compositions reused across the site.</li>
          <li><code>public/design-assets/</code> — the allowed design library, including assets not connected yet.</li>
        </ul>
      </section>
    </div>
  )
}
