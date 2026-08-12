"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { GradeLessonGrid, type GradeLesson } from "./GradeLessonGrid";
import { CLUSTERS, clusterFor } from "./SubjectDiscovery";
import type { GradeMeta } from "../lib/grades";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GradeDirectoryPage({
  meta,
  lessons,
}: {
  meta: GradeMeta;
  lessons: GradeLesson[];
}) {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const readyCount = lessons.filter((l) => l.ready).length;
  const printableCount = lessons.filter((l) => l.hasPrintables).length;
  const filtered = useMemo(
    () => (activeCluster ? lessons.filter((l) => clusterFor(l.subject) === activeCluster) : lessons),
    [lessons, activeCluster]
  );
  const planningCue = meta.key === "grade-one"
    ? "Think, create, and share with purpose."
    : "Ask deeper, solve bigger, and learn together.";

  return (
    <Tabs value={activeCluster ?? "all"} onValueChange={(value) => setActiveCluster(value === "all" ? null : value)} orientation="vertical" asChild>
    <section className={`gb-page gb-${meta.key}`}>
      <aside className="gb-rail" aria-label={`${meta.label} planning sections`}>
        <Image className="gb-rail-grade-badge" src={`/brand-kit-icon-sheets/individual-icons/grade-${meta.key === "grade-one" ? "1" : "2"}.png`} alt="" width={64} height={64} />
        <p className="gb-rail-kicker">Old MacDonald’s<br />Farm School</p>
        <h2>{meta.label}</h2>
        <small>{meta.ageRange}</small>
        <nav className="gb-rail-nav">
          <a href="#grade-today"><b>01</b> Today</a>
          <a href="#grade-curriculum"><b>02</b> Curriculum</a>
          <a href="#grade-planner"><b>03</b> Planner</a>
          <a href="#grade-resources"><b>04</b> Resources</a>
        </nav>
        <div className="gb-rail-note">
          <span>Planning reminder</span>
          <strong>{planningCue}</strong>
        </div>
      </aside>
      <div className="gb-stage">
      <section className="gb-hero stitch" id="grade-today">
        <div className="gb-hero-content">
          <span className="gb-hero-eyebrow">{meta.eyebrow}</span>
          <h1>{meta.label}</h1>
          <p className="gb-hero-tagline">{meta.tagline}</p>
        </div>
      </section>

      <div className="gb-body" id="grade-curriculum">
        <div className="gb-main" id="grade-resources">
          <TabsContent value={activeCluster ?? "all"}>
            <GradeLessonGrid lessons={filtered} />
          </TabsContent>
        </div>
        <div className="gb-info" id="grade-planner">
          <div className="gb-about paper-panel stitch">
            <h2>About {meta.label}</h2>
            <p className="gb-about-note">A focused set of starting points for this stage of the school day, with clear next steps for planning.</p>
            <dl className="gb-stats">
              <div><dt>Age range</dt><dd>{meta.ageRange}</dd></div>
              <div><dt>Lessons</dt><dd>{lessons.length}</dd></div>
              <div><dt>Ready now</dt><dd>{readyCount}</dd></div>
              <div><dt>With printables</dt><dd>{printableCount}</dd></div>
            </dl>
          </div>
          <div className="gb-subjects paper-panel stitch">
            <h2>Subjects</h2>
            <TabsList className="gb-subjects-list" aria-label="Filter by subject">
                <TabsTrigger
                  value="all"
                  className={`gb-subject-row${!activeCluster ? " active" : ""}`}
                >
                  <span className="gb-subject-icon gb-subject-icon-all">{"•"}</span>
                  <span>All subjects</span>
                </TabsTrigger>
              {CLUSTERS.map((c) => (
                  <TabsTrigger
                    value={c.key}
                    className={`gb-subject-row tone-${c.tone}${activeCluster === c.key ? " active" : ""}`}
                    key={c.key}
                  >
                    <span className="gb-subject-icon">{c.icon}</span>
                    <span>{c.title}</span>
                  </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </div>
      </div>
    </section>
    </Tabs>
  );
}
