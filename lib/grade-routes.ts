export const GRADE_KEYS = ["daycare", "pre-school", "kindergarten", "grade-one", "grade-two"] as const;

export type GradeKey = (typeof GRADE_KEYS)[number];

/** Search-index grade values for the five navigable grade routes. */
export const GRADE_SEARCH_VALUES: Record<GradeKey, string> = {
  daycare: "daycare",
  "pre-school": "preschool",
  kindergarten: "kindergarten",
  "grade-one": "grade-1",
  "grade-two": "grade-2",
};

export function gradeSearchHref(grade: GradeKey, cue: string) {
  const params = new URLSearchParams({ grade: GRADE_SEARCH_VALUES[grade], q: cue });
  return `/search?${params.toString()}`;
}

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

export function lessonIcon(...values: string[]) {
  const label = values.join(" ");
  if (/balance|equal weight|scale/i.test(label)) return "grade-two-balance-scale";
  if (/counted movement|freeze cue|stop and go|stepping/i.test(label)) return "physical-stepping-spots";
  if (/seed|sprout|growing pattern|plant/i.test(label)) return "garden-seed-trowel";
  if (/sort|sorting|classif|group by/i.test(label)) return "early-learning-blocks";
  if (/abacus|count|number|numeracy/i.test(label)) return "math-abacus-ruler";
  if (/measure|build|construction|stem|math/i.test(label)) return "math-building-icon";
  if (/curtain|stage|performance/i.test(label)) return "acting-stage-curtains";
  if (/mask|role.?play|character/i.test(label)) return "acting-theatre-masks";
  if (/puppet|story/i.test(label)) return "acting-pocket-puppets";
  if (/literacy|phonic|reading|writing|language|vocabulary|letter|vowel/i.test(label)) return "drama-storytelling-icon";
  if (/banjo|string instrument/i.test(label)) return "music-banjo";
  if (/fiddle|violin/i.test(label)) return "music-fiddle";
  if (/barn band|instruments?, sound|drum|steady beat|rhythm/i.test(label)) return "music-hand-drum";
  if (/ribbon|crossing|folk danc/i.test(label)) return "dance-crossing-ribbons";
  if (/turn|circle danc/i.test(label)) return "dance-turning-footprints";
  if (/dance|movement|motor/i.test(label)) return "physical-ball-rope";
  if (/music|song|\bsing(?:ing)?\b/i.test(label)) return "music-icon";
  if (/easel|brush|palette/i.test(label)) return "painting-easel";
  if (/handprint|finger paint|paint dot/i.test(label)) return "painting-handprint";
  if (/color|colour|visual art/i.test(label)) return "art-color-wheel";
  if (/art|photo|camera|drawing/i.test(label)) return "art-photography-icon";
  if (/watering|produce|vegetable|garden/i.test(label)) return "garden-watering-produce";
  if (/lunch|food|nutrition|healthy eating/i.test(label)) return "health-gingham-lunch";
  if (/health|nature|plant|science/i.test(label)) return "gardening-health-icon";
  if (/physical|sport|ball|rope/i.test(label)) return "physical-education-icon";
  if (/block|shape|early learning|fine motor/i.test(label)) return "early-learning-blocks";
  return "early-learning-icon";
}
