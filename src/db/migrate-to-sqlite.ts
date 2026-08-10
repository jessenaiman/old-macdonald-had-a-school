import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema-sqlite.js';
import pg from 'pg';

// Connect to Neon (source)
const NEON_URL = 'postgresql://neondb_owner:npg_crtE6i8yCzJh@ep-soft-butterfly-ax1441oa-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const neonClient = new pg.Client(NEON_URL);

// Connect to SQLite (destination)
const sqliteDb = new Database('./data/omhas.db');
const db = drizzle(sqliteDb, { schema });

async function migrate() {
  console.log('Starting migration from Neon to SQLite...\n');
  
  await neonClient.connect();
  console.log('✓ Connected to Neon');
  console.log('✓ Connected to SQLite\n');

  // Migrate search_chunks
  console.log('Migrating search_chunks...');
  const chunks = await neonClient.query('SELECT * FROM search_chunks');
  console.log(`  Found ${chunks.rows.length} chunks`);
  
  for (const chunk of chunks.rows) {
    db.insert(schema.searchChunks).values({
      id: chunk.id,
      kind: chunk.kind,
      sourcePath: chunk.source_path,
      url: chunk.url,
      title: chunk.title,
      chunkText: chunk.chunk_text,
      lyrics: chunk.lyrics || null,
      instructions: chunk.instructions || null,
      embedding: chunk.embedding ? JSON.stringify(Array.from(chunk.embedding)) : null,
      meta: typeof chunk.meta === 'object' ? JSON.stringify(chunk.meta) : (chunk.meta || '{}'),
      createdAt: chunk.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: chunk.updated_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${chunks.rows.length} chunks\n`);

  // Migrate curriculum_topics
  console.log('Migrating curriculum_topics...');
  const topics = await neonClient.query('SELECT * FROM curriculum_topics');
  console.log(`  Found ${topics.rows.length} topics`);
  
  for (const topic of topics.rows) {
    db.insert(schema.curriculumTopics).values({
      id: topic.id,
      gradeKey: topic.grade_key,
      grade: topic.grade,
      earlyYears: topic.early_years,
      subject: topic.subject,
      category: topic.category || null,
      seqNumber: topic.seq_number || null,
      lessonTopic: topic.lesson_topic,
      skillStatement: topic.skill_statement || null,
      standards: topic.standards || null,
      songCount: topic.song_count || 0,
      linkedSongs: topic.linked_songs || null,
      linkedResources: topic.linked_resources || null,
      tags: topic.tags || null,
      circleTimeSlot: topic.circle_time_slot || null,
      createdAt: topic.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: topic.updated_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${topics.rows.length} topics\n`);

  // Migrate song_actions
  console.log('Migrating song_actions...');
  const actions = await neonClient.query('SELECT * FROM song_actions');
  console.log(`  Found ${actions.rows.length} actions`);
  
  for (const action of actions.rows) {
    db.insert(schema.songActions).values({
      id: action.id,
      songTitle: action.song_title,
      alternateTitle: action.alternate_title || null,
      traditionPerformer: action.tradition_performer || null,
      actionWording: action.action_wording || null,
      normalizedAction: action.normalized_action || null,
      actionSequence: action.action_sequence || null,
      songCue: action.song_cue || null,
      actionClassification: action.action_classification || null,
      coreOrOptional: action.core_or_optional || null,
      ageRangeStated: action.age_range_stated || null,
      educatorOrg: action.educator_org || null,
      sourceTitle: action.source_title || null,
      sourceType: action.source_type || null,
      pageTimestamp: action.page_timestamp || null,
      sourceUrl: action.source_url || null,
      evidenceNote: action.evidence_note || null,
      researchStatus: action.research_status || 'Not started',
      reviewerNotes: action.reviewer_notes || null,
      createdAt: action.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: action.updated_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${actions.rows.length} actions\n`);

  // Migrate research_sources
  console.log('Migrating research_sources...');
  const sources = await neonClient.query('SELECT * FROM research_sources');
  console.log(`  Found ${sources.rows.length} sources`);
  
  for (const source of sources.rows) {
    db.insert(schema.researchSources).values({
      id: source.id,
      educatorOrg: source.educator_org,
      sourceTitle: source.source_title,
      sourceType: source.source_type,
      ageSetting: source.age_setting || null,
      songsCovered: source.songs_covered || null,
      directUrl: source.direct_url || null,
      localPdfFilename: source.local_pdf_filename || null,
      downloadStatus: source.download_status || 'Download needed',
      researchNotes: source.research_notes || null,
      createdAt: source.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: source.updated_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${sources.rows.length} sources\n`);

  // Migrate curriculum_topic_songs
  console.log('Migrating curriculum_topic_songs...');
  const topicSongs = await neonClient.query('SELECT * FROM curriculum_topic_songs');
  console.log(`  Found ${topicSongs.rows.length} links`);
  
  for (const link of topicSongs.rows) {
    db.insert(schema.curriculumTopicSongs).values({
      id: link.id,
      curriculumTopicId: link.curriculum_topic_id,
      searchChunkId: link.search_chunk_id,
      linkType: link.link_type || null,
      createdAt: link.created_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${topicSongs.rows.length} links\n`);

  // Migrate song_action_chunks
  console.log('Migrating song_action_chunks...');
  const actionChunks = await neonClient.query('SELECT * FROM song_action_chunks');
  console.log(`  Found ${actionChunks.rows.length} links`);
  
  for (const link of actionChunks.rows) {
    db.insert(schema.songActionChunks).values({
      id: link.id,
      songActionId: link.song_action_id,
      searchChunkId: link.search_chunk_id,
      createdAt: link.created_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${actionChunks.rows.length} links\n`);

  // Migrate research_queue
  console.log('Migrating research_queue...');
  const queue = await neonClient.query('SELECT * FROM research_queue');
  console.log(`  Found ${queue.rows.length} items`);
  
  for (const item of queue.rows) {
    db.insert(schema.researchQueue).values({
      id: item.id,
      priority: item.priority,
      resource: item.resource,
      whyItMatters: item.why_it_matters || null,
      sourceUrl: item.source_url || null,
      downloadFilename: item.download_filename || null,
      assignedTo: item.assigned_to || null,
      status: item.status || 'Download needed',
      notes: item.notes || null,
      createdAt: item.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: item.updated_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${queue.rows.length} items\n`);

  // Migrate action_vocabulary
  console.log('Migrating action_vocabulary...');
  const vocab = await neonClient.query('SELECT * FROM action_vocabulary');
  console.log(`  Found ${vocab.rows.length} terms`);
  
  for (const term of vocab.rows) {
    db.insert(schema.actionVocabulary).values({
      id: term.id,
      normalizedActionFamily: term.normalized_action_family,
      examples: term.examples || null,
      doNotUseAsProof: term.do_not_use_as_proof || null,
      createdAt: term.created_at?.toISOString() || new Date().toISOString(),
    }).onConflictDoNothing().run();
  }
  console.log(`  ✓ Migrated ${vocab.rows.length} terms\n`);

  await neonClient.end();
  sqliteDb.close();
  
  console.log('✓ Migration complete!');
  console.log('  Database: ./data/omhas.db');
}

migrate().catch(console.error);
