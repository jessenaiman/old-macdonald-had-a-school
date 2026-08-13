"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, CopyCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PATCHES = [
  { name: "Old MacDonald circle", path: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-circle.png", shape: "circle" },
  { name: "Old MacDonald square", path: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.png", shape: "square" },
  { name: "Miss Hayley circle", path: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png", shape: "circle" },
  { name: "Miss Hayley square", path: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-square.png", shape: "square" },
] as const;

const COMPOSITIONS = [
  {
    name: "Felt action",
    use: "Primary action on a durable school surface",
    className: "material-surface material-felt",
    path: "/design-assets/web-material-library-v1/felt/felt-01-old-macdonald-tile.png",
  },
  {
    name: "Paper action",
    use: "Quiet action on a readable paper surface",
    className: "material-surface material-cardboard-paper",
    path: "/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png",
  },
  {
    name: "Cork notice",
    use: "Pinned information or a working-wall card",
    className: "material-surface material-cork",
    path: "/design-assets/cork-board-kit-v1/seamless-cork-tile.png",
  },
] as const;

const NAV_SPECIMENS = [
  { label: "Asset toolkit", href: "#asset-toolkit", kind: "felt", path: "/design-assets/web-material-library-v1/felt/felt-01-old-macdonald-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" },
  { label: "Asset patterns", href: "#asset-patterns", kind: "patch-brown", path: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/16-needle-and-thread.png" },
  { label: "Badge recipe", href: "#badge-recipe", kind: "patch-pink", path: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-square.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/11-stitched-label-tab.png" },
  { label: "Palette", href: "#palette", kind: "woven", path: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-01-old-macdonald-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png" },
  { label: "Staff roster", href: "#cast-staff", kind: "construction", path: "/design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.png" },
  { label: "Student roster", href: "#cast-students", kind: "cork", path: "/design-assets/cork-board-kit-v1/seamless-cork-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" },
  { label: "Actual controls", href: "#site-controls", kind: "cardboard", path: "/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" },
  { label: "System gallery", href: "#controls", kind: "felt-blue", path: "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/13-brass-split-pin.png" },
  { label: "Typography", href: "#typography", kind: "paper", path: "/design-assets/web-material-library-v1/construction-paper/construction-paper-09-hopper-tile.png", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/06-washi-tape.png" },
] as const;

const LINK_SPECIMENS = [
  { label: "Read the cast source", href: "/CAST_AND_ROLES.md", kind: "taped-note", path: "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" },
  { label: "Open the guide source", href: "/BRAND_ASSET_RECIPES.md", kind: "stitched-tab", path: "/design-assets/web-material-library-v1/thread-overlays/thread-overlay-01-old-macdonald-tile.png" },
  { label: "Meet the teaching team", href: "#cast-staff", kind: "portrait-link", path: "/staff_and_students/old-macdonald-transparent-circle.png" },
  { label: "See the brand rule", href: "#cast-rule", kind: "pinned-label", path: "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" },
] as const;

function CopyPath({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <div className="assetCataloguePath">
    <code translate="no">{value}</code>
    <Button type="button" variant="outline" size="icon-xs" className="brandCopyIcon" onClick={copy} aria-label={copied ? "Path copied" : "Copy path"}>{copied ? <CopyCheck aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
  </div>;
}

function AssetRecipeDialog({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <Dialog>
    <DialogTrigger asChild>
      <Button type="button" variant="link" size="sm" className="brandRecipeTrigger"><Info aria-hidden="true" />Recipe</Button>
    </DialogTrigger>
    <DialogContent className="brandRecipeDialog">
      <DialogHeader>
        <span className="brandRecipeEyebrow">Reusable control recipe</span>
        <DialogTitle>{label}</DialogTitle>
        <DialogDescription>The button uses the shared <code>.brand-button</code> geometry. Its material modifier changes only the surface.</DialogDescription>
      </DialogHeader>
      <div className="brandRecipeCode"><code translate="no">{value}</code></div>
      <DialogFooter>
        <Button type="button" className="brand-button brand-button--navy" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copied" : "Copy recipe"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function BrandSpecimenNav() {
  return <section className="brandSpecimenShelf" aria-labelledby="brand-specimen-shelf-title">
    <header>
      <div><span>Working controls · governed surfaces · exact sources</span><h2 id="brand-specimen-shelf-title">A classroom shelf of real interface pieces</h2><p>Each object is a functioning link. Hover, focus, or tap its small attachment tab to reveal the exact asset recipe.</p></div>
      <Button asChild variant="link"><a href="/BRAND_ASSET_RECIPES.md">Open all recipes</a></Button>
    </header>
    <nav className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Brand guide specimen sections">
      {NAV_SPECIMENS.map((item) => <article className="brandSpecimen" data-specimen={item.kind} key={item.href}>
        <Button asChild className={`brand-button brand-button--${item.kind}`}><a href={item.href}>{item.label}</a></Button>
        <AssetRecipeDialog label={item.label} value={`className="brand-button brand-button--${item.kind}"\nSurface: public${item.path}`} />
      </article>)}
    </nav>
    <p className="brandSpacingRule"><strong>Spacing recipe</strong><code translate="no">grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5</code><span>One shared button height. A 1rem gap. Columns change only at documented Tailwind breakpoints.</span></p>
    <section className="brandPatchButtonShelf" aria-labelledby="patch-button-shelf-title">
      <header><span>Authored silhouette variants</span><h3 id="patch-button-shelf-title">The same reliable control, wearing a real patch</h3><p>The transparent shadcn button owns the interaction footprint. The authored PNG owns the irregular edge and stitching.</p></header>
      <nav className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Irregular cut-out navigation examples">
        {NAV_SPECIMENS.map((item) => <article className="brandSpecimen brandPatchButtonSpecimen" data-specimen={item.kind} key={item.href}>
          <Button asChild variant="ghost" className="brandPatchButton"><a href={item.href}><Image className="brandPatchFastener" src={item.fastener} alt="" width={52} height={52} /><span>{item.label}</span></a></Button>
          <AssetRecipeDialog label={item.label} value={`Button data-specimen="${item.kind}"\nSurface: public${item.path}\nAttachment: public${item.fastener}`} />
        </article>)}
      </nav>
    </section>
    <section className="brandLinkShelf" aria-labelledby="brand-link-shelf-title">
      <div><span>Semantic hyperlink objects</span><h3 id="brand-link-shelf-title">A link can look like something you would find in a classroom</h3></div>
      <nav aria-label="Creative hyperlink examples">
        {LINK_SPECIMENS.map((item) => <article className="brandLinkSpecimen" data-link-specimen={item.kind} key={item.href}>
          <a href={item.href}>
            {item.kind === "portrait-link" ? <Image src={item.path} alt="" width={64} height={64} /> : null}
            {item.kind === "taped-note" || item.kind === "pinned-label" ? <Image src={item.path} alt="" width={70} height={38} /> : null}
            <span>{item.label}</span>
          </a>
          <AssetRecipeDialog label={item.label} value={`Asset: public${item.path}`} />
        </article>)}
      </nav>
    </section>
  </section>;
}

export function AssetPatternCatalogue() {
  return <section className="section assetCatalogue" id="asset-patterns">
    <header>
      <span>Approved composition recipes</span>
      <h2>See the asset working before you copy it</h2>
      <p>Each specimen uses a real shadcn control or semantic HTML element. Copy the visible class recipe and exact public path; do not recreate the material or search the full asset tree.</p>
      <Button asChild variant="outline"><a href="/BRAND_ASSET_RECIPES.md">Open the Markdown reference</a></Button>
    </header>

    <div className="assetCatalogueGrid">
      <Card className="assetCatalogueCard material-surface material-cardboard-paper">
        <CardHeader>
          <CardTitle className="font-heading text-3xl">Patch-shaped actions</CardTitle>
          <CardDescription>Use the authored circle or square as the visible layer inside a real Button. Rectangle exports are blocked.</CardDescription>
        </CardHeader>
        <CardContent className="patchControlGrid">
          {PATCHES.map((patch) => <article className="patchControlSpecimen" key={patch.path}>
            <Button className={`patchAssetButton patchAssetButton-${patch.shape}`} variant="ghost" aria-label={`${patch.name} example action`}>
              <Image src={patch.path} alt="" fill sizes="132px" />
              <span>{patch.shape === "circle" ? "Open" : "Choose"}</span>
            </Button>
            <strong>{patch.name}</strong>
            <CopyPath value={`public${patch.path}`} />
          </article>)}
        </CardContent>
        <CardFooter><code translate="no">Button + patchAssetButton + patchAssetButton-circle|square</code></CardFooter>
      </Card>

      <Card className="assetCatalogueCard material-surface material-cardboard-paper">
        <CardHeader>
          <CardTitle className="font-heading text-3xl">Material-bearing controls</CardTitle>
          <CardDescription>The control remains shadcn; an approved global material class supplies the authored surface.</CardDescription>
        </CardHeader>
        <CardContent className="assetCompositionList">
          {COMPOSITIONS.map((item) => <article key={item.path}>
            {item.name === "Cork notice" ? <aside className={`${item.className} assetCorkNotice`}>
              <span className="brand-asset fastener-push-pin icon-small" aria-hidden="true" />
              <strong>Planning reminder</strong><span>Pin information; do not fake the cork or fastener.</span>
            </aside> : <Button className={item.className} variant={item.name === "Paper action" ? "outline" : "default"}>{item.name}</Button>}
            <p>{item.use}</p>
            <code translate="no">{item.className}</code>
            <CopyPath value={`public${item.path}`} />
          </article>)}
        </CardContent>
      </Card>

      <Card className="assetCatalogueCard material-surface material-cardboard-paper assetCatalogueWide">
        <CardHeader>
          <CardTitle className="font-heading text-3xl">Semantic HTML with asset details</CardTitle>
          <CardDescription>Images decorate meaningful HTML; they never replace headings, labels, links, or controls.</CardDescription>
        </CardHeader>
        <CardContent className="semanticAssetExamples">
          <article className="material-surface material-cardboard-paper assetPinnedCard">
            <span className="assetFastener brand-asset fastener-masking-tape icon-large" aria-hidden="true" />
            <span className="brand-asset music-icon icon-medium" aria-hidden="true" />
            <div><small>Music &amp; dance</small><h3>Keep the steady beat</h3><p>A semantic lesson card with approved tape and curriculum icon assets.</p></div>
          </article>
          <div className="assetReferenceStack">
            <CopyPath value="public/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" />
            <CopyPath value="public/brand-kit-icon-sheets/individual-icons/subject-music-dance.png" />
            <code translate="no">article + material-surface material-cardboard-paper + authored Image details</code>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>;
}
