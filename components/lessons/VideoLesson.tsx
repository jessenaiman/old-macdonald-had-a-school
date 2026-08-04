import { getLessonSections, getSectionField, getVideoCore, type LessonEntry } from "../../lib/content/lessons";
import { LessonHeader } from "./LessonHeader";
import { LessonMarkdown } from "./LessonMarkdown";

export function VideoLesson({ lesson }: { lesson: LessonEntry }) {
  const sections = getLessonSections(lesson.body);
  const watch = sections.find((section) => /^watch$/i.test(section.heading));
  const supports = watch ? sections.filter((section) => section !== watch) : sections;
  const core = getVideoCore(lesson);
  const watchBody = watch?.body ?? "";
  const publishedVideoUrl = getSectionField(watchBody, "Published video URL") ?? getSectionField(watchBody, "Media URL") ?? "";
  const localVideoPath = getSectionField(watchBody, "Local video URL") ?? "";
  const localVideoPaths = getSectionField(watchBody, "Local video paths") ?? getSectionField(watchBody, "Local Videos") ?? "";
  const mediaKind = getSectionField(watchBody, "Media kind") ?? "";
  const owner = getSectionField(watchBody, "Owner") ?? "";
  const firstParty = mediaKind.toLowerCase() === "first-party" || Boolean(localVideoPath || localVideoPaths) || /\bjesse\b/i.test(owner);
  const playerUrl = publishedVideoUrl || (/^\/(?!\/)/.test(localVideoPath) ? localVideoPath : "") || (/^\/(?!\/)/.test(core.url) ? core.url : "");
  const externalDestination = Boolean(core.url) && !playerUrl;
  const linkChecked = /\bverified\b|\bchecked\b/i.test(watchBody);
  const beforeNotes = getSectionField(watchBody, "Before notes") ?? `Name the focus before viewing: ${core.title}.`;
  const duringNotes = getSectionField(watchBody, "During notes") ?? "Ask children to notice one detail connected to today’s lesson.";
  const afterNotes = getSectionField(watchBody, "After notes") ?? "Move into the active lesson steps while the idea is fresh.";
  let destination = "No external link recorded";
  if (playerUrl || localVideoPaths) {
    destination = playerUrl || localVideoPaths;
  } else if (core.url) {
    try {
      const parsed = new URL(core.url);
      destination = `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname === "/" ? "" : parsed.pathname}`;
    } catch {
      destination = core.url;
    }
  }

  return (
    <article className="lesson-article lesson-article--video" data-template="video">
      <LessonHeader lesson={lesson} templateLabel="Video" />
      <section className="lesson-core lesson-core--video" aria-labelledby="video-core-heading">
        <p className="lesson-section-label">{watch ? "Start here" : "Core starting resource"}</p>
        <h2 id="video-core-heading">{watch?.heading ?? core.title}</h2>
        {playerUrl ? <video className="lesson-resource-player" controls preload="metadata"><source src={playerUrl} />Your browser cannot play this project video.</video> : null}
        {watch ? (
          <LessonMarkdown source={watch.body} />
        ) : (
          <>
            <p>{core.description}</p>
            {core.source ? <p className="lesson-resource-source">{core.source}</p> : null}
            {core.url ? (
              <a className="lesson-resource-link" href={core.url} target="_blank" rel="noreferrer">
                Open starting resource
              </a>
            ) : null}
          </>
        )}
        <div className={`lesson-resource-audit ${core.url || localVideoPaths ? "has-link" : "missing-link"}`}>
          <span>{firstParty ? (playerUrl ? "Jesse’s lesson video · published here" : externalDestination ? "Jesse’s lesson video · hosted externally" : "Jesse’s lesson video · file listed") : (core.url ? (linkChecked ? "Checked in lesson notes" : "Link provided") : "No link recorded")}</span>
          <span>{firstParty ? (externalDestination ? <>Hosted at <strong>{destination}</strong></> : <>Project media <strong>{destination}</strong></>) : <>Opens <strong>{destination}</strong></>}</span>
        </div>
        {core.url || localVideoPaths ? <p className="lesson-resource-destination"><strong>{firstParty ? "Jesse’s lesson video" : "Starting resource link"}:</strong> {core.url || localVideoPaths}</p> : null}
        <div className="lesson-discussion-prep">
          <strong>Prepare the conversation</strong>
          <p><b>Before:</b> {beforeNotes}</p>
          <p><b>During:</b> {duringNotes}</p>
          <p><b>After:</b> {afterNotes}</p>
        </div>
      </section>
      <div className="lesson-supports lesson-supports--video" aria-label="Video lesson supports">
        {supports.map((section) => (
          <section className="lesson-support lesson-support--video" key={section.heading}>
            <h2>{section.heading}</h2>
            <LessonMarkdown source={section.body} />
          </section>
        ))}
      </div>
    </article>
  );
}
