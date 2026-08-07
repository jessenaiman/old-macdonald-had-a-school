from __future__ import annotations

import csv
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT_MD = ROOT / "docs" / "DESIGN_ASSET_MASTER_LIST.md"
OUT_CSV = ROOT / "docs" / "design-asset-master-list.csv"
OUT_JSON = ROOT / "docs" / "design-asset-master-list.json"

SCAN_ROOTS = [
    PUBLIC / "icons",
    PUBLIC / "patches",
    PUBLIC / "staff_and_students",
    PUBLIC / "brand-kit-icon-sheets",
    PUBLIC / "core-material-sheets-v1",
    PUBLIC / "texture-assets",
    PUBLIC / "design-assets" / "blank-felt-patches-v1",
    PUBLIC / "design-assets" / "classroom-fasteners-v1",
    PUBLIC / "design-assets" / "theme-toggle-patches-v1",
    PUBLIC / "design-assets" / "web-material-library-v1",
    PUBLIC / "design-concepts" / "grade-family" / "canva-parts",
]

RASTER_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
KNOWN_DO_NOT_USE_PREFIXES = {
    "public/design-assets/blank-felt-patches-v1/individual-patches/":
        "Known clipped blank rectangle export; use an approved replacement only.",
}


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def family(path: Path) -> str:
    p = rel(path)
    rules = [
        ("public/design-assets/blank-felt-patches-v1", "blank felt patches"),
        ("public/design-assets/classroom-fasteners-v1", "classroom fasteners"),
        ("public/design-assets/theme-toggle-patches-v1", "theme toggle patches"),
        ("public/design-assets/web-material-library-v1", "web material textures"),
        ("public/design-concepts/grade-family/canva-parts", "Canva grade-page parts"),
        ("public/brand-kit-icon-sheets", "brand-kit curriculum icons"),
        ("public/core-material-sheets-v1", "core material review sheets"),
        ("public/texture-assets", "legacy and production texture assets"),
        ("public/staff_and_students", "canonical character portraits"),
        ("public/icons/early-years", "early-years activity icons"),
        ("public/icons/canva-animal-icons", "Canva animal icons"),
        ("public/icons/old-macdonald-icon-pack", "classroom and education icon pack"),
        ("public/icons/staff", "staff and student icons"),
        ("public/icons", "miscellaneous icon sheets"),
        ("public/patches", "character patches"),
    ]
    return next((name for prefix, name in rules if p.startswith(prefix)), "other")


def role(path: Path) -> str:
    name = path.name.lower()
    p = rel(path).lower()
    if any(token in name for token in ("contact-sheet", "atlas", "full-sheet", "sprite-sheet", "keyed")):
        return "reference sheet / atlas"
    if "/canva-parts/" in p:
        return "layout reference part"
    if "tile" in name or "texture" in name:
        return "repeatable material texture"
    if "fastener" in p or any(token in name for token in ("pin", "clip", "tape", "staple", "thread")):
        return "fastener / attachment cue"
    if "patch" in p or "badge" in name or "button" in name:
        return "felt patch / badge"
    if "staff_and_students" in p or "/icons/staff/" in p:
        return "character portrait / icon"
    return "curriculum / classroom icon"


