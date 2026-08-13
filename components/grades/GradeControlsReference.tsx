import { GradeInteractionLane } from "./GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "./grade-config";
import type { GradePathItem } from "../builder/CurriculumTemplates";

const referenceItems: GradePathItem[] = [
  {
    title: "Addition & Subtraction Word Problems",
    kicker: "Mathematics",
    summary: "Grade 1 solves concrete one-step problems within 20.",
    href: "/grade/grade-one/addition-subtraction-word-problems",
    icon: "math-building-icon",
  },
  {
    title: "Apply properties of operations",
    kicker: "Mathematics",
    summary: "Use counters and number sentences to explore addition.",
    href: "/grade/grade-one/properties-of-operations",
    icon: "math-building-icon",
  },
  {
    title: "Distinguish long from short vowel sounds",
    kicker: "Literacy & phonics",
    summary: "Listen for vowel sounds in spoken single-syllable words.",
    href: "/grade/grade-one/distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral",
    icon: "drama-storytelling-icon",
  },
  {
    title: "Tell a story in sequence",
    kicker: "Language and drama",
    summary: "Retell a familiar story with a beginning, middle, and end.",
    icon: "drama-storytelling-icon",
  },
];

/** The live, reusable grade-control surface used by the branding reference. */
export function GradeControlsReference() {
  return (
    <div className="not-prose" data-branding-example="grade-controls">
      <GradeInteractionLane
        config={GRADE_INTERACTION_CONFIGS["grade-one"]}
        summary="Reading, rhythm, and reasoning belong in one teacher-ready starting point."
        items={referenceItems}
      />
    </div>
  );
}
