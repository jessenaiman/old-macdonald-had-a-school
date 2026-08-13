export const GRADE_KEYS = ["daycare", "pre-school", "kindergarten", "grade-one", "grade-two"] as const;

export type GradeKey = (typeof GRADE_KEYS)[number];

export function gradeKeysForLabel(label: string): GradeKey[] {
  const normalized = label.toLowerCase();
  const keys: GradeKey[] = [];
  if (/daycare/.test(normalized)) keys.push("daycare");
  if (/pre[- ]?school/.test(normalized)) keys.push("pre-school");
  if (/kindergarten/.test(normalized)) keys.push("kindergarten");
  if (/grade\s*1|grade-one/.test(normalized)) keys.push("grade-one");
  if (/grade\s*2|grade-two/.test(normalized)) keys.push("grade-two");
  return keys;
}

export function lessonHref(lesson: { slug: string; grade: string }) {
  const [grade] = gradeKeysForLabel(lesson.grade);
  return grade ? `/grade/${grade}/${lesson.slug}` : `/lessons/${lesson.slug}`;
}

export function lessonIcon(subject: string, category: string) {
  const label = `${subject} ${category}`;
  if (/math|number|stem/i.test(label)) return "math-building-icon";
  if (/literacy|phonic|reading|writing|language|story/i.test(label)) return "drama-storytelling-icon";
  if (/music|movement|dance/i.test(label)) return "music-icon";
  if (/art|photo|visual/i.test(label)) return "art-photography-icon";
  if (/garden|health|nature/i.test(label)) return "gardening-health-icon";
  if (/physical|sport/i.test(label)) return "physical-education-icon";
  return "early-learning-icon";
}
