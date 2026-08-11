import sharp from "sharp";

const referencePath = "C:/Users/jesse/AppData/Local/Temp/codex-clipboard-20992ca1-dc26-4040-bff0-b03fc038c400.png";
const desktopPath = "qa/homepage-runtime-final/desktop-1440x900-final.png";
const tabletPath = "qa/homepage-runtime-final/tablet-768x1024-final.png";
const mobilePath = "qa/homepage-runtime-final/mobile-390x844-compact-final.png";
const outputPath = "qa/homepage-runtime-final/comparison-reference-vs-runtime.png";

const reference = await sharp(referencePath).resize({ width: 1450 }).png().toBuffer();
const referenceMeta = await sharp(reference).metadata();
const desktop = await sharp(desktopPath).resize({ width: 820 }).png().toBuffer();
const tablet = await sharp(tabletPath).resize({ width: 350 }).png().toBuffer();
const mobile = await sharp(mobilePath).resize({ width: 220 }).png().toBuffer();
const [desktopMeta, tabletMeta, mobileMeta] = await Promise.all([
  sharp(desktop).metadata(),
  sharp(tablet).metadata(),
  sharp(mobile).metadata(),
]);

const label = (text, width) => Buffer.from(`
  <svg width="${width}" height="48" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="8" fill="#061d34"/>
    <text x="18" y="31" fill="#fff7e5" font-family="Arial, sans-serif" font-size="20" font-weight="700">${text}</text>
  </svg>
`);

const referenceTop = 70;
const runtimeTop = referenceTop + referenceMeta.height + 95;
const canvasHeight = runtimeTop + Math.max(desktopMeta.height, tabletMeta.height, mobileMeta.height) + 40;

await sharp({
  create: {
    width: 1500,
    height: canvasHeight,
    channels: 4,
    background: "#efe1c4",
  },
})
  .composite([
    { input: label("EXPECTED — user-provided three-viewport reference", 1450), left: 25, top: 12 },
    { input: reference, left: 25, top: referenceTop },
    { input: label("IMPLEMENTED — live localhost captures", 1450), left: 25, top: runtimeTop - 60 },
    { input: desktop, left: 25, top: runtimeTop },
    { input: tablet, left: 865, top: runtimeTop },
    { input: mobile, left: 1245, top: runtimeTop },
  ])
  .png()
  .toFile(outputPath);

console.log(outputPath);
