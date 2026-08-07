import Image from "next/image";
import { SiteShell } from "../../components/SiteShell";
import AboutContent, { metadata as aboutMetadata } from "../../content/pages/about.mdx";

export default function AboutPage() {
  return (
    <SiteShell active="about">
      <div className="about-page">
        <section className="about-hero paper-panel">
          <div>
            <div className="breadcrumb">{aboutMetadata.eyebrow}</div>
            <h1>{aboutMetadata.title}</h1>
            <p className="hero-summary">{aboutMetadata.summary}</p>
          </div>
          <div className="about-mark"><Image src="/brand-emblem.png" alt="Old MacDonald Had a School tree and music-note emblem" width={220} height={220} style={{ height: "auto" }} /></div>
        </section>
        <section className="about-layout">
          <div className="about-story">
            <AboutContent />
          </div>
          <aside className="hire-card stitch">
            <span className="eyebrow">Work with me</span>
            <h2>{aboutMetadata.hireTitle}</h2>
            <p>{aboutMetadata.hireSummary}</p>
            <ul><li>Curriculum-organized content systems</li><li>Teacher-resource research and curation</li><li>Educational product and visual design</li></ul>
            {aboutMetadata.contactUrl && <a className="hire-button" href={aboutMetadata.contactUrl}>{aboutMetadata.contactLabel || "Get in touch"}</a>}
          </aside>
        </section>
      </div>
    </SiteShell>
  );
}
