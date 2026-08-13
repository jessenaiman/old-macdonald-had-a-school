"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import type { EarlyYearsGradeKey, EarlyYearsTopic } from "../lib/early-years";
import { DaycareTemplate } from "./grades/daycare/DaycareTemplate";
import { KindergartenTemplate } from "./grades/kindergarten/KindergartenTemplate";
import { PreschoolTemplate } from "./grades/pre-school/PreschoolTemplate";
import styles from "./EarlyYearsHub.module.css";

export type EarlyYearsTier = "list" | "detailed" | "bridge";

export function EarlyYearsHub({
  grade,
  title,
  tagline,
  lead,
  topics,
}: {
  grade: EarlyYearsGradeKey;
  title: string;
  tagline: string;
  lead: { patch: string; name: string };
  tier: EarlyYearsTier;
  topics: EarlyYearsTopic[];
}) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const topic = topics[active];
  const leadImage = `/staff_and_students/${lead.patch}-transparent-circle.png`;
  const headline = grade === "daycare" ? "Plan for little hands," : grade === "pre-school" ? "Grow confidence through" : "Turn curiosity into";
  const accentHeadline = grade === "daycare" ? "big feelings." : grade === "pre-school" ? "story and sensation." : "a day of discovery.";
  const leadQuote = grade === "daycare" ? "What will make joining in feel safe today?" : grade === "pre-school" ? "What can they choose, try, and tell us about?" : "Where can one good question take us?";
  const GradePageTemplate = grade === "daycare" ? DaycareTemplate : grade === "pre-school" ? PreschoolTemplate : KindergartenTemplate;

  return (
    <div className={styles.page} data-grade={grade}>
      <GradePageTemplate
        grade={title}
        age={grade === "daycare" ? "Ages 0–2" : grade === "pre-school" ? "Ages 3–4" : "Ages 4–6"}
        leadName={lead.name}
        leadImage={leadImage}
        leadQuote={leadQuote}
        headline={headline}
        accentHeadline={accentHeadline}
        summary={tagline}
        activeIndex={active}
        onSelect={setActive}
        onPreview={topic.image ? () => setPreview(true) : undefined}
        items={topics.map((item, index) => ({
          title: item.title,
          kicker: index === 0 ? "Story circle" : index === 1 ? "Mix & measure" : index === 2 ? "Explore together" : "Make & explain",
          summary: item.focus,
          href: `/grade/${item.grade}/${item.slug}`,
          icon: [
            "drama-storytelling-icon",
            "math-building-icon",
            "gardening-health-icon",
            "art-photography-icon",
          ][index % 4],
        }))}
      />

      <Sheet open={Boolean(topic.image) && preview} onOpenChange={setPreview}>
        <SheetContent className={styles.lightbox} side="bottom" showCloseButton={false}>
          <SheetTitle className="sr-only">Preview: {topic.title}</SheetTitle>
          <SheetDescription className="sr-only">{topic.focus}</SheetDescription>
          <SheetClose asChild>
            <Button className={styles.lightboxClose} type="button" variant="ghost" aria-label="Close preview">Close</Button>
          </SheetClose>
          <div className={styles.lightboxCard} onClick={(event) => event.stopPropagation()}>
            {topic.image ? <Image className={styles.lightboxImage} src={topic.image} alt={topic.title} width={1200} height={800} /> : null}
            <div className={styles.lightboxBar}>
              <div className={styles.lightboxCaption}><strong>{topic.title}</strong><small>{topic.focus}</small></div>
              <div className={styles.lightboxActions}>
                {topic.image ? <a href={topic.image} download>Download</a> : null}
                {topic.image ? <a href={topic.image} target="_blank" rel="noreferrer">Open for printing</a> : null}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
