"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GradeKey } from "@/lib/grade-routes";
import { CAST, type CastKey } from "@/lib/cast";
import type { GradePathItem } from "../builder/CurriculumTemplates";
import styles from "./GradeInteractionLane.module.css";
import {
  GradeCurriculumPanel,
  GradePlannerPanel,
  GradeResourcesPanel,
  GradeSearchPanel,
  GradeTodayPanel,
} from "./GradePanels";

export type GradeInteractionSection =
  "today" | "curriculum" | "planner" | "resources" | "search";
export type GradeInteractionConfig = {
  gradeKey: GradeKey;
  grade: string;
  age: string;
  reminder: string;
  eyebrow: string;
  headline: string;
  accentHeadline: string;
  teacher: CastKey;
  leadQuote: string;
  variant?: "standard" | "daycare";
};
export type GradeInteractionLaneProps = {
  config: GradeInteractionConfig;
  summary: string;
  items: GradePathItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onPreview?: () => void;
  /** Use h2 when the real control is embedded in a branded reference page. */
  headingLevel?: "h1" | "h2";
};

type GradeWorkspaceProps = {
  grade: GradeKey;
  gradeLabel: string;
  age: string;
  reminder: string;
  variant?: "standard" | "daycare";
  navigation: React.ReactNode;
  children: React.ReactNode;
};

