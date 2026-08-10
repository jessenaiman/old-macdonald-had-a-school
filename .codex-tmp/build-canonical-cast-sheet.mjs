import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const output = process.argv[2];
if (!output) throw new Error("Output path required");

const cast = [
  ["Old MacDonald", "Staff", "old-macdonald", "01-old-macdonald"],
  ["Miss Puddles", "Staff", "miss-puddles", "02-miss-puddles"],
  ["Mr Rusty", "Staff", "mr-rusty", "03-mr-rusty"],
  ["Miss Hayley", "Staff", "miss-hayley", "04-miss-hayley"],
  ["Mr Sam", "Staff", "mr-sam", "05-mr-sam"],
  ["Mr Maisy", "Staff", "mr-maisy", "06-mr-maisy"],
  ["Mr Puddles", "Staff", "mr-puddles", "07-mr-puddles"],
  ["Miss Maisy", "Staff", "miss-maisy", "08-miss-maisy"],
  ["Hopper", "Student", "hopper", "09-hopper"],
  ["Whiskers", "Student", "whiskers", "10-whiskers"],
  ["Scout", "Student", "scout", "11-scout"],
  ["Penny", "Student", "penny", "12-penny"],
  ["Maisy", "Student", "maisy", "13-maisy"],
  ["Puddles", "Student", "puddles", "14-puddles"],
  ["Sam", "Student", "sam", "15-sam"],
  ["Rusty", "Student", "rusty", "16-rusty"],
];

const width = 2048;
const height = 2200;
const margin = 70;
const gap = 24;
const columns = 4;
const cellWidth = Math.floor((width - margin * 2 - gap * (columns - 1)) / columns);
const cellHeight = 430;
const gridTop = 330;

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const baseSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#3b2716" flood-opacity="0.24"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#d8ad72"/>
  <rect x="34" y="34" width="1980" height="2132" rx="34" fill="#f7efd9" stroke="#173552" stroke-width="5" stroke-dasharray="14 10"/>
  <text x="74" y="105" fill="#1b3c52" font-family="Georgia, serif" font-size="31" font-weight="700">PEOPLE &amp; CHARACTERS</text>
  <text x="74" y="190" fill="#173552" font-family="Georgia, serif" font-size="72" font-weight="700">Canonical cast icon sheet</text>
  <text x="76" y="242" fill="#665846" font-family="Arial, sans-serif" font-size="25">16 authored character portraits layered on their matching felt badges</text>
  <line x1="74" y1="278" x2="1974" y2="278" stroke="#8b5e34" stroke-width="4"/>
  ${cast.map(([name, role], index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = margin + col * (cellWidth + gap);
    const y = gridTop + row * (cellHeight + gap);
    return `
      <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="22" fill="#fffaf0" stroke="#cbb58d" stroke-width="3" filter="url(#shadow)"/>
      <line x1="${x + 20}" y1="${y + 22}" x2="${x + cellWidth - 20}" y2="${y + 22}" stroke="#d5c29f" stroke-width="3" stroke-dasharray="7 6"/>
      <text x="${x + 24}" y="${y + 370}" fill="#173552" font-family="Georgia, serif" font-size="31" font-weight="700">${esc(name)}</text>
      <text x="${x + 24}" y="${y + 405}" fill="#766954" font-family="Arial, sans-serif" font-size="22">${role}</text>`;
  }).join("")}
</svg>`;

const composites = [{ input: Buffer.from(baseSvg), top: 0, left: 0 }];
for (let index = 0; index < cast.length; index += 1) {
  const [, , portraitName, patchName] = cast[index];
  const col = index % columns;
  const row = Math.floor(index / columns);
  const x = margin + col * (cellWidth + gap);
  const y = gridTop + row * (cellHeight + gap);
  const size = 292;
  const left = x + Math.floor((cellWidth - size) / 2);
  const top = y + 43;
  const patchFile = path.join(root, "public", "design-assets", "blank-felt-patches-v1", "individual-patches", `${patchName}-circle.png`);
  const portraitFile = path.join(root, "public", "staff_and_students", `${portraitName}-transparent-circle.png`);
  composites.push({ input: await sharp(patchFile).resize(size, size, { fit: "contain" }).png().toBuffer(), left, top });
  composites.push({ input: await sharp(portraitFile).resize(size - 34, size - 34, { fit: "contain" }).png().toBuffer(), left: left + 17, top: top + 17 });
}

await sharp({ create: { width, height, channels: 4, background: "#f7efd9" } })
  .composite(composites)
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(output);
