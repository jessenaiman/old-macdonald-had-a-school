"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GradePathItem } from "../builder/CurriculumTemplates";
import styles from "./GradeInteractionLane.module.css";

export type GradeInteractionSection = "today" | "curriculum" | "planner" | "resources";
export type GradeInteractionConfig = {
  gradeKey: string; grade: string; age: string; badge: string; reminder: string;
  eyebrow: string; headline: string; accentHeadline: string; leadName: string;
  leadImage: string; leadQuote: string; identityColor: string; identityInk?: string;
  identityTexture: string;
  variant?: "standard" | "daycare";
};
export type GradeInteractionLaneProps = {
  config: GradeInteractionConfig; summary: string; items: GradePathItem[];
  activeIndex?: number; onSelect?: (index: number) => void; onPreview?: () => void;
};

const sections: Array<{ id: GradeInteractionSection; number: string; label: string }> = [
  { id: "today", number: "01", label: "Today" },
  { id: "curriculum", number: "02", label: "Curriculum" },
  { id: "planner", number: "03", label: "Planner" },
  { id: "resources", number: "04", label: "Resources" },
];
const daycarePathways = [["Story & songs", "Books, songs, and rhymes"], ["Explore & discover", "Hands-on play, sensory fun"], ["Create & express", "Art, movement, pretend play"], ["Care & connect", "Feelings, friends, routines"]];
const fallbackIcons = [
  "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
  "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
  "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png",
  "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png",
];
const fasteners = [
  "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png",
  "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png",
  "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png",
];
const itemIcon = (item: GradePathItem | undefined, index: number) => item?.icon || fallbackIcons[index % fallbackIcons.length];

function PanelHeading({ eyebrow, title, summary }: { eyebrow: string; title: string; summary?: string }) {
  return <header className={styles.panelHeading}><div><span className={styles.eyebrow}>{eyebrow}</span><h2>{title}</h2></div>{summary ? <p>{summary}</p> : null}</header>;
}

function LessonCard({ item, index, active, onChoose }: { item: GradePathItem; index: number; active: boolean; onChoose: (index: number) => void }) {
  const body = <><span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span><Image src={itemIcon(item, index)} alt="" width={76} height={76} className={styles.cardIcon} /><span className={styles.cardKicker}>{item.kicker}</span><h3>{item.title}</h3><p>{item.summary}</p><span className={styles.cardAction}>{item.href ? "View lesson" : "Choose path"}</span></>;
  const className = `${styles.lessonCard} ${active ? styles.lessonCardActive : ""}`;
  return item.href ? <Link href={item.href} className={className} onClick={() => onChoose(index)}>{body}</Link> : <Button variant="ghost" type="button" className={className} aria-pressed={active} onClick={() => onChoose(index)}>{body}</Button>;
}

function TodayPanel({ config, summary, items, selectedIndex, onChoose, onSection, onPreview }: { config: GradeInteractionConfig; summary: string; items: GradePathItem[]; selectedIndex: number; onChoose: (index: number) => void; onSection: (section: GradeInteractionSection) => void; onPreview?: () => void }) {
  const selected = items[selectedIndex] ?? items[0];
  return <>
    <div className={`${styles.welcome} ${config.variant === "daycare" ? styles.daycareWelcome : ""}`}>
      <div className={styles.welcomeCopy}><span className={styles.eyebrow}>{config.eyebrow}</span><h1>{config.headline} <em>{config.accentHeadline}</em></h1><p>{summary}</p><div className={styles.actions}>{selected?.href ? <Link href={selected.href} className={styles.primaryAction}>Build this lesson</Link> : onPreview ? <Button variant="ghost" type="button" className={styles.primaryAction} onClick={onPreview}>Preview the story</Button> : null}<Button variant="ghost" type="button" className={styles.paperAction} onClick={() => onSection("curriculum")}>Browse learning paths</Button></div></div>
    </div>
    {config.variant === "daycare" ? <div className={styles.daycareRibbon} aria-label="Daycare pathways">{daycarePathways.map(([label, detail], index) => <Button variant="ghost" type="button" key={label} className={styles.daycarePathway} onClick={() => { onChoose(index % Math.max(items.length, 1)); onSection("curriculum"); }}><Image src={itemIcon(items[index], index)} alt="" width={48} height={48} /><span><strong>{label}</strong><small>{detail}</small></span></Button>)}</div> : null}
    <div className={styles.sectionHeader}><PanelHeading eyebrow="Pick a starting point" title={`Learning paths for ${config.grade}`} /><Button variant="ghost" type="button" className={styles.textButton} onClick={() => onSection("resources")}>See all resources →</Button></div>
    <div className={styles.lessonGrid}>{items.slice(0, 4).map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={index === selectedIndex} onChoose={onChoose} />)}</div>
    <div className={styles.planningStrip}><span className={styles.eyebrow}>Today&apos;s planning board</span><strong>Invite a choice and notice the story.</strong><Button variant="ghost" type="button" className={styles.textButton} onClick={() => onSection("planner")}>Open planner →</Button></div>
  </>;
}

