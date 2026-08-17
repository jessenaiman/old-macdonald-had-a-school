import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_IMAGES = path.join(ROOT, "assets", "source-images", "public");
const SOURCE = path.join(SOURCE_IMAGES, "brand-emblem.png");
const FAMILY = path.join(ROOT, "public", "design-assets", "brand-emblem-v1");
const INDIVIDUALS = path.join(FAMILY, "individual-marks");
const FLAT = path.join(FAMILY, "candidate-flat-marks");
const DETAIL = path.join(FAMILY, "candidate-detail-marks");
const REVIEW = path.join(ROOT, "public", "design-assets", "brand-emblem-v1-review");
const FLAT_SOURCE = path.join(SOURCE_IMAGES, "design-assets", "brand-emblem-v1-review", "brand-emblem-flat-source-v01.png");

const exports = [
  [16, "brand-emblem-micro-16.png"],
  [32, "brand-emblem-favicon-32.png"],
  [44, "brand-emblem-nav-44.png"],
  [48, "brand-emblem-nav-48.png"],
  [64, "brand-emblem-nav-64.png"],
  [96, "brand-emblem-card-96.png"],
  [128, "brand-emblem-card-128.png"],
  [256, "brand-emblem-display-256.png"],
  [512, "brand-emblem-print-512.png"],
];

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

