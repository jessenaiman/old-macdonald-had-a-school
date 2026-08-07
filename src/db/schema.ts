import { pgTable, uuid, text, timestamp, jsonb, vector, index, integer, boolean } from 'drizzle-orm/pg-core';

// Existing search_chunks table (knowledge base + songs)
// Note: tsv column is managed separately via SQL migrations
export const searchChunks = pgTable('search_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  kind: text('kind').notNull(),
  sourcePath: text('source_path').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  chunkText: text('chunk_text').notNull(),
  lyrics: text('lyrics'), // Just the song lyrics
  instructions: text('instructions'), // Just the actions/instructions
  embedding: vector('embedding', { dimensions: 384 }),
  meta: jsonb('meta').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  kindIdx: index('search_chunks_kind_idx').on(table.kind),
  sourcePathIdx: index('search_chunks_source_path_idx').on(table.sourcePath),
}));

// Curriculum topics table (from Curriculum Export)
export const curriculumTopics = pgTable('curriculum_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  gradeKey: text('grade_key').notNull(), // daycare, preschool, kindergarten, grade-1, grade-2, grade-3
  grade: text('grade').notNull(), // Daycare, Preschool, Kindergarten, Grade 1, Grade 2, Grade 3
  earlyYears: boolean('early_years').notNull(), // Yes/No
  subject: text('subject').notNull(), // 13 subject areas
  category: text('category'), // 50 detailed categories
  seqNumber: integer('seq_number'), // Sequence within subject
  lessonTopic: text('lesson_topic').notNull(), // 357 unique lesson topics
  skillStatement: text('skill_statement'), // Skill descriptions
  standards: text('standards'), // Ontario, ELOF, Common Core, SHAPE
  songCount: integer('song_count').default(0), // Number of linked songs
  linkedSongs: text('linked_songs'), // Sample song titles
  linkedResources: text('linked_resources'), // External resource names
  tags: text('tags'), // HDLH Foundations, Orff Process
  circleTimeSlot: text('circle_time_slot'), // greeting, goodbye, transition
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  gradeKeyIdx: index('curriculum_topics_grade_key_idx').on(table.gradeKey),
  subjectIdx: index('curriculum_topics_subject_idx').on(table.subject),
  earlyYearsIdx: index('curriculum_topics_early_years_idx').on(table.earlyYears),
  circleTimeIdx: index('curriculum_topics_circle_time_idx').on(table.circleTimeSlot),
}));

// Song actions table (from Early Years Action Song Corpus)
export const songActions = pgTable('song_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  songTitle: text('song_title').notNull(),
  alternateTitle: text('alternate_title'),
  traditionPerformer: text('tradition_performer'),
  actionWording: text('action_wording'), // Action wording from source
  normalizedAction: text('normalized_action'), // Normalized action
  actionSequence: text('action_sequence'), // Action sequence / order
  songCue: text('song_cue'), // Song cue or section
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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  songTitleIdx: index('song_actions_song_title_idx').on(table.songTitle),
  normalizedActionIdx: index('song_actions_normalized_action_idx').on(table.normalizedAction),
  researchStatusIdx: index('song_actions_research_status_idx').on(table.researchStatus),
}));

// Research sources table (from Early Years Action Song Corpus)
export const researchSources = pgTable('research_sources', {
  id: text('id').primaryKey(), // SRC-001, SRC-002, etc.
  educatorOrg: text('educator_org').notNull(),
  sourceTitle: text('source_title').notNull(),
  sourceType: text('source_type').notNull(), // Lesson-plan PDF, Teacher/family songbook PDF, etc.
  ageSetting: text('age_setting'), // EYFS / early years, Infant/toddler/preschool, etc.
  songsCovered: text('songs_covered'),
  directUrl: text('direct_url'),
  localPdfFilename: text('local_pdf_filename'),
  downloadStatus: text('download_status').default('Download needed'),
  researchNotes: text('research_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  downloadStatusIdx: index('research_sources_download_status_idx').on(table.downloadStatus),
}));

// Junction table: curriculum_topics ↔ search_chunks (many-to-many)
export const curriculumTopicSongs = pgTable('curriculum_topic_songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  curriculumTopicId: uuid('curriculum_topic_id').notNull().references(() => curriculumTopics.id, { onDelete: 'cascade' }),
  searchChunkId: uuid('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  linkType: text('link_type'), // e.g., 'primary', 'supplementary'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  curriculumTopicIdx: index('curriculum_topic_songs_topic_idx').on(table.curriculumTopicId),
  searchChunkIdx: index('curriculum_topic_songs_chunk_idx').on(table.searchChunkId),
}));

// Junction table: song_actions ↔ search_chunks (many-to-many)
export const songActionChunks = pgTable('song_action_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  songActionId: uuid('song_action_id').notNull().references(() => songActions.id, { onDelete: 'cascade' }),
  searchChunkId: uuid('search_chunk_id').notNull().references(() => searchChunks.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  songActionIdx: index('song_action_chunks_action_idx').on(table.songActionId),
  searchChunkIdx: index('song_action_chunks_chunk_idx').on(table.searchChunkId),
}));

// Research queue table (from Early Years Action Song Corpus)
export const researchQueue = pgTable('research_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  priority: integer('priority').notNull(), // 1, 2, etc.
  resource: text('resource').notNull(),
  whyItMatters: text('why_it_matters'),
  sourceUrl: text('source_url'),
  downloadFilename: text('download_filename'),
  assignedTo: text('assigned_to'),
  status: text('status').default('Download needed'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  priorityIdx: index('research_queue_priority_idx').on(table.priority),
  statusIdx: index('research_queue_status_idx').on(table.status),
}));

// Action vocabulary table (from Early Years Action Song Corpus)
export const actionVocabulary = pgTable('action_vocabulary', {
  id: uuid('id').primaryKey().defaultRandom(),
  normalizedActionFamily: text('normalized_action_family').notNull(),
  examples: text('examples'),
  doNotUseAsProof: text('do_not_use_as_proof'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  actionFamilyIdx: index('action_vocabulary_family_idx').on(table.normalizedActionFamily),
}));
