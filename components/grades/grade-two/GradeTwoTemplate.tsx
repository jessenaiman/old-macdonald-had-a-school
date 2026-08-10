"use client";

import type { GradePathItem } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

type GradeTwoTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeTwoTemplate({ summary, items }: GradeTwoTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "grade-two", grade: "Grade 2", age: "6–7 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-2.png", reminder: "Ask for evidence and another way.", eyebrow: "Choose a starting point", headline: "Ask deeper, solve bigger,", accentHeadline: "and learn together.", leadName: "Mr Maisy", leadImage: "/staff_and_students/mr-maisy-transparent-circle.png", leadQuote: "What evidence will help them explain their thinking?", identityColor: "#B5272C", identityInk: "#fffaf0", identityTexture: "/design-assets/web-material-library-v1/felt/felt-06-mr-maisy-tile.png" }} summary={summary} items={items} />;
}
