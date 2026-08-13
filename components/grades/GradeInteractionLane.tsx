"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gradeSearchHref, type GradeKey } from "@/lib/grade-routes";
import { CAST, type CastKey } from "@/lib/cast";
import type { GradePathItem } from "../builder/CurriculumTemplates";
import styles from "./GradeInteractionLane.module.css";

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
      className={`${styles.board} ${variant === "daycare" ? styles.daycareBoard : styles.standardBoard}`}
      data-grade={grade}
      data-grade-template={grade}
      data-style-scope="grade-workspace"
    >
      <aside className={styles.rail} aria-label={`${gradeLabel} lesson workspace`}>
        <div className={styles.identity}>
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
const daycarePathways = [
  ["Story & songs", "Books, songs, and rhymes"],
  ["Explore & discover", "Hands-on play, sensory fun"],
  ["Create & express", "Art, movement, pretend play"],
  ["Care & connect", "Feelings, friends, routines"],
];
const fallbackIcons = [
  "drama-storytelling-icon",
  "math-building-icon",
  "gardening-health-icon",
  "art-photography-icon",
];
const fasteners = [
  "fastener-paperclip",
  "fastener-masking-tape",
  "fastener-push-pin",
];
const itemIcon = (item: GradePathItem | undefined, index: number) =>
  item?.icon || fallbackIcons[index % fallbackIcons.length];

function PanelHeading({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
}) {
  return (
    <header className={styles.panelHeading}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {summary ? <p>{summary}</p> : null}
    </header>
  );
}

function LessonCard({
  item,
  index,
  active,
  onChoose,
}: {
  item: GradePathItem;
  index: number;
  active: boolean;
  onChoose: (index: number) => void;
}) {
  const body = (
    <>
      <span className={styles.cardNumber}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`${styles.cardIcon} brand-asset ${itemIcon(item, index)} icon-medium`}
        aria-hidden="true"
      />
      <span className={styles.cardKicker}>{item.kicker}</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <span className={styles.cardAction}>
        {item.href ? "View lesson" : "Choose path"}
      </span>
    </>
  );
  const className = `${styles.lessonCard} ${active ? styles.lessonCardActive : ""}`;
  return item.href ? (
    <Link
      href={item.href}
      className={className}
      onClick={() => onChoose(index)}
    >
      {body}
    </Link>
  ) : (
    <Button
      variant="ghost"
      type="button"
      className={className}
      aria-pressed={active}
      onClick={() => onChoose(index)}
    >
      {body}
    </Button>
  );
}

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
            <Link href={primaryHref} className={styles.primaryAction}>
              Build this lesson
            </Link>
          ) : onPreview ? (
            <Button
              variant="ghost"
              type="button"
              className={styles.primaryAction}
              onClick={onPreview}
            >
              Preview the story
            </Button>
          ) : null}
          <Button
            variant="ghost"
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

function TodayPanel({
  config,
  summary,
  items,
  selectedIndex,
  onChoose,
  onSection,
  onPreview,
  headingLevel = "h1",
}: {
  config: GradeInteractionConfig;
  summary: string;
  items: GradePathItem[];
  selectedIndex: number;
  onChoose: (index: number) => void;
  onSection: (section: GradeInteractionSection) => void;
  onPreview?: () => void;
  headingLevel?: "h1" | "h2";
}) {
  const selected = items[selectedIndex] ?? items[0];
  return (
    <>
      <GradeWelcomeControl
        config={config}
        summary={summary}
        primaryHref={selected?.href}
        onBrowse={() => onSection("curriculum")}
        onPreview={onPreview}
        headingLevel={headingLevel}
      />
      {config.variant === "daycare" ? (
        <div className={styles.daycareRibbon} aria-label="Daycare pathways">
          {daycarePathways.map(([label, detail], index) => (
            <Button
              variant="ghost"
              type="button"
              key={label}
              className={styles.daycarePathway}
              onClick={() => {
                onChoose(index % Math.max(items.length, 1));
                onSection("curriculum");
              }}
            >
              <span
                className={`brand-asset ${itemIcon(items[index], index)} icon-medium`}
                aria-hidden="true"
              />
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
            </Button>
          ))}
        </div>
      ) : null}
      <div className={styles.sectionHeader}>
        <PanelHeading
          eyebrow="Pick a starting point"
          title={`Learning paths for ${config.grade}`}
        />
        <Button
          variant="ghost"
          type="button"
          className={styles.textButton}
          onClick={() => onSection("resources")}
        >
          {"See all resources ->"}
        </Button>
      </div>
      <div className={styles.lessonGrid}>
        {items.slice(0, 4).map((item, index) => (
          <LessonCard
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            active={index === selectedIndex}
            onChoose={onChoose}
          />
        ))}
      </div>
      <div className={styles.planningStrip}>
        <span className={styles.eyebrow}>Today&apos;s planning board</span>
        <strong>Invite a choice and notice the story.</strong>
        <Button
          variant="ghost"
          type="button"
          className={styles.textButton}
          onClick={() => onSection("planner")}
        >
          {"Open planner ->"}
        </Button>
      </div>
    </>
  );
}

