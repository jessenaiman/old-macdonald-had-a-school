import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type CastRosterMember = {
  name: string;
  species: string;
  descriptor: string;
  grade?: string;
  colorLabel: string;
  color: string;
  activities: string;
  portrait: string;
  texture: string;
  group: "staff" | "students";
};

const clean = (value: string) => value.trim().replace(/^\*\*|\*\*$/g, "").replace(/`/g, "");
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function rowsBetween(markdown: string, start: string, end: string) {
  const section = markdown.split(start)[1]?.split(end)[0] ?? "";
  return section.split(/\r?\n/).filter((line) => line.startsWith("|") && !line.includes("---")).slice(1);
}

export async function getCastRoster() {
  const markdown = await readFile(path.join(process.cwd(), "content", "pages", "branding", "cast.mdx"), "utf8");
  const staffRows = rowsBetween(markdown, "## Canonical staff", "### Staff rule");
  const studentRows = rowsBetween(markdown, "## Students: 8 Total", "# Cast");

  const staff = staffRows.map((line, index): CastRosterMember => {
    const [, name, species, role, grade, colorCell, activities] = line.split("|").map(clean);
    const color = colorCell.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? "#8B5E34";
    const memberSlug = slug(name);
    return { name, species, descriptor: role, grade, colorLabel: colorCell.replace(color, "").trim(), color, activities, portrait: `/staff_and_students/${memberSlug}-transparent-circle.png`, texture: `/design-assets/web-material-library-v1/felt/felt-${String(index + 1).padStart(2, "0")}-${memberSlug}-tile.png`, group: "staff" };
  });

  const students = studentRows.map((line, index): CastRosterMember => {
    const [, , name, species, personality, colorCell, activities] = line.split("|").map(clean);
    const color = colorCell.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? "#8B5030";
    const memberSlug = slug(name);
    return { name, species, descriptor: personality, colorLabel: colorCell.replace(color, "").trim(), color, activities, portrait: `/staff_and_students/${memberSlug}-transparent-circle.png`, texture: `/design-assets/web-material-library-v1/felt/felt-${String(index + 9).padStart(2, "0")}-${memberSlug}-tile.png`, group: "students" };
  });

  return { staff, students };
}
