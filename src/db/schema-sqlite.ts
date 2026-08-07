import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Main search_chunks table (SQLite version)
export const searchChunks = sqliteTable('search_chunks', {
  id: text('id').primaryKey(), // UUID as text
  kind: text('kind').notNull(),
  sourcePath: text('source_path').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  chunkText: text('chunk_text').notNull(),
  lyrics: text('lyrics'),
  instructions: text('instructions'),
  embedding: text('embedding'), // JSON string of vector
  meta: text('meta').default('{}'), // JSON string
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Curriculum topics table
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

// Song actions table
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
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Research sources table
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

// Junction table: curriculum_topics ↔ search_chunks
export const curriculumTopicSongs = sqliteTable('curriculum_topic_songs', {
  id: text('id').primaryKey(),
  curriculumTopicId: text('curriculum_topic_id').notNull().references(() => curriculumTopics.id, { onDelete: 'cascade' }),
  searchChunkId: text('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  linkType: text('link_type'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Junction table: song_actions ↔ search_chunks
export const songActionChunks = sqliteTable('song_action_chunks', {
  id: text('id').primaryKey(),
  songActionId: text('song_action_id').notNull().references(() => songActions.id, { onDelete: 'cascade' }),
  searchChunkId: text('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Research queue table
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

// Action vocabulary table
export const actionVocabulary = sqliteTable('action_vocabulary', {
  id: text('id').primaryKey(),
  normalizedActionFamily: text('normalized_action_family').notNull(),
  examples: text('examples'),
  doNotUseAsProof: text('do_not_use_as_proof'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
