"use client"

import Image from "next/image"
import { useState } from "react"

import type { EarlyYearsGradeKey, EarlyYearsTopic } from "../lib/early-years"
import { DaycareTemplate } from "./grades/daycare/DaycareTemplate"
import { KindergartenTemplate } from "./grades/kindergarten/KindergartenTemplate"
import { PreschoolTemplate } from "./grades/pre-school/PreschoolTemplate"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet"

export type EarlyYearsTier = "list" | "detailed" | "bridge"

export function EarlyYearsHub({ grade, title, tagline, lead, topics }: { grade: EarlyYearsGradeKey; title: string; tagline: string; lead: { patch: string; name: string }; tier: EarlyYearsTier; topics: EarlyYearsTopic[] }) {
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState(false)
  const topic = topics[active]
  const leadImage = `/staff_and_students/${lead.patch}-transparent-circle.png`
  const headline = grade === "daycare" ? "Plan for little hands," : grade === "pre-school" ? "Grow confidence through" : "Turn curiosity into"
  const accentHeadline = grade === "daycare" ? "big feelings." : grade === "pre-school" ? "story and sensation." : "a day of discovery."
  const leadQuote = grade === "daycare" ? "What will make joining in feel safe today?" : grade === "pre-school" ? "What can they choose, try, and tell us about?" : "Where can one good question take us?"
  const GradePageTemplate = grade === "daycare" ? DaycareTemplate : grade === "pre-school" ? PreschoolTemplate : KindergartenTemplate

  return <div className="min-w-0" data-grade={grade}>
    <GradePageTemplate grade={title} age={grade === "daycare" ? "Ages 0–2" : grade === "pre-school" ? "Ages 3–4" : "Ages 4–6"} leadName={lead.name} leadImage={leadImage} leadQuote={leadQuote} headline={headline} accentHeadline={accentHeadline} summary={tagline} activeIndex={active} onSelect={setActive} onPreview={topic.image ? () => setPreview(true) : undefined} items={topics.map((item, index) => ({ title: item.title, kicker: index === 0 ? "Story circle" : index === 1 ? "Mix & measure" : index === 2 ? "Explore together" : "Make & explain", summary: item.focus, href: `/grade/${item.grade}/${item.slug}`, icon: ["drama-storytelling-icon", "math-building-icon", "gardening-health-icon", "art-photography-icon"][index % 4] }))} />
    <Sheet open={Boolean(topic.image) && preview} onOpenChange={setPreview}>
      <SheetContent className="min-h-screen bg-background p-2 text-foreground sm:p-4" side="bottom" showCloseButton={false}>
        <SheetTitle className="sr-only">Preview: {topic.title}</SheetTitle><SheetDescription className="sr-only">{topic.focus}</SheetDescription>
        <SheetClose asChild><Button className="sticky top-0 z-10 min-h-11 justify-self-end" type="button" variant="ghost" aria-label="Close preview">Close</Button></SheetClose>
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl" onClick={(event) => event.stopPropagation()}>
          {topic.image ? <Image className="block h-auto max-h-screen w-full bg-muted object-contain" src={topic.image} alt={topic.title} width={1200} height={800} /> : null}
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><strong className="block font-heading text-xl">{topic.title}</strong><small className="mt-1 block text-muted-foreground">{topic.focus}</small></div><div className="flex flex-wrap gap-2">{topic.image ? <Button asChild variant="outline"><a href={topic.image} download>Download</a></Button> : null}{topic.image ? <Button asChild><a href={topic.image} target="_blank" rel="noreferrer">Open for printing</a></Button> : null}</div></div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
}
