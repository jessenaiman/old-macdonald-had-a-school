"use client"

import Image from "next/image"
import { useState } from "react"

import type { EarlyYearsGradeKey, EarlyYearsTopic } from "../lib/early-years"
import { sceneAsset } from "../lib/early-years"
import { lessonIcon } from "../lib/grade-routes"
import { GradeInteractionLane } from "./grades/GradeInteractionLane"
import { GRADE_INTERACTION_CONFIGS } from "./grades/grade-config"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet"

export type EarlyYearsTier = "list" | "detailed" | "bridge"

export function EarlyYearsHub({ grade, tagline, topics }: { grade: EarlyYearsGradeKey; tagline: string; topics: EarlyYearsTopic[] }) {
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState(false)
  const topic = topics[active]
  const topicImage = topic.image ? sceneAsset(topic.image) : undefined

  return <div className="min-w-0" data-grade={grade}>
    <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS[grade]} summary={tagline} activeIndex={active} onSelect={setActive} onPreview={topicImage ? () => setPreview(true) : undefined} items={topics.map((item, index) => ({ title: item.title, kicker: index === 0 ? "Story circle" : index === 1 ? "Mix & measure" : index === 2 ? "Explore together" : "Make & explain", summary: item.focus, href: `/grade/${item.grade}/${item.slug}`, icon: lessonIcon(item.title, item.focus) }))} />
    <Sheet open={Boolean(topicImage) && preview} onOpenChange={setPreview}>
      <SheetContent className="min-h-screen bg-background p-2 text-foreground sm:p-4" side="bottom" showCloseButton={false}>
        <SheetTitle className="sr-only">Preview: {topic.title}</SheetTitle><SheetDescription className="sr-only">{topic.focus}</SheetDescription>
        <SheetClose asChild><Button className="sticky top-0 min-h-11 justify-self-end" type="button" variant="ghost" aria-label="Close preview">Close</Button></SheetClose>
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl" onClick={(event) => event.stopPropagation()}>
          {topicImage ? <Image className="block h-auto max-h-screen w-full bg-muted object-contain" src={topicImage} alt={topic.title} width={1200} height={800} /> : null}
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><strong className="block font-heading text-xl">{topic.title}</strong><small className="mt-1 block text-muted-foreground">{topic.focus}</small></div><div className="flex flex-wrap gap-2">{topicImage ? <Button asChild variant="outline"><a href={topicImage} download>Download</a></Button> : null}{topicImage ? <Button asChild><a href={topicImage} target="_blank" rel="noreferrer">Open for printing</a></Button> : null}</div></div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
}
