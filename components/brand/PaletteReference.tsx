import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CAST, STAFF_KEYS, STUDENT_KEYS, type CastKey } from "@/lib/cast"

const siteRoles = [
  ["Readable paper", "material-surface material-cardboard-paper"],
  ["Supporting cloth", "material-surface material-woven-fabric"],
  ["Working board", "material-surface material-cork"],
  ["Durable identity patch", "cast-old-macdonald material-surface material-felt"],
] as const
const curriculumRoles = [
  ["Physical education", "mr-maisy"], ["Early learning", "miss-puddles"], ["Music and rhythm", "mr-rusty"],
  ["Ready participation", "hopper"], ["Growing and food", "miss-maisy"], ["Art and observation", "mr-puddles"],
] as const

function IdentityPatches({ characters }: { characters: readonly CastKey[] }) {
  return <ul className="mt-3 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
    {characters.map((character) => {
      const identity = CAST[character]
      const semanticClass = `cast-${character}`
      return <li className={`${semanticClass} character-surface relative min-w-0 rounded-xl border border-current p-4 shadow-md after:pointer-events-none after:absolute after:inset-1 after:rounded-lg after:border after:border-dashed after:border-current after:opacity-35`} key={character}>
        <strong className="relative block font-heading text-xl leading-none">{identity.name}</strong>
        <span className="relative mt-2 block text-xs font-bold">Live identity token</span>
      </li>
    })}
  </ul>
}

export function PaletteReference() {
  return <section className="material-surface material-cork rounded-2xl border border-border p-5 shadow-lg sm:p-8" aria-labelledby="live-palette-title">
    <header className="material-surface material-cardboard-paper relative rounded-xl border border-border p-5 pt-8 shadow-md">
      <span className="brand-asset fastener-masking-tape icon-small absolute -top-4 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <h3 id="live-palette-title" className="m-0 font-heading text-3xl">Live material palette</h3>
      <p className="mb-0 mt-2 max-w-3xl leading-7">These are production surfaces and identity classes, not copied swatches. Switch theme to test site roles; character fabric stays locally identifiable.</p>
      <div className="mt-5 flex flex-wrap gap-3"><Button>Primary action</Button><Button variant="secondary">Woven patch</Button><Button variant="outline">Paper label</Button></div>
    </header>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <section className="material-surface material-cardboard-paper rounded-xl border border-border p-5"><Link className="font-heading text-2xl underline underline-offset-4" href="#assets">Named material combinations</Link><div className="mt-3 grid grid-cols-2 gap-3">{siteRoles.map(([label, className]) => <div className={`${className} min-h-24 rounded-lg border border-border p-3`} key={label}><strong className="block">{label}</strong><code className="mt-2 block text-xs">{className}</code></div>)}</div></section>
      <section className="material-surface material-cork rounded-xl border border-border p-5"><Link className="font-heading text-2xl underline underline-offset-4" href="#icons">Curriculum identity fabric</Link><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{curriculumRoles.map(([label, character]) => <div className={`cast-${character} character-surface relative min-h-20 rounded-lg border border-current p-3 after:absolute after:inset-1 after:rounded-md after:border after:border-dashed after:border-current after:opacity-40`} key={label}><strong className="relative block font-heading text-lg">{label}</strong><span className="relative mt-2 block text-xs font-bold">{CAST[character].name}</span></div>)}</div></section>
    </div>
    <section className="mt-6"><Link className="font-heading text-2xl underline underline-offset-4" href="#cast">Staff identity fabric</Link><IdentityPatches characters={STAFF_KEYS} /></section>
    <section className="mt-6"><Link className="font-heading text-2xl underline underline-offset-4" href="#cast">Student identity fabric</Link><IdentityPatches characters={STUDENT_KEYS} /></section>
  </section>
}
