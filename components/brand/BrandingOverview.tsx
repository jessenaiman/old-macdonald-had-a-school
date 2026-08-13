import Image from "next/image"

import { Button } from "@/components/ui/button"

const guideSections = [
  ["Page recipe", "#page-recipe"],
  ["Materials", "#assets"],
  ["Icons", "#icons"],
  ["Cast", "#cast"],
  ["Subjects", "#subject-cards"],
  ["Typography", "#typography"],
  ["Controls", "#controls"],
  ["Grades", "#grades"],
] as const

const cast = [
  ["Old MacDonald", "/staff_and_students/old-macdonald-transparent-circle.png"],
  ["Miss Puddles", "/staff_and_students/miss-puddles-transparent-circle.png"],
  ["Mr Rusty", "/staff_and_students/mr-rusty-transparent-circle.png"],
  ["Miss Hayley", "/staff_and_students/miss-hayley-transparent-circle.png"],
] as const

export function BrandingOverview() {
  return (
    <>
      <header className="grid min-h-[32rem] overflow-hidden rounded-2xl border border-border bg-site-chrome text-site-chrome-foreground shadow-xl lg:grid-cols-[1.15fr_.85fr]">
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16">
          <p className="mb-3 font-body text-xs font-black uppercase tracking-widest text-site-chrome-accent">
            Working brand reference
          </p>
          <h1 className="m-0 max-w-3xl text-balance font-heading text-5xl leading-[.88] text-site-chrome-foreground sm:text-7xl lg:text-8xl">
            The whole school <em className="block font-hand text-brand-pink">in character.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-site-chrome-foreground">
            Start with readable structure. Add approved materials where they behave like real objects. Keep each character’s assigned colour local and unmistakable.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild><a href="#page-recipe">See the complete recipe</a></Button>
            <Button asChild variant="outline"><a href="#assets">Browse approved pieces</a></Button>
          </div>
        </div>

        <div className="material-surface material-woven-fabric grid min-h-80 content-end overflow-hidden border-t border-border px-5 pt-10 lg:min-h-full lg:border-t-0 lg:border-l">
          <div className="material-surface material-felt relative mx-auto mb-10 w-full max-w-sm rounded-xl p-7 text-center text-site-chrome-foreground shadow-xl">
            <span className="brand-asset fastener-masking-tape icon-medium absolute -top-7 left-1/2 -translate-x-1/2" aria-hidden="true" />
            <strong className="font-heading text-3xl leading-none">Structure first.</strong>
            <small className="mt-2 block font-body font-black uppercase tracking-wider">Then layer the real pieces.</small>
          </div>
          <div className="flex items-end justify-center">
            {cast.map(([name, src], index) => (
              <Image
                key={name}
                className={index === 0 ? "h-auto w-24 sm:w-32" : "-ml-8 h-auto w-24 sm:-ml-10 sm:w-32"}
                src={src}
                alt={name}
                width={150}
                height={150}
              />
            ))}
          </div>
        </div>
      </header>

      <nav className="material-surface material-cardboard-paper my-5 grid grid-cols-2 gap-2 rounded-xl border border-border p-2 shadow-md sm:grid-cols-4 xl:grid-cols-8" aria-label="Brand guide sections">
        {guideSections.map(([label, href]) => (
          <a className="grid min-h-14 place-items-center rounded-lg border border-border bg-card px-3 text-center text-sm font-black text-card-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
    </>
  )
}

export function BrandingLookup() {
  return (
    <section id="fast-lookup" className="material-surface material-cardboard-paper mt-5 rounded-2xl border border-border p-4 shadow-md sm:p-8">
      <div className="max-w-3xl">
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-primary">Start here</p>
        <h2 className="m-0 font-heading text-3xl sm:text-5xl">Fast lookup by decision</h2>
        <p className="mt-2 mb-0 leading-7">Use the visual example first, then open the named source for the exact class, path, fact, or status. This page is the visual index; the small source files hold the implementation contract.</p>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider"><tr><th className="p-3">If you need to decide</th><th className="p-3">See on this page</th><th className="p-3">Then open</th></tr></thead>
          <tbody>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Material, board, or fastener</th><td className="p-3"><a className="font-bold underline" href="#assets">Materials and attachment examples</a></td><td className="p-3"><code>public/BRAND_ASSET_RECIPES.md</code></td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Icon or curriculum signal</th><td className="p-3"><a className="font-bold underline" href="#icons">Icon catalogue and size roles</a></td><td className="p-3"><code>public/BRAND_ASSET_RECIPES.md</code></td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Character identity or teaching role</th><td className="p-3"><a className="font-bold underline" href="#cast">Canonical cast examples</a></td><td className="p-3"><code>content/pages/branding/cast.mdx</code></td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Typography or palette role</th><td className="p-3"><a className="font-bold underline" href="#typography">Typography in context</a></td><td className="p-3"><code>public/branding/PALETTE_AND_TYPOGRAPHY.md</code></td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Component behavior or responsive pattern</th><td className="p-3"><a className="font-bold underline" href="#controls">Shared controls</a> or <a className="font-bold underline" href="#page-recipe">Page recipe</a></td><td className="p-3"><code>public/branding/DESIGN_SYSTEM.md</code></td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-bold">Approval, exclusion, or ambiguity</th><td className="p-3"><a className="font-bold underline" href="#governance">Production boundary</a></td><td className="p-3"><code>docs/ASSET_LIBRARY_GOVERNANCE.md</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
