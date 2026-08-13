import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const directory = path.resolve("public/design-assets/classroom-paper-notes-v1/individual-notes");
const names = (await fs.readdir(directory)).filter((name) => name.endsWith(".png"));

for (const name of names) {
  const file = path.join(directory, name);
  const temporary = `${file}.optimized.png`;
  await sharp(file)
    .resize({ width: 320, height: 360, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(temporary);
  await fs.rename(temporary, file);
}
