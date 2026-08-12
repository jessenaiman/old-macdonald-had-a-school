"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  { label: "Asset toolkit", href: "#asset-toolkit", kind: "felt", path: "/design-assets/web-material-library-v1/felt/felt-01-old-macdonald-tile.png" },
  { label: "Asset patterns", href: "#asset-patterns", kind: "patch-brown", path: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.png" },
  { label: "Badge recipe", href: "#badge-recipe", kind: "patch-pink", path: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-square.png" },
  { label: "Palette", href: "#palette", kind: "woven", path: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-01-old-macdonald-tile.png" },
  { label: "Staff roster", href: "#cast-staff", kind: "construction", path: "/design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.png" },
  { label: "Student roster", href: "#cast-students", kind: "cork", path: "/design-assets/cork-board-kit-v1/seamless-cork-tile.png" },
  { label: "Actual controls", href: "#site-controls", kind: "cardboard", path: "/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png" },
  { label: "System gallery", href: "#controls", kind: "felt-blue", path: "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png" },
  { label: "Typography", href: "#typography", kind: "paper", path: "/design-assets/web-material-library-v1/construction-paper/construction-paper-09-hopper-tile.png" },
] as const;

const LINK_SPECIMENS = [
  { label: "Read the cast source", href: "/CAST_AND_ROLES.md", kind: "taped-note", path: "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" },
  { label: "Open the guide source", href: "/branding/guide", kind: "stitched-tab", path: "/design-assets/web-material-library-v1/thread-overlays/thread-overlay-01-old-macdonald-tile.png" },
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
    <Button type="button" variant="outline" size="xs" onClick={copy}>{copied ? "Copied" : "Copy path"}</Button>
  </div>;
}

export function BrandSpecimenNav() {
  return <section className="brandSpecimenShelf" aria-labelledby="brand-specimen-shelf-title">
    <header>
      <div><span>Working button and background examples</span><h2 id="brand-specimen-shelf-title">Navigate through the materials</h2></div>
      <Button asChild variant="link"><a href="/BRAND_ASSET_RECIPES.md">Open all recipes</a></Button>
    </header>
    <nav aria-label="Brand guide specimen sections">
      {NAV_SPECIMENS.map((item) => <article className="brandSpecimen" data-specimen={item.kind} key={item.href}>
        <Button asChild variant="ghost"><a href={item.href}>{item.label}</a></Button>
        <CopyPath value={`public${item.path}`} />
      </article>)}
    </nav>
    <section className="brandLinkShelf" aria-labelledby="brand-link-shelf-title">
      <div><span>Semantic hyperlink objects</span><h3 id="brand-link-shelf-title">Links do not have to masquerade as buttons</h3></div>
      <nav aria-label="Creative hyperlink examples">
        {LINK_SPECIMENS.map((item) => <article className="brandLinkSpecimen" data-link-specimen={item.kind} key={item.href}>
          <a href={item.href}>
            {item.kind === "portrait-link" ? <Image src={item.path} alt="" width={64} height={64} /> : null}
            {item.kind === "taped-note" || item.kind === "pinned-label" ? <Image src={item.path} alt="" width={70} height={38} /> : null}
            <span>{item.label}</span>
          </a>
          <CopyPath value={`public${item.path}`} />
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
              <Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={30} height={30} />
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
            <Image className="assetFastener" src="/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" alt="" width={92} height={46} />
            <Image src="/brand-kit-icon-sheets/individual-icons/subject-music-dance.png" alt="" width={72} height={72} />
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