export function GradeWorkspace({
  grade,
  gradeLabel,
  age,
  reminder,
  variant,
  navigation,
  children,
}: GradeWorkspaceProps) {
  return (
    <div
      className={`${styles.board} material-surface material-cardboard-paper ${variant === "daycare" ? styles.daycareBoard : styles.standardBoard}`}
      data-grade={grade}
      data-grade-template={grade}
      data-style-scope="grade-workspace"
    >
      <aside className={`${styles.rail} material-surface material-cork`} aria-label={`${gradeLabel} lesson workspace`}>
        <div className={`${styles.identity} grade-surface`}>
          <span className={`${styles.identityFastener} brand-asset fastener-sewing-button icon-micro`} aria-hidden="true" />
          <span>Lesson workspace</span>
          <strong>{gradeLabel}</strong>
          <small>{age}</small>
        </div>
        {navigation}
        <div className={styles.reminder}>
          <span className="brand-asset fastener-push-pin icon-small" aria-hidden="true" />
          <span>Planning reminder</span>
          <strong>{reminder}</strong>
        </div>
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}

const sections: Array<{ id: GradeInteractionSection; label: string }> = [
  { id: "today", label: "Today" },
  { id: "curriculum", label: "Curriculum" },
  { id: "planner", label: "Planner" },
  { id: "resources", label: "Resources" },
  { id: "search", label: "Search" },
];
export function GradeWelcomeControl({
  config,
  summary,
  primaryHref,
  onBrowse,
  onPreview,
  headingLevel: Heading = "h1",
}: {
  config: GradeInteractionConfig;
  summary: string;
  primaryHref?: string;
  onBrowse?: () => void;
  onPreview?: () => void;
  /** Branding embeds this real control under the route's single page-level h1. */
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section
      className={`${styles.welcome} grid min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)] [&>*]:min-w-0 ${config.variant === "daycare" ? styles.daycareWelcome : ""}`}
    >
      <div className={styles.welcomeCopy}>
        <span className={styles.eyebrow}>{config.eyebrow}</span>
        <Heading>
          {config.headline} <em>{config.accentHeadline}</em>
        </Heading>
        <p>{summary}</p>
        <div className={styles.actions}>
          {primaryHref ? (
            <Button asChild className={`${styles.primaryAction} grade-surface`}>
              <Link href={primaryHref}>Build this lesson</Link>
            </Button>
          ) : onPreview ? (
            <Button
              variant="default"
              type="button"
              className={`${styles.primaryAction} grade-surface`}
              onClick={onPreview}
            >
              Preview the story
            </Button>
          ) : null}
          <Button
            variant="outline"
            type="button"
            className={styles.paperAction}
            onClick={onBrowse}
          >
            Browse learning paths
          </Button>
        </div>
      </div>
      <PersistentTeacherQuote config={config} />
    </section>
  );
}

export function TeacherNote({
  character,
  quote,
  actionHref,
  actionLabel = "Open lesson workspace",
}: {
  character: CastKey;
  quote: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const teacher = CAST[character];
  return (
    <aside
      className={styles.teacherQuote}
      aria-label={`A note from ${teacher.name}`}
    >
      <Card
        className={`${styles.teacherCard} cast-${character} character-surface`}
      >
        <span className={`${styles.teacherFastener} brand-asset fastener-binder-clip icon-small`} aria-hidden="true" />
        <CardHeader className={styles.teacherCardHeader}>
          <CardTitle className={styles.teacherCardTitle}>
            A note from {teacher.name}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.teacherCardContent}>
          <blockquote>{`"${quote}"`}</blockquote>
          <p className={styles.teacherIdentity}>{teacher.name} · teaching note</p>
          {actionHref ? <Link className={styles.teacherNoteAction} href={actionHref}>{actionLabel}</Link> : null}
          <Image
            src={teacher.portrait}
            width={220}
            height={220}
            alt={teacher.name}
            className={styles.teacherImage}
            priority
          />
        </CardContent>
      </Card>
    </aside>
  );
}

function PersistentTeacherQuote({ config }: { config: GradeInteractionConfig }) {
  return <TeacherNote character={config.teacher} quote={config.leadQuote} />;
}

export function GradeInteractionLane({
  config,
  summary,
  items,
  activeIndex = 0,
  onSelect,
  onPreview,
  headingLevel = "h1",
}: GradeInteractionLaneProps) {
  const [section, setSection] = useState<GradeInteractionSection>("today");
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const chooseItem = (index: number) => {
    setSelectedIndex(index);
    onSelect?.(index);
  };
  const moveSectionFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    const currentIndex = sections.findIndex((entry) => entry.id === section);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % sections.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = sections.length - 1;
    else return;

    event.preventDefault();
    const nextSection = sections[nextIndex].id;
    setSection(nextSection);
    requestAnimationFrame(() =>
      document.getElementById(`${config.gradeKey}-${nextSection}-tab`)?.focus(),
    );
  };
  const panel =
    section === "today" ? (
      <GradeTodayPanel
        config={config}
        summary={summary}
        items={items}
        selectedIndex={selectedIndex}
        onChoose={chooseItem}
        onSection={setSection}
        headingLevel={headingLevel}
        welcome={
          <GradeWelcomeControl
            config={config}
            summary={summary}
            primaryHref={(items[selectedIndex] ?? items[0])?.href}
            onBrowse={() => setSection("curriculum")}
            onPreview={onPreview}
            headingLevel={headingLevel}
          />
        }
      />
    ) : section === "curriculum" ? (
      <GradeCurriculumPanel
        config={config}
        items={items}
        selectedIndex={selectedIndex}
        onChoose={chooseItem}
        onSection={setSection}
      />
    ) : section === "planner" ? (
      <GradePlannerPanel
        config={config}
        item={items[selectedIndex] ?? items[0]}
        onSection={setSection}
      />
    ) : section === "resources" ? (
      <GradeResourcesPanel config={config} items={items} onChoose={chooseItem} />
    ) : (
      <GradeSearchPanel config={config} onSection={setSection} />
    );
  const panelId = `${config.gradeKey}-grade-panel`;
  return (
    <Tabs
      value={section}
      onValueChange={(value) => setSection(value as GradeInteractionSection)}
      orientation="vertical"
      asChild
    >
      <GradeWorkspace
        grade={config.gradeKey}
        gradeLabel={config.grade}
        age={config.age}
        reminder={config.reminder}
        variant={config.variant}
        navigation={
          <TabsList
            className={styles.railNav}
            aria-label={`${config.grade} lesson tools`}
            onKeyDown={moveSectionFocus}
            asChild
          >
            <nav>
              {sections.map((entry) => (
                <TabsTrigger
                  key={entry.id}
                  value={entry.id}
                  id={`${config.gradeKey}-${entry.id}-tab`}
                  className={`${styles.railButton} material-surface material-cardboard-paper ${section === entry.id ? styles.railButtonActive : ""}`}
                >
                  <span className={`${styles.railFastener} brand-asset fastener-sewing-button icon-micro`} aria-hidden="true" />
                  <span>{entry.label}</span>
                </TabsTrigger>
              ))}
            </nav>
          </TabsList>
        }
      >
          <div className={styles.panelFrame}>
            <TabsContent value={section} asChild>
              <section
                key={section}
                id={panelId}
                aria-label={`${config.grade} ${section} panel`}
                tabIndex={-1}
                className={styles.panel}
              >
                {panel}
              </section>
            </TabsContent>
          </div>
      </GradeWorkspace>
    </Tabs>
  );
}
