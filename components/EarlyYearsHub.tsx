"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { EarlyYearsBandKey, EarlyYearsTopic } from "../lib/early-years";
import { GradeTemplate } from "./builder/CurriculumTemplates";

export type EarlyYearsTier = "list" | "detailed" | "bridge";

export function EarlyYearsHub({
  band,
  title,
  tagline,
  lead,
  topics,
}: {
  band: EarlyYearsBandKey;
  title: string;
  tagline: string;
  lead: { patch: string; name: string };
  tier: EarlyYearsTier;
  topics: EarlyYearsTopic[];
}) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const topic = topics[active];
  const leadImage = lead.patch === "old-macdonald" ? "/icons/staff/old-mac.png" : `/icons/staff/${lead.patch}.png`;
  const headline = band === "daycare" ? "Plan for little hands," : band === "preschool" ? "Grow confidence through" : "Turn curiosity into";
  const accentHeadline = band === "daycare" ? "big feelings." : band === "preschool" ? "story and sensation." : "a day of discovery.";
  const leadQuote = band === "daycare" ? "What will make joining in feel safe today?" : band === "preschool" ? "What can they choose, try, and tell us about?" : "Where can one good question take us?";

  useEffect(() => {
    if (!preview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [preview]);

  return (
    <div className={`ey-page ey-${band}`}>
      <GradeTemplate
        grade={title}
        age={band === "daycare" ? "Ages 0–2" : band === "preschool" ? "Ages 3–4" : "Ages 4–6"}
        leadName={lead.name}
        leadImage={leadImage}
        leadQuote={leadQuote}
        headline={headline}
        accentHeadline={accentHeadline}
        summary={tagline}
        activeIndex={active}
        onSelect={setActive}
        onPreview={() => setPreview(true)}
        items={topics.map((item, index) => ({
          title: item.title,
          kicker: index === 0 ? "Story circle" : index === 1 ? "Mix & measure" : index === 2 ? "Explore together" : "Make & explain",
          summary: item.focus,
          icon: [
            "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
            "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
            "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png",
            "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png",
          ][index % 4],
        }))}
      />

      {preview && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${topic.title}`} onClick={() => setPreview(false)}>
          <button className="lp-lightbox-close" type="button" onClick={() => setPreview(false)} aria-label="Close preview">Close</button>
          <div className="lp-lightbox-card" onClick={(event) => event.stopPropagation()}>
            <Image className="lp-lightbox-img" src={topic.image} alt={topic.title} width={1200} height={800} />
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{topic.title}</strong><small>{topic.focus}</small></div>
              <div className="lp-lightbox-actions">
                <a className="lp-btn-ghost" href={topic.image} download>Download</a>
                <a className="lp-btn" href={topic.image} target="_blank" rel="noreferrer">Open for printing</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
