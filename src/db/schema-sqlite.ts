import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Core curriculum (normalized) ──────────────────────────────────────────

export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey(),
  key: text('key').notNull(),
  label: text('label').notNull(),
  sortOrder: integer('sort_order'),
});

export const grades = sqliteTable('grades', {
  id: integer('id').primaryKey(),
  key: text('key').notNull(),
  label: text('label').notNull(),
  sortOrder: integer('sort_order'),
});

export const topics = sqliteTable('topics', {
  id: integer('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id),
  category: text('category'),
  topic: text('topic').notNull(),
  skill: text('skill'),
  sequence: real('sequence'),
  taughtStatus: text('taught_status'),
  mergedInto: integer('merged_into').references((): any => topics.id),
  circleTime: text('circle_time'),
});

export const topicGrades = sqliteTable('topic_grades', {
  id: integer('id').primaryKey(),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  gradeId: integer('grade_id').notNull().references(() => grades.id),
});

export const topicStandards = sqliteTable('topic_standards', {
  id: integer('id').primaryKey(),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  standardId: integer('standard_id').notNull().references(() => standards.id),
  alignmentNotes: text('alignment_notes'),
});

export const topicTags = sqliteTable('topic_tags', {
  id: integer('id').primaryKey(),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
});

export const topicMaterials = sqliteTable('topic_materials', {
  id: integer('id').primaryKey(),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  materialKind: text('material_kind').notNull(),
  materialId: integer('material_id').notNull(),
  role: text('role'),
  useInPhase: text('use_in_phase'),
  routineSlot: text('routine_slot'),
  teacherRationale: text('teacher_rationale'),
});

export const weeklyPacing = sqliteTable('weekly_pacing', {
  id: integer('id').primaryKey(),
  topicGradeId: integer('topic_grade_id').notNull().references(() => topicGrades.id),
  weekNumber: integer('week_number').notNull(),
  month: text('month'),
  notes: text('notes'),
});

// ─── Standards & Tags ──────────────────────────────────────────────────────

export const standards = sqliteTable('standards', {
  id: integer('id').primaryKey(),
  parentStandardId: integer('parent_standard_id').references((): any => standards.id),
  framework: text('framework'),
  code: text('code'),
  fullText: text('full_text'),
  source: text('source'),
  externalId: text('external_id'),
  frames: text('frames'),
});

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  parentTagId: integer('parent_tag_id').references((): any => tags.id),
  name: text('name').notNull(),
  definition: text('definition'),
});

// ─── Songs & Resources ─────────────────────────────────────────────────────

export const songs = sqliteTable('songs', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist'),
  catalog: text('catalog'),
  lyrics: text('lyrics'),
  url: text('url'),
  instructions: text('instructions'),
  actions: text('actions'),
  ageRange: text('age_range'),
  sourceId: integer('source_id'),
  verified: integer('verified'),
  type: text('type'),
  educationalDomain: text('educational_domain'),
  materialsNeeded: text('materials_needed'),
  tags: text('tags'),
  creatorArtist: text('creator_artist'),
  sourceTitle: text('source_title'),
  curriculumLinks: text('curriculum_links'),
  earlyYearsLinks: text('early_years_links'),
  markdownPath: text('markdown_path'),
});

export const songSections = sqliteTable('song_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  songId: integer('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  label: text('label'),
  sectionType: text('section_type').notNull().default('verse'),
  sortOrder: integer('sort_order').notNull(),
  lyrics: text('lyrics').notNull(),
  actions: text('actions'),
  actionScope: text('action_scope'),
  actionLineNumber: integer('action_line_number'),
  actionProvenance: text('action_provenance'),
});

export const songChordGuides = sqliteTable('song_chord_guides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  songId: integer('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  sectionId: integer('section_id').references(() => songSections.id, { onDelete: 'cascade' }),
  scope: text('scope').notNull(),
  lineNumber: integer('line_number'),
  progression: text('progression').notNull(),
  musicalKey: text('musical_key'),
  capo: text('capo'),
  tuning: text('tuning'),
  meter: text('meter'),
  startingPitch: text('starting_pitch'),
  provenance: text('provenance').notNull(),
  sourceNote: text('source_note'),
  sortOrder: integer('sort_order').notNull().default(1),
});

