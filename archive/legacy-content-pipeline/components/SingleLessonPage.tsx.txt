"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { CheckStep, PrintableDoc, PracticeStep, SingleLessonTopic, TryStep } from "../lib/content";
import { charKey } from "../lib/char-key";
import { CharacterBadge } from "./CharacterBadge";
import { STAFF } from "../lib/cast";
import { LessonPrintActions } from "./planning/LessonPrintActions";

/* ── icons ── */
const WatchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2" /><polygon points="10,8 16,11 10,14" fill="currentColor" stroke="none" /></svg>);
const TryIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
const PracticeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>);
const CheckIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const ExtendIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ExternalIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const DownloadIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const CopyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
const BulbIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>);
const StarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const DocIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
function CategoryIcon({ type }: { type: string }) {
  if (type === "music") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
  if (type === "document") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
  if (type === "game") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><circle cx="16" cy="10" r="1" fill="currentColor" /><circle cx="18" cy="12" r="1" fill="currentColor" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
const PRACTICE_TILES: Record<string, React.ReactNode> = {
  counters: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="4" /><circle cx="16" cy="16" r="4" /></svg>,
  "number-cards": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="8" height="14" rx="1" /><rect x="13" y="5" width="8" height="14" rx="1" /><text x="7" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">3</text><text x="17" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">5</text></svg>,
  "plus-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  "equals-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="15" x2="19" y2="15" /></svg>,
};

const STEPS = [
  { key: "watch", label: "Watch", sub: "Best starting resource", icon: <WatchIcon /> },
  { key: "try", label: "Try", sub: "Teacher-led activity", icon: <TryIcon /> },
  { key: "practice", label: "Practice", sub: "Student practice", icon: <PracticeIcon /> },
  { key: "check", label: "Check", sub: "Quick assessment", icon: <CheckIcon /> },
  { key: "extend", label: "Extend", sub: "Search more", icon: <ExtendIcon /> },
] as const;

function leadFor(subject: string) {
  if (/math/i.test(subject)) return { patch: "mr-sam", name: "Mr Sam" };
  if (/literacy|phonics|language|reading/i.test(subject)) return { patch: "miss-hayley", name: "Miss Hayley" };
  return { patch: "old-macdonald", name: "Old MacDonald" };
}

function linkDestination(url: string) {
  if (!url) return "No external link recorded";
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return url;
  }
}

type WatchResourceDetails = {
  mediaKind?: "first-party" | "external";
  firstParty?: boolean;
  owner?: string;
  publishedVideoUrl?: string;
  mediaUrl?: string;
  localVideoPath?: string;
  localVideoPaths?: string;
  beforeNotes?: string;
  duringNotes?: string;
  afterNotes?: string;
  worksheetPurpose?: string;
};

function resourceDetails(watch: { title: string; url: string; source: string; thumbnailNote: string }) {
  const candidate = watch as typeof watch & WatchResourceDetails;
  const publishedVideoUrl = candidate.publishedVideoUrl?.trim() || candidate.mediaUrl?.trim() || "";
  const localVideoPath = candidate.localVideoPath?.trim() || "";
  const localVideoPaths = candidate.localVideoPaths?.trim() || "";
  const firstParty = candidate.mediaKind === "first-party"
    || candidate.firstParty === true
    || Boolean(localVideoPath || localVideoPaths)
    || /\bjesse\b/i.test(candidate.owner || "");
  const playerUrl = publishedVideoUrl || (/^\/(?!\/)/.test(localVideoPath) ? localVideoPath : "") || (/^\/(?!\/)/.test(watch.url) ? watch.url : "");
  const externalDestination = Boolean(watch.url) && !playerUrl;
  return {
    ...candidate,
    firstParty,
    playerUrl,
    externalDestination,
    localVideoPaths,
    discussion: {
      before: candidate.beforeNotes || `Name the focus before viewing: ${watch.title || "the lesson video"}.`,
      during: candidate.duringNotes || "Ask children to notice one detail connected to today’s lesson, then pause if a brief discussion will help.",
      after: candidate.afterNotes || "Move into Try and Check while the idea is fresh. Keep the conversation short, active, and connected to the printable.",
    },
  };
}

