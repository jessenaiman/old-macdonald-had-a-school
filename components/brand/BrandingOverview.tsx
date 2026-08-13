import { Button } from "@/components/ui/button"
import { CharacterPortrait } from "@/components/brand/CharacterPortrait"
import type { CastKey } from "@/lib/cast"

const guideSections = [
  ["Page recipe", "#page-recipe"], ["Materials", "#assets"], ["Icons", "#icons"],
  ["Logo family", "#logo-family"], ["Icon sizing", "#icon-sizes"],
  ["Cast", "#cast"], ["Subjects", "#subject-cards"], ["Badge recipe", "#badge-recipe"],
  ["Typography", "#typography"], ["Actions", "#buttons"], ["Controls", "#controls"],
  ["Grades", "#grades"], ["Palette", "#palette"], ["Governance", "#governance"],
] as const

const cast: readonly CastKey[] = ["old-macdonald", "miss-puddles", "mr-rusty", "miss-hayley"]

const rules = [
  ["Palette", "theme.css is the only colour owner. Components consume semantic tokens; printed HEX values sit on their live semantic surface.", "fastener-push-pin"],
  ["Assets", "brand-assets.css maps approved paths. Components request named classes or semantic character keys—never URLs.", "fastener-paperclip"],
  ["Layout", "Prefer intrinsic flex/grid sizing and standard Tailwind utilities. A page must not declare a private breakpoint system.", "fastener-masking-tape"],
  ["Identity", "Use character=\"miss-puddles\", data-grade, or a semantic subject key. Never pass colour, portrait, texture, or ink props.", "fastener-binder-clip"],
  ["Materials", "Paper carries readable information. Fasteners cross both attached edges. Character colour remains local to character identity.", "fastener-gingham-tape"],
  ["Verification", "Check light and dark at 1900, 1440, 768, 390, and 320px. Reject overflow, clipping, unused container space, unreadable text, detached fasteners, or extra page headings.", "fastener-brass-rivet"],
] as const

const decisions = [
  ["Material, board, or fastener", "#assets", "Materials and attachment examples", "public/BRAND_ASSET_RECIPES.md"],
  ["Icon or curriculum signal", "#icons", "Icon catalogue and size roles", "public/BRAND_ASSET_RECIPES.md"],
  ["Character identity or teaching role", "#cast", "Canonical cast examples", "content/pages/branding/cast.mdx"],
  ["Typography or palette role", "#typography", "Typography in context", "public/branding/PALETTE_AND_TYPOGRAPHY.md"],
  ["Component behavior or responsive pattern", "#controls", "Shared controls and page recipe", "public/branding/DESIGN_SYSTEM.md"],
  ["Approval, exclusion, or ambiguity", "#governance", "Production boundary", "docs/ASSET_LIBRARY_GOVERNANCE.md"],
] as const

type BrandingOverviewProps = {
  eyebrow: string
  title: string
  emphasis: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  patchTitle: string
  patchCaption: string
}

export function BrandingOverview({ eyebrow, title, emphasis, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref, patchTitle, patchCaption }: BrandingOverviewProps) {
  return <>
    <header className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-site-chrome text-site-chrome-foreground shadow-xl">
      <div className="flex min-w-[min(100%,32rem)] flex-[1.15_1_38rem] flex-col justify-center p-[clamp(1.5rem,4vw,4rem)]">
        <p className="mb-3 font-body text-xs font-black uppercase tracking-widest text-site-chrome-accent">{eyebrow}</p>
        <h1 className="m-0 max-w-3xl text-balance font-heading text-[clamp(3rem,7vw,6rem)] leading-[.88] text-site-chrome-foreground">{title} <em className="block font-hand text-brand-pink">{emphasis}</em></h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-site-chrome-foreground">Start with readable structure. Add approved materials where they behave like real objects. Keep each character’s assigned colour local and unmistakable.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Button asChild><a href={primaryHref}>{primaryLabel}</a></Button><Button asChild variant="outline"><a href={secondaryHref}>{secondaryLabel}</a></Button></div>
      </div>
      <div className="material-surface material-cork grid min-h-80 min-w-[min(100%,24rem)] flex-[.85_1_30rem] content-end overflow-hidden border border-border px-5 pt-10">
        <div className="material-surface material-felt relative mx-auto mb-10 w-full max-w-sm rounded-xl p-7 text-center text-site-chrome-foreground shadow-xl"><span className="brand-asset fastener-masking-tape icon-medium absolute -top-7 left-1/2 -translate-x-1/2" aria-hidden="true" /><strong className="font-heading text-3xl leading-none">{patchTitle}</strong><small className="mt-2 block font-body font-black uppercase tracking-wider">{patchCaption}</small></div>
        <div className="flex items-end justify-center">{cast.map((character, index) => <CharacterPortrait key={character} character={character} className={index === 0 ? "h-auto w-[clamp(6rem,12vw,8rem)]" : "-ml-8 h-auto w-[clamp(6rem,12vw,8rem)]"} />)}</div>
      </div>
    </header>
    <nav className="material-surface material-cardboard-paper my-5 rounded-xl border border-border p-3 shadow-md" aria-label="Brand guide contents">
      <strong className="mb-2 block font-hand text-xl">Brand guide contents</strong>
      <div className="flex flex-wrap gap-2">{guideSections.map(([label, href]) => <a className="min-h-11 flex-[1_1_9rem] rounded-lg border border-border bg-primary px-4 py-3 text-center text-sm font-black text-primary-foreground no-underline shadow-[0_3px_0_var(--border)] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={href} key={href}>{label}</a>)}</div>
    </nav>
  </>
}

export function BrandingLookup() {
  return <section id="fast-lookup" className="material-surface material-cardboard-paper mt-5 rounded-2xl border border-border p-[clamp(1rem,3vw,2rem)] shadow-md">
    <div className="max-w-3xl"><p className="mb-2 text-xs font-black uppercase tracking-widest text-primary">Production contract</p><h2 className="m-0 font-heading text-[clamp(1.875rem,4vw,3rem)]">Rules every page must obey</h2><p className="mb-0 mt-2 leading-7">Read this before copying a visual example. Pages compose semantic components; they do not invent their own palette, asset paths, identity data, or breakpoint system.</p></div>
    <div className="mt-5 flex flex-wrap gap-4">{rules.map(([title, copy, fastener]) => <article className="material-surface material-cardboard-paper relative min-w-[min(100%,16rem)] flex-[1_1_18rem] border border-border p-5 pt-7 text-foreground shadow-md" key={title}><span className={`brand-asset ${fastener} icon-small absolute -top-5 left-1/2 -translate-x-1/2`} aria-hidden="true" /><strong className="font-heading text-xl">{title}</strong><p className="mb-0 mt-2 text-base leading-7">{copy}</p></article>)}</div>
    <h3 className="mt-8 font-heading text-2xl">Open the exact source only when needed</h3>
    <div className="mt-4 flex flex-wrap gap-3">{decisions.map(([decision, href, example, source]) => <article className="min-w-[min(100%,20rem)] flex-[1_1_25rem] rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm" key={decision}><span className="text-xs font-black uppercase tracking-wider text-muted-foreground">If you need to decide</span><strong className="mt-1 block font-heading text-xl">{decision}</strong><a className="mt-3 inline-block font-bold text-primary underline underline-offset-4" href={href}>{example}</a><code className="mt-3 block break-all rounded bg-muted p-2 text-xs">{source}</code></article>)}</div>
  </section>
}