export function TeacherNote({
  character,
  quote,
}: {
  character: CastKey;
  quote: string;
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
        <CardHeader className={styles.teacherCardHeader}>
          <CardTitle className={styles.teacherCardTitle}>
            A note from {teacher.name}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.teacherCardContent}>
          <blockquote>{`"${quote}"`}</blockquote>
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

function CurriculumPanel({
  config,
  items,
  selectedIndex,
  onChoose,
  onSection,
}: {
  config: GradeInteractionConfig;
  items: GradePathItem[];
  selectedIndex: number;
  onChoose: (index: number) => void;
  onSection: (section: GradeInteractionSection) => void;
}) {
  const selected = items[selectedIndex] ?? items[0];
  return (
    <>
      <PanelHeading
        eyebrow="Curriculum - topic overview"
        title={`${config.grade} learning paths`}
        summary="Choose a topic, then shape the lesson around the learners who will meet it."
      />
      <section className={styles.featuredGoal} aria-label="Featured topic goal">
        <div>
          <span className={styles.eyebrow}>Featured topic goal</span>
          <h3>{selected?.title ?? "Choose a lesson to begin"}</h3>
          <p>
            {selected?.summary ??
              "Open a learning path to load the current goal."}
          </p>
        </div>
        <Button
          variant="ghost"
          type="button"
          className={styles.paperAction}
          onClick={() => onSection("planner")}
        >
          Plan this topic
        </Button>
      </section>
      <div className={styles.sequenceHeading}>
        <span className={styles.eyebrow}>Lesson sequence</span>
        <span>{items.length} lessons</span>
      </div>
      <div className={styles.sequenceList}>
        {items.map((item, index) => (
          <LessonCard
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            active={index === selectedIndex}
            onChoose={onChoose}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        type="button"
        className={styles.backButton}
        onClick={() => onSection("today")}
      >
        {"<- Back to today"}
      </Button>
    </>
  );
}

function PlannerPanel({
  config,
  item,
  onSection,
}: {
  config: GradeInteractionConfig;
  item?: GradePathItem;
  onSection: (section: GradeInteractionSection) => void;
}) {
  const notes = [
    ["Set a goal", "Name the one thing learners might notice, try, or share."],
    [
      "Gather what helps",
      "Leave room for the materials, song, book, or visual support.",
    ],
    [
      "Prepare your plan",
      "Carry forward what children showed you and one next step.",
    ],
  ];
  return (
    <>
      <PanelHeading
        eyebrow="Planner"
        title="Prepare one helpful next step"
        summary={`A quiet place to gather what ${config.grade} learners need before the lesson begins.`}
      />
      <div className={styles.plannerGoal}>
        <div>
          <span className={styles.eyebrow}>Current lesson goal</span>
          <h3>{item?.title ?? "Choose a lesson to begin"}</h3>
          <p>
            {item?.summary ??
              "Open a learning path above to load the current goal."}
          </p>
        </div>
        {item?.href ? (
          <Link href={item.href} className={styles.primaryAction}>
            Open lesson
          </Link>
        ) : (
          <Button
            variant="ghost"
            type="button"
            className={styles.primaryAction}
            onClick={() => onSection("curriculum")}
          >
            Choose a lesson
          </Button>
        )}
      </div>
      <div
        className={styles.noteGrid}
        aria-label={`${config.grade} planning notes`}
      >
        {notes.map(([label, prompt], index) => (
          <article className={styles.noteSheet} key={label}>
            <span
              className={`${styles.fastener} brand-asset ${fasteners[index]} icon-small`}
              aria-hidden="true"
            />
            <span>{label}</span>
            <p>{prompt}</p>
            <div className={styles.noteLines} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>
        ))}
      </div>
      <div className={styles.plannerFooter}>
        <span>Planning reminder</span>
        <strong>{config.reminder}</strong>
        <Button
          variant="ghost"
          type="button"
          className={styles.textButton}
          onClick={() => onSection("today")}
        >
          {"Return to today ->"}
        </Button>
      </div>
    </>
  );
}

function ResourcesPanel({
  config,
  items,
  onChoose,
}: {
  config: GradeInteractionConfig;
  items: GradePathItem[];
  onChoose: (index: number) => void;
}) {
  return (
    <>
      <PanelHeading
        eyebrow="Resources"
        title="Gather what helps"
        summary="Open an existing lesson to find its starting point and supporting materials."
      />
      <div className={styles.resourceGrid}>
        {items.map((item, index) => (
          <LessonCard
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            active={false}
            onChoose={onChoose}
          />
        ))}
      </div>
      <div className={styles.resourceFooter}>
        <span>Related to {config.grade}</span>
        <strong>Use the lesson sequence to keep the work close at hand.</strong>
      </div>
    </>
  );
}

function SearchPanel({
  config,
  items,
  onSection,
}: {
  config: GradeInteractionConfig;
  items: GradePathItem[];
  onSection: (section: GradeInteractionSection) => void;
}) {
  const cues = [
    "lesson resources",
    ...items.map((item) => item.title),
    ...items.map((item) => item.kicker),
  ];
  const uniqueCues = [...new Set(cues)].slice(0, 6);

  return (
    <>
      <PanelHeading
        eyebrow="Search this grade"
        title={`Find ${config.grade} resources`}
        summary="Choose a cue to search the complete resource collection while keeping this grade filter applied."
      />
      <section
        className={styles.searchBoard}
        aria-label={`${config.grade} search cues`}
      >
        <span
          className={`${styles.searchFastener} brand-asset fastener-paperclip icon-medium`}
          aria-hidden="true"
        />
        <div>
          <span className={styles.eyebrow}>Current grade</span>
          <h3>{config.grade}</h3>
          <p>
            Every cue opens the shared search with this grade already selected.
          </p>
        </div>
        <div className={styles.searchCueGrid}>
          {uniqueCues.map((cue) => (
            <Link
              key={cue}
              className={styles.searchCue}
              href={gradeSearchHref(config.gradeKey, cue)}
            >
              {cue}
            </Link>
          ))}
        </div>
      </section>
      <Button
        variant="ghost"
        type="button"
        className={styles.backButton}
        onClick={() => onSection("today")}
      >
        {"<- Back to today"}
      </Button>
    </>
  );
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
      <TodayPanel
        config={config}
        summary={summary}
        items={items}
        selectedIndex={selectedIndex}
        onChoose={chooseItem}
        onSection={setSection}
        onPreview={onPreview}
        headingLevel={headingLevel}
      />
    ) : section === "curriculum" ? (
      <CurriculumPanel
        config={config}
        items={items}
        selectedIndex={selectedIndex}
        onChoose={chooseItem}
        onSection={setSection}
      />
    ) : section === "planner" ? (
      <PlannerPanel
        config={config}
        item={items[selectedIndex] ?? items[0]}
        onSection={setSection}
      />
    ) : section === "resources" ? (
      <ResourcesPanel config={config} items={items} onChoose={chooseItem} />
    ) : (
      <SearchPanel config={config} items={items} onSection={setSection} />
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
                  className={`${styles.railButton} ${section === entry.id ? styles.railButtonActive : ""}`}
                >
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