function linkStatus(watch: { url: string; source: string; thumbnailNote: string }, resource: ReturnType<typeof resourceDetails>) {
  if (resource.firstParty && resource.playerUrl) {
    return { label: "Jesse’s lesson video · published here", tone: "checked" as const, detail: "This is first-party project media. Use the built-in player or open the lesson page on the classroom device." };
  }
  if (resource.firstParty && resource.externalDestination) {
    return { label: "Jesse’s lesson video · hosted externally", tone: "review" as const, detail: "This is first-party lesson media hosted at an external destination. Open or copy the link for the classroom device; do not download it from the host." };
  }
  if (resource.firstParty && resource.localVideoPaths) {
    return { label: "Jesse’s lesson video · file listed", tone: "review" as const, detail: "The workbook lists project media, but a playable site file is not published on this page yet." };
  }
  if (!watch.url) return { label: "No link recorded", tone: "missing" as const, detail: "Add a verified resource before class." };
  const notes = `${watch.source} ${watch.thumbnailNote}`;
  if (/\bverified\b|\bchecked\b/i.test(notes)) {
    return { label: "Checked in lesson notes", tone: "checked" as const, detail: "The lesson notes mark this resource as checked." };
  }
  return { label: "Link provided", tone: "review" as const, detail: "Open it before class to confirm it still plays." };
}

function stepDescription(step: TryStep | PracticeStep | CheckStep) {
  return (step as { description?: string }).description || "";
}

function LessonPlanningRail({ grade }: { grade: string }) {
  const cue = /2/.test(grade)
    ? "Ask deeper, solve bigger, and learn together."
    : "Think, create, and share with purpose.";
  return (
    <aside className="lp-grade-rail" aria-label="Lesson planning sections">
      <p>Teacher planning</p>
      <strong>{grade}</strong>
      <nav>
        <a href="#lesson-start"><b>01</b> Today</a>
        <a href="#lesson-sequence"><b>02</b> Sequence</a>
        <a href="#lesson-planning"><b>03</b> Planner</a>
      </nav>
      <div><span>Planning reminder</span><em>{cue}</em></div>
    </aside>
  );
}

