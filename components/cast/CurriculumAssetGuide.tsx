"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ROOT = "/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons";
const SMALL_ROOT = "/brand-kit-icon-sheets/music-arts-flat-v3-small-review/individual-icons";

const TOPICS = [
  { name: "Instruments", note: "Choose the instrument the activity actually uses.", icons: ["01-instrument-fiddle-bow.png", "06-instrument-hand-drum.png", "11-instrument-banjo-strap.png", "16-instrument-handbells-ribbon.png"] },
  { name: "Dance & movement", note: "Signal the movement structure, not music in general.", icons: ["02-dance-turning-footprints.png", "07-dance-crossing-ribbons.png", "12-dance-tap-shoes.png", "17-dance-spiralling-scarves.png"] },
  { name: "Music signals", note: "Use notes for listening, singing, rhythm, or notation contexts.", icons: ["03-music-note-single-eighth.png", "08-music-notes-paired-beam.png", "13-music-notes-ascending.png", "18-music-note-rhythm-dots.png"] },
  { name: "Acting & performance", note: "These mean performance; books remain a separate storytelling signal.", icons: ["04-acting-theatre-masks.png", "09-acting-stage-curtains.png", "14-acting-pocket-puppets.png", "19-acting-spotlight-star.png"] },
  { name: "Painting by stage", note: "Progress from hands and sponges to crayons, then brush and easel.", icons: ["05-painting-handprint-dots.png", "10-painting-sponge-shapes-tray.png", "15-painting-crayon-swatches.png", "20-painting-easel-brush-palette.png"] },
] as const;

const COMPOSITIONS = [
  { name: "Taped teacher note", className: "paperComposition paperComposition--taped", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png", title: "A note for circle time", body: "Tape holds a temporary note to a quiet cardboard surface." },
  { name: "Pinned planning card", className: "paperComposition paperComposition--pinned", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png", title: "Today’s invitation", body: "A pin belongs on a bounded notice or working-board card." },
  { name: "Gingham activity strip", className: "paperComposition paperComposition--gingham", fastener: "/design-assets/classroom-fasteners-v2/individual-icons/04-gingham-fabric-tape.png", title: "Move, listen, respond", body: "Fabric tape makes a playful classroom label without becoming the content." },
  { name: "Apple-peg display", className: "paperComposition paperComposition--peg", fastener: "/design-assets/classroom-fasteners-v2/individual-icons/06-apple-wood-clothes-peg.png", title: "Learner work", body: "A wooden peg suspends work or a display card from its top edge." },
  { name: "Pocketed resource", className: "paperComposition paperComposition--pocket", fastener: "/design-assets/classroom-fasteners-v2/individual-icons/11-kraft-corner-pocket.png", title: "Keep for later", body: "A corner pocket indicates a tucked resource, not a generic decoration." },
  { name: "Quilted page tab", className: "paperComposition paperComposition--quilted", fastener: "/design-assets/classroom-fasteners-v2/individual-icons/14-quilted-corner-tab.png", title: "Teacher reference", body: "A sewn corner marks durable guidance or a saved classroom reference." },
] as const;

function PathDialog({ label, path, triggerLabel = "Asset details" }: { label: string; path: string; triggerLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(`public${path}`); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <Dialog>
    <DialogTrigger asChild><Button variant="link" size="xs" className="h-auto px-0 text-[10px]">{triggerLabel}</Button></DialogTrigger>
    <DialogContent className="brandRecipeDialog">
      <DialogHeader><span className="brandRecipeEyebrow">Curriculum asset</span><DialogTitle>{label}</DialogTitle><DialogDescription>Use the separated production file. Do not crop it again from a source sheet.</DialogDescription></DialogHeader>
      <div className="brandRecipeCode"><code translate="no">public{path}</code></div>
      <DialogFooter><Button className="brand-button brand-button--navy" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy path"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function CurriculumAssetGuide() {
  return <section className="section curriculumAssetGuide" id="curriculum-assets">
    <header><span>Scalable curriculum language</span><h2>One idea, drawn for the space it occupies</h2><p>Dimensional felt is the approved large and medium brand family. The simplified transparent family is shown beside it for small UI evaluation; never shrink detailed felt until its meaning disappears.</p></header>
    <section className="curriculumScaleKey" aria-label="Curriculum icon size guidance">
      <div><strong>Large</strong><span>96px+</span><small>Feature cards, subject introductions, empty states</small></div>
      <div><strong>Medium</strong><span>64–95px</span><small>Lesson cards, grade paths, curriculum panels</small></div>
      <div><strong>Small review</strong><span>20–32px</span><small>Navigation, compact metadata, filters</small></div>
      <div><strong>Do not use</strong><span>&lt;48px felt</span><small>Switch families instead of crushing detail</small></div>
    </section>
    <div className="curriculumTopicStack">
      {TOPICS.map((topic) => <article className="curriculumTopic" key={topic.name}>
        <header><h3>{topic.name}</h3><p>{topic.note}</p></header>
        <div className="curriculumVariantGrid">
          {topic.icons.map((file, index) => {
            const felt = `${ROOT}/${file}`;
            const small = `${SMALL_ROOT}/${file}`;
            return <Card className="curriculumVariant" key={file}>
              <CardHeader><CardTitle>Option {index + 1}</CardTitle><CardDescription>{file.replace(/^\d+-/, "").replace(".png", "").replaceAll("-", " ")}</CardDescription></CardHeader>
              <CardContent>
                <div className="curriculumIconSizes"><Image src={felt} alt="" width={112} height={112} /><Image src={felt} alt="" width={68} height={68} /><span className="smallIconPreview"><Image src={small} alt="" width={28} height={28} /><Image src={small} alt="" width={20} height={20} /></span></div>
                <div className="curriculumAssetLinks"><PathDialog label={`${topic.name} felt option ${index + 1}`} path={felt} triggerLabel="Felt file" /><PathDialog label={`${topic.name} small option ${index + 1}`} path={small} triggerLabel="Small file" /></div>
              </CardContent>
            </Card>;
          })}
        </div>
      </article>)}
    </div>
    <section className="attachmentCompositionGuide" aria-labelledby="attachment-composition-title">
      <header><span>Physical composition grammar</span><h3 id="attachment-composition-title">Attach information as though the object has a job</h3><p>The surface carries the words. The fastener explains how that surface belongs on the classroom wall, shelf, or planning board.</p></header>
      <div className="attachmentCompositionGrid">{COMPOSITIONS.map((item) => <article className={item.className} key={item.name}><div className="paperCompositionSurface"><Image src={item.fastener} alt="" width={92} height={64} /><div className="paperCompositionNote"><small>{item.name}</small><h4>{item.title}</h4><p>{item.body}</p><PathDialog label={item.name} path={item.fastener} /></div></div></article>)}</div>
      <aside><strong>Missing source:</strong> the remembered torn and ruled-paper sheet is not present in this checkout or its inventory. The existing layered/folded material-kit sheet is preserved as a source reference, but it will not be cropped into production controls until separated properly.</aside>
    </section>
  </section>;
}