export const songSources = sqliteTable('song_sources', {
  songId: integer('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  sourceDocumentId: integer('source_document_id').notNull().references(() => sourceDocuments.id, { onDelete: 'cascade' }),
  relationship: text('relationship').notNull(),
  locator: text('locator'),
  evidenceNote: text('evidence_note'),
});

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey(),
  name: text('name'),
  type: text('type'),
  description: text('description'),
  url: text('url'),
  free: integer('free'),
  paywalled: integer('paywalled'),
  verified: integer('verified'),
  sourceId: integer('source_id'),
});

export const materialTags = sqliteTable('material_tags', {
  id: integer('id').primaryKey(),
  materialKind: text('material_kind').notNull(),
  materialId: integer('material_id').notNull(),
  tagId: integer('tag_id').notNull().references(() => tags.id),
});

export const materialRelations = sqliteTable('material_relations', {
  id: integer('id').primaryKey(),
  fromKind: text('from_kind'),
  fromId: integer('from_id'),
  relationType: text('relation_type'),
  toKind: text('to_kind'),
  toId: integer('to_id'),
});

export const songCurriculumLinks = sqliteTable('song_curriculum_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  songId: integer('song_id').notNull().references(() => songs.id),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  relevance: text('relevance'),
  linkType: text('link_type').notNull().default('curriculum'),
});

// ─── Search index ──────────────────────────────────────────────────────────