export function SingleLessonPage({ lesson }: { lesson: SingleLessonTopic }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [videoCopied, setVideoCopied] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const { meta, watch, try: tryStep, practice, check, extend, curriculumPath, printables } = lesson;

  const standards = [meta.standardUS, meta.standardOntario].filter(Boolean).join(" · ") || meta.standards;
  const curriculumLesson = meta.curriculumLesson || meta.title;
  const curriculumSource = meta.recommendedSource || meta.sourceReference;
  const lead = leadFor(meta.subject);
  const media = resourceDetails(watch);
  const videoStatus = linkStatus(watch, media);
  const videoDestination = media.playerUrl || media.localVideoPaths || linkDestination(watch.url);
  const mediaLink = media.playerUrl || watch.url;
  const pathSegments = curriculumPath.length > 0 ? curriculumPath : [meta.subject, meta.category, meta.title];
  const docs: PrintableDoc[] = printables.length
    ? printables
    : practice.printable
      ? [{ title: practice.printableLabel || "Printable", image: "", format: practice.printableFormat || "PDF", url: practice.printableURL || "" }]
      : [];

  const step = STEPS[active];

  async function copySearch() {
    await navigator.clipboard.writeText(extend.searchPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  async function copyVideoLink() {
    if (!mediaLink) return;
    try {
      await navigator.clipboard.writeText(mediaLink);
      setVideoCopied(true);
      window.setTimeout(() => setVideoCopied(false), 1800);
    } catch {
      setVideoCopied(false);
    }
  }
  function openPreview(i: number) { setPreview(i); }
  const closePreview = useCallback(() => setPreview(null), []);
  const movePreview = useCallback(
    (d: number) => setPreview((p) => (p === null ? p : (p + d + docs.length) % docs.length)),
    [docs.length],
  );

  useEffect(() => {
    if (preview === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      else if (e.key === "ArrowRight") movePreview(1);
      else if (e.key === "ArrowLeft") movePreview(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, closePreview, movePreview]);

  const previewDoc = preview !== null ? docs[preview] : null;

  return (
    <div className="lp-page lesson-page" data-char={charKey(lead.name)} data-print-preview={previewDoc ? "true" : undefined}>
      <LessonPlanningRail grade={meta.grade} />
      <section className="lp-hero stitch" id="lesson-start">
        <div className="lp-topbar lp-screen-only">
          <nav className="lp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="lp-bc-home" aria-label="Home"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></Link>
            <span className="lp-bc-sep">›</span><span>{meta.gradeBand}</span>
            <span className="lp-bc-sep">›</span><span>{meta.subject}</span>
            <span className="lp-bc-sep">›</span><span className="lp-bc-current">{meta.category}</span>
          </nav>
          <span className="lp-grade-chip">{meta.grade}</span>
        </div>

        <header className="lp-header">
          <div className="lp-header-copy">
            <h1>{meta.title}<span className="lp-sparkle" aria-hidden="true">✦</span></h1>
            <p className="lp-summary">{meta.summary}</p>
          </div>
          <div className="lp-lead-badge stitch">
            <CharacterBadge className="lp-lead-patch" charKey={lead.patch} color={STAFF.find((s) => s.key === lead.patch)?.color ?? "var(--gold)"} name={lead.name} size={48} />
            <div className="lp-lead-meta">
              <strong>Built for {meta.grade}</strong>
              <small>{lead.name} · {meta.timeEstimate}</small>
            </div>
          </div>
        </header>
        <div className="lp-hero-actions lp-screen-only">
          <LessonPrintActions label="Print lesson plan" />
        </div>
      </section>

      <section className="lp-academics stitch" aria-label="Curriculum alignment">
        <div><span>Curriculum lesson</span><strong>{curriculumLesson}</strong></div>
        <div><span>Standards</span><strong>{standards || "Standards pending"}</strong></div>
        <div><span>Recommended source</span><strong>{curriculumSource || "Source pending"}</strong>{meta.externalResource && <a href={meta.externalResource} target="_blank" rel="noreferrer">Open source ↗</a>}</div>
      </section>

      <div className="lp-split">
        <section className="lp-interact" id="lesson-sequence" aria-label="Lesson sequence">
          <div className="lp-map" role="tablist" aria-label="Lesson steps">
            {STEPS.map((s, i) => (
              <button key={s.key} role="tab" aria-selected={i === active} className={`stitch${i === active ? " active" : ""}`} onClick={() => setActive(i)}>
                <span className="lp-map-num">{i + 1}</span>
                <span className="lp-map-icon">{s.icon}</span>
                <span className="lp-map-text"><strong>{s.label}</strong><small>{s.sub}</small></span>
              </button>
            ))}
          </div>

          <div className="lp-focus lp-panel stitch" aria-live="polite">
            <div className="lp-focus-eyebrow"><span className="lp-focus-icon">{step.icon}</span> Step {active + 1} · {step.label}</div>

            {step.key === "watch" && (
              <>
                <div className="lp-video-frame">
                  {media.playerUrl ? (
                    <video className="lp-video-element" controls preload="metadata">
                      <source src={media.playerUrl} />
                      Your browser cannot play this project video.
                    </video>
                  ) : (
                    <div className="lp-video">
                      <span className="lp-video-play"><svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg></span>
                      <span className="lp-video-title">{watch.title}</span>
                    </div>
                  )}
                  <div className="lp-video-audit">
                    <span className={`lp-link-status lp-link-status-${videoStatus.tone}`}><span aria-hidden="true">{videoStatus.tone === "checked" ? "✓" : videoStatus.tone === "review" ? "•" : "×"}</span>{videoStatus.label}</span>
                    <span className="lp-video-destination">{media.firstParty ? (media.externalDestination ? <>Hosted at <strong>{videoDestination}</strong></> : <>Project media <strong>{videoDestination}</strong></>) : <>Opens <strong>{videoDestination}</strong></>}</span>
                  </div>
                </div>
                <p className="lp-step-desc">{watch.description}</p>
                <div className="lp-link-detail">
                  <span>{media.firstParty ? "Jesse’s lesson video" : "External resource link"}</span>
                  <code>{mediaLink || media.localVideoPaths || "No external link recorded"}</code>
                  <small>{videoStatus.detail}</small>
                </div>
                <section className="lp-discussion-prep" aria-labelledby="discussion-prep-heading">
                  <div className="lp-discussion-head"><span className="eyebrow">Prepare the conversation</span><h3 id="discussion-prep-heading">Three small prompts before the group begins</h3></div>
                  <dl>
                    <div><dt>Before viewing</dt><dd>{media.discussion.before}</dd></div>
                    <div><dt>While viewing</dt><dd>{media.discussion.during}</dd></div>
                    <div><dt>After viewing</dt><dd>{media.discussion.after}</dd></div>
                  </dl>
                </section>
                <div className="lp-actions">
                  {watch.url && media.externalDestination ? <a className="lp-btn" href={watch.url} target="_blank" rel="noreferrer">Open for class <ExternalIcon /></a> : null}
                  {mediaLink ? <button className="lp-btn-ghost" type="button" onClick={copyVideoLink}>{videoCopied ? "Link copied" : "Copy link for class"}</button> : null}
                </div>
              </>
            )}

            {step.key === "try" && (
              <>
                <h3 className="lp-step-title">{tryStep.title}</h3>
                <p className="lp-step-desc">{stepDescription(tryStep)}</p>
                {tryStep.teacher && <p className="lp-role"><strong>Teacher:</strong> {tryStep.teacher}</p>}
                {tryStep.students && <p className="lp-role"><strong>Students:</strong> {tryStep.students}</p>}
                {tryStep.lookFor && <p className="lp-lookfor"><strong>Look for:</strong> {tryStep.lookFor}</p>}
                {tryStep.tip && <div className="lp-tip"><BulbIcon /><span>{tryStep.tip}</span></div>}
              </>
            )}

            {step.key === "practice" && (
              <>
                <h3 className="lp-step-title">{practice.title}</h3>
                <p className="lp-step-desc">{stepDescription(practice)}</p>
                {practice.icons.length > 0 && (
                  <div className="lp-tiles">{practice.icons.map((ic) => <span className="lp-tile" key={ic}>{PRACTICE_TILES[ic] || PRACTICE_TILES.counters}</span>)}</div>
                )}
                {docs.length > 0 && <p className="lp-pointer">The printable worksheet{docs.length > 1 ? "s" : ""} for this step {docs.length > 1 ? "are" : "is"} in the planning panel — preview, download or print {docs.length > 1 ? "them" : "it"} there. →</p>}
              </>
            )}

            {step.key === "check" && (
              <>
                <h3 className="lp-step-title">{check.title}</h3>
                <p className="lp-step-desc">{stepDescription(check)}</p>
                {check.teacher && <p className="lp-role"><strong>Teacher:</strong> {check.teacher}</p>}
                {check.students && <p className="lp-role"><strong>Students:</strong> {check.students}</p>}
                {check.lookFor && <p className="lp-lookfor"><strong>Look for:</strong> {check.lookFor}</p>}
                {check.tip && <div className="lp-tip lp-tip-star"><StarIcon /><span>{check.tip}</span></div>}
              </>
            )}

            {step.key === "extend" && (
              <>
                <p className="lp-step-desc">Find more ideas and resources to extend this lesson.</p>
                <div className="lp-copybox">
                  <div className="lp-copy-label">Copy this search</div>
                  <div className="lp-copy-row"><code>{extend.searchPrompt}</code><button className="lp-copy-btn" onClick={copySearch} aria-label="Copy search prompt">{copied ? "✓" : <CopyIcon />}</button></div>
                </div>
                {extend.categories.length > 0 && (
                  <div className="lp-explore">
                    <span className="lp-explore-label">Or explore these</span>
                    {extend.categories.map((c) => <span className="lp-explore-item" key={c.label}><CategoryIcon type={c.icon} />{c.label}</span>)}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="lp-plan" id="lesson-planning" aria-label="Lesson planning and documents">
          <div className="lp-plan-card lp-panel stitch">
            <div className="lp-plan-head">
              <span className="eyebrow">Lesson documents</span>
              <h2>{docs.length} {docs.length === 1 ? "sheet" : "sheets"} to preview &amp; print</h2>
              <p>Open any sheet to read it before you download or print. These become your printable PDFs.</p>
            </div>
            {docs.length > 0 ? (
              <div className="lp-docs">
                {docs.map((d, i) => (
                  d.image ? (
                    <div className="lp-doc" key={d.title + i}>
                      <button className="lp-doc-thumb" onClick={() => openPreview(i)} aria-label={`Preview ${d.title}`}>
                        <Image src={d.image} alt={d.title} fill sizes="(max-width:760px) 45vw, 280px" />
                        <span className="lp-doc-fmt">{d.format}</span>
                        <span className="lp-doc-zoom" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg></span>
                      </button>
                      <div className="lp-doc-foot">
                        <strong>{d.title}</strong>
                        {d.url ? <a className="lp-doc-dl" href={d.url} download aria-label={`Download ${d.title}`}><DownloadIcon /></a> : null}
                      </div>
                    </div>
                  ) : (
                    <div className="lp-doc-row" key={d.title + i}>
                      <span className="lp-doc-row-icon"><DocIcon /></span>
                      <strong>{d.title}</strong>
                      <em>{d.format}</em>
                      {d.url ? <a className="lp-btn-ghost" href={d.url} target="_blank" rel="noreferrer">Open <ExternalIcon /></a> : <span className="lp-doc-soon">Coming soon</span>}
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="lp-doc-empty">No printable sheets for this lesson yet.</p>
            )}
          </div>

          <div className="lp-plan-card lp-facts lp-panel stitch">
            <div className="lp-fact"><span>Grade &amp; time</span><strong>{meta.grade} · {meta.timeEstimate}</strong></div>
            <div className="lp-fact"><span>Standards</span><strong>{standards || "Pending"}</strong></div>
            <div className="lp-fact">
              <span>Curriculum path</span>
              <div className="lp-path">{pathSegments.map((seg, i) => <span key={seg} className={`lp-path-node${i === pathSegments.length - 1 ? " lp-path-active" : ""}`}>{seg}</span>)}</div>
            </div>
            {lesson.planningNote && <div className="lp-fact"><span>Planning note</span><p className="lp-note">{lesson.planningNote}</p></div>}
          </div>
        </aside>
      </div>

      <nav className="lp-course-nav stitch" aria-label="Lesson navigation">
        {meta.previousSlug ? <Link href={`/topics/${meta.previousSlug}`}><span>← Previous lesson</span><strong>{meta.previousTitle}</strong></Link> : <div><span>Previous lesson</span><strong>{meta.previousTitle || "Start of sequence"}</strong></div>}
        <div><span>Current lesson</span><strong>{meta.title}</strong></div>
        {meta.nextSlug ? <Link href={`/topics/${meta.nextSlug}`}><span>Next lesson →</span><strong>{meta.nextTitle}</strong></Link> : <div><span>Next lesson</span><strong>{meta.nextTitle || "End of sequence"}</strong></div>}
      </nav>
      <details className="lp-source"><summary>Curriculum source and editing note</summary><p>{meta.sourceReference || `This page is generated from content/lessons/${meta.slug}.mdx.`}</p></details>

      <section className="lp-print-plan" aria-label="Printable lesson plan">
        <header className="lp-print-heading">
          <p>Old MacDonald Had a School · Teacher preparation plan</p>
          <h1>{meta.title}</h1>
          <p>{meta.summary}</p>
        </header>
        <dl className="lp-print-meta">
          <div><dt>Grade</dt><dd>{meta.grade}</dd></div>
          <div><dt>Time</dt><dd>{meta.timeEstimate}</dd></div>
          <div><dt>Focus</dt><dd>{meta.focus}</dd></div>
          <div><dt>Standards</dt><dd>{standards || "Not recorded"}</dd></div>
        </dl>
        <section className="lp-print-section">
          <h2>Start with this resource</h2>
          <h3>{watch.title}</h3>
          <p>{watch.description}</p>
          <p><strong>Source:</strong> {watch.source || "Not recorded"}</p>
          <p><strong>Link status:</strong> {videoStatus.label} · <strong>Destination:</strong> {videoDestination}</p>
          <p><strong>Media:</strong> {media.firstParty ? "Jesse’s first-party lesson video" : "External resource"}{media.externalDestination ? " · hosted externally; copy the link for class rather than downloading it" : " · project media"}</p>
          {mediaLink ? <p className="lp-print-url"><strong>Open:</strong> {mediaLink}</p> : null}
          <h3>Discussion preparation</h3>
          <ul>
            <li><strong>Before viewing:</strong> {media.discussion.before}</li>
            <li><strong>While viewing:</strong> {media.discussion.during}</li>
            <li><strong>After viewing:</strong> {media.discussion.after}</li>
          </ul>
        </section>
        <div className="lp-print-columns">
          <section className="lp-print-section">
            <h2>Lesson sequence</h2>
            {[tryStep, practice, check].map((lessonStep) => (
              <div className="lp-print-step" key={lessonStep.key}>
                <h3>{lessonStep.label}: {lessonStep.title}</h3>
                <p>{stepDescription(lessonStep)}</p>
                {lessonStep.teacher ? <p><strong>Teacher:</strong> {lessonStep.teacher}</p> : null}
                {lessonStep.students ? <p><strong>Students:</strong> {lessonStep.students}</p> : null}
                {lessonStep.lookFor ? <p><strong>Look for:</strong> {lessonStep.lookFor}</p> : null}
              </div>
            ))}
          </section>
          <section className="lp-print-section">
            <h2>Prepare</h2>
            {meta.curriculumLesson ? <p><strong>Curriculum lesson:</strong> {meta.curriculumLesson}</p> : null}
            {curriculumSource ? <p><strong>Recommended source:</strong> {curriculumSource}</p> : null}
            <h3>Printables</h3>
            {docs.length > 0 ? <ul>{docs.map((doc) => <li key={doc.title}>{doc.title} ({doc.format}){doc.url ? ` · ${doc.url}` : ""}</li>)}</ul> : <p>No printable is recorded for this lesson.</p>}
            {lesson.planningNote ? <><h3>Planning note</h3><p>{lesson.planningNote}</p></> : null}
          </section>
        </div>
        <footer className="lp-print-footer">Source note: {meta.sourceReference || `content/lessons/${meta.slug}.mdx`}</footer>
      </section>

      {previewDoc ? (
        <section className="lp-print-preview" aria-label={`Printable preview: ${previewDoc.title}`}>
          <p>Old MacDonald Had a School · Printable preview</p>
          <h1>{previewDoc.title}</h1>
          {/* eslint-disable-next-line @next/next/no-img-element -- preserve the source sheet in print output */}
          {previewDoc.image ? <img src={previewDoc.image} alt={previewDoc.title} /> : null}
          {previewDoc.url ? <p>Open or download the original resource: {previewDoc.url}</p> : <p>No downloadable file is recorded for this preview.</p>}
        </section>
      ) : null}

      {previewDoc && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${previewDoc.title}`} onClick={closePreview}>
          <button className="lp-lightbox-close" onClick={closePreview} aria-label="Close preview"><CloseIcon /></button>
          <button className="lp-lightbox-nav lp-prev" onClick={(e) => { e.stopPropagation(); movePreview(-1); }} aria-label="Previous sheet">‹</button>
          <div className="lp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- printable dimensions are not fixed */}
            {previewDoc.image ? <img className="lp-lightbox-img" src={previewDoc.image} alt={previewDoc.title} /> : <div className="lp-lightbox-none"><DocIcon /><p>No preview available yet.</p></div>}
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{previewDoc.title}</strong><small>{previewDoc.format}{preview !== null ? ` · ${preview + 1} of ${docs.length}` : ""}</small></div>
              <div className="lp-lightbox-actions">
                {previewDoc.url ? <a className="lp-btn-ghost" href={previewDoc.url} download><DownloadIcon /> Download</a> : previewDoc.image ? <a className="lp-btn-ghost" href={previewDoc.image} download><DownloadIcon /> Download preview</a> : null}
                {previewDoc.image ? <a className="lp-btn-ghost" href={previewDoc.image} target="_blank" rel="noreferrer">Open preview <ExternalIcon /></a> : null}
                <button className="lp-btn-ghost" type="button" onClick={() => window.print()}>Print this preview</button>
                {previewDoc.url ? <a className="lp-btn" href={previewDoc.url} target="_blank" rel="noreferrer">Open / Print ↗</a> : null}
              </div>
            </div>
          </div>
          <button className="lp-lightbox-nav lp-next" onClick={(e) => { e.stopPropagation(); movePreview(1); }} aria-label="Next sheet">›</button>
        </div>
      )}
    </div>
  );
}
