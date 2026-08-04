"use client";

import { useState } from "react";
import type { PracticeStep, PrintableDoc, WatchStep } from "../lib/mdx-content";

const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const DownloadIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const ExternalIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const ZoomIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const DocIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);

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
};

function resourceDetails(watch: WatchStep) {
  const candidate = watch as WatchStep & WatchResourceDetails;
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
      after: candidate.afterNotes || "Move into the lesson’s active practice while the idea is fresh.",
    },
  };
}

function linkStatus(watch: WatchStep, resource: ReturnType<typeof resourceDetails>) {
  if (resource.firstParty && resource.playerUrl) {
    return { label: "Jesse’s lesson video · published here", tone: "checked" as const, detail: "This is first-party project media." };
  }
  if (resource.firstParty && resource.externalDestination) {
    return { label: "Jesse’s lesson video · hosted externally", tone: "review" as const, detail: "First-party lesson media hosted at an external destination. Copy the link for class; do not download it from the host." };
  }
  if (resource.firstParty && resource.localVideoPaths) {
    return { label: "Jesse’s lesson video · file listed", tone: "review" as const, detail: "The workbook lists project media, but a playable site file is not published here yet." };
  }
  if (!watch.url) return { label: "No link recorded", tone: "missing" as const, detail: "Add a verified resource before class." };
  if (/\bverified\b|\bchecked\b/i.test(`${watch.source} ${watch.thumbnailNote}`)) {
    return { label: "Checked in lesson notes", tone: "checked" as const, detail: "The lesson notes mark this resource as checked." };
  }
  return { label: "Link provided", tone: "review" as const, detail: "Open it before class to confirm it still plays." };
}

export type PreviewLesson = { slug: string; title: string; gradeBand: string; watch: WatchStep; printables: PrintableDoc[]; practice: PracticeStep };