async function transparentMaster() {
  const { data, info } = await sharp(SOURCE).raw().toBuffer({ resolveWithObject: true });
  const pixels = info.width * info.height;
  const background = new Uint8Array(pixels);
  const queued = new Uint8Array(pixels);
  const queue = new Int32Array(pixels);
  let head = 0;
  let tail = 0;

  const enqueue = (index) => {
    if (queued[index]) return;
    queued[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 1; y < info.height - 1; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const offset = index * info.channels;
    const peak = Math.max(data[offset], data[offset + 1], data[offset + 2]);
    if (peak > 48) continue;
    background[index] = 1;
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < info.width) enqueue(index + 1);
    if (y > 0) enqueue(index - info.width);
    if (y + 1 < info.height) enqueue(index + info.width);
  }

  const rgba = Buffer.alloc(pixels * 4);
  for (let index = 0; index < pixels; index += 1) {
    const sourceOffset = index * info.channels;
    const targetOffset = index * 4;
    rgba[targetOffset] = data[sourceOffset];
    rgba[targetOffset + 1] = data[sourceOffset + 1];
    rgba[targetOffset + 2] = data[sourceOffset + 2];
    rgba[targetOffset + 3] = background[index] ? 0 : 255;
  }

  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function removeMagenta(source) {
  const { data, info } = await sharp(source).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let index = 0; index < info.width * info.height; index += 1) {
    const sourceOffset = index * info.channels;
    const targetOffset = index * 4;
    const red = data[sourceOffset];
    const green = data[sourceOffset + 1];
    const blue = data[sourceOffset + 2];
    const keyDistance = Math.sqrt((255 - red) ** 2 + green ** 2 + (255 - blue) ** 2);
    const alpha = Math.max(0, Math.min(255, Math.round((keyDistance - 18) * (255 / 82))));
    rgba[targetOffset] = alpha < 255 ? Math.min(red, green * 2) : red;
    rgba[targetOffset + 1] = green;
    rgba[targetOffset + 2] = alpha < 255 ? Math.min(blue, green * 2) : blue;
    rgba[targetOffset + 3] = alpha;
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

function sharpenFor(size) {
  if (size <= 32) return { sigma: 0.45, m1: 1.15, m2: 1.7 };
  if (size <= 64) return { sigma: 0.55, m1: 1.05, m2: 1.5 };
  if (size <= 128) return { sigma: 0.65, m1: 0.9, m2: 1.3 };
  return { sigma: 0.8, m1: 0.65, m2: 1.1 };
}

async function build() {
  await fs.mkdir(INDIVIDUALS, { recursive: true });
  await fs.mkdir(FLAT, { recursive: true });
  await fs.mkdir(DETAIL, { recursive: true });
  await fs.mkdir(REVIEW, { recursive: true });
  const master = await transparentMaster();
  const flatMaster = await removeMagenta(FLAT_SOURCE);
  const masterPath = path.join(FAMILY, "brand-emblem-transparent-master-1254.png");
  await sharp(master).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(masterPath);

  for (const [size, filename] of exports) {
    const inset = Math.max(1, Math.round(size * 0.045));
    const markSize = size - inset * 2;
    await sharp(master)
      .resize(markSize, markSize, { fit: "contain", kernel: sharp.kernel.lanczos3 })
      .sharpen(sharpenFor(size))
      .extend({ top: inset, bottom: inset, left: inset, right: inset, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true, palette: size <= 64, quality: 100 })
      .toFile(path.join(INDIVIDUALS, filename));
  }

  for (const size of [16, 32, 44, 48, 64]) {
    const inset = Math.max(1, Math.round(size * 0.045));
    await sharp(flatMaster)
      .resize(size - inset * 2, size - inset * 2, { fit: "contain", kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.5, m1: 0.9, m2: 1.4 })
      .extend({ top: inset, bottom: inset, left: inset, right: inset, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(FLAT, `brand-emblem-flat-${size}.png`));
  }

  for (const size of [512, 1024]) {
    const inset = Math.max(1, Math.round(size * 0.035));
    await sharp(master)
      .resize(size - inset * 2, size - inset * 2, { fit: "contain", kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.8, m1: 0.55, m2: 1.05 })
      .extend({ top: inset, bottom: inset, left: inset, right: inset, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(DETAIL, `brand-emblem-detail-${size}.png`));
  }

  const sheetWidth = 1600;
  const sheetHeight = 1080;
  const placements = [
    ["16", 16, 100, 268, path.join(FLAT, "brand-emblem-flat-16.png")],
    ["32", 32, 190, 260, path.join(FLAT, "brand-emblem-flat-32.png")],
    ["44", 44, 295, 254, path.join(FLAT, "brand-emblem-flat-44.png")],
    ["64", 64, 415, 244, path.join(FLAT, "brand-emblem-flat-64.png")],
    ["44", 44, 675, 254, path.join(INDIVIDUALS, "brand-emblem-nav-44.png")],
    ["64", 64, 795, 244, path.join(INDIVIDUALS, "brand-emblem-nav-64.png")],
    ["96", 96, 935, 228, path.join(INDIVIDUALS, "brand-emblem-card-96.png")],
    ["128", 128, 1100, 212, path.join(INDIVIDUALS, "brand-emblem-card-128.png")],
    ["original", 256, 104, 530, SOURCE],
    ["detail 512", 440, 506, 430, path.join(DETAIL, "brand-emblem-detail-512.png")],
  ];
  const composites = [];
  for (const [label, size, left, top, source] of placements) {
    const preview = await sharp(source).resize(size, size, { fit: "contain" }).png().toBuffer();
    composites.push({ input: preview, left, top });
    composites.push({
      input: Buffer.from(`<svg width="${Math.max(size, 130)}" height="36"><text x="${Math.max(size, 130) / 2}" y="24" text-anchor="middle" fill="#102842" font-family="Arial, sans-serif" font-size="18" font-weight="700">${escapeXml(label)}</text></svg>`),
      left: left - Math.max(0, (130 - size) / 2), top: top + size + 10,
    });
  }

  const background = Buffer.from(`<svg width="${sheetWidth}" height="${sheetHeight}">
    <rect width="1600" height="1080" fill="#dce7ea"/>
    <rect x="42" y="42" width="1516" height="996" rx="28" fill="#f8fbfd" stroke="#7898a8" stroke-width="2"/>
    <text x="82" y="105" fill="#102842" font-family="Arial, sans-serif" font-size="38" font-weight="800">Old MacDonald Had a School — emblem production family</text>
    <text x="82" y="146" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="20">Review sheet only · no candidate is wired into production</text>
    <text x="82" y="210" fill="#102842" font-family="Arial, sans-serif" font-size="24" font-weight="800">Tier 1 · simplified flat micro/nav</text>
    <text x="625" y="210" fill="#102842" font-family="Arial, sans-serif" font-size="24" font-weight="800">Tier 2 · sharp digital screen</text>
    <text x="82" y="475" fill="#102842" font-family="Arial, sans-serif" font-size="24" font-weight="800">Original source</text>
    <text x="470" y="400" fill="#102842" font-family="Arial, sans-serif" font-size="24" font-weight="800">Tier 3 · high-detail media</text>
    <rect x="1095" y="505" width="385" height="220" rx="18" fill="#eef3f5" stroke="#7898a8" stroke-dasharray="8 7"/>
    <text x="1125" y="565" fill="#102842" font-family="Arial, sans-serif" font-size="23" font-weight="800">Green-tree alternative</text>
    <text x="1125" y="607" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="18">No authentic source located in</text>
    <text x="1125" y="637" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="18">the repository or Git history.</text>
    <text x="1125" y="680" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="18">Not reconstructed or invented.</text>
    <text x="82" y="972" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="14">Composition: public/brand-emblem.png · 2D style: public/icons/farm_school_character_face_patch_sheet_primary_secondary_16.png</text>
    <text x="82" y="1000" fill="#3d5c6c" font-family="Arial, sans-serif" font-size="14">Flat source: brand-emblem-flat-source-v01.png · safe padding and target-size sharpening applied deterministically</text>
  </svg>`);
  await sharp(background).composite(composites).png({ compressionLevel: 9 }).toFile(path.join(REVIEW, "brand-emblem-family-contact-sheet.png"));
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
