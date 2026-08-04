# Old MacDonald Had a School — asset inventory

**Scope:** `C:/Users/jesse/OneDrive/Documents/Endless Measures/Curriculum/old-macdonald-had-a-school/src/assets`

**Canonical references used:**

- `C:/Users/jesse/OneDrive/Documents/New project/public/CAST_AND_ROLES.md`
- `C:/Users/jesse/OneDrive/Documents/New project/public/Old_MacDonalds_Farm_School_Character_Deck_v2.pdf` — 19 pages, Google-created PDF, 8 staff pages plus 8 student pages and index/reference pages.

## Executive summary

- The tree contains **1,730 files**: 32 PNGs, 192 PDFs, 1,428 Markdown files, 38 HTML files, 29 TXT files, 3 JSON files, 2 DOCX files, 2 XLSX files, 3 Python files, 3 PYC files, and 1 log.
- The only clear website-ready visual assets inside `src/assets` are the **32 transparent PNG character portraits**: one base portrait and one alternate portrait per canonical name.
- The base portraits map to the canonical 8 staff and 8 students by name/species and broadly match the deck’s visible wardrobe cues. They are portrait crops, not full-body scene art.
- Two alternate files are materially mislabelled: `sam-red.png` is the Scout/beagle depiction, while `scout-green.png` is the Sam/pig depiction.
- The colour suffixes are not a reliable canon key. Several suffixes conflict with the canonical signature colours, and some alternates change wardrobe/pose as well as colour.
- No logo, brand emblem, homepage hero, lesson video, or local video file exists under `src/assets`. The current application references those from outside this bounded folder (`src/imports` and `public`).

## 1. Inventory by intended use

| Intended use | Asset path(s) | Count / dimensions / pages | Apparent subject and disposition |
|---|---|---:|---|
| Canonical character portraits | `src/assets/*.png` | 32 PNGs; 196–286 px wide × 247–286 px high; transparent portrait crops | 16 named characters, base plus alternate render. Use base files as the safest canonical defaults. |
| Logos / brand | No matching files under `src/assets` | 0 | No logo/emblem asset in scope. Existing app references include `src/imports/logo_-_dark_blue.png`, `src/imports/logo_-_alternate.png`, and `/public/brand-emblem.png`, which are outside this inventory. |
| Homepage / hero | No matching files under `src/assets` | 0 | No farm-school hero art in scope. Existing app code references `src/imports/oldmac-school.png` and `src/imports/ChatGPT_Image_Jul_30__2026__04_53_23_PM__5_.png`, outside this inventory. |
| Lesson / music research | `src/assets/early-years-music-resources/song_versions/*.md` | 1,405 Markdown files | Song, rhyme, fingerplay, lesson-plan, and activity notes. Research/content source, not visual UI art. |
| Lesson / video research | `src/assets/early-years-music-resources/**/web/*.html` and selected `.txt`/`.md` | 38 HTML plus related notes | Saved web pages and extracted lesson/music references. No local video media. Treat as research/archive; check rights before publishing excerpts. |
| Printables / supplemental documents | `src/assets/early-years-music-resources/**/pdf/*.pdf`, `**/doc/*.docx`, `**/metadata/*.json` | 192 PDFs; 2 DOCX; 21 metadata files | External lesson plans, lyric sheets, activity sheets, curricula, historical books, and research metadata. Suitable as internal references or carefully rights-cleared downloads, not automatically as site content. |
| OCR / extracted support files | `src/assets/early-years-music-resources/ocr/*`, `metadata/*`, `__pycache__/*`, root scripts/log | 13 OCR files, 21 metadata files, 3 PYC, 3 PY, 1 log, 2 XLSX | Processing outputs and research indexes; archive/developer support, not visible website assets. |
| Uncertain / archive | `src/assets/early-years-music-resources/01-*` through `09-*` and all source-format files below them | 1,698 files excluding the 32 PNGs | Large research corpus. Keep out of the public asset bundle unless a specific lesson/document is selected and rights/attribution are confirmed. |

### File-type and path coverage

