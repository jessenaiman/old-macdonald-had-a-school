import sharp from "sharp";

const source = "public/design-assets/cork-board-kit-v2/seamless-cork-tile.png";
const output = "public/design-assets/cork-board-kit-v2/seamless-cork-tile-web.webp";

await sharp(source)
  .resize(512, 512, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .webp({ quality: 78, effort: 6 })
  .toFile(output);

console.log(`Built ${output}`);