export function ResourcePreview({ lessons }: { lessons: PreviewLesson[] }) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const lesson = lessons[active];
  if (!lesson) return null;
  const docs: PrintableDoc[] = lesson.printables.length
    ? lesson.printables
    : lesson.practice.printable
      ? [{ title: lesson.practice.printableLabel || "Printable", image: "", format: lesson.practice.printableFormat || "PDF", url: lesson.practice.printableURL || "" }]
      : [];
  const previewDoc = preview !== null ? docs[preview] : null;
  const media = resourceDetails(lesson.watch);
  const videoStatus = linkStatus(lesson.watch, media);
  const videoDestination = media.playerUrl || media.localVideoPaths || linkDestination(lesson.watch.url);
  const mediaLink = media.playerUrl || lesson.watch.url;

  async function copyVideoLink() {
    if (!mediaLink) return;
    try {
      await navigator.clipboard.writeText(mediaLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="home-section resource-preview paper-panel stitch" aria-label="Preview real lesson resources" data-print-preview={previewDoc ? "true" : undefined}>
      <div className="section-intro compact">
        <span className="eyebrow">See what's inside</span>
        <h2>Preview real lesson resources.</h2>
        <p>Every video-first topic names its starting media, shows where it lives, and pairs it with the printable workflow a teacher prepares before class.</p>
      </div>

      <div className="lp-map rp-map" role="tablist" aria-label="Choose a lesson to preview">
        {lessons.map((l, i) => (
          <button key={l.slug} role="tab" aria-selected={i === active} className={`stitch${i === active ? " active" : ""}`} onClick={() => { setActive(i); setPreview(null); setCopied(false); }}>
            <span className="lp-map-text"><strong>{l.title}</strong><small>{l.gradeBand}</small></span>
          </button>
        ))}
      </div>

      <div className="rp-body">
        <div className="rp-video">
          <span className="eyebrow">Watch</span>
          {media.playerUrl ? (
            <video className="lp-video-element" controls preload="metadata">
              <source src={media.playerUrl} />
              Your browser cannot play this project video.
            </video>
          ) : (
            <div className="lp-video">
              <span className="lp-video-play"><svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg></span>
              <span className="lp-video-title">{lesson.watch.title}</span>
            </div>
          )}
          <p className="rp-video-note">{lesson.watch.thumbnailNote || lesson.watch.description}</p>
          <div className="rp-video-audit">
            <span className={`lp-link-status lp-link-status-${videoStatus.tone}`}><span aria-hidden="true">{videoStatus.tone === "checked" ? "✓" : videoStatus.tone === "review" ? "•" : "×"}</span>{videoStatus.label}</span>
            <span>{media.firstParty ? (media.externalDestination ? <>Hosted at <strong>{videoDestination}</strong></> : <>Project media <strong>{videoDestination}</strong></>) : <>Opens <strong>{videoDestination}</strong></>}</span>
          </div>
          <p className="rp-video-destination"><strong>{media.firstParty ? "Jesse’s lesson video" : "External resource link"}:</strong> {mediaLink || media.localVideoPaths || "No external link recorded"}</p>
          <p className="rp-video-note">{videoStatus.detail}{media.externalDestination ? " This site does not download or save a copy of the hosted video." : ""}</p>
          <div className="rp-discussion-prep">
            <span className="eyebrow">Prepare the conversation</span>
            <p><strong>Before:</strong> {media.discussion.before}</p>
            <p><strong>During:</strong> {media.discussion.during}</p>
            <p><strong>After:</strong> {media.discussion.after}</p>
          </div>
          <div className="rp-video-actions">
            {lesson.watch.url && media.externalDestination ? <a className="lp-btn" href={lesson.watch.url} target="_blank" rel="noreferrer">Open for class <ExternalIcon /></a> : null}
            {mediaLink ? <button className="lp-btn-ghost" type="button" onClick={copyVideoLink}>{copied ? "Link copied" : "Copy link for class"}</button> : null}
          </div>
        </div>

        <div className="rp-docs">
          <span className="eyebrow">{docs.length > 0 ? `${docs.length} printable${docs.length === 1 ? "" : "s"}` : "Printables"}</span>
          {docs.length > 0 ? (
            <div className="lp-docs">
              {docs.map((d, i) => (
                d.image ? (
                  <div className="lp-doc" key={d.title + i}>
                    <button className="lp-doc-thumb" onClick={() => setPreview(i)} aria-label={`Preview ${d.title}`}>
                      <img src={d.image} alt={d.title} />
                      <span className="lp-doc-fmt">{d.format}</span>
                      <span className="lp-doc-zoom" aria-hidden="true"><ZoomIcon /></span>
                    </button>
                    <div className="lp-doc-foot"><strong>{d.title}</strong></div>
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
            <p className="rp-no-docs">This topic's practice step doesn't use a printable — it's teacher-led instead.</p>
          )}
          <a className="rp-open-lesson" href={`/topics/${lesson.slug}`}>Open the full lesson →</a>
        </div>
      </div>

      {previewDoc && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${previewDoc.title}`} onClick={() => setPreview(null)}>
          <button className="lp-lightbox-close" onClick={() => setPreview(null)} aria-label="Close preview"><CloseIcon /></button>
          <div className="lp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            {previewDoc.image ? <img className="lp-lightbox-img" src={previewDoc.image} alt={previewDoc.title} /> : <div className="lp-lightbox-none"><DocIcon /><p>No preview available yet.</p></div>}
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{previewDoc.title}</strong><small>{previewDoc.format}</small></div>
              <div className="lp-lightbox-actions">
                {previewDoc.url ? <a className="lp-btn-ghost" href={previewDoc.url} download><DownloadIcon /> Download</a> : previewDoc.image ? <a className="lp-btn-ghost" href={previewDoc.image} download><DownloadIcon /> Download preview</a> : null}
                {previewDoc.image ? <a className="lp-btn-ghost" href={previewDoc.image} target="_blank" rel="noreferrer">Open preview <ExternalIcon /></a> : null}
                <button className="lp-btn-ghost" type="button" onClick={() => window.print()}>Print this preview</button>
                <a className="lp-btn" href={`/topics/${lesson.slug}`}>Open lesson ↗</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
