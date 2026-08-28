"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CHARACTERS, type CharacterKey } from "@/data/brand/characters-registry";
import { type GradeKey } from "@/lib/grade-routes";
import {
  GradeCurriculumPanel,
  GradePlannerPanel,
  GradeResourcesPanel,
  GradeSearchPanel,
  GradeTodayPanel,
} from "./GradePanels";
import type { GradePathItem } from "./types";

export type GradeInteractionSection =
  "today" | "curriculum" | "planner" | "resources" | "search";
export type GradeInteractionConfig = {
  gradeKey: GradeKey;
  grade: string;
  academicLead: string;
  age: string;
  reminder: string;
  eyebrow: string;
  headline: string;
  accentHeadline: string;
  teacher: CharacterKey;
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
  headingLevel?: "h1" | "h2";
};

const sections: Array<{ id: GradeInteractionSection; label: string }> = [
  { id: "today", label: "Today" },
  { id: "curriculum", label: "Curriculum" },
  { id: "planner", label: "Planner" },
  { id: "resources", label: "Resources" },
  { id: "search", label: "Search" },
];

/**
 * Grade-workspace shell. It combines grade metadata with shadcn Card and Tabs
 * compositions; the custom portion is the educational planning structure.
 */
export function GradeWorkspace({
  grade,
  gradeLabel,
  academicLead,
  age,
  teacher,
  reminder,
  navigation,
  children,
}: {
  grade: GradeKey;
  gradeLabel: string;
  academicLead: string;
  age: string;
  teacher: CharacterKey;
  reminder: string;
  variant?: "standard" | "daycare";
  navigation: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grade-workspace-stage working-wall-stage grid min-h-[calc(100dvh-5rem)] min-w-0 grid-cols-1 overflow-hidden text-foreground lg:grid-cols-[14rem_minmax(0,1fr)] print:block"
      data-grade={grade}
      data-grade-template={grade}
      data-style-scope="grade-workspace"
    >
      <aside
        className="grade-surface flex min-w-0 flex-col gap-3 p-3 lg:p-5 print:hidden"
        aria-label={`${gradeLabel} lesson workspace`}
      >
        <div className="grade-workspace-rail-header grade-surface relative grid justify-items-start gap-x-3 gap-y-1 rounded-lg p-3">
          <span
            className="brand-asset fastener-sewing-button icon-micro absolute right-2 -top-1"
            aria-hidden="true"
          />
          <span
            data-character={teacher}
            className="brand-asset character-face-bust icon-small"
            aria-hidden="true"
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Old MacDonald Had a School
          </span>
          <small className="max-w-[10rem] text-xs font-bold leading-tight">{academicLead}</small>

          <strong className="font-hand text-2xl leading-none">
            {gradeLabel}
          </strong>
          <small className="text-xs font-bold uppercase tracking-widest">
            {age}
          </small>
          <small className="text-xs font-semibold">{CHARACTERS[teacher].name}</small>
        </div>
        {navigation}
        <Card className="material-surface material-cardboard-paper relative mt-auto hidden lg:block bg-card text-card-foreground">
          <span
            className="brand-asset fastener-push-pin icon-small absolute -top-4 left-3"
            aria-hidden="true"
          />
          <CardHeader className="pt-8">
            <p className="text-xs font-black uppercase tracking-widest">
              Planning reminder
            </p>
            <CardTitle className="font-hand text-xl">{reminder}</CardTitle>
          </CardHeader>
        </Card>
      </aside>
      <div className="grade-workspace-stage-content min-w-0 p-2 sm:p-4 lg:p-6 print:p-0">{children}</div>
    </div>
  );
}

/**
 * Grade-specific welcome content built from standard Button and Card primitives.
 */
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
  headingLevel?: "h1" | "h2";
}) {
  const teacherColor = `var(--characters-${config.teacher}-color)`;
  return (
    <section className="grid min-w-0 grid-cols-1 items-center gap-6 border-b pb-6 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)] [&>*]:min-w-0" style={{ '--teacher-color': teacherColor } as React.CSSProperties}>
      <div className="flex min-w-0 flex-col items-start gap-4">
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {config.eyebrow}
        </span>
        <Heading className="max-w-3xl text-balance font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">
          {config.headline}{" "}
          <em className="block text-[color-mix(in_srgb,var(--teacher-color)_72%,black)] not-italic">
            {config.accentHeadline}
          </em>
        </Heading>
        <p className="max-w-2xl text-muted-foreground">{summary}</p>
        <div className="flex flex-wrap gap-3">
          {primaryHref ? (
            <Button asChild>
              <Link href={primaryHref}>Build this lesson</Link>
            </Button>
          ) : onPreview ? (
            <Button type="button" onClick={onPreview}>
              Preview the story
            </Button>
          ) : null}
          <Button variant="outline" type="button" onClick={onBrowse}>
            Browse learning paths
          </Button>
        </div>
      </div>
      <TeacherNote
        character={config.teacher}
        quote={config.leadQuote}
        actionHref={primaryHref ?? `/grade/${config.gradeKey}`}
        actionLabel="Open teacher note"
      />
    </section>
  );
}

