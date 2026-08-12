"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import type { CastRosterMember } from "@/lib/cast-roster";
import { globalClassNames as styles } from "@/lib/global-class-names";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradeInteractionLane } from "@/components/grades/GradeInteractionLane";
import { ResponsiveFeatureSplit } from "@/components/layout/ResponsiveFeatureSplit";
import { GRADE_INTERACTION_CONFIGS } from "@/components/grades/grade-config";
import { AssetPatternCatalogue, BrandSpecimenNav } from "@/components/cast/AssetPatternCatalogue";
import { CurriculumAssetGuide } from "@/components/cast/CurriculumAssetGuide";

const MATERIALS = [
  ["Felt", "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png", "Buttons, rails, and soft panels"],
  ["Woven fabric", "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-01-old-macdonald-tile.png", "Cloth fields and warm section backgrounds"],
  ["Construction paper", "/design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.png", "Lesson cards and cut-paper accents"],
  ["Cardboard", "/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png", "Readable notes and planning surfaces"],
  ["Cork", "/design-assets/cork-board-kit-v1/seamless-cork-tile.png", "Pinboards and working walls"],
] as const;

const FASTENERS = [
  ["Push pin", "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"],
  ["Paper clip", "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"],
  ["Binder clip", "/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.png"],
  ["Masking tape", "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png"],
  ["Sewing button", "/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png"],
] as const;

const CURRICULUM_ICONS = [
  ["Daycare", "/brand-kit-icon-sheets/individual-icons/grade-daycare.png"],
  ["Kindergarten", "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png"],
  ["Grade 1", "/brand-kit-icon-sheets/individual-icons/grade-1.png"],
  ["Music & dance", "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png"],
  ["Math & building", "/brand-kit-icon-sheets/individual-icons/subject-math-building.png"],
  ["Drama & storytelling", "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png"],
] as const;

