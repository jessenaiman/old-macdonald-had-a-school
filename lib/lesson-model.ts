export const GRADE_KEY_MAP = {
  daycare: "daycare",
  preschool: "pre-school",
  kindergarten: "kindergarten",
  "grade-1": "grade-one",
  "grade-2": "grade-two",
} as const;

export type CurriculumGradeKey = (typeof GRADE_KEY_MAP)[keyof typeof GRADE_KEY_MAP];
export type DatabaseGradeKey = keyof typeof GRADE_KEY_MAP;
export type ContentCompleteness = "complete" | "planning-draft";

export type MarkdownMatchHint = {
  sourcePath: string;
  title: string | null;
  matchBasis: "exact-title" | "exact-slug";
};

export type SupplementarySource = {
  kind: string;
  sourcePath: string;
  title: string;
  url: string | null;
  limitation: string;
};

export type CurriculumTopic = {
  id: string;
  grade: CurriculumGradeKey;
  subject: string;
  category: string | null;
  sequence: number | null;
  title: string;
  skillStatement: string | null;
  standards: string | null;
  tags: string[];
  linkedSongs: string | null;
  linkedSongCount: number;
  linkedResources: string | null;
  circleTimeSlot: string | null;
  sourceType: "database";
  completeness: ContentCompleteness;
  markdownHints: MarkdownMatchHint[];
  supplementarySources: SupplementarySource[];
};

export type CurriculumTopicSearchResult = CurriculumTopic & {
  matchScope: "topic-fields" | "supplementary-source";
};

export const SUPPLEMENTARY_SOURCE_LIMITATION =
  "Linked search chunks are supplementary source material only. Their mappings are over-broad and do not establish grade scope, lesson alignment, or planning completeness.";

export function serializeCurriculumTopicAsMarkdown(topic: CurriculumTopic): string {
  const valueOrLabel = (value: string | null) => value ?? "Not yet available";
  const listOrLabel = (values: string[]) => values.length > 0 ? values.join("; ") : "Not yet available";
  const hints = topic.markdownHints.length > 0
    ? topic.markdownHints.map((hint) => {
        const title = hint.title ? ` — ${hint.title}` : "";
        return `- ${hint.sourcePath}${title} (${hint.matchBasis})`;
      }).join("\n")
    : "Not yet available";
  const supplementarySources = topic.supplementarySources.length > 0
    ? topic.supplementarySources.map((source) => {
        const url = source.url ? ` — ${source.url}` : "";
        return `- ${source.title} — ${source.sourcePath}${url}`;
      }).join("\n")
    : "Not yet available";

  return [
    `# ${topic.title}`,
    "",
    "## Verified curriculum record",
    `- Grade: ${topic.grade}`,
    `- Subject: ${topic.subject}`,
    `- Category: ${valueOrLabel(topic.category)}`,
    `- Sequence: ${topic.sequence ?? "Not yet available"}`,
    `- Skill statement: ${valueOrLabel(topic.skillStatement)}`,
    `- Standards: ${valueOrLabel(topic.standards)}`,
    `- Tags: ${listOrLabel(topic.tags)}`,
    `- Circle-time slot: ${valueOrLabel(topic.circleTimeSlot)}`,
    `- Linked songs summary: ${valueOrLabel(topic.linkedSongs)}`,
    `- Linked song count: ${topic.linkedSongCount}`,
    `- Linked resources: ${valueOrLabel(topic.linkedResources)}`,
    "",
    "## Database lesson outline",
    `- Learning focus: ${valueOrLabel(topic.skillStatement)}`,
    "- Teaching sequence: Use the linked focus materials in their documented lesson phase. An authored Markdown sequence is added only when it has been reviewed.",
    "- Materials: See Linked lesson materials below for the teacher-useful song, resource, action, and source links available for this record.",
    `- Observation or assessment: ${topic.skillStatement ? `Observe children as they work toward: ${topic.skillStatement}` : "Not yet available"}`,
    "",
    "## Supplementary source material",
    `> ${SUPPLEMENTARY_SOURCE_LIMITATION}`,
    supplementarySources,
    "",
    "## Markdown matching hints",
    "> These are exact-title or exact-slug migration hints only; they do not replace or rewrite Markdown content.",
    hints,
    "",
    "## Record status",
    `- Source type: ${topic.sourceType}`,
    `- Completeness: ${topic.completeness}`,
    `- Database identifier: ${topic.id}`,
    "",
  ].join("\n");
}
