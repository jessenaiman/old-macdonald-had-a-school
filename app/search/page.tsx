import { SearchWorkspace } from "@/components/search/SearchWorkspace";

type SearchParams = Promise<{ q?: string | string[]; grade?: string | string[] }>;

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <div className="relative min-w-0 w-full min-h-0 px-3 py-6 sm:px-6">
      <SearchWorkspace initialQuery={firstValue(params.q)} initialGrade={firstValue(params.grade)} />
    </div>
  );
}