function PersistentTeacherQuote({ config }: { config: GradeInteractionConfig }) {
  return (
    <aside className={styles.teacherQuote} aria-label={`A note from ${config.leadName}`}>
      <Card className={styles.teacherCard} style={{ backgroundImage: `url("${config.identityTexture}")` }}>
        <CardHeader className={styles.teacherCardHeader}>
          <CardTitle className={styles.teacherCardTitle}>A note from {config.leadName}</CardTitle>
        </CardHeader>
        <CardContent className={styles.teacherCardContent}>
          <blockquote>“{config.leadQuote}”</blockquote>
          <Image src={config.leadImage} width={220} height={220} alt={config.leadName} className={styles.teacherImage} priority />
        </CardContent>
      </Card>
    </aside>
  );
}

function CurriculumPanel({ config, items, selectedIndex, onChoose, onSection }: { config: GradeInteractionConfig; items: GradePathItem[]; selectedIndex: number; onChoose: (index: number) => void; onSection: (section: GradeInteractionSection) => void }) {
  const selected = items[selectedIndex] ?? items[0];
  return <><PanelHeading eyebrow="Curriculum · topic overview" title={`${config.grade} learning paths`} summary="Choose a topic, then shape the lesson around the learners who will meet it." /><section className={styles.featuredGoal} aria-label="Featured topic goal"><div><span className={styles.eyebrow}>Featured topic goal</span><h3>{selected?.title ?? "Choose a lesson to begin"}</h3><p>{selected?.summary ?? "Open a learning path to load the current goal."}</p></div><Button variant="ghost" type="button" className={styles.paperAction} onClick={() => onSection("planner")}>Plan this topic</Button></section><div className={styles.sequenceHeading}><span className={styles.eyebrow}>Lesson sequence</span><span>{items.length} lessons</span></div><div className={styles.sequenceList}>{items.map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={index === selectedIndex} onChoose={onChoose} />)}</div><Button variant="ghost" type="button" className={styles.backButton} onClick={() => onSection("today")}>← Back to today</Button></>;
}

function PlannerPanel({ config, item, onSection }: { config: GradeInteractionConfig; item?: GradePathItem; onSection: (section: GradeInteractionSection) => void }) {
  const notes = [["Set a goal", "Name the one thing learners might notice, try, or share."], ["Gather what helps", "Leave room for the materials, song, book, or visual support."], ["Prepare your plan", "Carry forward what children showed you and one next step."]];
  return <><PanelHeading eyebrow="Planner" title="Prepare one helpful next step" summary={`A quiet place to gather what ${config.grade} learners need before the lesson begins.`} /><div className={styles.plannerGoal}><div><span className={styles.eyebrow}>Current lesson goal</span><h3>{item?.title ?? "Choose a lesson to begin"}</h3><p>{item?.summary ?? "Open a learning path above to load the current goal."}</p></div>{item?.href ? <Link href={item.href} className={styles.primaryAction}>Open lesson</Link> : <Button variant="ghost" type="button" className={styles.primaryAction} onClick={() => onSection("curriculum")}>Choose a lesson</Button>}</div><div className={styles.noteGrid} aria-label={`${config.grade} planning notes`}>{notes.map(([label, prompt], index) => <article className={styles.noteSheet} key={label}><Image src={fasteners[index]} width={30} height={30} alt="" className={styles.fastener} /><span>{label}</span><p>{prompt}</p><div className={styles.noteLines} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div></article>)}</div><div className={styles.plannerFooter}><span>Planning reminder</span><strong>{config.reminder}</strong><Button variant="ghost" type="button" className={styles.textButton} onClick={() => onSection("today")}>Return to today →</Button></div></>;
}

