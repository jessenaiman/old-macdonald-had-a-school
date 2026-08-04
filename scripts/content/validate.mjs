import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const LESSONS_DIR = path.join(ROOT, "content", "lessons");
const QUEUE_FILENAME = "kathy_reid_naiman_recent_28_prompt_dataset.xlsx";
const REQUIRED_COMMON_FIELDS = [
  "template",
  "slug",
  "title",
  "subject",
  "category",
  "gradeBand",
  "focus",
  "summary",
  "sourceReference",
  "publicationStatus",
];
const REQUIRED_SECTIONS = {
  music: ["Song", "Movement", "Teaching", "Activity"],
  video: ["Watch", "Try", "Practice", "Check", "Extend"],
};
const PENDING_VALUES = /\b(?:pending|not\s+ready|not\s+yet\s+available|tbd|to\s+be\s+added|awaiting)\b/i;
const MEDIA_FIELD_NAMES = new Set([
  "videoUrl",
  "videoUrls",
  "audioUrl",
  "audioUrls",
  "mediaUrl",
  "mediaUrls",
  "mediaDestination",
  "mediaDestinations",
  "sourceMarkedVideoUrl",
  "sourceMarkedVideoUrls",
  "localVideoPath",
  "localVideoPaths",
  "localAudioPath",
  "localAudioPaths",
  "localMediaPath",
  "localMediaPaths",
  "videoPath",
  "videoPaths",
  "audioPath",
  "audioPaths",
  "mediaPath",
  "mediaPaths",
]);
const LOCAL_FIELD_PATTERN = /^(?:source)?local(?:video|audio|media)(?:path|paths|url|urls)$/i;
const BODY_LOCAL_LABEL_PATTERN = /^\s*-?\s*(?:local\s+(?:video|audio|media)(?:\s+(?:url|path|paths))?|(?:video|audio|media)\s+path)\s*:\s*(.+?)\s*$/i;

function displayPath(fileName) {
  return path.posix.join("content/lessons", fileName);
}

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function unquote(value) {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(raw, fileName) {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { error: "expected YAML frontmatter to start with ---" };
  }

  const closeIndex = normalized.indexOf("\n---", 4);
  if (closeIndex === -1) {
    return { error: "frontmatter is missing its closing --- marker" };
  }

  const closeLineEnd = normalized.indexOf("\n", closeIndex + 1);
  const frontmatterText = normalized.slice(4, closeIndex);
  const body = closeLineEnd === -1 ? "" : normalized.slice(closeLineEnd + 1).trim();
  const metadata = {};
  const errors = [];

  for (const [index, line] of frontmatterText.split("\n").entries()) {
    const lineNumber = index + 2;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)\s*$/);
    if (!match) {
      errors.push(`${displayPath(fileName)}:${lineNumber}: invalid frontmatter line`);
      continue;
    }
    const [, key, rawValue] = match;
    if (Object.hasOwn(metadata, key)) {
      errors.push(`${displayPath(fileName)}:${lineNumber}: duplicate frontmatter field "${key}"`);
      continue;
    }
    metadata[key] = unquote(rawValue);
  }

  return { metadata, body, errors };
}

