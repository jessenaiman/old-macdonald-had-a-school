import assert from "node:assert/strict";
import test from "node:test";

import {
  GRADE_KEY_MAP,
  serializeCurriculumTopicAsMarkdown,
} from "../lib/lesson-model.ts";

test("the supported database grade map excludes grade-3", () => {
  assert.deepEqual(GRADE_KEY_MAP, {
    daycare: "daycare",
    preschool: "pre-school",
    kindergarten: "kindergarten",
    "grade-1": "grade-one",
    "grade-2": "grade-two",
  });
  assert.equal("grade-3" in GRADE_KEY_MAP, false);
});

test("the database fallback serializer labels absent planning sections", () => {
  const markdown = serializeCurriculumTopicAsMarkdown({
    id: "topic-1",
    grade: "grade-one",
    subject: "Mathematics",
    category: "Operations",
    sequence: 1,
    title: "Addition",
    skillStatement: "Solve within 20",
    standards: "1.OA.A.1",
    tags: ["Number"],
    linkedSongs: null,
    linkedSongCount: 0,
    linkedResources: null,
    circleTimeSlot: null,
    sourceType: "database",
    completeness: "planning-draft",
    markdownHints: [],
    supplementarySources: [],
  });

  assert.match(markdown, /# Addition/);
  assert.match(markdown, /Solve within 20/);
  assert.match(markdown, /Goal: Not yet available/);
  assert.match(markdown, /Teaching sequence: Not yet available/);
  assert.match(markdown, /Materials: Not yet available/);
  assert.match(markdown, /Learner practice: Not yet available/);
  assert.match(markdown, /Observation or assessment: Not yet available/);
  assert.doesNotMatch(markdown, /invented|suggested|recommended/i);
});
