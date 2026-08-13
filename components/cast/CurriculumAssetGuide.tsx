"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TOPICS = [
  { name: "Instruments", note: "Choose the instrument the activity actually uses.", assets: ["music-fiddle", "music-hand-drum", "music-banjo", "music-handbells"] },
  { name: "Dance & movement", note: "Signal the movement structure, not music in general.", assets: ["dance-turning-footprints", "dance-crossing-ribbons", "dance-tap-shoes", "dance-spiralling-scarves"] },
  { name: "Music signals", note: "Use notes for listening, singing, rhythm, or notation contexts.", assets: ["music-note-single", "music-notes-paired", "music-notes-ascending", "music-rhythm-dots"] },
  { name: "Acting & performance", note: "These mean performance; books remain a separate storytelling signal.", assets: ["acting-theatre-masks", "acting-stage-curtains", "acting-pocket-puppets", "acting-spotlight-star"] },
  { name: "Painting by stage", note: "Progress from hands and sponges to crayons, then brush and easel.", assets: ["painting-handprint", "painting-sponge-shapes", "painting-crayon-swatches", "painting-easel"] },
] as const;

const COMPOSITIONS = [
  { name: "Taped teacher note", className: "paperComposition paperComposition--taped", fastener: "fastener-masking-tape", title: "A note for circle time", body: "Tape holds a temporary note to a quiet cardboard surface." },
  { name: "Pinned planning card", className: "paperComposition paperComposition--pinned", fastener: "fastener-push-pin", title: "Today’s invitation", body: "A pin belongs on a bounded notice or working-board card." },
  { name: "Gingham activity strip", className: "paperComposition paperComposition--gingham", fastener: "fastener-gingham-tape", title: "Move, listen, respond", body: "Fabric tape makes a playful classroom label without becoming the content." },
  { name: "Apple-peg display", className: "paperComposition paperComposition--peg", fastener: "fastener-apple-peg", title: "Learner work", body: "A wooden peg suspends work or a display card from its top edge." },
  { name: "Pocketed resource", className: "paperComposition paperComposition--pocket", fastener: "fastener-kraft-pocket", title: "Keep for later", body: "A corner pocket indicates a tucked resource, not a generic decoration." },
  { name: "Quilted page tab", className: "paperComposition paperComposition--quilted", fastener: "fastener-quilted-tab", title: "Teacher reference", body: "A sewn corner marks durable guidance or a saved classroom reference." },
] as const;

function RecipeDialog({ label, recipe, triggerLabel = "Asset details" }: { label: string; recipe: string; triggerLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(recipe);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <Dialog>
    <DialogTrigger asChild><Button variant="link" size="xs" className="h-auto px-0 text-[10px]">{triggerLabel}</Button></DialogTrigger>
    <DialogContent className="brandRecipeDialog">
      <DialogHeader><span className="brandRecipeEyebrow">Named asset class</span><DialogTitle>{label}</DialogTitle><DialogDescription>Copy the semantic class recipe. The public filepath lives only in app/brand-assets.css.</DialogDescription></DialogHeader>
      <div className="brandRecipeCode"><code translate="no">{recipe}</code></div>
      <DialogFooter><Button className="brand-button brand-button--navy" onClick={copy}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copied" : "Copy classes"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function CurriculumAssetGuide() {
  return <section className="section curriculumAssetGuide" id="curriculum-assets">
    <header><span>Scalable curriculum language</span><h2>One idea, drawn for the space it occupies</h2><p>Use the semantic class names shown here. Filepaths belong in the named registry, never in a page component.</p></header>
    <section className="curriculumScaleKey" aria-label="Curriculum icon size guidance">
      <div><strong>Large</strong><span>icon-large</span><small>Feature cards, subject introductions, empty states</small></div>
      <div><strong>Medium</strong><span>icon-medium</span><small>Lesson cards, grade paths, curriculum panels</small></div>
      <div><strong>Small review</strong><span>icon-small</span><small>Navigation, compact metadata, filters</small></div>
      <div><strong>Micro review</strong><span>icon-micro</span><small>Only simple compact-family silhouettes</small></div>
    </section>
    <div className="curriculumTopicStack">
      {TOPICS.map((topic) => <article className="curriculumTopic" key={topic.name}>
        <header><h3>{topic.name}</h3><p>{topic.note}</p></header>
        <div className="curriculumVariantGrid">
          {topic.assets.map((assetClass, index) => {
            const flatClass = `${assetClass}-flat`;
            return <Card className="curriculumVariant" key={assetClass}>
              <CardHeader><CardTitle>Option {index + 1}</CardTitle><CardDescription><code>{assetClass}</code></CardDescription></CardHeader>
              <CardContent>
                <div className="curriculumIconSizes"><span className={`brand-asset ${assetClass} icon-large`} aria-hidden="true" /><span className={`brand-asset ${assetClass} icon-medium`} aria-hidden="true" /><span className="smallIconPreview"><span className={`brand-asset ${flatClass} icon-small`} aria-hidden="true" /><span className={`brand-asset ${flatClass} icon-micro`} aria-hidden="true" /></span></div>
                <div className="curriculumAssetLinks"><RecipeDialog label={`${topic.name} option ${index + 1}`} recipe={`brand-asset ${assetClass} icon-medium`} triggerLabel="Felt classes" /><RecipeDialog label={`${topic.name} compact option ${index + 1}`} recipe={`brand-asset ${flatClass} icon-small`} triggerLabel="Small classes" /></div>
              </CardContent>
            </Card>;
          })}
        </div>
      </article>)}
    </div>
    <section className="attachmentCompositionGuide" aria-labelledby="attachment-composition-title">
      <header><span>Physical composition grammar</span><h3 id="attachment-composition-title">Attach information as though the object has a job</h3><p>The fastener is a child of the surface it attaches to, so the composition remains responsive.</p></header>
      <div className="attachmentCompositionGrid">{COMPOSITIONS.map((item) => <article className={item.className} key={item.name}><div className="paperCompositionSurface"><span className={`brand-asset ${item.fastener} icon-medium`} aria-hidden="true" /><div className="paperCompositionNote"><small>{item.name}</small><h4>{item.title}</h4><p>{item.body}</p><RecipeDialog label={item.name} recipe={`brand-asset ${item.fastener} icon-medium`} /></div></div></article>)}</div>
      <aside><strong>Missing source:</strong> the remembered torn and ruled-paper sheet is not present in this checkout or its inventory. It remains missing rather than being approximated.</aside>
    </section>
  </section>;
}