def inspect_image(path: Path) -> dict:
    record = {
        "path": rel(path),
        "family": family(path),
        "role": role(path),
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }
    try:
        with Image.open(path) as im:
            im.load()
            record.update({"format": im.format, "mode": im.mode, "width": im.width, "height": im.height})
            rgba = im.convert("RGBA")
            alpha = rgba.getchannel("A")
            extrema = alpha.getextrema()
            bbox = alpha.getbbox()
            has_transparency = extrema[0] < 255
            record["has_transparency"] = has_transparency
            record["alpha_bbox"] = list(bbox) if bbox else None
            if bbox:
                left, top, right, bottom = bbox
                margins = [left, top, im.width - right, im.height - bottom]
                touches = [
                    side
                    for side, margin in zip(("left", "top", "right", "bottom"), margins)
                    if margin == 0
                ]
            else:
                margins = None
                touches = []
            record["transparent_margins_ltrb"] = margins
            record["alpha_touches_edges"] = touches
    except Exception as exc:
        record.update({"error": str(exc), "status": "BROKEN/UNREADABLE", "note": str(exc)})
        return record

    name = path.name.lower()
    exempt_edge_roles = {
        "reference sheet / atlas",
        "layout reference part",
        "repeatable material texture",
    }
    is_known_clipped_rectangle = (
        record["path"].endswith("-rectangle.png")
        and any(record["path"].startswith(prefix) for prefix in KNOWN_DO_NOT_USE_PREFIXES)
    )
    is_extraction_family = record["path"].startswith((
        "public/icons/early-years/",
        "public/icons/canva-animal-icons/",
    ))
    is_intentionally_tight = record["path"].startswith((
        "public/brand-kit-icon-sheets/individual-icons/",
        "public/icons/staff/",
        "public/staff_and_students/",
    )) or "favicon" in name or name.startswith("stitch-")

    if is_known_clipped_rectangle:
        record["status"] = "DO NOT USE"
        record["note"] = next(
            note for prefix, note in KNOWN_DO_NOT_USE_PREFIXES.items()
            if record["path"].startswith(prefix)
        )
    elif record["has_transparency"] and record["alpha_touches_edges"] and is_extraction_family:
        record["status"] = "REVIEW: EXTRACTION ARTIFACTS"
        record["note"] = "Tight chroma-key crop; visible edge streaks or cut-off artwork are possible."
    elif record["has_transparency"] and record["alpha_touches_edges"] and is_intentionally_tight:
        record["status"] = "USABLE SOURCE"
        record["note"] = "Intentionally tight crop; preserve aspect ratio and add spacing in the layout slot."
    elif record["has_transparency"] and record["alpha_touches_edges"] and record["role"] not in exempt_edge_roles:
        record["status"] = "REVIEW: POSSIBLE CLIPPING"
        record["note"] = "Opaque alpha reaches canvas edge; inspect before development use."
    elif any(token in name for token in ("contact-sheet", "atlas", "full-sheet", "sprite-sheet", "keyed")) or "/canva-parts/" in record["path"]:
        record["status"] = "REFERENCE ONLY"
        record["note"] = "Use to select or compare assets; do not flatten interactive UI from it."
    else:
        record["status"] = "USABLE SOURCE"
        record["note"] = "Use only in its documented canonical role."
    return record


