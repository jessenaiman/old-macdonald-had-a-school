import { getCurriculumTopic } from "../../../../../../lib/curriculum-db";
import { GRADE_KEYS, type GradeKey } from "../../../../../../lib/grade-routes";
import { serializeCurriculumTopicAsMarkdown } from "../../../../../../lib/lesson-model";

export const runtime = "nodejs";

function isGradeKey(value: string): value is GradeKey {
  return GRADE_KEYS.includes(value as GradeKey);
}

export async function GET(_request: Request, { params }: { params: Promise<{ grade: string; id: string }> }) {
  const { grade, id } = await params;
  if (!isGradeKey(grade)) return new Response("Not found", { status: 404 });

  const topic = getCurriculumTopic(id, grade);
  if (!topic) return new Response("Not found", { status: 404 });

  const filename = topic.title.toLocaleLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return new Response(serializeCurriculumTopicAsMarkdown(topic), {
    headers: {
      "Content-Disposition": `attachment; filename="${filename || topic.id}.md"`,
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
