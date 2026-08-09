export type GradeMeta = {
  key: string;
  label: string;
  ageRange: string;
  tagline: string;
  eyebrow: string;
  leads: string[];
};

export const GRADE_META: Record<string, GradeMeta> = {
  "grade-one": {
    key: "grade-one",
    label: "Grade 1",
    ageRange: "5–6 yrs",
    tagline: "Reading and rhythm",
    eyebrow: "5–6 YRS · TEACHER-PLANNING RESOURCE",
    leads: ["mr-maisy", "miss-hayley", "mr-rusty", "old-macdonald"],
  },
  "grade-two": {
    key: "grade-two",
    label: "Grade 2",
    ageRange: "6–7 yrs",
    tagline: "Building fluency and proof",
    eyebrow: "6–7 YRS · TEACHER-PLANNING RESOURCE",
    leads: ["mr-rusty", "miss-hayley", "mr-sam", "old-macdonald"],
  },
};

export function matchesGrade(gradeLabel: string, grade: string): boolean {
  if (grade === "grade-one") return /1/.test(gradeLabel);
  if (grade === "grade-two") return /2/.test(gradeLabel);
  return true;
}
