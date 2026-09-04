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

const [design, css, homePage] = await Promise.all([
  readFile("DESIGN.md", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("app/page.tsx", "utf8"),
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

const characterTextUsesReducedOpacity = /characters-surface[\s\S]*opacity-85/.test(
  homePage,
);
const characterOpacityOverride = css.match(
  /\.characters-surface\s+\.opacity-85\s*\{([\s\S]*?)\n\}/,
)?.[1];
if (
  characterTextUsesReducedOpacity &&
  !characterOpacityOverride?.includes(
    "opacity: var(--character-secondary-text-opacity) !important;",
  )
) {
  failures.push(
    "Character secondary text uses reduced opacity without a theme-owned full-opacity override",
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
if (!gradeSurfaceBlock?.includes("color: var(--grade-ink) !important;")) {
  failures.push(
    "Grade surfaces must keep grade ink above generic card foreground utilities",
  );
}

const leatherBlueBlock = css.match(
  /\.material-leather-blue\s*\{([\s\S]*?)\n\}/,
)?.[1];
if (
  !leatherBlueBlock?.includes("var(--material-leather-contrast-wash)") ||
  !leatherBlueBlock?.includes("var(--asset-leather-blue)") ||
  !leatherBlueBlock?.includes("--material-repeat: no-repeat, repeat;")
) {
  failures.push(
    "Blue leather needs a theme-owned navy wash over its approved texture",
  );
}
const leatherAccentBlock = css.match(
  /\.material-leather-blue\s+em\s*\{([\s\S]*?)\n\}/,
)?.[1];
if (
  !leatherBlueBlock?.includes(
    "--material-accent-foreground: var(--theme-white);",
  ) ||
  !leatherAccentBlock?.includes(
    "color: var(--material-accent-foreground) !important;",
  )
) {
  failures.push(
    "Blue leather display accents must use the shared warm-cream foreground",
  );
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
