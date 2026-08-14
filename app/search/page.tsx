import { SearchWorkspace } from "@/components/search/SearchWorkspace";

type SearchParams = Promise<{ q?: string | string[]; grade?: string | string[] }>;

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <main className="material-surface material-leather-blue min-h-screen px-3 py-6 sm:px-6 lg:px-10">
      <SearchWorkspace initialQuery={firstValue(params.q)} initialGrade={firstValue(params.grade)} />
    </main>
  );
}
