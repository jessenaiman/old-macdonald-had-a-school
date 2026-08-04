import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LessonMarkdown({ source }: { source: string }) {
  return (
    <div className="lesson-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
