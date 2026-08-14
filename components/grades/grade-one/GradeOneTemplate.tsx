"use client";

import type { GradePathItem } from "../types";
import { GradeInteractionLane } from "../GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "../grade-config";

type GradeOneTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeOneTemplate({ summary, items }: GradeOneTemplateProps) {
  return <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS["grade-one"]} summary={summary} items={items} />;
}
