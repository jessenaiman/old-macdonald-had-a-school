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
  { label: "Music", className: "music-icon icon-medium" }, { label: "Math and building", className: "math-building-icon icon-medium" }, { label: "Drama", className: "drama-storytelling-icon icon-medium" }, { label: "Art", className: "art-photography-icon icon-medium" }, { label: "Garden and health", className: "gardening-health-icon icon-medium" }, { label: "Physical education", className: "physical-education-icon icon-medium" }, { label: "Early learning", className: "early-learning-blocks icon-medium" }, { label: "Measure", className: "math-abacus-ruler icon-medium" }, { label: "Colour", className: "art-color-wheel icon-medium" }, { label: "Physical play", className: "physical-ball-rope icon-medium" }, { label: "Garden", className: "garden-watering-produce icon-medium" }, { label: "Health", className: "health-gingham-lunch icon-medium" },
]

const artsIcons: IconEntry[] = [
  { label: "Fiddle", className: "music-fiddle icon-medium" }, { label: "Turning", className: "dance-turning-footprints icon-medium" }, { label: "Acting", className: "acting-theatre-masks icon-medium" }, { label: "Painting", className: "painting-handprint icon-medium" }, { label: "Drum", className: "music-hand-drum icon-medium" }, { label: "Ribbons", className: "dance-crossing-ribbons icon-medium" }, { label: "Stage", className: "acting-stage-curtains icon-medium" }, { label: "Banjo", className: "music-banjo icon-medium" }, { label: "Puppets", className: "acting-pocket-puppets icon-medium" }, { label: "Easel", className: "painting-easel icon-medium" },
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
