import type { Metadata } from "next";
import Link from "next/link";
import { getSongbookFacets, listSongbookSongs } from "@/lib/songbook";
import styles from "./songs.module.css";

export const metadata: Metadata = {
  title: "Teacher Songbook | Old MacDonald Had a School",
  description: "A practical teacher songbook with readable lyrics, actions, simple chord guides, sources, and curriculum connections.",
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SongsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = {
    q: valueOf(params.q), grade: valueOf(params.grade), topic: valueOf(params.topic), type: valueOf(params.type),
    actions: valueOf(params.actions) === "1", chords: valueOf(params.chords) === "1", verified: valueOf(params.verified) === "1",
  };
  const [songs, facets] = [listSongbookSongs(filters), getSongbookFacets()];

  return <div className={styles.page}>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Practical teacher songbook</p>
      <h1>Songs worth singing tomorrow</h1>
      <p>Readable words, usable movement ideas, simple chords when we have them, and a clear path back to the source.</p>
    </header>

    <form className={styles.filters} action="/songs" method="get">
      <label className={styles.search}>Search songs<input name="q" defaultValue={filters.q} placeholder="pony, greeting, counting…" /></label>
      <label>Grade<select name="grade" defaultValue={filters.grade}><option value="">All grades</option>{facets.grades.map((grade) => <option key={grade.key} value={grade.key}>{grade.label}</option>)}</select></label>
      <label>Topic<select name="topic" defaultValue={filters.topic}><option value="">All topics</option>{facets.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}</select></label>
      <label>Type<select name="type" defaultValue={filters.type}><option value="">All types</option>{facets.types.map((type) => <option key={type}>{type}</option>)}</select></label>
      <fieldset><legend>Include</legend><label><input type="checkbox" name="actions" value="1" defaultChecked={filters.actions} /> Actions</label><label><input type="checkbox" name="chords" value="1" defaultChecked={filters.chords} /> Chords</label><label><input type="checkbox" name="verified" value="1" defaultChecked={filters.verified} /> Verified</label></fieldset>
      <div className={styles.filterActions}><button type="submit">Find songs</button><Link href="/songs">Clear</Link></div>
    </form>

    <section className={styles.results} aria-labelledby="song-results-heading">
      <div className={styles.resultHeading}><h2 id="song-results-heading">{songs.length} songs</h2><span>Open a song for its teaching sheet</span></div>
      <div className={styles.grid}>{songs.map((song) => <article className={styles.card} key={song.id}>
        <div className={styles.badges}>{song.verified && <span>Reviewed</span>}{song.hasActions && <span>Actions</span>}{song.hasChords && <span>Chords</span>}</div>
        <h3><Link href={`/songs/${song.id}`}>{song.title}</Link></h3>
        {song.artist && <p className={styles.artist}>{song.artist}</p>}
        {song.preview && <p className={styles.preview}>{song.preview}</p>}
        <div className={styles.meta}>{song.type && <span>{song.type}</span>}{song.grades.slice(0, 3).map((grade) => <span key={grade}>{grade}</span>)}</div>
        <Link className={styles.open} href={`/songs/${song.id}`}>Open teaching sheet →</Link>
      </article>)}</div>
      {songs.length === 0 && <p className={styles.empty}>No songs match those filters yet.</p>}
    </section>
  </div>;
}