const MATCHED_CAST_ASSETS: Record<string, readonly [string, string][]> = {
  "Old MacDonald": [["Kindergarten", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/13-kindergarten-schoolhouse.png"], ["Banjo", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/11-instrument-banjo-strap.png"], ["Community", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/03-community-schoolhouse-ribbon.png"]],
  "Miss Puddles": [["Daycare", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/01-daycare-stacking-blocks.png"], ["Early learning", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/07-early-learning-shape-blocks.png"], ["First painting", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/05-painting-handprint-dots.png"]],
  "Mr Rusty": [["Grade 1", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/04-grade-1-book-pencil.png"], ["Fiddle", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/01-instrument-fiddle-bow.png"], ["Dance", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/02-dance-turning-footprints.png"]],
  "Miss Hayley": [["Grade 1", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/14-grade-1-writing-slate-books.png"], ["Acting", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/04-acting-theatre-masks.png"], ["Stage", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/09-acting-stage-curtains.png"]],
  "Mr Sam": [["Math", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/13-math-abacus-ruler-block.png"], ["Measure", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/15-math-construction-measure.png"], ["Balance", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/14-math-balance-scale.png"]],
  "Mr Maisy": [["Grade 2", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/10-grade-2-balance-scale.png"], ["Physical play", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/19-physical-play-ball-rope.png"], ["Movement", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/20-physical-stepping-spots-beanbag.png"]],
  "Mr Puddles": [["Art", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/16-art-camera-brush.png"], ["Colour", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/18-art-color-wheel-frame.png"], ["Painting", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/20-painting-easel-brush-palette.png"]],
  "Miss Maisy": [["Preschool", "/brand-kit-icon-sheets/grade-variations-v2/individual-icons/12-preschool-sprout-counting-beads.png"], ["Gardening", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/23-garden-seed-packet-trowel.png"], ["Health", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/24-health-gingham-lunch.png"]],
  Hopper: [["Movement", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/02-dance-turning-footprints.png"], ["Physical play", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/20-physical-stepping-spots-beanbag.png"]],
  Whiskers: [["Lacing", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/09-early-learning-lacing-card.png"], ["Observe", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/16-art-camera-brush.png"]],
  Scout: [["Helping", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/02-community-helping-hands-heart.png"], ["Discovery", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/22-garden-watering-can-produce.png"]],
  Penny: [["Handbells", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/16-instrument-handbells-ribbon.png"], ["Music", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/03-music-note-single-eighth.png"]],
  Maisy: [["Encourage", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/02-community-helping-hands-heart.png"], ["Clap & move", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/07-dance-crossing-ribbons.png"]],
  Puddles: [["Rhythm", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/18-music-note-rhythm-dots.png"], ["Move", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/17-dance-spiralling-scarves.png"]],
  Sam: [["Count", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/13-math-abacus-ruler-block.png"], ["Build", "/brand-kit-icon-sheets/subject-variations-v2/individual-icons/15-math-construction-measure.png"]],
  Rusty: [["Instrument", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/11-instrument-banjo-strap.png"], ["Steady beat", "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/06-instrument-hand-drum.png"]],
};

const PALETTE = [
  ["Navy", "--navy", "#0B1A33", "bg-brand-navy"],
  ["Blue", "--blue", "#3F78A4", "bg-brand-blue"],
  ["Sky", "--sky", "#B9D3E6", "bg-brand-sky"],
  ["Gold", "--gold", "#E1B84B", "bg-brand-gold"],
  ["Red", "--red", "#C33F3F", "bg-brand-red"],
  ["Coral", "--coral", "#D45D6D", "bg-brand-coral"],
  ["Pink", "--pink", "#D98291", "bg-brand-pink"],
  ["Plum", "--plum", "#8D7AA8", "bg-brand-plum"],
  ["Orange", "--orange", "#D97A2B", "bg-brand-orange"],
  ["Paper", "--card", "#FDF8EC", "bg-card"],
] as const;

const SITE_CONTROL_STORIES = [
  ["Site header", "Primary navigation, grade state, search, and desktop actions", "http://localhost:6006/?path=/story/site-controls-header--grade-one-active"],
  ["Mobile navigation", "The real Sheet, links, grade shortcuts, and close behaviour", "http://localhost:6006/?path=/story/site-controls-mobile-navigation--grade-one-active"],
  ["Theme switcher", "The real light and dark theme action", "http://localhost:6006/?path=/story/site-controls-theme-switcher--farm-day"],
  ["Grade welcome + teacher note", "The essential responsive two-column control, shown for every assigned teacher", "http://localhost:6006/?path=/story/grade-controls-welcome-and-teacher-note--grade-one"],
  ["Shared grade interaction lane", "The full grade workspace with daycare through Grade 2 as selectable stories", "http://localhost:6006/?path=/story/grade-controls-shared-interaction-lane--grade-one"],
  ["Feature carousel", "The homepage carousel, arrows, selected state, and keyboard controls", "http://localhost:6006/?path=/story/home-controls-feature-carousel--standard"],
  ["Print action", "The real lesson print action", "http://localhost:6006/?path=/story/lesson-controls-print-action--teacher-plan"],
] as const;

const BRANDING_GRADE_ITEMS = [
  { title: "Addition & Subtraction Word Problems", kicker: "Mathematics", summary: "Grade 1 solves concrete one-step problems within 20.", href: "/grade/grade-one/addition-subtraction-word-problems", icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png" },
  { title: "Apply properties of operations", kicker: "Mathematics", summary: "Use counters and number sentences to explore addition.", href: "/grade/grade-one/properties-of-operations", icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png" },
  { title: "Distinguish long from short vowel sounds", kicker: "Literacy & phonics", summary: "Listen for vowel sounds in spoken single-syllable words.", href: "/grade/grade-one/distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral", icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png" },
] as const;

function BrandAssetDialog({ label, path, kind }: { label: string; path: string; kind: "portrait" | "texture" }) {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <Dialog>
    <DialogTrigger asChild><Button className="brandAssetDialogTrigger" variant="outline" size="xs">{label}</Button></DialogTrigger>
    <DialogContent className="material-surface material-cardboard-paper max-h-[calc(100svh-2rem)] max-w-3xl overflow-y-auto text-foreground">
      <DialogHeader>
        <DialogTitle className="font-heading text-3xl">{label}</DialogTitle>
        <DialogDescription>Preview the approved public asset here. Do not leave the brand book or replace it with a copied approximation.</DialogDescription>
      </DialogHeader>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Image src={path} alt="" width={kind === "portrait" ? 560 : 960} height={kind === "portrait" ? 560 : 480} className="max-h-[48svh] w-full object-contain" />
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background/75 p-3 sm:flex-row sm:items-center sm:justify-between">
        <code className="break-all text-xs text-foreground" translate="no">{path}</code>
        <Button type="button" variant="outline" size="icon-sm" className="brandCopyIcon" onClick={copyPath} aria-label={copied ? "Filepath copied" : "Copy filepath"}>{copied ? <CopyCheck aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
      </div>
      <DialogFooter showCloseButton />
    </DialogContent>
  </Dialog>;
}

function CopyRecipe({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <div className="brandCopyRecipe">
    <strong className="font-body text-xs uppercase tracking-wide text-muted-foreground">{label}</strong>
    <code className="break-words font-mono text-sm font-bold leading-6 text-foreground" translate="no">{value}</code>
    <Button className="brandCopyIcon" type="button" variant="outline" size="icon-sm" onClick={copy} aria-label={copied ? "Recipe copied" : "Copy recipe"}>{copied ? <CopyCheck aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
  </div>;
}

function CastCard({ member, featured = false }: { member: CastRosterMember; featured?: boolean }) {
  const castKey = member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const castClass = `cast-${castKey}`;
  const matchedAssets = MATCHED_CAST_ASSETS[member.name] ?? [];
  return <article className={`${styles.card} cast-${castKey} ${featured ? styles.featured : ""}`} data-cast={castKey}>
    <div className={`${styles.portrait} character-surface`}><Image className="castPortraitImage" src={member.portrait} alt={member.name} width={280} height={280} /><div className="portraitMatchedAssets" aria-label={`${member.name} matched grade and curriculum assets`}>{matchedAssets.map(([label,path])=><Image key={path} src={path} alt={label} title={label} width={58} height={58}/>)}</div></div>
    <div className={styles.cardCopy}>
      <span className={styles.species}>{member.species}</span><h3>{member.name}</h3>
      <p className={styles.role}>{member.descriptor}</p>
      {member.grade ? <p><strong>Grade / level:</strong> {member.grade}</p> : null}
      <p><strong>Character context:</strong> <code>{castClass}</code> supplies {member.colorLabel} <code>{member.color}</code> and the matching texture to the local <code>character-surface</code>.</p>
      <p><strong>{member.group === "staff" ? "Activities" : "Can be shown"}:</strong> {member.activities}</p>
      <p className="flex flex-wrap items-center gap-1 text-xs font-bold text-muted-foreground"><span>Rendered class recipe:</span><code className="rounded border border-border bg-background/75 px-1.5 py-0.5 text-foreground">{castClass}</code><span>on this card, then</span><code className="rounded border border-border bg-background/75 px-1.5 py-0.5 text-foreground">character-surface</code><span>on its portrait panel.</span></p>
      <div className={styles.assetReference}>
        <span><i />Brand files</span>
        <nav aria-label={`${member.name} asset files`}>
          <BrandAssetDialog label="Portrait PNG" path={member.portrait} kind="portrait" />
          <BrandAssetDialog label="Felt texture" path={member.texture} kind="texture" />
        </nav>
        <small><strong>Safe visual example:</strong> show {member.name} in scenes involving {member.activities.toLowerCase()}.</small>
      </div>
      <Collapsible className="matchedVisualKit">
        <CollapsibleTrigger className="matchedVisualKitTrigger">Matched visual kit <span aria-hidden="true">+</span></CollapsibleTrigger>
        <CollapsibleContent><p>These curriculum signals match the canonical role, grade, or activities above. <a href="/CAST_AND_ROLES.md" target="_blank" rel="noreferrer">Open the character Markdown to correct this record.</a></p><div>{matchedAssets.map(([label,path])=><figure key={path}><Image src={path} alt="" width={72} height={72}/><figcaption>{label}</figcaption><BrandAssetDialog label="Preview & copy" path={path} kind="texture" /></figure>)}</div></CollapsibleContent>
      </Collapsible>
    </div>
  </article>;
}

function BrandingUiExamples() {
  return <section className={`${styles.section} ${styles.uiReference}`} id="ui-reference">
    <header><span>Working component reference</span><h2>Controls, patches, and page type</h2><p>These are the actual controls to use across the site. They use the shared global theme and real material or cast context only where that context is meaningful.</p></header>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
      <Card className="material-surface material-cardboard-paper gap-5 border-border bg-transparent py-5 shadow-sm">
        <CardHeader className="px-5"><CardTitle className="font-heading text-3xl text-foreground">Neutral school controls</CardTitle><CardDescription className="text-muted-foreground">Use these for ordinary actions. A grade page stays neutral unless a component is actually about a character.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 px-5">
          <div className="flex flex-wrap gap-3"><Button className="brand-button brand-button--felt">Build this lesson</Button><Button className="brand-button brand-button--woven" variant="secondary">Browse paths</Button><Button className="brand-button brand-button--cardboard" variant="outline">Save for later</Button><Button className="brandTextLink" variant="link">View all resources</Button></div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2"><Input aria-label="Example lesson search" placeholder="Search lessons" /><NativeSelect aria-label="Example grade filter" defaultValue="grade-one"><option value="daycare">Daycare</option><option value="grade-one">Grade 1</option><option value="grade-two">Grade 2</option></NativeSelect></div>
          <Tabs defaultValue="today"><TabsList className="grid w-full grid-cols-3 rounded-lg border border-border bg-background/75 p-1"><TabsTrigger value="today" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Today</TabsTrigger><TabsTrigger value="curriculum" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Curriculum</TabsTrigger><TabsTrigger value="planner" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Planner</TabsTrigger></TabsList><TabsContent value="today" className="pt-3 text-sm text-muted-foreground">A tab is a real navigational control, not a styled `div`.</TabsContent><TabsContent value="curriculum" className="pt-3 text-sm text-muted-foreground">Use it for switching related panel content.</TabsContent><TabsContent value="planner" className="pt-3 text-sm text-muted-foreground">Use forms and inputs only when the task genuinely needs them.</TabsContent></Tabs>
        </CardContent>
      </Card>
      <Card className="cast-miss-hayley character-surface gap-4 border-white/30 py-5 shadow-sm">
        <CardHeader className="px-5"><CardTitle className="font-heading text-3xl text-[var(--character-foreground)]">Character-specific context</CardTitle><CardDescription className="text-[color:var(--character-foreground)]/85">Miss Hayleyâ€™s colour and texture belong here, on her own note, not on Grade 1.</CardDescription></CardHeader>
        <CardContent className="px-5"><blockquote className="font-hand text-3xl leading-none text-[var(--character-foreground)]">â€œWhat can they notice, explain, and share today?â€</blockquote></CardContent>
        <CardFooter className="justify-between gap-3 px-5"><span className="text-xs font-bold text-[var(--character-foreground)]">cast-miss-hayley</span><DropdownMenu><DropdownMenuTrigger asChild><Button className="brand-button brand-button--patch-pink" variant="secondary">Teacher actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Open lesson notes</DropdownMenuItem><DropdownMenuItem>View drama resources</DropdownMenuItem></DropdownMenuContent></DropdownMenu></CardFooter>
      </Card>
    </div>
  </section>;
}

export function TypographySpread() {
  return <section className={`${styles.section} ${styles.typeSpread} min-h-svh`} id="typography">
    <header><span>Typography reference page</span><h2>Type has jobs, not just styles</h2><p>This complete page-sized specimen defines the roles used by navigation, grade workspaces, lessons, controls, and teacher notes. Agents should copy the role, not improvise a nearby font treatment.</p></header>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)]">
      <Card className="material-surface material-cardboard-paper gap-5 border-border bg-transparent py-7 shadow-sm"><CardHeader className="px-7"><CardDescription className="font-body text-xs font-extrabold uppercase tracking-[.12em] text-muted-foreground">Display heading</CardDescription><CopyRecipe label="Copy display-heading classes" value="font-heading text-5xl leading-[.9] text-foreground sm:text-6xl" /><CardTitle className="font-heading text-5xl leading-[.9] text-foreground sm:text-6xl">Turn rhythm into a day of discovery.</CardTitle></CardHeader><CardContent className="grid gap-5 px-7"><div className="grid gap-3"><CopyRecipe label="Copy body-copy classes" value="font-body text-base leading-7 text-muted-foreground" /><p className="max-w-prose font-body text-base leading-7 text-muted-foreground">Body copy uses the reading face at a comfortable line length and line height. It explains the teaching task without competing with the heading.</p></div><Separator /><div className="grid gap-3"><p className="font-body text-xs font-extrabold uppercase tracking-[.12em] text-muted-foreground">Handwritten emphasis</p><CopyRecipe label="Copy handwritten-emphasis classes" value="font-hand text-4xl leading-[1.1] text-primary sm:text-5xl" /><p className="font-hand text-4xl leading-[1.1] text-primary sm:text-5xl">Make room for what learners show you.</p></div></CardContent><CardFooter className="flex-wrap gap-3 px-7"><div className="grid w-full gap-3"><CopyRecipe label="Control source" value="components/ui/button.tsx Â· Button variant='default' | variant='outline'" /><div className="flex flex-wrap gap-3"><Button className="brand-button brand-button--felt">Build this lesson</Button><Button className="brand-button brand-button--cardboard" variant="outline">Browse learning paths</Button></div></div></CardFooter></Card>
      <div className="grid gap-5">
        <Card className="material-surface material-leather gap-4 border-white/20 py-6 text-[var(--site-chrome-foreground)] shadow-sm"><CardHeader className="px-6"><CardDescription className="font-body text-xs font-extrabold uppercase tracking-[.12em] text-[var(--site-chrome-accent)]">Navigation label</CardDescription><CopyRecipe label="Copy navigation-title classes" value="material-surface material-leather font-heading text-4xl leading-none text-[var(--site-chrome-foreground)]" /><CardTitle className="font-heading text-4xl leading-none text-[var(--site-chrome-foreground)]">The farm school</CardTitle></CardHeader><CardContent className="grid gap-3 px-6 font-body text-sm leading-6"><CopyRecipe label="Copy compact-body classes" value="font-body text-sm leading-6" /><p>Compact labels guide. Display type names the destination. Body type carries explanation.</p></CardContent></Card>
        <Card className="cast-miss-hayley character-surface gap-4 border-white/20 py-6 shadow-sm"><CardHeader className="px-6"><CardDescription className="font-body text-xs font-extrabold uppercase tracking-[.12em] text-[var(--character-foreground)]">Character voice</CardDescription><CopyRecipe label="Copy character-voice classes" value="cast-miss-hayley character-surface font-hand text-4xl leading-[1.1] text-[var(--character-foreground)]" /><CardTitle className="font-hand text-4xl leading-[1.1] text-[var(--character-foreground)]">What can they notice, explain, and share today?</CardTitle></CardHeader><CardContent className="grid gap-3 px-6 font-body text-sm leading-6 text-[var(--character-foreground)]"><CopyRecipe label="Copy character-body classes" value="font-body text-sm leading-6 text-[var(--character-foreground)]" /><p>Handwriting is reserved for a short human voice or emphasis. It is never the body-reading face.</p></CardContent></Card>
      </div>
    </div>
    <Card className="mt-5 gap-4 border-border bg-card py-5 shadow-sm"><CardHeader className="px-5"><CardTitle className="font-heading text-3xl">Selector ownership</CardTitle><CardDescription>Use reusable names directly. Scoped production selectors are for diagnosis and must remain inside their component.</CardDescription></CardHeader><CardContent className="grid gap-3 px-5 text-sm md:grid-cols-2"><CopyRecipe label="Reusable global utilities" value="font-heading Â· font-body Â· font-hand Â· typeset-farm-ui Â· typeset-farm-reading" /><CopyRecipe label="Scoped grade typography" value="[data-style-scope='grade-interaction-lane'] .eyebrow Â· .welcomeCopy h1 Â· .teacherCardTitle Â· .teacherCardContent blockquote" /></CardContent><CardFooter className="px-5"><Button asChild><a href="http://localhost:6006/?path=/story/branding-typography--type-roles" target="_blank" rel="noreferrer">Open typography in Storybook</a></Button></CardFooter></Card>
  </section>;
}

function PaletteSpread() {
  return <section className={`${styles.section} ${styles.uiReference}`} id="palette">
    <header><span>Global palette</span><h2>Named tokens, not loose paint</h2><p>These are the existing global brand tokens. Use the semantic token or its Tailwind utility; do not paste a hex into a page. Cast colours remain supplied by the <code>cast-*</code> class shown on every character card below.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {PALETTE.map(([name, token, value, swatchClass]) => <Card className="gap-0 overflow-hidden border-border bg-card py-0 shadow-sm" key={token}>
        <div className={`h-20 ${swatchClass}`} aria-hidden="true" />
        <CardContent className="grid gap-1 p-4"><strong className="font-heading text-xl text-foreground">{name}</strong><code className="text-xs text-muted-foreground">{token}</code><code className="text-xs text-foreground">{value}</code></CardContent>
      </Card>)}
    </div>
  </section>;
}

function SiteControlWorkbench() {
  return <section className={`${styles.section} ${styles.uiReference}`} id="site-controls">
    <header><span>Targeted repair workspace</span><h2>Inspect the controls we actually ship</h2><p>Storybook renders the real exported website controls in isolation. It is for finding one problem, fixing its shared component or global token, then checking the result before changing a page composition.</p></header>
    <Card className="mb-5 gap-0 overflow-hidden border-border bg-card py-0 shadow-sm"><CardHeader className="px-5 py-5"><CardTitle className="font-heading text-3xl text-foreground">Complete grade workspace</CardTitle><CardDescription>This is the actual production component, not a recreation: rail, responsive welcome and teacher note, learning cards, planning strip, and all four tab panels. It is the canonical page-level example for all five grades.</CardDescription></CardHeader><CardContent className="p-0"><GradeInteractionLane config={GRADE_INTERACTION_CONFIGS["grade-one"]} summary="Reading and rhythm" items={[...BRANDING_GRADE_ITEMS]} /></CardContent></Card>
    <Card className="gap-5 border-border bg-card py-5 shadow-sm">
      <CardHeader className="px-5"><CardTitle className="font-heading text-3xl text-foreground">The division of responsibility</CardTitle><CardDescription className="text-muted-foreground">shadcn provides accessible component structure, keyboard behavior, variants, and responsive primitives. The Farm system supplies the semantic tokens, material classes, approved assets, and typography roles. A page composes those two layers.</CardDescription></CardHeader>
      <CardContent className="grid gap-4 px-5 md:grid-cols-2 xl:grid-cols-3">{SITE_CONTROL_STORIES.map(([name, detail, href]) => <Card className="gap-3 border-border bg-background py-4 shadow-none" key={name}><CardHeader className="px-4"><CardTitle className="font-heading text-2xl text-foreground">{name}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardFooter className="px-4"><Button asChild variant="outline" size="sm"><a href={href} target="_blank" rel="noreferrer">Open actual control</a></Button></CardFooter></Card>)}</CardContent>
    </Card>
  </section>;
}

export function BrandingControls() {
  return <><SiteControlWorkbench /><section className={`${styles.section} ${styles.controlsSpread}`} id="controls">
    <header><span>System control reference</span><h2>Compose shadcn controls with the Farm system</h2><p>This is a live system gallery, not a page prototype. Use the real control stories above to diagnose the website; use this gallery to check which standard shadcn component and brand context belong together. <a className="font-bold underline underline-offset-4" href="http://localhost:6006/?path=/story/branding-controls--all-controls" target="_blank" rel="noreferrer">Open this gallery in Storybook</a>.</p></header>
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="material-surface material-cardboard-paper gap-4 border-border bg-transparent py-5 shadow-sm"><CardHeader className="px-5"><CardTitle className="font-heading text-3xl">Actions</CardTitle><CardDescription>Use Button for actions and links that look like actions.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3 px-5"><Button className="material-surface material-felt text-primary-foreground">Primary action</Button><Button className="material-surface material-cardboard-paper" variant="outline">Secondary action</Button><Button variant="ghost">Quiet action</Button><Button variant="link">Text link</Button><Button disabled>Unavailable</Button></CardContent></Card>
      <Card className="material-surface material-cardboard-paper gap-4 border-border bg-transparent py-5 shadow-sm"><CardHeader className="px-5"><CardTitle className="font-heading text-3xl">Inputs and selection</CardTitle><CardDescription>Use labels and native controls when a teacher must enter or choose something.</CardDescription></CardHeader><CardContent className="grid gap-3 px-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-foreground">Lesson search<Input placeholder="Search lessons" /></label><label className="grid gap-2 text-sm font-bold text-foreground">Grade<NativeSelect defaultValue="grade-one"><option value="daycare">Daycare</option><option value="grade-one">Grade 1</option><option value="grade-two">Grade 2</option></NativeSelect></label></CardContent></Card>
      <Card className="material-surface material-cardboard-paper gap-4 border-border bg-transparent py-5 shadow-sm"><CardHeader className="px-5"><CardTitle className="font-heading text-3xl">Menus, tabs, and disclosure</CardTitle><CardDescription>Use the component that matches the interaction. Do not turn a styled `div` into a control.</CardDescription></CardHeader><CardContent className="grid gap-5 px-5"><NavigationMenu viewport={false} className="justify-start"><NavigationMenuList className="justify-start"><NavigationMenuItem><NavigationMenuTrigger>Learning paths</NavigationMenuTrigger><NavigationMenuContent><ul className="grid w-64 gap-1 p-2"><li><NavigationMenuLink href="/grade/grade-one">Grade 1 resources</NavigationMenuLink></li><li><NavigationMenuLink href="/grade/grade-two">Grade 2 resources</NavigationMenuLink></li></ul></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu><Tabs defaultValue="today"><TabsList className="grid w-full grid-cols-3 rounded-lg border border-border bg-background/75 p-1"><TabsTrigger value="today" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Today</TabsTrigger><TabsTrigger value="curriculum" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Curriculum</TabsTrigger><TabsTrigger value="planner" className="rounded-md px-3 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Planner</TabsTrigger></TabsList><TabsContent value="today" className="pt-3 text-sm text-muted-foreground">Use tabs for related panels in the same place.</TabsContent><TabsContent value="curriculum" className="pt-3 text-sm text-muted-foreground">Use a link for a different page.</TabsContent><TabsContent value="planner" className="pt-3 text-sm text-muted-foreground">Do not recreate tab keyboard behaviour manually.</TabsContent></Tabs><Collapsible className="rounded-lg border border-border bg-background/70 px-4"><CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between text-left text-sm font-bold">When do I use this control?<span aria-hidden="true">+</span></CollapsibleTrigger><CollapsibleContent className="border-t border-border py-3 text-sm text-muted-foreground">Use a collapsible for optional supporting detail. Keep the trigger a real button.</CollapsibleContent></Collapsible></CardContent></Card>
      <Card className="material-surface material-cardboard-paper gap-4 border-border bg-transparent py-5 shadow-sm"><CardHeader className="px-5"><CardTitle className="font-heading text-3xl">Overlay and carousel</CardTitle><CardDescription>Use these only when content warrants them, not as decorative replacements for layout.</CardDescription></CardHeader><CardContent className="grid gap-5 px-5"><div className="flex flex-wrap gap-3"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Resource actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Open lesson</DropdownMenuItem><DropdownMenuItem>Save for planning</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Sheet><SheetTrigger asChild><Button className="material-surface material-leather text-[#fff4dc]">Open planning sheet</Button></SheetTrigger><SheetContent className="material-surface material-cardboard-paper"><SheetHeader><SheetTitle className="font-heading text-3xl">Planning sheet</SheetTitle><SheetDescription>Use a sheet for focused secondary work without leaving the current page.</SheetDescription></SheetHeader><div className="p-4"><Input placeholder="Add a planning note" /></div></SheetContent></Sheet></div><Carousel opts={{ align: "start" }} className="mx-10"><CarouselContent><CarouselItem className="basis-full sm:basis-1/2"><article className="material-surface material-felt min-h-32 rounded-lg p-5 text-primary-foreground"><strong className="font-heading text-2xl">Felt</strong><p className="mt-2 text-sm">For soft, active surfaces.</p></article></CarouselItem><CarouselItem className="basis-full sm:basis-1/2"><article className="material-surface material-cork min-h-32 rounded-lg p-5 text-foreground"><strong className="font-heading text-2xl">Cork</strong><p className="mt-2 text-sm">For working walls and pinboards.</p></article></CarouselItem><CarouselItem className="basis-full sm:basis-1/2"><article className="material-surface material-construction-paper min-h-32 rounded-lg p-5 text-primary-foreground"><strong className="font-heading text-2xl">Paper</strong><p className="mt-2 text-sm">For cut-paper accents.</p></article></CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel></CardContent></Card>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]"><article className="material-surface material-cork rounded-xl border border-[#5b391c38] p-6 text-foreground shadow-sm"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[#5b391c]">Pattern - grade rail</span><div className="mt-4 grid gap-2"><Button className="justify-start material-surface material-cardboard-paper text-left text-foreground" variant="outline">01 Today</Button><Button className="justify-start" variant="secondary">02 Curriculum</Button><Button className="justify-start" variant="ghost">03 Planner</Button><Button className="justify-start" variant="ghost">04 Resources</Button></div></article><article className="material-surface material-cardboard-paper rounded-xl border border-border p-6 text-foreground shadow-sm"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-muted-foreground">Pattern - character note</span><div className="cast-miss-hayley character-surface mt-4 rounded-xl p-5"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--character-foreground)]">A note from Miss Hayley</p><p className="mt-4 font-hand text-4xl leading-none text-[var(--character-foreground)]">What can they notice, explain, and share today?</p></div><p className="mt-4 text-sm leading-6 text-muted-foreground">A character identity belongs to its own note or activity. The surrounding grade shell remains neutral.</p></article></div>
  </section></>;
}

export function CastShowcase({ staff, students }: { staff: CastRosterMember[]; students: CastRosterMember[] }) {
  return <div className={`${styles.page} typeset-farm-reading`} data-style-scope="cast-showcase">
    <ResponsiveFeatureSplit asChild ratio="primary" className={styles.hero}>
      <header>
        <div><span>Internal brand reference - source-led</span><h1>The whole school,<br/><em>in character.</em></h1><nav className="heroActions" aria-label="Brand guide shortcuts"><Button asChild><a href="#asset-toolkit">Browse assets</a></Button><Button asChild variant="outline"><a href="#site-controls">Inspect controls</a></Button><Button asChild variant="link"><a href="#typography">Typography guide</a></Button></nav></div>
        <div className={styles.heroCluster}>
          <div className="heroLayerSample" aria-label="Layered brand construction example">
            <Image src="/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.png" alt="" width={512} height={512} />
            <div><strong>Layer the real pieces</strong><small>felt patch + stitching + type + portrait</small></div>
          </div>
          <div className="heroCast" aria-label="Old MacDonald, Miss Puddles, Mr Rusty, and Miss Hayley">{staff.slice(0,4).map((member)=><Image key={member.name} src={member.portrait} alt={member.name} width={180} height={180} sizes="(max-width: 600px) 110px, (max-width: 1050px) 150px, 180px" />)}</div>
        </div>
      </header>
    </ResponsiveFeatureSplit>
    <BrandSpecimenNav />
    <section className={`${styles.section} ${styles.toolkit}`} id="asset-toolkit">
      <header><span>Production-ready visual vocabulary</span><h2>Choose from the shelf, not the file tree</h2><p>These governed examples cover the project&apos;s main visual building blocks. Start here, copy the exact path, and inspect only that family when you need a nearby alternative. <a className="font-bold underline underline-offset-4" href="http://localhost:6006/?path=/story/branding-asset-atlas--repeatable-materials" target="_blank" rel="noreferrer">Open repeatable materials in Storybook</a>.</p></header>
      <div className={styles.materialGrid}>{MATERIALS.map(([name, src, use])=><article className={styles.materialCard} data-material={name.toLowerCase().replaceAll(" ", "-")} key={name}><div /><h3>{name}</h3><p>{use}</p><code translate="no">{src}</code></article>)}</div>
      <div className={styles.assetRows}>
        <article><header><span>Attachment details</span><h3>Classroom fasteners</h3></header><div className={styles.iconShelf}>{FASTENERS.map(([name,src])=><figure key={name}><Image src={src} alt="" width={72} height={72}/><figcaption>{name}</figcaption><code>{src}</code></figure>)}</div></article>
        <article><header><span>Curriculum signals</span><h3>Grade &amp; subject icons</h3></header><div className={styles.iconShelf}>{CURRICULUM_ICONS.map(([name,src])=><figure key={name}><Image src={src} alt="" width={72} height={72}/><figcaption>{name}</figcaption><code>{src}</code></figure>)}</div></article>
      </div>
    </section>
    <CurriculumAssetGuide />
    <section className={`${styles.section} ${styles.badgeRecipe}`} id="badge-recipe">
      <header><span>Canonical character construction</span><h2>Build badges from 2 authored layers</h2><p>Use the unchanged transparent-circle portrait over the matching authored circle patch. Never recolour either layer or substitute an extracted face patch.</p></header>
      <div className={styles.recipeBody}>
        <figure className={styles.badgeLayers} aria-label="Miss Puddles portrait layered over her matching yellow felt patch"><Image src="/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png" alt="" width={240} height={240}/><Image src="/staff_and_students/miss-puddles-transparent-circle.png" alt="Miss Puddles" width={220} height={220}/></figure>
        <ol><li><strong>Patch:</strong><code>/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png</code></li><li><strong>Portrait:</strong><code>/staff_and_students/miss-puddles-transparent-circle.png</code></li><li><strong>Identity check:</strong><span>Miss Puddles - Daycare - yellow #E8A227</span></li></ol>
      </div>
      <aside className={styles.statusKey}><p><strong>Production:</strong> separated tiles, portraits, circle patches, icons, and fasteners shown here.</p><p><strong>Reference only:</strong> contact sheets, atlases, page composites, design concepts, explorations, and Figma exports.</p><p><strong>Blocked:</strong> every blank-felt rectangle marked DO NOT USE and every extraction-damaged asset awaiting review.</p></aside>
    </section>
    <AssetPatternCatalogue />
    <PaletteSpread />
    <section className={styles.section} id="cast-staff"><header><span>Eight canonical staff</span><h2>Meet the teaching team</h2><p>Roles and grade ownership remain visible in plain text so this page can function as a practical brand check.</p><Button asChild variant="outline"><a href="/CAST_AND_ROLES.md" target="_blank" rel="noreferrer">Open character Markdown</a></Button></header><div className={styles.staffGrid}>{staff.map((member,index)=><CastCard key={member.name} member={member} featured={index < 2}/>)}</div></section>
    <section className={`${styles.section} ${styles.studentSection}`} id="cast-students"><header><span>Eight students - eight learning lenses</span><h2>The learners bring the school to life</h2><p>Students are optional teaching lenses, not substitute subjects. Their approved actions stay scene-dependent.</p><Button asChild variant="outline"><a href="/CAST_AND_ROLES.md" target="_blank" rel="noreferrer">Open character Markdown</a></Button></header><div className={styles.studentGrid}>{students.map((member)=><CastCard key={member.name} member={member}/>)}</div></section>
    <BrandingUiExamples />
    <BrandingControls />
    <TypographySpread />
    <aside className={styles.rule} id="cast-rule"><strong>Brand rule</strong><p>Use canonical portraits unchanged. Pair each character with the signature colour, role, grade, and activity listed here. Layout may be playful; identity data may not.</p></aside>
  </div>;
}