All paths below are relative to `src/assets/` and include every file in the corresponding directory. The directory totals were checked recursively.

| Directory | Files | Types / page totals where relevant |
|---|---:|---|
| `.` | 32 | 32 PNG portraits |
| `early-years-music-resources/song_versions/` | 1,405 | 1,405 Markdown song/reference variants |
| `early-years-music-resources/01-libraries-agencies/` | 34 | 25 PDF / 452 pages; 8 HTML; 1 TXT |
| `early-years-music-resources/02-educators-publishers/` | 31 | 28 PDF / 312 pages; 2 DOCX; 1 HTML |
| `early-years-music-resources/03-performers-programs/` | 28 | 24 PDF / 171 pages; 4 HTML |
| `early-years-music-resources/04-historical-public-domain/` | 25 | 16 PDF / 2,507 pages; 8 TXT; 1 HTML |
| `early-years-music-resources/05-libraries-deep/` | 25 | 19 PDF / 182 pages; 6 HTML |
| `early-years-music-resources/06-educators-performers-deep/` | 35 | 14 PDF / 256 pages; 10 HTML; 1 TXT; 10 OCR/support files |
| `early-years-music-resources/07-historical-more/` | 21 | 15 PDF / 1,942 pages; 6 TXT |
| `early-years-music-resources/08-libraries-more/` | 19 | 17 PDF / 325 pages; 2 HTML |
| `early-years-music-resources/09-educators-performers-more/` | 43 | 34 PDF / 539 pages; 7 HTML; 2 support files |
| `early-years-music-resources/metadata/` | 21 | JSON/support metadata |
| `early-years-music-resources/ocr/` | 13 | OCR text outputs |
| `early-years-music-resources/__pycache__/` | 3 | PYC processing cache |

The 192 PDFs total **6,686 pages**. Page counts range from 1 to 334; the historical/public-domain folders are the largest page collections.

## 2. Character portrait inventory

All files below are direct children of:
`C:/Users/jesse/OneDrive/Documents/Endless Measures/Curriculum/old-macdonald-had-a-school/src/assets/`

| Canonical character | Base asset | Base pixels | Alternate asset | Alternate pixels | Apparent depiction / use |
|---|---|---:|---|---:|---|
| Old MacDonald — human adult | `old-mac.png` | 232×286 | `old-macdonald-yellow.png` | 286×286 | Elderly bearded man, hat, red plaid, blue overalls. Base is the default; alternate is a close alternate portrait. |
| Miss Puddles — duck adult | `miss-puddles.png` | 214×267 | `miss-puddles-purple.png` | 267×267 | Yellow duck adult in blue gingham/bow styling. Base is the default; suffix colour is not canonically meaningful. |
| Mr Rusty — horse adult | `mr-rusty.png` | 232×285 | `mr-rusty-blue.png` | 285×285 | Brown horse, dark mane, red/blue bandana variants. Base is safest for canon. |
| Miss Hayley — human adult | `miss-hayley.png` | 232×267 | `miss-hayley-purple.png` | 267×267 | Human woman with cowboy hat, red plaid, blue overalls. Base and alternate both fit the role; neither uses the canonical pink signature colour literally. |
| Mr Sam — pig adult | `mr-sam.png` | 232×267 | `mr-sam-blue.png` | 267×267 | Pink pig adult with round glasses, bow tie, green vest. Both depict Mr Sam correctly. |
| Mr Maisy — cow adult | `mr-maisy.png` | 250×286 | `mr-maisy-orange.png` | 286×286 | Black-and-white cow adult with red plaid/bandana and denim. Base is the default. |
| Mr Puddles — duck adult | `mr-puddles.png` | 196×267 | `mr-puddles-green.png` | 267×267 | Pale-yellow duck adult with checkered cap and blue vest. Both depict Mr Puddles correctly. |
| Miss Maisy — cow adult | `miss-maisy.png` | 232×286 | `miss-maisy-purple.png` | 286×286 | Cow adult with floral apron/blue dress styling. Base is the default. |
| Hopper — rabbit student | `hopper.png` | 232×286 | `hopper-red.png` | 286×286 | Cream rabbit, orange vest; alternate is a close pose/wardrobe render. Both depict Hopper. |
| Whiskers — cat student | `whiskers.png` | 215×247 | `whiskers-orange.png` | 247×247 | Grey tabby with green eyes, lavender scarf, teal satchel. Both depict Whiskers. |
| Scout — dog student | `scout.png` | 250×247 | `scout-green.png` | 250×250 | Base is the beagle/explorer and canonical Scout. **Alternate is not Scout: it depicts the pink pig/Sam.** |
| Penny — chick student | `penny.png` | 214×267 | `penny-orange.png` | 267×267 | Yellow chick with pink bow and blue backpack/straps. Both depict Penny. |
| Maisy — cow student | `maisy.png` | 250×286 | `maisy-yellow.png` | 286×286 | Black-and-white calf/cow with blue neckwear. Both depict Maisy. |
| Puddles — duck student | `puddles.png` | 215×267 | `puddles-blue.png` | 267×267 | Yellow duckling with blue cap/backpack. Both depict Puddles. |
| Sam — pig student | `sam.png` | 250×247 | `sam-red.png` | 250×250 | Base is the pink piglet with glasses/green bow tie and overalls. **Alternate is not Sam: it depicts the beagle/Scout.** |
| Rusty — horse student | `rusty.png` | 214×266 | `rusty-blue.png` | 266×266 | Brown foal with mane and red/green vest/bandana variants. Both depict Rusty. |