function sectionMap(body) {
  const sections = new Map();
  const matches = [...body.matchAll(/^##\s+(.+?)\s*$/gm)];
  for (const [index, match] of matches.entries()) {
    const heading = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    sections.set(heading.toLowerCase(), body.slice(start, end).trim());
  }
  return sections;
}

function valueOf(metadata, names) {
  for (const name of names) {
    if (isNonEmpty(metadata[name])) return metadata[name].trim();
  }
  return "";
}

function hasStructuredSource(metadata) {
  const workbook = valueOf(metadata, ["sourceWorkbook", "sourceQueueWorkbook"]);
  const sheet = valueOf(metadata, ["sourceSheet", "sourceQueueSheet"]);
  const row = valueOf(metadata, ["sourceRow", "sourceQueueRow"]);
  const supplied = [workbook, sheet, row].filter(Boolean).length;
  return { workbook, sheet, row, supplied, complete: supplied === 3 };
}

function hasExplicitLegacyReference(metadata) {
  const reference = valueOf(metadata, ["legacySourceReference", "sourceLegacyReference", "sourceReference"]);
  return Boolean(reference && /(?:^|[\\/\s])(?:lib|src|archive|legacy)[\\/]|\blegacy\b/i.test(reference));
}

function isQueuePage(metadata) {
  return Object.values(metadata).some((value) => value.includes?.(QUEUE_FILENAME));
}

function isExternalUrl(value) {
  return /^(?:https?:|mailto:)/i.test(value.trim());
}

function isLikelyPendingField(key, value) {
  return /^(?:media|mediaDestination|localMedia|video|audio)(?:Status|State)$/i.test(key) && PENDING_VALUES.test(value);
}

function splitDeclaredPaths(value) {
  return value
    .split(/\s*;\s*|\s*,\s*/)
    .map((part) => part.trim())
    .filter((part) => part && !isExternalUrl(part) && !PENDING_VALUES.test(part));
}

function isLocalAssetField(key) {
  return LOCAL_FIELD_PATTERN.test(key) || (/local/i.test(key) && /(?:path|paths|url|urls)/i.test(key));
}

function resolveLocalAsset(declaredPath) {
  const cleaned = declaredPath.replace(/^['"]|['"]$/g, "").trim();
  if (!cleaned || isExternalUrl(cleaned)) return null;
  if (path.isAbsolute(cleaned)) return cleaned;
  if (cleaned.startsWith("/")) return path.join(ROOT, "public", cleaned.slice(1));
  if (cleaned.startsWith("public/")) return path.join(ROOT, cleaned);
  return path.join(ROOT, cleaned);
}

function localDeclarations(metadata, body) {
  const declarations = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (isLocalAssetField(key)) {
      for (const declaredPath of splitDeclaredPaths(value)) declarations.push({ key, declaredPath });
    }
  }
  for (const line of body.split("\n")) {
    const match = line.match(BODY_LOCAL_LABEL_PATTERN);
    if (!match) continue;
    for (const declaredPath of splitDeclaredPaths(match[1])) {
      declarations.push({ key: "body local media field", declaredPath });
    }
  }
  return declarations;
}

function mediaDestination(metadata, body) {
  const values = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (MEDIA_FIELD_NAMES.has(key) && isNonEmpty(value)) values.push(value.trim());
  }
  for (const line of body.split("\n")) {
    if (/\b(?:URL|Resource destination|Media destination|Video destination|Audio destination)\s*:/i.test(line)) {
      const value = line.replace(/^.*?\b(?:URL|Resource destination|Media destination|Video destination|Audio destination)\s*:\s*/i, "").trim();
      if (isNonEmpty(value)) values.push(value);
    }
    for (const match of line.matchAll(/\[[^\]]+\]\((https?:[^)]+)\)/gi)) values.push(match[1]);
  }
  return values;
}

