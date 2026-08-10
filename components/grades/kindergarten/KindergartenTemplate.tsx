"use client";

import type { GradeTemplateProps } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

export function KindergartenTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "kindergarten", grade: "Kindergarten", age: "Ages 4–6", badge: "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png", reminder: "Find the beat and help everyone join in.", eyebrow: "Choose a starting point", headline: "Turn rhythm into", accentHeadline: "a day of discovery.", leadName: "Mr Rusty", leadImage: "/staff_and_students/mr-rusty-transparent-circle.png", leadQuote: "Can you find and keep the steady beat with me?", identityColor: "#2C6C9B", identityInk: "#fffaf0", identityTexture: "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png" }} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
