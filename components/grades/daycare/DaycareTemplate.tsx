"use client";

import type { GradeTemplateProps } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

export function DaycareTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "daycare", grade: "Daycare", age: "Ages 2–3", badge: "/brand-kit-icon-sheets/individual-icons/grade-daycare.png", reminder: "Invite a choice. Notice the story.", eyebrow: "Welcome back, teacher", headline: "Plan for little hands,", accentHeadline: "big feelings.", leadName: "Miss Puddles", leadImage: "/staff_and_students/miss-puddles-transparent-circle.png", leadQuote: "What will make joining in feel safe today?", identityColor: "#E8A227", identityInk: "#173552", identityTexture: "/design-assets/web-material-library-v1/felt/felt-02-miss-puddles-tile.png", variant: "daycare" }} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
