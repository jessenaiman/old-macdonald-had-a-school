import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSongbookSong } from "@/lib/songbook";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const song = getSongbookSong(Number(id));
  return song ? { title: `${song.title} | Teacher Songbook`, description: `Lyrics, actions, chords, sources, and curriculum connections for ${song.title}.` } : { title: "Page not found | Old MacDonald Had a School", description: "Find your way back to songs, grades, and teacher-ready resources." };
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

  return <div className="min-h-dvh px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:py-14 print:bg-none print:p-0 print:text-black"><article className="flex w-full flex-col gap-6">
    <Button asChild className="min-h-[44px] self-start print:hidden" variant="link"><Link href="/songs">← Back to the songbook</Link></Button>
    <Card className="material-surface material-paper-ruled print:bg-white print:text-black print:shadow-none"><CardHeader><div className="flex flex-wrap gap-2"><Badge variant="outline">{song.type ?? "Song"}</Badge><Badge variant={song.verified ? "default" : "secondary"}>{song.verified ? "Reviewed source" : "Source review pending"}</Badge></div><h1 className="font-heading text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05] text-balance">{song.title}</h1>{song.artist && <CardDescription>{song.artist}</CardDescription>}</CardHeader><CardContent><p className="max-w-3xl text-lg leading-relaxed">Use this on-site teaching sheet for the lyrics, documented music guidance, movement ideas, and curriculum context.</p></CardContent></Card>
    {songChords.length > 0 && <Card className="print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Quick chords</CardTitle><CardDescription>{provenanceLabel(songChords[0].provenance)}{songChords[0].musicalKey ? ` · Key of ${songChords[0].musicalKey}` : ""}</CardDescription></CardHeader><CardContent><p className="font-hand text-3xl font-bold tracking-wider">{songChords.map((chord) => chord.progression).join(" · ")}</p></CardContent></Card>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(16.25rem,.65fr)] print:grid-cols-[2fr_1fr] print:gap-3">
      <Card className="print:bg-white print:text-black print:shadow-none" data-song-lyrics><CardHeader><CardTitle>Lyrics and classroom cues</CardTitle><CardDescription>The lyric sheet remains here; sources below are documentation, not the next destination.</CardDescription></CardHeader><CardContent className="flex flex-col gap-8">
        {song.sections.length === 0 ? <p className="text-muted-foreground">This source record has no transcribed lyrics yet.</p> : song.sections.map((section) => {
          const sectionChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope !== "line");
          const lineChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope === "line");
          const lines = section.lyrics.split("\n");
          return <section className="flex flex-col gap-4" key={section.id || section.label || section.lyrics}>{(section.label || song.sections.length > 1) && <h2 className="font-heading text-2xl">{section.label ?? section.sectionType}</h2>}{sectionChords.map((chord) => <div className="flex flex-col gap-1" key={chord.id}><p className="font-hand text-lg font-bold text-primary">{chord.progression}</p><Badge variant="outline">{provenanceLabel(chord.provenance)}</Badge></div>)}<div className="flex flex-col gap-3">{lines.map((line, index) => {
            const chords = lineChords.filter((chord) => chord.lineNumber === index + 1);
            const lineAction = section.actionScope === "line" && section.actionLineNumber === index + 1;
            const sourceActions = song.actions.filter((action) => action.sectionId === section.id && action.lineNumber === index + 1);
            return <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,.65fr)]" data-song-lyric-row key={`${index}-${line}`}><div>{chords.map((chord) => <p className="font-hand text-lg font-bold text-primary" key={chord.id}>{chord.progression}</p>)}<p className="whitespace-pre-wrap text-lg font-bold leading-relaxed sm:text-2xl">{line || "\u00a0"}</p></div>{(lineAction && section.actions || sourceActions.length > 0) && <Card className="card-paper gap-3 py-4" data-song-line-actions><CardContent className="flex flex-col gap-3 text-sm leading-relaxed">{lineAction && section.actions && <p><Badge variant="outline">{provenanceLabel(section.actionProvenance)}</Badge><span className="mt-2 block">{section.actions}</span></p>}{sourceActions.map((action) => <p key={action.id}><Badge variant="outline">{provenanceLabel(action.provenance)}</Badge><span className="mt-2 block">{action.wording}</span></p>)}</CardContent></Card>}</div>;
          })}</div>{section.actions && section.actionScope !== "line" && <Card className="card-paper gap-3 py-4"><CardContent className="text-sm leading-relaxed"><Badge variant="outline">{provenanceLabel(section.actionProvenance)}</Badge><p className="mt-2 whitespace-pre-wrap">{section.actions}</p></CardContent></Card>} <Separator /></section>;
        })}
        {songLevelActions.length > 0 && <Card className="card-paper gap-3 py-4" data-song-level-actions aria-labelledby="song-actions-heading"><CardHeader><CardTitle id="song-actions-heading">Things to do with the music</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm leading-relaxed">{songLevelActions.map((action) => <p key={action.id}><Badge variant="outline">{provenanceLabel(action.provenance)}</Badge><span className="mt-2 block">{action.wording}</span></p>)}</CardContent></Card>}
      </CardContent></Card>
      <aside className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 print:grid-cols-1">
        {(song.instructions || song.materialsNeeded || song.educationalDomain) && <Card className="print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Teacher notes</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm leading-relaxed">{song.instructions && <p>{song.instructions}</p>}{song.materialsNeeded && <p><strong>Materials:</strong> {song.materialsNeeded}</p>}{song.educationalDomain && <p><strong>Learning:</strong> {song.educationalDomain}</p>}</CardContent></Card>}
        <Card className="print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Curriculum connections</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{song.topics.length === 0 ? <p className="text-sm text-muted-foreground">No curriculum connection has been reviewed for this song yet.</p> : song.topics.map((topic, index) => <div className="flex flex-col gap-2" key={topic.id}>{index > 0 && <Separator />}{topic.grades.length > 0 && <div className="flex flex-wrap gap-2">{topic.grades.map((grade) => <Badge key={grade} variant="outline">{grade}</Badge>)}</div>}<h3 className="font-semibold">{topic.label}</h3>{topic.rationale && <p className="text-sm leading-relaxed text-muted-foreground">{topic.rationale}</p>}</div>)}</CardContent></Card>
        {song.sources.length > 0 && <Card className="md:col-span-2 lg:col-span-1 print:col-span-1 print:bg-white print:text-black print:shadow-none"><CardHeader><CardTitle>Source citations</CardTitle><CardDescription>Provenance for this teaching sheet. It does not replace the on-site lyrics or teaching guidance.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{song.sources.map((source, index) => <div className="flex flex-col gap-1 break-words text-xs" key={`${source.path}-${source.relationship}`}>{index > 0 && <Separator />}{<Badge variant="outline">{source.relationship}</Badge>}<span>{source.path.split("/").at(-1)}</span>{source.locator && <span>{source.locator}</span>}<span className="text-muted-foreground">{source.state}</span></div>)}</CardContent><CardFooter><Button asChild variant="outline"><Link href="/songs">Browse another teaching sheet</Link></Button></CardFooter></Card>}
      </aside>
    </div>
  </article></div>;
}
