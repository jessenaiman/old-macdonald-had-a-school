import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { getSongbookFacets, listSongbookSongs } from "@/lib/songbook";

export const metadata: Metadata = {
  title: "Teacher Songbook | Old MacDonald Had a School",
  description: "A practical teacher songbook with readable lyrics, actions, simple chord guides, sources, and curriculum connections.",
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SongsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const requestedLimit = Number.parseInt(valueOf(params.limit), 10);
  const resultLimit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 30), 240) : 30;
  const filters = {
    q: valueOf(params.q), grade: valueOf(params.grade), topic: valueOf(params.topic), type: valueOf(params.type),
    actions: valueOf(params.actions) === "1", chords: valueOf(params.chords) === "1", verified: valueOf(params.verified) === "1",
  };
  const [songs, facets] = [listSongbookSongs(filters), getSongbookFacets()];
  const visibleSongs = songs.slice(0, resultLimit);
  const moreParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const current = valueOf(value);
    if (current && key !== "limit") moreParams.set(key, current);
  }
  moreParams.set("limit", String(Math.min(resultLimit + 30, songs.length)));

  return <div className="material-surface material-cardboard-paper min-h-dvh px-4 py-8 text-foreground sm:px-6 lg:px-[max(1.5rem,calc((100vw-73.75rem)/2))] lg:py-16">
    <header className="mb-7 max-w-3xl">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-primary">Practical teacher songbook</p>
      <h1 className="font-heading text-5xl leading-[0.95] text-balance sm:text-7xl">Songs worth singing tomorrow</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">Readable words, usable movement ideas, simple chords when we have them, and a clear path back to the source.</p>
    </header>

    <Card>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" action="/songs" method="get">
          <label className="flex flex-col gap-1.5 text-xs font-black xl:col-span-1">Search songs<Input name="q" defaultValue={filters.q} placeholder="pony, greeting, counting…" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-black">Grade<NativeSelect name="grade" defaultValue={filters.grade}><option value="">All grades</option>{facets.grades.map((grade) => <option key={grade.key} value={grade.key}>{grade.label}</option>)}</NativeSelect></label>
          <label className="flex flex-col gap-1.5 text-xs font-black">Topic<NativeSelect name="topic" defaultValue={filters.topic}><option value="">All topics</option>{facets.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}</NativeSelect></label>
          <label className="flex flex-col gap-1.5 text-xs font-black">Type<NativeSelect name="type" defaultValue={filters.type}><option value="">All types</option>{facets.types.map((type) => <option key={type}>{type}</option>)}</NativeSelect></label>
          <fieldset className="flex flex-wrap items-center gap-4 md:col-span-2 xl:col-span-3"><legend className="mb-2 text-xs font-black">Include</legend>{[["actions", filters.actions, "Actions"], ["chords", filters.chords, "Chords"], ["verified", filters.verified, "Verified"]].map(([name, checked, label]) => <label className="flex items-center gap-2 text-sm font-bold" key={String(name)}><input className="size-4 accent-primary" type="checkbox" name={String(name)} value="1" defaultChecked={Boolean(checked)} /> {label}</label>)}</fieldset>
          <div className="flex items-end justify-end gap-3"><Button type="submit">Find songs</Button><Button variant="link" asChild><Link href="/songs">Clear</Link></Button></div>
        </form>
      </CardContent>
    </Card>

    <section className="mt-9" aria-labelledby="song-results-heading">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><h2 className="font-heading text-4xl" id="song-results-heading">{songs.length} songs</h2><span className="font-bold">Showing {visibleSongs.length} · open a song for its teaching sheet</span></div>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleSongs.map((song) => <Card className="min-h-72" key={song.id}>
        <CardHeader>
          <div className="flex flex-wrap gap-1.5">{song.verified && <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">Reviewed</span>}{song.hasActions && <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">Actions</span>}{song.hasChords && <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">Chords</span>}</div>
          <CardTitle><Link href={`/songs/${song.id}`}>{song.title}</Link></CardTitle>
          {song.artist && <CardDescription>{song.artist}</CardDescription>}
          {song.sourceTitle && <CardDescription>Source: {song.sourceTitle}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-1">{song.preview && <p className="line-clamp-4 whitespace-pre-line leading-relaxed">{song.preview}</p>}<div className="mt-4 flex flex-wrap gap-1.5">{song.type && <span className="rounded-full border px-2 py-1 text-xs font-bold">{song.type}</span>}{song.grades.slice(0, 3).map((grade) => <span className="rounded-full border px-2 py-1 text-xs font-bold" key={grade}>{grade}</span>)}</div></CardContent>
        <CardFooter><Button asChild><Link href={`/songs/${song.id}`}>Open teaching sheet →</Link></Button></CardFooter>
      </Card>)}</div>
      {visibleSongs.length < songs.length && <div className="mt-7 flex justify-center"><Button asChild><Link href={`/songs?${moreParams.toString()}`}>Show 30 more songs</Link></Button></div>}
      {songs.length === 0 && <Empty className="mt-4"><EmptyHeader><EmptyTitle>No matching songs</EmptyTitle><EmptyDescription>No songs match those filters yet.</EmptyDescription></EmptyHeader></Empty>}
    </section>
  </div>;
}
