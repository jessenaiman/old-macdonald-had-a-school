"use client";

import type { GradeTemplateProps } from "../types";
import { GradeInteractionLane } from "../GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "../grade-config";

export function PreschoolTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS["pre-school"]} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
