import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
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

function filterHref(params: Record<string, string | string[] | undefined>, limit: number) {
  const nextParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const current = valueOf(value);
    if (current && key !== "limit") nextParams.set(key, current);
  }
  nextParams.set("limit", String(limit));
  return `/songs?${nextParams.toString()}`;
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
  const nextLimit = Math.min(resultLimit + 30, songs.length);

  return (
    <div className="material-surface material-cardboard-paper min-h-dvh px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:py-14">
      <section className="flex flex-col gap-8" aria-labelledby="songbook-heading">
        <header className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">Practical teacher songbook</p>
          <h1 className="mt-2 font-heading text-5xl leading-[0.95] text-balance sm:text-7xl" id="songbook-heading">Songs worth singing tomorrow</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">Find a usable teaching sheet first: readable words, movement ideas, chord guidance where documented, and clear source provenance.</p>
        </header>

        <Card className="material-surface material-paper-ruled">
          <CardHeader>
            <CardTitle>Find a song for the next useful moment</CardTitle>
            <CardDescription>Filter the collection by classroom context. Source records stay as citations; every teaching-sheet action stays on this site.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/songs" method="get">
              <FieldGroup className="gap-5">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <Field><FieldLabel htmlFor="song-search">Search songs</FieldLabel><Input defaultValue={filters.q} id="song-search" name="q" placeholder="Pony, greeting, counting…" type="search" /></Field>
                  <Field><FieldLabel htmlFor="song-grade">Grade</FieldLabel><NativeSelect defaultValue={filters.grade} id="song-grade" name="grade"><option value="">All grades</option>{facets.grades.map((grade) => <option key={grade.key} value={grade.key}>{grade.label}</option>)}</NativeSelect></Field>
                  <Field><FieldLabel htmlFor="song-topic">Topic</FieldLabel><NativeSelect defaultValue={filters.topic} id="song-topic" name="topic"><option value="">All topics</option>{facets.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}</NativeSelect></Field>
                  <Field><FieldLabel htmlFor="song-type">Type</FieldLabel><NativeSelect defaultValue={filters.type} id="song-type" name="type"><option value="">All types</option>{facets.types.map((type) => <option key={type} value={type}>{type}</option>)}</NativeSelect></Field>
                </div>
                <FieldSet>
                  <FieldLegend variant="label">Include</FieldLegend>
                  <FieldDescription>Limit results to songs with the teaching support you need.</FieldDescription>
                  <FieldGroup className="flex-row flex-wrap gap-4" data-slot="checkbox-group">
                    {[["actions", filters.actions, "Actions"], ["chords", filters.chords, "Chords"], ["verified", filters.verified, "Reviewed sources"]].map(([name, checked, label]) => <Field key={String(name)} orientation="horizontal" className="w-auto"><Checkbox defaultChecked={Boolean(checked)} id={`song-${name}`} name={String(name)} value="1" /><FieldLabel htmlFor={`song-${name}`}>{label}</FieldLabel></Field>)}
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <div className="mt-6 flex flex-wrap items-center gap-3"><Button type="submit">Find songs</Button><Button asChild type="button" variant="link"><Link href="/songs">Clear filters</Link></Button></div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" aria-labelledby="song-results-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.12em] text-primary">Teaching sheets</p><h2 className="mt-1 font-heading text-4xl" id="song-results-heading">{songs.length} songs</h2></div><p className="text-sm text-muted-foreground">Showing {visibleSongs.length} of {songs.length}</p></div>
        {songs.length === 0 ? <Empty className="material-surface material-paper-ruled mt-5"><EmptyHeader><EmptyTitle>No matching songs</EmptyTitle><EmptyDescription>Try removing a filter or using a broader search phrase.</EmptyDescription></EmptyHeader><EmptyContent><Button asChild variant="outline"><Link href="/songs">View all songs</Link></Button></EmptyContent></Empty> : <>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleSongs.map((song) => <Card className="min-w-0" key={song.id}>
              <CardHeader>
                <div className="flex flex-wrap gap-2">{song.verified && <Badge>Reviewed</Badge>}{song.hasActions && <Badge variant="secondary">Actions</Badge>}{song.hasChords && <Badge variant="secondary">Chords</Badge>}</div>
                <CardTitle><Link className="underline-offset-4 hover:underline" data-song-navigation href={`/songs/${song.id}`}>{song.title}</Link></CardTitle>
                {song.artist && <CardDescription>{song.artist}</CardDescription>}{song.sourceTitle && <CardDescription>Source citation: {song.sourceTitle}</CardDescription>}
                <CardAction className="min-w-0 max-w-full">{song.type && <Badge className="max-w-full whitespace-normal text-right" variant="outline">{song.type}</Badge>}</CardAction>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">{song.preview ? <p className="line-clamp-4 whitespace-pre-line leading-relaxed">{song.preview}</p> : <p className="text-sm text-muted-foreground">Lyrics have not been transcribed into the teaching sheet yet.</p>}{song.grades.length > 0 && <div className="flex flex-wrap gap-2" role="group" aria-label="Related grades">{song.grades.slice(0, 3).map((grade) => <Badge key={grade} variant="outline">{grade}</Badge>)}</div>}</CardContent>
              <CardFooter><Button asChild><Link data-song-navigation href={`/songs/${song.id}`}>Open teaching sheet →</Link></Button></CardFooter>
            </Card>)}
          </div>
          {visibleSongs.length < songs.length && <div className="mt-8 flex justify-center"><Button asChild variant="outline"><Link href={filterHref(params, nextLimit)}>Show 30 more songs</Link></Button></div>}
        </>}
      </section>
    </div>
  );
}
