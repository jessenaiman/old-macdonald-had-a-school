import { readFile } from "node:fs/promises";

const minimumRatio = 4.5;

const characters = {
  "old-macdonald": { name: "Old MacDonald", background: "#a66a32" },
  "miss-puddles": { name: "Miss Puddles", background: "#f6af32" },
  "mr-rusty": { name: "Mr Rusty", background: "#267cba" },
  "miss-hayley": { name: "Miss Hayley", background: "#d95c86" },
  "mr-sam": { name: "Mr Sam", background: "#1d8787" },
  "mr-maisy": { name: "Mr Maisy", background: "#d81d24" },
  "mr-puddles": { name: "Mr Puddles", background: "#5367b5" },
  "miss-maisy": { name: "Miss Maisy", background: "#5d8164" },
  hopper: { name: "Hopper", background: "#e66c71" },
  whiskers: { name: "Whiskers", background: "#e695b0" },
  scout: { name: "Scout", background: "#c59e7a" },
  penny: { name: "Penny", background: "#f9cb7a" },
  maisy: { name: "Maisy", background: "#96ad9a" },
  puddles: { name: "Puddles", background: "#8f9ccf" },
  sam: { name: "Sam", background: "#6cb1b1" },
  rusty: { name: "Rusty", background: "#72aad2" },
};

const [
  design,
  css,
  homePage,
  rootLayout,
  siteHeader,
  mobileNavigation,
] = await Promise.all([
  readFile("DESIGN.md", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("app/page.tsx", "utf8"),
  readFile("app/layout.tsx", "utf8"),
  readFile("components/SiteHeader.tsx", "utf8"),
  readFile("components/MobileNavigation.tsx", "utf8"),
]);

const cssVariables = new Map();
const cssVariableDeclarations = new Map();
const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
for (const match of cssWithoutComments.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
  const name = match[1];
  const value = match[2].trim();
  const declarations = cssVariableDeclarations.get(name) ?? [];
  declarations.push(value);
  cssVariableDeclarations.set(name, declarations);
  cssVariables.set(name, value);
}

function normalizeHex(value) {
  const hex = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-f]{3}$/.test(hex)) {
    return `#${[...hex.slice(1)].map((digit) => digit.repeat(2)).join("")}`;
  }
  return null;
}

function resolveCssColor(value, seen = new Set()) {
  const direct = normalizeHex(value);
  if (direct) return direct;

  const reference = value.match(/^var\(--([\w-]+)\)$/)?.[1];
  if (!reference || seen.has(reference)) return null;

  const next = cssVariables.get(reference);
  if (!next) return null;

  seen.add(reference);
  return resolveCssColor(next, seen);
}

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

function designRecord(key) {
  const token = `--characters-${key}-color`;
  const row = design
    .split(/\r?\n/)
    .find((line) => line.includes(`\`${token}\``));
  if (!row) return null;

  const cells = row
    .split("|")
    .map((cell) => cell.trim().replaceAll("`", ""))
    .filter(Boolean);
  const tokenIndex = cells.indexOf(token);
  if (tokenIndex < 0) return null;

  return {
    background: normalizeHex(cells[tokenIndex + 1] ?? ""),
    foreground: normalizeHex(cells[tokenIndex + 2] ?? ""),
  };
}

const failures = [];
const results = [];