PNG dimensions are intrinsic pixel dimensions; all 32 are small transparent portrait crops. No embedded logo, landscape hero, or full-scene character composition was found in this folder.

## 3. Canon comparison and conflicts

### Canonical roster check

| Canonical group | Expected | Present as correctly labelled base assets | Result |
|---|---:|---:|---|
| Staff | 8 | 8 | Names and species align: Old MacDonald human; Miss Puddles duck; Mr Rusty horse; Miss Hayley human; Mr Sam pig; Mr Maisy cow; Mr Puddles duck; Miss Maisy cow. |
| Students | 8 | 8 | Names and species align in the base set: Hopper rabbit; Whiskers cat; Scout dog; Penny chick; Maisy cow; Puddles duck; Sam pig; Rusty horse. |

### Naming / role / wardrobe findings

1. **Critical label swap:** `sam-red.png` is visually Scout (beagle, explorer hat/blue neckerchief), while `scout-green.png` is visually Sam (pink pig, glasses, green bow tie). Do not use either alternate by filename until renamed or explicitly remapped in code; the user requested no asset edits, so leave files unchanged.
2. **Signature-colour suffixes are unreliable:** canonical colours are subject/role-coded, but alternate suffixes include `yellow`, `purple`, `orange`, `green`, `blue`, and `red` in combinations that do not consistently match the canonical hex values. Treat suffixes as version labels, not identity labels.
3. **Staff/student overlaps are expected but must retain honorifics:** `Mr Sam` and `Sam`, `Mr Rusty` and `Rusty`, `Mr Maisy` and `Maisy`, `Mr Puddles` and `Puddles`, and `Miss Puddles`/`Puddles` are distinct canon characters. UI labels should always preserve adult honorifics.
4. **Wardrobe match is broad, not exhaustive:** the base portraits show the expected species and several signature items (Old MacDonald’s hat/plaid/overalls; Miss Hayley’s hat/plaid/overalls; Mr Sam’s glasses/bow tie/vest; Whiskers’ scarf/satchel; Scout’s explorer styling; Penny’s bow; Sam’s glasses/green bow tie). The portraits are head-and-shoulders/upper-body crops, so full identity-lock details from the PDF—boots, backpacks, instruments, props, posture—cannot be verified from these assets.
5. **No extra cast was found:** no image asset clearly introduces a non-canonical named character. The research corpus contains unrelated source material and should not be treated as cast art.

## 4. Duplicate and near-duplicate check

### Exact duplicates

SHA-256 comparison found three exact duplicate PDF pairs:

