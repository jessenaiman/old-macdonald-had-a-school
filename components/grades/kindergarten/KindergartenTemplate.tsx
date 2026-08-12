"use client";

import type { GradeTemplateProps } from "../../builder/CurriculumTemplates";
import { GradeInteractionLane } from "../GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "../grade-config";

export function KindergartenTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS.kindergarten} summary={summary} items={items} activeIndex={activeIndex} onSelect={onSelect} onPreview={onPreview} />;
}
