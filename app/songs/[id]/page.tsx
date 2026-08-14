import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSongbookSong } from "@/lib/songbook";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const song = getSongbookSong(Number(id));
  return song ? { title: `${song.title} | Teacher Songbook`, description: `Lyrics, actions, chords, sources, and curriculum connections for ${song.title}.` } : {};
}

function provenanceLabel(value: string | null) {
  if (value === "source-documented") return "From the source";
  if (value === "expert-suggested") return "Teacher suggestion";
  if (value === "community-legacy") return "Community arrangement";
  return "Teaching note";
}

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const songId = Number(id);
  if (!Number.isInteger(songId)) notFound();
  const song = getSongbookSong(songId);
  if (!song) notFound();
  const songChords = song.chords.filter((chord) => chord.scope === "song");
  const songLevelActions = song.actions.filter((action) => action.sectionId === null && action.lineNumber === null);

  return <article className="material-surface material-cardboard-paper min-h-dvh px-4 py-8 text-foreground sm:px-6 lg:px-[max(1.5rem,calc((100vw-73.75rem)/2))] lg:py-16 print:bg-none print:p-0 print:text-black">
    <Button className="mb-6 print:hidden" variant="link" asChild><Link href="/songs">← Back to the songbook</Link></Button>
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-primary">{song.type ?? "Song"}</p><h1 className="font-heading text-5xl leading-[0.95] text-balance sm:text-7xl">{song.title}</h1>{song.artist && <p className="mt-2 font-bold">{song.artist}</p>}</div>
      <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-black uppercase text-primary-foreground">{song.verified ? "Reviewed source" : "Needs source review"}</span>
    </header>

    {songChords.length > 0 && <Card className="mb-6 bg-primary text-primary-foreground print:border-2 print:border-black print:bg-white print:text-black"><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><span className="text-xs font-black uppercase">Quick chords</span><h2 className="mt-1 font-hand text-3xl font-bold tracking-wider" id="quick-chords">{songChords.map((chord) => chord.progression).join("  •  ")}</h2></div><p className="text-xs font-black uppercase">{provenanceLabel(songChords[0].provenance)}{songChords[0].musicalKey ? ` · Key of ${songChords[0].musicalKey}` : ""}</p></CardContent></Card>}

    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(16.25rem,.65fr)] print:grid-cols-[2fr_1fr] print:gap-3">
      <Card data-song-lyrics className="print:bg-white print:text-black print:shadow-none"><CardContent className="px-5 sm:px-10">{song.sections.map((section, sectionIndex) => {
        const sectionChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope !== "line");
        const lineChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope === "line");
        const lines = section.lyrics.split("\n");
        return <section key={section.id || section.label || section.lyrics}>
          {sectionIndex > 0 && <Separator className="my-8" />}
          {(section.label || song.sections.length > 1) && <h2 className="mb-4 font-heading text-2xl text-primary">{section.label ?? section.sectionType}</h2>}
          {sectionChords.map((chord) => <div className="mb-4" key={chord.id}><strong className="block font-hand text-lg text-primary">{chord.progression}</strong><span className="block text-xs font-black uppercase">{provenanceLabel(chord.provenance)}</span></div>)}
          <div className="flex flex-col gap-1">{lines.map((line, index) => {
            const chords = lineChords.filter((chord) => chord.lineNumber === index + 1);
            const lineAction = section.actionScope === "line" && section.actionLineNumber === index + 1;
            const sourceActions = song.actions.filter((action) => action.sectionId === section.id && action.lineNumber === index + 1);
            return <div className="grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,.65fr)] sm:gap-5" data-song-lyric-row key={`${index}-${line}`}>
              <div>{chords.map((chord) => <span className="block font-hand text-lg font-bold text-primary" key={chord.id}>{chord.progression}</span>)}<p className="whitespace-pre-wrap text-lg font-bold leading-relaxed sm:text-2xl">{line || "\u00a0"}</p></div>
              {(lineAction && section.actions || sourceActions.length > 0) && <aside className="border-l-4 border-primary bg-secondary p-2 text-sm text-secondary-foreground" data-song-line-actions>
                {lineAction && section.actions && <span className="block"><strong className="block text-xs uppercase">{provenanceLabel(section.actionProvenance)}</strong>{section.actions}</span>}
                {sourceActions.map((action) => <span className="block" key={action.id}><strong className="block text-xs uppercase">{provenanceLabel(action.provenance)}</strong>{action.wording}</span>)}
              </aside>}
            </div>;
          })}</div>
          {section.actions && section.actionScope !== "line" && <aside className="mt-5 border-l-4 border-primary bg-secondary p-3 text-sm text-secondary-foreground"><strong className="block text-xs uppercase">{provenanceLabel(section.actionProvenance)}</strong><p className="mt-1 whitespace-pre-wrap">{section.actions}</p></aside>}
        </section>;
      })}
      {songLevelActions.length > 0 && <aside className="mt-6 border-l-4 border-primary bg-secondary p-3 text-sm text-secondary-foreground" data-song-level-actions aria-labelledby="song-actions-heading"><strong className="block text-xs uppercase" id="song-actions-heading">Things to do with the music</strong>{songLevelActions.map((action) => <p className="mt-2" key={action.id}><strong className="block text-xs uppercase">{provenanceLabel(action.provenance)}</strong>{action.wording}</p>)}</aside>}
      </CardContent></Card>

      <aside className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 print:grid-cols-1">
        {(song.instructions || song.materialsNeeded || song.educationalDomain) && <Card className="print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Teacher notes</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm leading-relaxed">{song.instructions && <p>{song.instructions}</p>}{song.materialsNeeded && <p><strong>Materials:</strong> {song.materialsNeeded}</p>}{song.educationalDomain && <p><strong>Learning:</strong> {song.educationalDomain}</p>}</CardContent></Card>}
        <Card className="print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Curriculum connections</CardTitle></CardHeader><CardContent>{song.topics.map((topic, index) => <div key={topic.id}>{index > 0 && <Separator className="my-4" />}<h3 className="font-bold">{topic.label}</h3>{topic.grades.length > 0 && <p className="mt-1 text-xs">{topic.grades.join(" · ")}</p>}{topic.rationale && <p className="mt-1 text-sm leading-relaxed">{topic.rationale}</p>}</div>)}</CardContent></Card>
        {song.sources.length > 0 && <Card className="md:col-span-2 lg:col-span-1 print:col-span-1 print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Sources</CardTitle></CardHeader><CardContent>{song.sources.map((source, index) => <div className="grid gap-1 break-words text-xs" key={`${source.path}-${source.relationship}`}>{index > 0 && <Separator className="my-3" />}<strong className="uppercase text-primary">{source.relationship}</strong><span>{source.path.split("/").at(-1)}</span>{source.locator && <span>{source.locator}</span>}<small>{source.state}</small></div>)}</CardContent></Card>}
      </aside>
    </div>
  </article>;
}
