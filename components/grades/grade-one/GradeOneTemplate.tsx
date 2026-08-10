"use client";

import type { GradePathItem } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";

type GradeOneTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeOneTemplate({ summary, items }: GradeOneTemplateProps) {
  return <GradeInteractionLane config={{ gradeKey: "grade-one", grade: "Grade 1", age: "5–6 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-1.png", reminder: "Invite a choice. Notice the story.", eyebrow: "Choose a starting point", headline: "Think, create, and", accentHeadline: "share with purpose.", leadName: "Miss Hayley", leadImage: "/staff_and_students/miss-hayley-transparent-circle.png", leadQuote: "What can they notice, explain, and share today?", identityColor: "#C9527A", identityInk: "#fffaf0", identityTexture: "/design-assets/web-material-library-v1/felt/felt-04-miss-hayley-tile.png" }} summary={summary} items={items} />;
}