def main() -> None:
    paths = sorted(
        {
            path
            for root in SCAN_ROOTS
            if root.exists()
            for path in root.rglob("*")
            if path.is_file() and path.suffix.lower() in RASTER_EXTENSIONS
        }
    )
    rows = [inspect_image(path) for path in paths]

    duplicate_groups = defaultdict(list)
    for row in rows:
        duplicate_groups[row["sha256"]].append(row["path"])
    duplicates = [group for group in duplicate_groups.values() if len(group) > 1]

    fields = [
        "path", "family", "role", "status", "note", "format", "mode", "width", "height", "bytes",
        "has_transparency", "transparent_margins_ltrb", "alpha_touches_edges", "alpha_bbox", "sha256", "error",
    ]
    with OUT_CSV.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    OUT_JSON.write_text(
        json.dumps({"assets": rows, "exact_duplicate_groups": duplicates}, indent=2),
        encoding="utf-8",
    )

    families = defaultdict(list)
    for row in rows:
        families[row["family"]].append(row)
    status_counts = Counter(row["status"] for row in rows)

    lines = [
        "# Design asset master list",
        "",
        "Generated from the current working tree. This is the development handoff index for icons, patches,",
        "fasteners, material textures, canonical portraits, and separated Canva page parts.",
        "",
        "## Locked usage rules",
        "",
        "- Canva-authored files provide textures, patches, icons, and physical attachment cues.",
        "- Figma defines typography, spacing, hierarchy, responsive layout, and component boundaries.",
        "- React/HTML must keep visible labels, links, buttons, and layout semantic; reference sheets are not UI components.",
        "- Preserve character names, roles, and exact colours from `public/CAST_AND_ROLES.md`.",
        "- Any `REVIEW` asset must be visually cleared before use.",
        "- Do not use files marked `DO NOT USE` or silently substitute a lookalike.",
        "",
        "## Canonical source order",
        "",
        "1. `public/CAST_AND_ROLES.md` for names, roles, grade ownership, and exact hex colours.",
        "2. `public/staff_and_students/*-transparent-circle.png` for canonical character artwork.",
        "3. `public/design-assets/blank-felt-patches-v1/individual-patches/*-{circle,square}.png` for colour-bearing patch backgrounds.",
        "4. `public/brand-kit-icon-sheets/individual-icons/` for grade and subject icons.",
        "5. `public/design-assets/classroom-fasteners-v1/individual-icons/` for pins, clips, tape, staples, buttons, and thread cues.",
        "6. `public/design-assets/web-material-library-v1/` for repeatable felt, paper, cardboard, woven-fabric, and thread textures.",
        "7. `public/design-concepts/`, `public/design-explorations-v5/`, and `public/design-concepts/grade-family/canva-parts/` for composition reference only.",
        "",
        "For a canonical coloured character badge, layer the transparent character artwork over the matching circle patch. Do not recolour either layer in CSS.",
        "",
        "| Website identity | Character art | Colour patch | Locked colour |",
        "| --- | --- | --- | --- |",
        "| Daycare | `miss-puddles-transparent-circle.png` | `02-miss-puddles-circle.png` | `#E8A227` |",
        "| Kindergarten | `mr-rusty-transparent-circle.png` | `03-mr-rusty-circle.png` | `#2C6C9B` |",
        "| Grade 1 | `miss-hayley-transparent-circle.png` | `04-miss-hayley-circle.png` | `#C9527A` |",
        "| Grade 2 | `mr-sam-transparent-circle.png` | `05-mr-sam-circle.png` | `#1F6B6B` |",
        "",
        "> Preschool identity conflict: the current `CAST_AND_ROLES.md` assigns Mr Maisy to Preschool, while existing UI/reference work assigns Miss Maisy. Treat the current cast file as repository truth and flag the stale reference before implementation; never silently choose or recolour.",
        "",
        "## Figma and Canva provenance",
        "",
        "- Canva supplied the raster material pieces and separated page parts now stored under `public/`.",
        "- Figma supplied layout, typography, hierarchy, and component-boundary intent. The local `figma-copy-design/` export is a prototype reference, not production code.",
        "- The local Figma export still contains emoji, generated CSS texture/stitch effects, and stale role/colour assignments. Development agents must not copy those parts as canonical assets.",
        "- A live Figma file key is not stored in the repository. Review the connected Figma file again when a node-specific URL is available.",
        "",
        "## Summary",
        "",
        f"- Total raster assets indexed: **{len(rows)}**",
        *[f"- {status}: **{count}**" for status, count in sorted(status_counts.items())],
        f"- Exact duplicate groups: **{len(duplicates)}**",
        "- Full machine-readable records: `docs/design-asset-master-list.csv` and `docs/design-asset-master-list.json`",
        "",
        "## Asset families",
        "",
        "| Family | Files | Usable | Reference | Clipping review | Do not use | Primary role |",
        "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ]
    for name, group in sorted(families.items()):
        counts = Counter(row["status"] for row in group)
        review_count = sum(count for status, count in counts.items() if status.startswith("REVIEW"))
        roles = Counter(row["role"] for row in group)
        lines.append(
            f"| {name} | {len(group)} | {counts['USABLE SOURCE']} | {counts['REFERENCE ONLY']} | "
            f"{review_count} | {counts['DO NOT USE']} | {roles.most_common(1)[0][0]} |"
        )

    lines.extend(["", "## Files requiring review or exclusion", ""])
    flagged = [row for row in rows if row["status"] not in {"USABLE SOURCE", "REFERENCE ONLY"}]
    if flagged:
        lines.extend([
            "| Status | File | Pixels | Edge contact | Reason |",
            "| --- | --- | ---: | --- | --- |",
        ])
        for row in flagged:
            edges = ", ".join(row.get("alpha_touches_edges", [])) or "—"
            pixels = f"{row.get('width', '?')}×{row.get('height', '?')}"
            lines.append(f"| {row['status']} | `{row['path']}` | {pixels} | {edges} | {row['note']} |")
    else:
        lines.append("No files were automatically flagged.")

    lines.extend(["", "## Exact duplicate groups", ""])
    if duplicates:
        for index, group in enumerate(duplicates, 1):
            lines.append(f"{index}. " + "; ".join(f"`{path}`" for path in group))
    else:
        lines.append("No exact duplicate images were found in the indexed families.")

    lines.extend([
        "",
        "## Per-file inventory",
        "",
        "The CSV is the canonical exhaustive list. Use its `family`, `role`, `status`, pixel dimensions, alpha bounds,",
        "and SHA-256 columns when assigning assets to implementation agents.",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(json.dumps({
        "assets": len(rows),
        "status_counts": status_counts,
        "families": {name: len(group) for name, group in families.items()},
        "duplicates": len(duplicates),
        "outputs": [rel(OUT_MD), rel(OUT_CSV), rel(OUT_JSON)],
    }, indent=2, default=dict))


if __name__ == "__main__":
    main()
