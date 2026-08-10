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
  if (/math|number|stem/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-math-building.png";
  if (/literacy|phonic|reading|writing|language|story/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png";
  if (/music|movement|dance/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png";
  if (/art|photo|visual/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png";
  if (/garden|health|nature/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png";
  if (/physical|sport/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-physical-education.png";
  return "/brand-kit-icon-sheets/individual-icons/subject-early-learning.png";
}
