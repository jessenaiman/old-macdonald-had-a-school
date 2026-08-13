import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSongbookSong } from "@/lib/songbook";
import styles from "../songs.module.css";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const song = getSongbookSong(Number(id));
  return song ? { title: `${song.title} | Teacher Songbook`, description: `Lyrics, actions, chords, sources, and curriculum connections for ${song.title}.` } : {};
}

function provenanceLabel(value: string | null) {
  if (value === "source-documented") return "From the source";
  if (value === "expert-suggested") return "Teacher suggestion";
  if (value === "community-legacy") return "Community / legacy arrangement";
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

  return <article className={styles.detailPage}>
    <Link className={styles.back} href="/songs">← Back to the songbook</Link>
    <header className={styles.songHeader}>
      <div><p className={styles.eyebrow}>{song.type ?? "Song"}</p><h1>{song.title}</h1>{song.artist && <p>{song.artist}</p>}</div>
      <div className={styles.status}>{song.verified ? "Reviewed source" : "Needs source review"}</div>
    </header>

    {songChords.length > 0 && <section className={styles.chordStrip} aria-labelledby="quick-chords"><div><span>Quick chords</span><h2 id="quick-chords">{songChords.map((chord) => chord.progression).join("  •  ")}</h2></div><p>{provenanceLabel(songChords[0].provenance)}{songChords[0].musicalKey ? ` · Key of ${songChords[0].musicalKey}` : ""}</p></section>}

    <div className={styles.songLayout}>
      <main className={styles.leadSheet} data-song-lyrics>
        {song.sections.map((section) => {
          const sectionChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope !== "line");
          const lineChords = song.chords.filter((chord) => chord.sectionId === section.id && chord.scope === "line");
          const lines = section.lyrics.split("\n");
          return <section className={styles.songSection} key={section.id || section.label || section.lyrics}>
            {(section.label || song.sections.length > 1) && <h2>{section.label ?? section.sectionType}</h2>}
            {sectionChords.map((chord) => <div className={styles.sectionChord} key={chord.id}><strong>{chord.progression}</strong><span>{provenanceLabel(chord.provenance)}</span></div>)}
            <div className={styles.lyricLines}>{lines.map((line, index) => {
              const chords = lineChords.filter((chord) => chord.lineNumber === index + 1);
              const lineAction = section.actionScope === "line" && section.actionLineNumber === index + 1;
              const sourceActions = song.actions.filter((action) => action.sectionId === section.id && action.lineNumber === index + 1);
              return <div className={styles.lyricRow} data-song-lyric-row key={`${index}-${line}`}>
                <div>{chords.map((chord) => <span className={styles.lineChord} key={chord.id}>{chord.progression}</span>)}<p>{line || " "}</p></div>
                {(lineAction && section.actions || sourceActions.length > 0) && <aside className={styles.lineActions} data-song-line-actions>
                  {lineAction && section.actions && <span><strong>{provenanceLabel(section.actionProvenance)}</strong>{section.actions}</span>}
                  {sourceActions.map((action) => <span key={action.id}><strong>{provenanceLabel(action.provenance)}</strong>{action.wording}</span>)}
                </aside>}
              </div>;
            })}</div>
            {section.actions && section.actionScope !== "line" && <aside className={styles.actionNote}><strong>{provenanceLabel(section.actionProvenance)}</strong><p>{section.actions}</p></aside>}
          </section>;
        })}
        {songLevelActions.length > 0 && <aside className={styles.actionNote} data-song-level-actions aria-labelledby="song-actions-heading">
          <strong id="song-actions-heading">Things to do with the music</strong>
          {songLevelActions.map((action) => <p key={action.id}><strong>{provenanceLabel(action.provenance)}</strong>{action.wording}</p>)}
        </aside>}
      </main>

      <aside className={styles.teacherRail}>
        {(song.instructions || song.materialsNeeded || song.educationalDomain) && <section><h2>Teacher notes</h2>{song.instructions && <p>{song.instructions}</p>}{song.materialsNeeded && <p><strong>Materials:</strong> {song.materialsNeeded}</p>}{song.educationalDomain && <p><strong>Learning:</strong> {song.educationalDomain}</p>}</section>}
        <section><h2>Curriculum connections</h2>{song.topics.map((topic) => <div className={styles.topic} key={topic.id}><h3>{topic.label}</h3>{topic.grades.length > 0 && <p>{topic.grades.join(" · ")}</p>}{topic.rationale && <p>{topic.rationale}</p>}</div>)}</section>
        {song.sources.length > 0 && <section><h2>Sources</h2>{song.sources.map((source) => <div className={styles.source} key={`${source.path}-${source.relationship}`}><strong>{source.relationship}</strong><span>{source.path.split("/").at(-1)}</span>{source.locator && <span>{source.locator}</span>}<small>{source.state}</small></div>)}</section>}
      </aside>
    </div>
  </article>;
}
