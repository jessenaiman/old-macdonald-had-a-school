"use client";

import type { GradeTemplateProps } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

export function PreschoolTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "pre-school", grade: "Pre-School", age: "Ages 3–4", badge: "/staff_and_students/miss-maisy-transparent-circle.png", reminder: "Leave room for choice and change.", eyebrow: "Welcome back, teacher", headline: "Grow confidence through", accentHeadline: "story and sensation.", leadName: "Miss Maisy", leadImage: "/staff_and_students/miss-maisy-transparent-circle.png", leadQuote: "What can they choose, try, and tell us about?", identityColor: "#55705A", identityInk: "#fffaf0", identityTexture: "/design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.png" }} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
