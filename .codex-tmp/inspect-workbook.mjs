import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = process.argv[2];
const outputDir = process.argv[3];
if (!inputPath || !outputDir) throw new Error("Usage: inspect-workbook.mjs <input.xlsx> <output-dir>");

await fs.mkdir(outputDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheetInfo = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 10000 });
console.log("SHEETS");
console.log(sheetInfo.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange(true);
  console.log(`\nSHEET ${sheet.name} USED ${used?.address ?? "empty"}`);
  if (used) {
    const preview = await workbook.inspect({
      kind: "table",
      sheetId: sheet.name,
      range: used.address,
      include: "values,formulas",
      tableMaxRows: 12,
      tableMaxCols: 20,
      tableMaxCellChars: 180,
      maxChars: 20000,
    });
    console.log(preview.ndjson);
    const rendered = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1, format: "png" });
    const safeName = sheet.name.replace(/[^a-z0-9_-]+/gi, "-");
    await fs.writeFile(path.join(outputDir, `${safeName}.png`), new Uint8Array(await rendered.arrayBuffer()));
  }
}