function validateLesson(fileName, raw) {
  const errors = [];
  const parsed = parseFrontmatter(raw, fileName);
  if (parsed.error) return { errors: [`${displayPath(fileName)}: ${parsed.error}`] };
  errors.push(...(parsed.errors ?? []));
  const metadata = parsed.metadata ?? {};
  const body = parsed.body ?? "";
  const route = displayPath(fileName);

  for (const field of REQUIRED_COMMON_FIELDS) {
    if (!isNonEmpty(metadata[field])) errors.push(`${route}: missing required field "${field}"`);
  }

  if (isNonEmpty(metadata.template) && !Object.hasOwn(REQUIRED_SECTIONS, metadata.template)) {
    errors.push(`${route}: template must be either music or video`);
  }

  const fileSlug = fileName.replace(/\.mdx$/i, "");
  if (isNonEmpty(metadata.slug) && metadata.slug !== fileSlug) {
    errors.push(`${route}: slug "${metadata.slug}" must match filename slug "${fileSlug}"`);
  }
  if (isNonEmpty(metadata.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    errors.push(`${route}: slug must be lowercase kebab-case`);
  }

  if (isNonEmpty(metadata.publicationStatus) && !["draft", "review", "publishable"].includes(metadata.publicationStatus)) {
    errors.push(`${route}: publicationStatus must be draft, review, or publishable`);
  }
  if (metadata.publicationStatus === "publishable") {
    if (!isNonEmpty(metadata.reviewDate)) errors.push(`${route}: publishable pages require "reviewDate"`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.reviewDate)) errors.push(`${route}: reviewDate must use YYYY-MM-DD`);
    if (!isNonEmpty(metadata.reviewer)) errors.push(`${route}: publishable pages require "reviewer"`);
  }

  const source = hasStructuredSource(metadata);
  if (!source.complete && !hasExplicitLegacyReference(metadata)) {
    if (source.supplied === 0) {
      errors.push(`${route}: require source workbook, sheet, and row fields, or an explicit legacy source reference`);
    } else {
      if (!source.workbook) errors.push(`${route}: source provenance is missing workbook`);
      if (!source.sheet) errors.push(`${route}: source provenance is missing sheet`);
      if (!source.row) errors.push(`${route}: source provenance is missing row`);
    }
  }

  if (isQueuePage(metadata)) {
    for (const field of ["sourceArtist", "videoOwnership", "musicOwnership", "projectPermission"]) {
      if (!isNonEmpty(metadata[field])) errors.push(`${route}: 28-video queue pages require "${field}"`);
    }
  }

  if (isNonEmpty(metadata.template) && REQUIRED_SECTIONS[metadata.template]) {
    const sections = sectionMap(body);
    for (const heading of REQUIRED_SECTIONS[metadata.template]) {
      const sectionBody = sections.get(heading.toLowerCase());
      if (sectionBody === undefined) errors.push(`${route}: ${metadata.template} template requires ## ${heading}`);
      else if (!sectionBody) errors.push(`${route}: ## ${heading} cannot be empty`);
    }
  }

  const destinations = mediaDestination(metadata, body);
  const hasPendingState = Object.entries(metadata).some(([key, value]) => isLikelyPendingField(key, value)) || /(?:media|resource|video|audio)(?:\s+destination)?\s+(?:status|state)\s*:\s*[^\n]*pending/i.test(body);
  if (destinations.length === 0 && !hasPendingState) {
    errors.push(`${route}: require a nonempty media destination or an explicit pending media state`);
  }

  for (const { key, declaredPath } of localDeclarations(metadata, body)) {
    const resolved = resolveLocalAsset(declaredPath);
    if (resolved && !fs.existsSync(resolved)) {
      errors.push(`${route}: local asset declared by ${key} does not exist: ${declaredPath}`);
    }
  }

  return {
    errors,
    sourceKey: source.complete
      ? [source.workbook, source.sheet, source.row]
          .map((part) => part.toLowerCase().replace(/\\/g, "/").replace(/\s+/g, " ").trim())
          .join(" | ")
      : "",
    slug: metadata.slug,
  };
}

function main() {
  if (!fs.existsSync(LESSONS_DIR)) {
    console.error("content/lessons: directory does not exist");
    process.exitCode = 1;
    return;
  }

  const files = fs.readdirSync(LESSONS_DIR).filter((fileName) => fileName.endsWith(".mdx")).sort();
  const allErrors = [];
  const slugClaims = new Map();
  const sourceClaims = new Map();

  for (const fileName of files) {
    const result = validateLesson(fileName, fs.readFileSync(path.join(LESSONS_DIR, fileName), "utf8"));
    allErrors.push(...result.errors);
    if (result.slug) {
      const prior = slugClaims.get(result.slug);
      if (prior) allErrors.push(`${displayPath(fileName)}: duplicate slug "${result.slug}" also claimed by ${displayPath(prior)}`);
      else slugClaims.set(result.slug, fileName);
    }
    if (result.sourceKey) {
      const prior = sourceClaims.get(result.sourceKey);
      if (prior) allErrors.push(`${displayPath(fileName)}: duplicate source-row claim "${result.sourceKey}" also claimed by ${displayPath(prior)}`);
      else sourceClaims.set(result.sourceKey, fileName);
    }
  }

  if (allErrors.length > 0) {
    for (const error of allErrors) console.error(`ERROR ${error}`);
    console.error(`\nContent validation failed: ${allErrors.length} finding${allErrors.length === 1 ? "" : "s"}.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Content validation passed: ${files.length} lesson page${files.length === 1 ? "" : "s"}.`);
}

main();
