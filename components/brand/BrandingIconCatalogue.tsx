"use client"

import { BrandIconUsage } from "@/components/brand/BrandIconUsage"

type IconEntry = { label: string; className: string; gradeIcon?: string }

const gradeIcons: IconEntry[] = [
  { label: "Daycare", className: "grade-icon icon-medium", gradeIcon: "daycare" },
  { label: "Preschool", className: "grade-icon icon-medium", gradeIcon: "pre-school" },
  { label: "Kindergarten", className: "grade-icon icon-medium", gradeIcon: "kindergarten" },
  { label: "Grade 1", className: "grade-icon icon-medium", gradeIcon: "grade-one" },
  { label: "Grade 2", className: "grade-icon icon-medium", gradeIcon: "grade-two" },
  { label: "Grade 2 balance", className: "math-balance-scale icon-medium" },
]

const subjectIcons: IconEntry[] = [
  { label: "Music", className: "music-icon icon-medium" },
  { label: "Math and building", className: "math-building-icon icon-medium" },
  { label: "Drama and storytelling", className: "drama-storytelling-icon icon-medium" },
  { label: "Art and photography", className: "art-photography-icon icon-medium" },
  { label: "Garden and health", className: "gardening-health-icon icon-medium" },
  { label: "Physical education", className: "physical-education-icon icon-medium" },
  { label: "Early learning", className: "early-learning-icon icon-medium" },
  { label: "Community helping", className: "community-helping icon-medium" },
  { label: "Community schoolhouse", className: "community-schoolhouse icon-medium" },
  { label: "Early learning blocks", className: "early-learning-blocks icon-medium" },
  { label: "Early learning lacing", className: "early-learning-lacing icon-medium" },
  { label: "Abacus and ruler", className: "math-abacus-ruler icon-medium" },
  { label: "Balance scale", className: "math-balance-scale icon-medium" },
  { label: "Construction and measure", className: "math-construction-measure icon-medium" },
  { label: "Camera and brush", className: "art-camera-brush icon-medium" },
  { label: "Colour wheel", className: "art-color-wheel icon-medium" },
  { label: "Physical play", className: "physical-ball-rope icon-medium" },
  { label: "Stepping spots", className: "physical-stepping-spots icon-medium" },
  { label: "Garden produce", className: "garden-watering-produce icon-medium" },
  { label: "Seeds and trowel", className: "garden-seed-trowel icon-medium" },
  { label: "Healthy lunch", className: "health-gingham-lunch icon-medium" },
]

const artsIcons: IconEntry[] = [
  { label: "Fiddle", className: "music-fiddle icon-medium" },
  { label: "Turning footprints", className: "dance-turning-footprints icon-medium" },
  { label: "Single music note", className: "music-note-single icon-medium" },
  { label: "Theatre masks", className: "acting-theatre-masks icon-medium" },
  { label: "Painted handprint", className: "painting-handprint icon-medium" },
  { label: "Hand drum", className: "music-hand-drum icon-medium" },
  { label: "Crossing ribbons", className: "dance-crossing-ribbons icon-medium" },
  { label: "Paired music notes", className: "music-notes-paired icon-medium" },
  { label: "Stage curtains", className: "acting-stage-curtains icon-medium" },
  { label: "Sponge shapes", className: "painting-sponge-shapes icon-medium" },
  { label: "Banjo", className: "music-banjo icon-medium" },
  { label: "Tap shoes", className: "dance-tap-shoes icon-medium" },
  { label: "Ascending notes", className: "music-notes-ascending icon-medium" },
  { label: "Pocket puppets", className: "acting-pocket-puppets icon-medium" },
  { label: "Crayon swatches", className: "painting-crayon-swatches icon-medium" },
  { label: "Handbells", className: "music-handbells icon-medium" },
  { label: "Spiralling scarves", className: "dance-spiralling-scarves icon-medium" },
  { label: "Rhythm dots", className: "music-rhythm-dots icon-medium" },
  { label: "Spotlight star", className: "acting-spotlight-star icon-medium" },
  { label: "Painting easel", className: "painting-easel icon-medium" },
]

function IconGrid({ entries, className }: { entries: IconEntry[]; className: string }) {
  return <div className={className}>{entries.map(({ label, className: iconClassName, gradeIcon }) => {
    const usage = gradeIcon ? `<span className="brand-asset grade-icon icon-medium" data-grade-icon="${gradeIcon}" aria-hidden="true" />` : `<span className="brand-asset ${iconClassName}" aria-hidden="true" />`
    return <figure className="m-0 grid justify-items-center rounded-lg border border-border p-3 text-center" key={label}><BrandIconUsage className={iconClassName} gradeIcon={gradeIcon} label={label} usage={usage} /><figcaption>{label}<br/><code>{gradeIcon ? `data-grade-icon="${gradeIcon}"` : iconClassName.replace(" icon-medium", "")}</code></figcaption></figure>
  })}</div>
}

export function BrandingIconCatalogue() {
  return <>
    <h3 className="mt-8 font-heading text-3xl">Grades</h3><IconGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6" entries={gradeIcons} />
    <h3 className="mt-8 font-heading text-3xl">Subjects and learning</h3><IconGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6" entries={subjectIcons} />
    <h3 className="mt-8 font-heading text-3xl">Music, dance, drama, and visual art</h3><IconGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5" entries={artsIcons} />
  </>
}
