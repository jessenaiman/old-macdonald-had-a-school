import fs from "node:fs";
import path from "node:path";

const lessonDirectory = path.join(process.cwd(), "content", "lessons");

function lessonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return lessonFiles(entryPath);
    return /\.mdx?$/i.test(entry.name) ? [entryPath] : [];
  });
}

function fileSlug(file) {
  return path.basename(file, path.extname(file));
}

function readMarkdown(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return { data, content: match[2] };
}

const files = lessonFiles(lessonDirectory);
const errors = [];
const slugs = new Map();

if (files.length === 0) {
  errors.push("content/lessons contains no .md or .mdx lesson files");
}

for (const file of files) {
  const relative = path.relative(process.cwd(), file).replaceAll("\\", "/");
  let parsed;
  try {
    parsed = readMarkdown(file);
  } catch (error) {
    errors.push(`${relative}: ${error instanceof Error ? error.message : "could not parse Markdown"}`);
    continue;
  }

  if (!parsed.content.trim()) {
    errors.push(`${relative}: lesson content is empty`);
  }

  const slug = typeof parsed.data.slug === "string" && parsed.data.slug.trim()
    ? parsed.data.slug.trim()
    : fileSlug(file);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${relative}: URL slug "${slug}" must be lowercase kebab-case`);
  }

  const existing = slugs.get(slug);
  if (existing) {
    errors.push(`${relative}: duplicate URL slug "${slug}" also used by ${existing}`);
  } else {
    slugs.set(slug, relative);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`\nContent validation failed: ${errors.length} finding${errors.length === 1 ? "" : "s"}.`);
  process.exitCode = 1;
} else {
  console.log(`Content validation passed: ${files.length} lesson files, ${slugs.size} unique routes.`);
}