function ResourcesPanel({ config, items, onChoose }: { config: GradeInteractionConfig; items: GradePathItem[]; onChoose: (index: number) => void }) {
  return <><PanelHeading eyebrow="Resources" title="Gather what helps" summary="Open an existing lesson to find its starting point and supporting materials." /><div className={styles.resourceGrid}>{items.map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={false} onChoose={onChoose} />)}</div><div className={styles.resourceFooter}><span>Related to {config.grade}</span><strong>Use the lesson sequence to keep the work close at hand.</strong></div></>;
}

export function GradeInteractionLane({ config, summary, items, activeIndex = 0, onSelect, onPreview }: GradeInteractionLaneProps) {
  const [section, setSection] = useState<GradeInteractionSection>("today");
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const panelId = `${config.gradeKey}-grade-panel`;
  const identityStyle = { "--identity-color": config.identityColor, "--identity-ink": config.identityInk ?? "#fffaf0" } as CSSProperties;
  const identityThread = config.identityTexture.replace("/felt/felt-", "/thread-overlays/thread-overlay-");
  const chooseItem = (index: number) => { setSelectedIndex(index); onSelect?.(index); };
  const moveSectionFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    const currentIndex = sections.findIndex((entry) => entry.id === section);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % sections.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = sections.length - 1;
    else return;

    event.preventDefault();
    const nextSection = sections[nextIndex].id;
    setSection(nextSection);
    requestAnimationFrame(() => document.getElementById(`${config.gradeKey}-${nextSection}-tab`)?.focus());
  };
  const panel = section === "today" ? <TodayPanel config={config} summary={summary} items={items} selectedIndex={selectedIndex} onChoose={chooseItem} onSection={setSection} onPreview={onPreview} /> : section === "curriculum" ? <CurriculumPanel config={config} items={items} selectedIndex={selectedIndex} onChoose={chooseItem} onSection={setSection} /> : section === "planner" ? <PlannerPanel config={config} item={items[selectedIndex] ?? items[0]} onSection={setSection} /> : <ResourcesPanel config={config} items={items} onChoose={chooseItem} />;
  return <Tabs value={section} onValueChange={(value) => setSection(value as GradeInteractionSection)} orientation="vertical" asChild>
  <div className={`${styles.board} ${config.variant === "daycare" ? styles.daycareBoard : styles.standardBoard}`} data-grade-template={config.gradeKey} style={identityStyle}>
    <aside className={styles.rail} style={{ backgroundImage: `url("${identityThread}"), url("${config.identityTexture}")` }} aria-label={`${config.grade} lesson workspace`}><div className={styles.identity}><span>Lesson workspace</span><strong>{config.grade}</strong><small>{config.age}</small></div><TabsList className={styles.railNav} aria-label={`${config.grade} lesson tools`} onKeyDown={moveSectionFocus} asChild><nav>{sections.map((entry) => <TabsTrigger key={entry.id} value={entry.id} id={`${config.gradeKey}-${entry.id}-tab`} className={`${styles.railButton} ${section === entry.id ? styles.railButtonActive : ""}`}><b>{entry.number}</b><span>{entry.label}</span></TabsTrigger>)}</nav></TabsList><div className={styles.reminder}><Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" width={28} height={28} alt="" /><span>Planning reminder</span><strong>{config.reminder}</strong></div></aside>
    <main className={styles.main}><PersistentTeacherQuote config={config} /><div className={styles.panelFrame}><TabsContent value={section} asChild><section key={section} id={panelId} aria-label={`${config.grade} ${section} panel`} tabIndex={-1} className={styles.panel}>{panel}</section></TabsContent></div></main>
  </div>
  </Tabs>;
}
