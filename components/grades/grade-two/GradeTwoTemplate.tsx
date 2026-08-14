"use client";

import type { GradePathItem } from "../types";
import { GradeInteractionLane } from "../GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "../grade-config";

type GradeTwoTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeTwoTemplate({ summary, items }: GradeTwoTemplateProps) {
  return <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS["grade-two"]} summary={summary} items={items} />;
}
