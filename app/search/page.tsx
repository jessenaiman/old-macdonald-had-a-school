import type { Metadata } from "next";
import { SearchWorkspace } from "@/components/search/SearchWorkspace";

export const metadata: Metadata = {
  title: "Search Lessons | Old MacDonald Had a School",
  description: "Search songs, curriculum topics, and teacher-ready resources for your next lesson.",
};

type SearchParams = Promise<{ q?: string | string[]; grade?: string | string[] }>;

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <div className="relative min-w-0 w-full min-h-0 px-3 py-6 sm:px-6">
      <h1 className="mb-6 font-heading text-5xl leading-none text-foreground sm:text-7xl">Search lessons</h1>
      <SearchWorkspace initialQuery={firstValue(params.q)} initialGrade={firstValue(params.grade)} />
    </div>
  );
}
