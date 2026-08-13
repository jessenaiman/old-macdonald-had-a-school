import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./BrandSystemExamples.module.css";

export function LessonTypographyExample() {
  return <article className={styles.lessonSheet}>
    <span className="brand-asset fastener-masking-tape icon-medium" aria-hidden="true" />
    <div>
      <p className={styles.eyebrow}>Grade 1 · language and drama</p>
      <h3>Build a story together.<em>Then make room to perform it.</em></h3>
      <p className={styles.bodyCopy}>Display type names the learning invitation. Handwriting adds one short human cue. The body face carries instructions at a comfortable measure and line height.</p>
      <div className={styles.lessonActions}><Button>Build this lesson</Button><Button variant="outline">Browse learning paths</Button></div>
    </div>
    <aside className={styles.taskNote}><strong>Typography recipe</strong><p>One display heading, one handwritten emphasis, and readable body copy. Do not use handwriting for instructions or controls.</p><code>heading · note · body</code></aside>
  </article>;
}

export function CharacterActionExample() {
  return <article className={styles.teacherNote}>
    <div className={styles.teacherPortrait}><Image src="/staff_and_students/mr-maisy-transparent-circle.png" alt="Mr Maisy" fill sizes="(max-width: 760px) 100vw, 32vw" /></div>
    <div className={styles.teacherCopy}><p className={styles.eyebrow}>Orange family · Grade 2 movement</p><blockquote>“Choose a way to move that feels strong and safe.”</blockquote><small>Character colour stays local to Mr Maisy&apos;s note. The action labels remain direct, readable controls; the portrait remains unchanged.</small><div className={styles.teacherActions}><Button variant="secondary">Start movement plan</Button><Button variant="outline">Read safety notes</Button></div></div>
  </article>;
}

export function PlanningControlsExample() {
  return <article className={styles.planningBoard}>
    <span className="brand-asset fastener-binder-clip icon-medium" aria-hidden="true" />
    <div className={styles.planningPaper}>
      <header className={styles.planningHeader}><div><p className={styles.eyebrow}>Reusable planning station</p><h3>Find and shape a lesson</h3></div><Button variant="outline">Clear choices</Button></header>
      <div className={styles.formRow}><label className={styles.field}>Teaching goal<Input placeholder="Rhythm, counting, or plants" /></label><label className={styles.field}>Grade<NativeSelect defaultValue="grade-two"><option value="daycare">Daycare</option><option value="kindergarten">Kindergarten</option><option value="grade-one">Grade 1</option><option value="grade-two">Grade 2</option></NativeSelect></label><Button>Find lessons</Button></div>
      <Tabs className={styles.planningTabs} defaultValue="today"><TabsList><TabsTrigger value="today">Today</TabsTrigger><TabsTrigger value="curriculum">Curriculum</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger></TabsList><TabsContent value="today">Begin with a familiar song, name the learning goal, then choose one clear participation pathway.</TabsContent><TabsContent value="curriculum">Connections belong beside the teaching sequence, not hidden inside decorative cards.</TabsContent><TabsContent value="notes">Use this space for short planning reminders that remain readable when printed.</TabsContent></Tabs>
      <Collapsible className={styles.disclosure}><CollapsibleTrigger>Why these controls belong together <span aria-hidden="true">+</span></CollapsibleTrigger><CollapsibleContent>Search, grade selection, planning views, and optional rationale form one teacher task. The cork, paper, and clip explain their physical relationship without replacing semantic controls.</CollapsibleContent></Collapsible>
    </div>
  </article>;
}
