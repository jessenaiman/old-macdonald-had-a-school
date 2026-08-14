import { FolkArtsSection } from "@/components/home/FolkArtsSection";
import { HOME_SUBJECTS, SUBJECT_LEARNERS } from "@/components/home/home-data";
import { HomeSubjectNote } from "@/components/home/HomeSubjectNote";

export function HomepageBrandPatterns() {
  return <><section className="material-surface material-cork relative w-full rounded-xl border border-border p-4 pt-8" aria-labelledby="branding-home-note-title"><header><h2 className="font-display text-3xl" id="branding-home-note-title">Homepage subject notes</h2></header><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{HOME_SUBJECTS.map((subject) => <HomeSubjectNote key={subject.key} subject={subject.key} title={subject.title} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`} iconClass={subject.iconClass} teacherReason={subject.teacherReason} highlights={subject.highlights} fastenerClass={subject.fastenerClass} noteShape={subject.noteShape} rotation={subject.rotation} guideCharacter={SUBJECT_LEARNERS[subject.key]?.character} />)}</div></section><FolkArtsSection /></>;
}
