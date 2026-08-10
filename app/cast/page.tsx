import type { Metadata } from "next";
import CastContent, { metadata as castMetadata } from "../../content/pages/cast.mdx";
import { SiteShell } from "../../components/SiteShell";

export const metadata: Metadata = {
  title: `${castMetadata.title} | Old MacDonald Had a School`,
  description: castMetadata.summary,
};

export default function CastRoute() {
  return (
    <SiteShell active="cast-guide">
      <article className="about-page cast-page">
        <header className="about-hero paper-panel">
          <div>
            <div className="breadcrumb">{castMetadata.eyebrow}</div>
            <h1>{castMetadata.title}</h1>
            <p className="hero-summary">{castMetadata.summary}</p>
          </div>
        </header>
        <div className="about-layout">
          <div className="about-story prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-[var(--heading)] prose-p:text-[var(--muted)] prose-li:text-[var(--muted)] prose-strong:text-[var(--heading)] prose-a:text-[var(--blue)]">
            <CastContent />
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
