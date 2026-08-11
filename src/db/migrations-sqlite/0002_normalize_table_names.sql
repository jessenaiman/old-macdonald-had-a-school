-- Normalize table names to lowercase
-- SQLite on Windows is case-insensitive, so rename through temp names

PRAGMA foreign_keys = OFF;

-- Two-step rename: UPPER → temp → lower
ALTER TABLE "SONGS" RENAME TO "_songs_tmp";
ALTER TABLE "_songs_tmp" RENAME TO "songs";

ALTER TABLE "TOPICS" RENAME TO "_topics_tmp";
ALTER TABLE "_topics_tmp" RENAME TO "topics";

ALTER TABLE "GRADES" RENAME TO "_grades_tmp";
ALTER TABLE "_grades_tmp" RENAME TO "grades";

ALTER TABLE "SUBJECTS" RENAME TO "_subjects_tmp";
ALTER TABLE "_subjects_tmp" RENAME TO "subjects";

ALTER TABLE "STANDARDS" RENAME TO "_standards_tmp";
ALTER TABLE "_standards_tmp" RENAME TO "standards";

ALTER TABLE "TAGS" RENAME TO "_tags_tmp";
ALTER TABLE "_tags_tmp" RENAME TO "tags";

ALTER TABLE "RESOURCES" RENAME TO "_resources_tmp";
ALTER TABLE "_resources_tmp" RENAME TO "resources";

ALTER TABLE "MATERIAL_TAGS" RENAME TO "_material_tags_tmp";
ALTER TABLE "_material_tags_tmp" RENAME TO "material_tags";

ALTER TABLE "MATERIAL_RELATIONS" RENAME TO "_material_relations_tmp";
ALTER TABLE "_material_relations_tmp" RENAME TO "material_relations";

ALTER TABLE "TOPIC_GRADES" RENAME TO "_topic_grades_tmp";
ALTER TABLE "_topic_grades_tmp" RENAME TO "topic_grades";

ALTER TABLE "TOPIC_MATERIALS" RENAME TO "_topic_materials_tmp";
ALTER TABLE "_topic_materials_tmp" RENAME TO "topic_materials";

ALTER TABLE "TOPIC_STANDARDS" RENAME TO "_topic_standards_tmp";
ALTER TABLE "_topic_standards_tmp" RENAME TO "topic_standards";

ALTER TABLE "TOPIC_TAGS" RENAME TO "_topic_tags_tmp";
ALTER TABLE "_topic_tags_tmp" RENAME TO "topic_tags";

ALTER TABLE "WEEKLY_PACING" RENAME TO "_weekly_pacing_tmp";
ALTER TABLE "_weekly_pacing_tmp" RENAME TO "weekly_pacing";

ALTER TABLE "SOURCES" RENAME TO "_sources_tmp";
ALTER TABLE "_sources_tmp" RENAME TO "sources";

ALTER TABLE "ACTIVITIES" RENAME TO "_activities_tmp";
ALTER TABLE "_activities_tmp" RENAME TO "activities";

ALTER TABLE "BOOK_SUGGESTIONS" RENAME TO "_book_suggestions_tmp";
ALTER TABLE "_book_suggestions_tmp" RENAME TO "book_suggestions";

PRAGMA foreign_keys = ON;
