-- Generated printables (worksheets, posters, reference cards) attached to lessons
CREATE TABLE "lesson_assets" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "lesson_id" INTEGER NOT NULL REFERENCES "lesson_blueprints"("id") ON DELETE CASCADE,
  "asset_type" TEXT NOT NULL DEFAULT 'worksheet',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "file_path" TEXT,
  "format" TEXT,
  "generation_prompt" TEXT,
  "visual_notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "worksheet_brief_id" INTEGER REFERENCES "worksheet_briefs"("id"),
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "lesson_assets_lesson_id_idx" ON "lesson_assets"("lesson_id");
CREATE INDEX "lesson_assets_asset_type_idx" ON "lesson_assets"("asset_type");
CREATE INDEX "lesson_assets_status_idx" ON "lesson_assets"("status");

-- Link worksheet briefs to their generated asset
ALTER TABLE "worksheet_briefs" ADD COLUMN "lesson_asset_id" INTEGER REFERENCES "lesson_assets"("id");