/**
 * Displays a governed teacher identity and teaching note using a shadcn Card.
 */
export function TeacherNote({
  character,
  quote,
  actionHref,
  actionLabel = "Open lesson workspace",
}: {
  character: CharacterKey;
  quote: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const teacher = CHARACTERS[character];
  const teacherColor = `var(--characters-${character}-color)`;
  return (
    <aside aria-label={`A note from ${teacher.name}`}>
      <Card
        className={`characters-${character} character-surface material-surface material-felt relative overflow-hidden bg-card text-card-foreground`}
        style={{ '--teacher-color': teacherColor, '--teacher-foreground': `var(--characters-${character}-foreground)` } as React.CSSProperties}
      >
        <span
          className="brand-asset fastener-binder-clip icon-small absolute right-4 -top-1"
          aria-hidden="true"
        />
        <CardHeader className="relative z-10 pl-28 sm:pl-44">
          <CardTitle className="text-xs uppercase tracking-widest">
            A note from {teacher.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex min-h-40 flex-col items-start gap-3 pl-28 sm:pl-44">
          <blockquote className="font-hand text-2xl font-bold leading-tight sm:text-3xl text-[var(--teacher-foreground)]">
            “{quote}”
          </blockquote>
          <p className="text-xs font-black uppercase tracking-widest">
            {teacher.name} · teaching note
          </p>
          {actionHref ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
          <Image
            src={teacher.portrait}
            width={220}
            height={220}
            alt={teacher.name}
            className="absolute bottom-0 left-1 h-full w-24 object-contain object-bottom sm:w-40"
            preload
            sizes="(min-width: 640px) 10rem, 6rem"
          />
        </CardContent>
      </Card>
    </aside>
  );
}

/**
 * Coordinates grade tabs and content panels. It retains custom state only for
 * the selected grade path and panel; layout and controls are shadcn compositions.
 */
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
  const [tabsOrientation, setTabsOrientation] =
    useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    const desktopTabs = window.matchMedia("(min-width: 64rem)");
    const updateOrientation = () =>
      setTabsOrientation(desktopTabs.matches ? "vertical" : "horizontal");

    updateOrientation();
    desktopTabs.addEventListener("change", updateOrientation);
    return () => desktopTabs.removeEventListener("change", updateOrientation);
  }, []);

  const chooseItem = (index: number) => {
    setSelectedIndex(index);
    onSelect?.(index);
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
      <GradeResourcesPanel
        config={config}
        items={items}
        onChoose={chooseItem}
      />
    ) : (
      <GradeSearchPanel config={config} onSection={setSection} />
    );
  return (
    <Tabs
      value={section}
      onValueChange={(value) => setSection(value as GradeInteractionSection)}
      orientation={tabsOrientation}
    >
      <GradeWorkspace
        grade={config.gradeKey}
        gradeLabel={config.grade}
        academicLead={config.academicLead}
        age={config.age}
        teacher={config.teacher}
        reminder={config.reminder}
        variant={config.variant}
        navigation={
          <TabsList
            aria-label={`${config.grade} lesson tools`}
            className="flex h-auto min-h-11 w-full items-start gap-1 overflow-x-auto p-0 pb-2 bg-transparent lg:flex-col lg:items-stretch lg:overflow-visible lg:pb-0"
          >
            {sections.map((entry) => (
              <TabsTrigger
                key={entry.id}
                value={entry.id}
                className="min-h-11 shrink-0 justify-start gap-2 bg-background/75 text-foreground lg:w-full"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-[11px] font-black tabular-nums" aria-hidden="true">
                  {String(sections.indexOf(entry) + 1).padStart(2, "0")}
                </span>
                <span>{entry.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        }
      >
        <TabsContent value={section} className="mt-0 min-w-0" asChild>
          <section
            key={section}
            aria-label={`${config.grade} ${section} panel`}
          className="material-surface material-cardboard-paper flex min-h-full min-w-0 flex-col rounded-xl border p-3 shadow-sm sm:p-5"
          >
            {panel}
          </section>
        </TabsContent>
      </GradeWorkspace>
    </Tabs>
  );
}
