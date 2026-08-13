import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const globalsPath = "app/globals.css";
const root = postcss.parse(fs.readFileSync(globalsPath, "utf8"), { from: globalsPath });

const moduleTargets = new Map([
  ["lessons-page", "app/lessons/LessonsPage.module.css"],
  ["search-page", "app/search/SearchPage.module.css"],
  ["about-product-page", "components/about/AboutProductPage.module.css"],
  ["curriculum-lesson-page", "components/curriculum/CurriculumLessonPage.module.css"],
  ["grade-interaction-lane", "components/grades/GradeInteractionLane.module.css"],
  ["grade-lesson-page", "components/grades/GradeLessonPage.module.css"],
  ["home-page", "components/home/HomePageAlternative.module.css"],
  ["curriculum-templates", "components/grades/DefaultGradeTemplate.module.css"],
]);

const moduleRoots = new Map();

for (const [scope, outputPath] of moduleTargets) {
  const scopeNeedle = `data-style-scope='${scope}'`;
  const atScope = root.nodes.find(
    (node) => node.type === "atrule" && node.name === "scope" && node.params.includes(scopeNeedle),
  );

  if (!atScope) throw new Error(`Missing @scope block for ${scope}`);

  const moduleRoot = postcss.root();
  for (const child of [...atScope.nodes]) moduleRoot.append(child.clone());
  moduleRoots.set(scope, { outputPath, root: moduleRoot });

  const previous = atScope.prev();
  if (previous?.type === "comment" && previous.text.includes("Consolidated")) previous.remove();
  atScope.remove();
}

function appendWithParents(targetRoot, sourceRule, replacementSelector) {
  let clone = sourceRule.clone({ selector: replacementSelector });
  const ancestors = [];
  for (let parent = sourceRule.parent; parent && parent.type !== "root"; parent = parent.parent) {
    if (parent.type === "atrule") ancestors.unshift(parent);
  }
  for (const ancestor of ancestors.reverse()) {
    const wrapper = ancestor.clone({ nodes: [] });
    wrapper.append(clone);
    clone = wrapper;
  }
  targetRoot.append(clone);
}

// A few GradeInteractionLane corrections were appended after its original
// consolidated block. Keep them with the owning module before deleting the
// global selectors.
const gradeScope = "grade-interaction-lane";
const gradeNeedle = `[data-style-scope='${gradeScope}']`;
const gradeModule = moduleRoots.get(gradeScope).root;
root.walkRules((rule) => {
  if (!rule.selector.includes(gradeNeedle)) return;
  const localSelector = rule.selector.split(gradeNeedle).join("").trim();
  appendWithParents(gradeModule, rule, localSelector);
  rule.remove();
});

// The bulletin homepage implementation no longer exists. Its scoped rules do
// not match the selected HomePage component and are safe to remove.
const bulletinNeedle = "data-style-scope='bulletin-home-page'";
const bulletinScope = root.nodes.find(
  (node) => node.type === "atrule" && node.name === "scope" && node.params.includes(bulletinNeedle),
);
if (bulletinScope) {
  const previous = bulletinScope.prev();
  if (previous?.type === "comment" && previous.text.includes("Consolidated")) previous.remove();
  bulletinScope.remove();
}
root.walkRules((rule) => {
  if (rule.selector.includes(`[${bulletinNeedle}]`)) rule.remove();
});

// Remove empty media/support wrappers left after extracting scoped rules.
root.walkAtRules((atRule) => {
  if (atRule.nodes && atRule.nodes.length === 0) atRule.remove();
});

for (const { outputPath, root: moduleRoot } of moduleRoots.values()) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${moduleRoot.toString().trim()}\n`);
}

fs.writeFileSync(globalsPath, `${root.toString().trim()}\n`);