| Duplicate group | Note |
|---|---|
| `early-years-music-resources/01-libraries-agencies/pdf/health-unit-nursery-rhymes-circle-time-cards.pdf` and `early-years-music-resources/02-educators-publishers/pdf/health-unit-nursery-rhymes-fingerplays-songs-cards.pdf` | Byte-identical PDFs |
| `early-years-music-resources/01-libraries-agencies/pdf/uark-ecep-favorite-songs-fingerplays.pdf` and `early-years-music-resources/02-educators-publishers/pdf/uark-ecec-favorite-songs-and-fingerplays.pdf` | Byte-identical PDFs |
| `early-years-music-resources/05-libraries-deep/pdf/booktrust-rhyme-sheet-animals-and-nature.pdf` and `early-years-music-resources/05-libraries-deep/pdf/booktrust-rhyme-sheet-bird-themed.pdf` | Byte-identical PDFs despite different filenames |

No exact duplicate PNGs were found. The 16 base/alternate PNG pairs are related by filename and subject intent but are not byte-identical; they differ in crop, pose, clothing and/or colour treatment. The Scout/Sam pair is a semantic near-duplicate conflict caused by swapped labels, not a safe duplicate.

## 5. Recommended existing asset per visible website slot

| Website slot | Recommended existing asset | Confidence / caveat |
|---|---|---|
| Header/footer brand mark | No asset in `src/assets`; keep the existing outside-scope brand asset already used by the app: `src/imports/logo_-_dark_blue.png` or `src/imports/logo_-_alternate.png` | High for current implementation, but outside this inventory. Do not substitute a character portrait as a logo. |
| About-page emblem | No asset in `src/assets`; current app points to `/public/brand-emblem.png` | High for current implementation, outside scope. |
| Homepage hero / school scene | No asset in `src/assets`; current app points to `src/imports/oldmac-school.png` | No in-scope replacement. Character portraits are not hero art. |
| Staff directory cards | Base portraits: `old-mac.png`, `miss-puddles.png`, `mr-rusty.png`, `miss-hayley.png`, `mr-sam.png`, `mr-maisy.png`, `mr-puddles.png`, `miss-maisy.png` | High. Preserve honorifics in labels. |
| Student directory cards | Base portraits: `hopper.png`, `whiskers.png`, `scout.png`, `penny.png`, `maisy.png`, `puddles.png`, `sam.png`, `rusty.png` | High. Do not use `sam-red.png` or `scout-green.png` by their filenames. |
| Lesson teacher badge | Choose the base staff portrait by subject: `miss-puddles.png` daycare, `mr-rusty.png` music/dance, `miss-hayley.png` Grade 1/2/drama, `mr-sam.png` math/building, `mr-maisy.png` PE, `mr-puddles.png` art/photography, `miss-maisy.png` office/garden/health, `old-mac.png` whole-school/music | High; matches the canonical teaching-role table. |
| Music-unit student strip | Use the relevant base student portraits, one each across the four units as required by the curriculum; never infer identity from alternate colour suffixes | High. Rotate the eight students without repeating a child within a unit unless the content explicitly requires it. |
| Lesson/video thumbnail | Use a canonical base portrait only when a character badge is required; otherwise no suitable in-scope visual exists | Medium. The research HTML/PDF files are references, not cleared thumbnail art. |
| Printable/supplement card | Use the selected canonical base portrait as a small badge only; link the specific PDF/DOCX after rights/attribution review | Medium. The document corpus is not automatically publishable. |

## Unresolved items for migration

- Resolve the `sam-red.png` / `scout-green.png` filename-to-depiction swap before any alternate portrait is exposed.
- Decide whether the alternate portraits are approved canon versions or only exploratory colour/wardrobe variants; the deck does not define these suffix versions.
- Confirm rights, attribution, and intended publication status for the 192 PDFs, 38 saved HTML pages, and 1,405 song-version Markdown files before surfacing them to end users.
- If the migration needs a true homepage scene, logo, or video thumbnail, use the already referenced outside-scope assets or obtain an approved asset; none exists in `src/assets`.

