"use client";

import type { GradeTemplateProps } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

export function KindergartenTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "kindergarten", grade: "Kindergarten", age: "Ages 4–6", badge: "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png", reminder: "Ask one good question and wait.", eyebrow: "Choose a starting point", headline: "Turn curiosity into", accentHeadline: "a day of discovery.", leadName: "Old MacDonald", leadImage: "/staff_and_students/old-macdonald-transparent-circle.png", leadQuote: "Where can one good question take us?", identityColor: "#8B5E34", identityInk: "#fffaf0", identityTexture: "/design-assets/web-material-library-v1/felt/felt-01-old-macdonald-tile.png" }} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