for (const obsoleteHomePattern of [
  'from "@/components/home/HomeGradeNav"',
  "function CharacterPerspectiveWall()",
  "function MobileQuickSearch()",
  "material-leather-blue",
]) {
  if (homePage.includes(obsoleteHomePattern)) {
    failures.push(`Homepage still contains reverted structure: ${obsoleteHomePattern}`);
  }
}
if (!homePage.includes("tags: [\"K\", \"1\", \"2\"]")) {
  failures.push("Homepage lesson rows must restore their grade tags");
}
if (!/TEACHER_GRADE_ITEMS\.map\(\(grade\)/.test(siteHeader)) {
  failures.push("Desktop navigation must expose the shared grade destinations");
}
if (!siteHeader.includes('data-grade={grade.key}')) {
  failures.push("Desktop grade navigation must use the shared data-grade theme contract");
}
if (!/TEACHER_GRADE_ITEMS\.map\(\(grade\)/.test(mobileNavigation)) {
  failures.push("Mobile navigation must expose the shared grade destinations");
}
if (!mobileNavigation.includes('data-grade={grade.key}')) {
  failures.push("Mobile grade navigation must use the shared data-grade theme contract");
}
if (siteHeader.includes("NavigationMenu")) {
  failures.push("Flat desktop links must use native navigation instead of a menu abstraction");
}
for (const gradeUtility of ["bg-grade", "text-grade-foreground"]) {
  if (!siteHeader.includes(gradeUtility)) {
    failures.push(`Desktop grade navigation must use semantic ${gradeUtility} utilities`);
  }
}
for (const gradeToken of [
  "--color-grade: var(--grade-color);",
  "--color-grade-foreground: var(--grade-ink);",
]) {
  if (!css.includes(gradeToken)) {
    failures.push(`Tailwind theme must map ${gradeToken}`);
  }
}
if (
  !rootLayout.includes('attribute="class"') ||
  !rootLayout.includes('defaultTheme="system"') ||
  !/\benableSystem\b/.test(rootLayout) ||
  !rootLayout.includes("suppressHydrationWarning")
) {
  failures.push("Root theme provider must retain the documented next-themes class/system contract");
}
const sharedForegroundPattern =
  /^var\(--character-foreground-(?:light|dark|maximum)\)$/;
const lockedTokenNames = [
  "character-foreground-light",
  "character-foreground-dark",
  "character-foreground-maximum",
  ...Object.keys(characters).map((key) => `characters-${key}-color`),
  ...Object.keys(characters).map((key) => `characters-${key}-foreground`),
];
for (const name of lockedTokenNames) {
  const declarations = cssVariableDeclarations.get(name) ?? [];
  if (declarations.length !== 1) {
    failures.push(
      `Locked token --${name} must have exactly one declaration; found ${declarations.length}`,
    );
  }
}
if (
  !/character-badge-mr-rusty:[\s\S]*?textColor:\s*"\{colors\.character-foreground-maximum\}"/.test(
    design,
  )
) {
  failures.push(
    "Mr Rusty badge recipe must use the maximum-contrast character foreground",
  );
}

for (const [key, character] of Object.entries(characters)) {
  const backgroundToken = `characters-${key}-color`;
  const foregroundToken = `characters-${key}-foreground`;
  const backgroundValue = cssVariables.get(backgroundToken);
  const foregroundValue = cssVariables.get(foregroundToken);
  const background = backgroundValue
    ? resolveCssColor(backgroundValue)
    : null;
  const foreground = foregroundValue
    ? resolveCssColor(foregroundValue)
    : null;
  const record = designRecord(key);

  if (background !== character.background) {
    failures.push(
      `${character.name}: CSS background changed; expected ${character.background}, received ${background ?? "missing"}`,
    );
  }
  if (record?.background !== character.background) {
    failures.push(
      `${character.name}: DESIGN background changed; expected ${character.background}, received ${record?.background ?? "missing"}`,
    );
  }
  if (!foregroundValue || !sharedForegroundPattern.test(foregroundValue)) {
    failures.push(
      `${character.name}: foreground must bind to a shared character foreground token`,
    );
  }
  if (!foreground) {
    failures.push(`${character.name}: CSS foreground is missing or unresolved`);
    continue;
  }
  if (record?.foreground !== foreground) {
    failures.push(
      `${character.name}: DESIGN foreground ${record?.foreground ?? "missing"} does not match CSS ${foreground}`,
    );
  }

  const ratio = contrastRatio(character.background, foreground);
  results.push({ name: character.name, background: character.background, foreground, ratio });
  if (ratio < minimumRatio) {
    failures.push(
      `${character.name}: ${ratio.toFixed(2)}:1 is below ${minimumRatio}:1`,
    );
  }
}

const surfaceBlock = css.match(
  /\.character-surface,\s*\.characters-surface\s*\{([\s\S]*?)\n\}/,
)?.[1];
if (
  !surfaceBlock?.includes(
    "--character-contrast-halo: var(--character-color);",
  ) ||
  !/text-shadow:[\s\S]*var\(--character-contrast-halo\)/.test(surfaceBlock)
) {
  failures.push(
    "Textured character surfaces must use the theme-owned character contrast halo",
  );
}
for (const binding of [
  "--card: var(--character-color);",
  "--card-foreground: var(--character-foreground);",
  "--muted-foreground: var(--character-foreground);",
]) {
  if (!surfaceBlock?.includes(binding)) {
    failures.push(`Shared character surfaces must bind ${binding}`);
  }
}
const characterControlBlock = css.match(
  /\.character-surface\s+\[data-slot=["']button["']\]\s*\{([\s\S]*?)\n\}/,
)?.[1];
if (!characterControlBlock?.includes("text-shadow: none;")) {
  failures.push(
    "Opaque controls inside character surfaces must reset the inherited texture halo",
  );
}

const paperBackground = resolveCssColor("var(--brand-paper)");
const paperMuted = resolveCssColor("var(--brand-paper-muted)");
if (
  !paperBackground ||
  !paperMuted ||
  contrastRatio(paperBackground, paperMuted) < 7
) {
  failures.push(
    "Muted paper text needs a 7:1 solid-color reserve for textured paper backgrounds",
  );
}
const themeCopy = resolveCssColor("var(--theme-copy)");
if (
  !paperBackground ||
  !themeCopy ||
  contrastRatio(paperBackground, themeCopy) < 7
) {
  failures.push(
    "Theme copy needs the same 7:1 reserve when used as muted text on paper",
  );
}

const gradeSurfaceBlock = css.match(/\.grade-surface\s*\{([\s\S]*?)\n\}/)?.[1];
for (const binding of [
  "--card: var(--grade-color);",
  "--card-foreground: var(--grade-ink);",
  "--foreground: var(--grade-ink);",
  "--muted-foreground: var(--grade-ink);",
]) {
  if (!gradeSurfaceBlock?.includes(binding)) {
    failures.push(`Grade surfaces must bind ${binding}`);
  }
}
if (gradeSurfaceBlock?.includes("!important")) {
  failures.push("Grade surfaces must not override shadcn utilities with !important");
}

const paperThemeBlock = css.match(
  /\.card-paper,\s*\.card-paper-ruled,\s*\.material-surface\.material-cardboard-paper,\s*\.material-surface\.material-paper-ruled,\s*\.material-surface\.material-paper-grid\s*\{([\s\S]*?)\n\}/,
)?.[1];
for (const binding of [
  "--background: var(--theme-paper);",
  "--foreground: var(--theme-ink);",
  "--card: var(--theme-paper);",
  "--card-foreground: var(--theme-ink);",
  "--muted-foreground: var(--theme-copy);",
]) {
  if (!paperThemeBlock?.includes(binding)) {
    failures.push(`Pinned paper surfaces must bind ${binding}`);
  }
}
if (/\.dark\s+:is\([^}]*text-(?:muted-foreground|primary)/.test(cssWithoutComments)) {
  failures.push("Pinned paper must use local semantic tokens instead of dark descendant patches");
}
if (/\.material-leather-blue\s+em\s*\{[\s\S]*?!important/.test(cssWithoutComments)) {
  failures.push("Material accents must not override element utilities with !important");
}

for (const result of results) {
  console.log(
    `${result.name.padEnd(14)} ${result.background} / ${result.foreground} = ${result.ratio.toFixed(2)}:1`,
  );
}

if (failures.length > 0) {
  console.error(`\nTheme contrast verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `\nTheme contrast verification passed: ${results.length} character surfaces meet WCAG AA and retain approved backgrounds.`,
);