export const searchChunks = sqliteTable('search_chunks', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  sourcePath: text('source_path').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  chunkText: text('chunk_text').notNull(),
  lyrics: text('lyrics'),
  instructions: text('instructions'),
  embedding: text('embedding'),
  meta: text('meta').default('{}'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const retrievalEvaluationQueries = sqliteTable('retrieval_evaluation_queries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  queryText: text('query_text').notNull().unique(),
  teacherIntent: text('teacher_intent').notNull(),
  expectedTitleContains: text('expected_title_contains'),
  expectedResultKind: text('expected_result_kind'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  sourceNote: text('source_note'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const retrievalEvaluationRuns = sqliteTable('retrieval_evaluation_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  queryId: integer('query_id').notNull().references(() => retrievalEvaluationQueries.id, { onDelete: 'cascade' }),
  engineKind: text('engine_kind').notNull(),
  engineVersion: text('engine_version'),
  durationMs: integer('duration_ms').notNull(),
  resultCount: integer('result_count').notNull(),
  expectationMet: integer('expectation_met', { mode: 'boolean' }),
  evaluatorNote: text('evaluator_note'),
  executedAt: text('executed_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const retrievalEvaluationResults = sqliteTable('retrieval_evaluation_results', {
  runId: integer('run_id').notNull().references(() => retrievalEvaluationRuns.id, { onDelete: 'cascade' }),
  rank: integer('rank').notNull(),
  resultKind: text('result_kind').notNull(),
  resultId: text('result_id').notNull(),
  title: text('title').notNull(),
  matchScope: text('match_scope'),
  score: real('score'),
});

export const searchChunkSources = sqliteTable('search_chunk_sources', {
  searchChunkId: text('search_chunk_id').notNull().references(() => searchChunks.id),
  sourceDocumentId: integer('source_document_id').notNull().references(() => sourceDocuments.id),
});

export const sourceDocuments = sqliteTable('source_documents', {
  id: integer('id').primaryKey(),
  sourcePath: text('source_path').notNull(),
  sourceKind: text('source_kind'),
  reviewState: text('review_state'),
  checksum: text('checksum'),
  importedAt: text('imported_at'),
});

// curriculum_topic_songs: relevance mapping between topics and search chunks
export const curriculumTopicSongs = sqliteTable('curriculum_topic_songs', {
  id: text('id').primaryKey(),
  curriculumTopicId: text('curriculum_topic_id').notNull(),
  searchChunkId: text('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  linkType: text('link_type'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  topicId: integer('topic_id').references(() => topics.id),
});

// ─── Legacy flat curriculum (to be deprecated) ─────────────────────────────

export const curriculumTopics = sqliteTable('curriculum_topics', {
  id: text('id').primaryKey(),
  gradeKey: text('grade_key').notNull(),
  grade: text('grade').notNull(),
  earlyYears: integer('early_years', { mode: 'boolean' }).notNull(),
  subject: text('subject').notNull(),
  category: text('category'),
  seqNumber: integer('seq_number'),
  lessonTopic: text('lesson_topic').notNull(),
  skillStatement: text('skill_statement'),
  standards: text('standards'),
  songCount: integer('song_count').default(0),
  linkedSongs: text('linked_songs'),
  linkedResources: text('linked_resources'),
  tags: text('tags'),
  circleTimeSlot: text('circle_time_slot'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Song actions research ─────────────────────────────────────────────────

export const songActions = sqliteTable('song_actions', {
  id: text('id').primaryKey(),
  songTitle: text('song_title').notNull(),
  alternateTitle: text('alternate_title'),
  traditionPerformer: text('tradition_performer'),
  actionWording: text('action_wording'),
  normalizedAction: text('normalized_action'),
  actionSequence: text('action_sequence'),
  songCue: text('song_cue'),
  actionClassification: text('action_classification'),
  coreOrOptional: text('core_or_optional'),
  ageRangeStated: text('age_range_stated'),
  educatorOrg: text('educator_org'),
  sourceTitle: text('source_title'),
  sourceType: text('source_type'),
  pageTimestamp: text('page_timestamp'),
  sourceUrl: text('source_url'),
  evidenceNote: text('evidence_note'),
  researchStatus: text('research_status').default('Not started'),
  reviewerNotes: text('reviewer_notes'),
  songId: integer('song_id').references(() => songs.id, { onDelete: 'cascade' }),
  sectionId: integer('section_id').references(() => songSections.id, { onDelete: 'set null' }),
  lineNumber: integer('line_number'),
  provenance: text('provenance'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const songActionChunks = sqliteTable('song_action_chunks', {
  id: text('id').primaryKey(),
  songActionId: text('song_action_id').notNull().references(() => songActions.id, { onDelete: 'cascade' }),
  searchChunkId: text('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const actionVocabulary = sqliteTable('action_vocabulary', {
  id: text('id').primaryKey(),
  normalizedActionFamily: text('normalized_action_family').notNull(),
  examples: text('examples'),
  doNotUseAsProof: text('do_not_use_as_proof'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Research tracking ─────────────────────────────────────────────────────

export const researchSources = sqliteTable('research_sources', {
  id: text('id').primaryKey(),
  educatorOrg: text('educator_org').notNull(),
  sourceTitle: text('source_title').notNull(),
  sourceType: text('source_type').notNull(),
  ageSetting: text('age_setting'),
  songsCovered: text('songs_covered'),
  directUrl: text('direct_url'),
  localPdfFilename: text('local_pdf_filename'),
  downloadStatus: text('download_status').default('Download needed'),
  researchNotes: text('research_notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const researchQueue = sqliteTable('research_queue', {
  id: text('id').primaryKey(),
  priority: integer('priority').notNull(),
  resource: text('resource').notNull(),
  whyItMatters: text('why_it_matters'),
  sourceUrl: text('source_url'),
  downloadFilename: text('download_filename'),
  assignedTo: text('assigned_to'),
  status: text('status').default('Download needed'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Import tracking ───────────────────────────────────────────────────────

export const schemaMigrations = sqliteTable('schema_migrations', {
  migrationId: text('migration_id').primaryKey(),
  appliedAt: text('applied_at'),
  omhasSha256: text('omhas_sha256'),
  curriculumSha256: text('curriculum_sha256'),
  generatedSha256: text('generated_sha256'),
});

export const importBatches = sqliteTable('import_batches', {
  id: integer('id').primaryKey(),
  migrationId: text('migration_id').references(() => schemaMigrations.migrationId),
  sourceName: text('source_name'),
  sourcePath: text('source_path'),
  sourceSha256: text('source_sha256'),
  importedAt: text('imported_at'),
});

// ─── Lesson assets (linked to curriculum topics) ───────────────────────────

export const lessonAssets = sqliteTable('lesson_assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  assetType: text('asset_type').notNull().default('worksheet'),
  title: text('title').notNull(),
  description: text('description'),
  filePath: text('file_path'),
  format: text('format'),
  generationPrompt: text('generation_prompt'),
  visualNotes: text('visual_notes'),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Empty target tables (for data parsing) ────────────────────────────────

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey(),
  name: text('name'),
  type: text('type'),
  instructions: text('instructions'),
  materialsNeeded: text('materials_needed'),
  ageRange: text('age_range'),
  durationMinutes: integer('duration_minutes'),
  sourceId: integer('source_id'),
});

export const bookSuggestions = sqliteTable('book_suggestions', {
  id: integer('id').primaryKey(),
  title: text('title'),
  author: text('author'),
  description: text('description'),
  ageRange: text('age_range'),
  isbn: text('isbn'),
  url: text('url'),
});

export const sources = sqliteTable('sources', {
  id: integer('id').primaryKey(),
  pathOrUrl: text('path_or_url'),
  type: text('type'),
  checksum: text('checksum'),
});
