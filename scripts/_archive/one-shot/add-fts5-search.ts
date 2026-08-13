import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

console.log('=== ADDING FTS5 FULL-TEXT SEARCH ===\n');

// Enable FTS5 extension (SQLite has it built-in)
console.log('Creating FTS5 virtual table for search_chunks...\n');

// Create FTS5 virtual table
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS search_chunks_fts USING fts5(
    id UNINDEXED,
    kind UNINDEXED,
    title,
    chunk_text,
    lyrics,
    instructions,
    source_path UNINDEXED,
    content='search_chunks',
    content_rowid='rowid'
  );
`);

console.log('✓ FTS5 virtual table created\n');

// Populate FTS table from existing data
console.log('Populating FTS index from existing data...');

const songs = db.prepare(`
  SELECT rowid, id, kind, title, chunk_text, lyrics, instructions, source_path
  FROM search_chunks
`).all();

const insertFts = db.prepare(`
  INSERT INTO search_chunks_fts (rowid, id, kind, title, chunk_text, lyrics, instructions, source_path)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let indexed = 0;
for (const song of songs) {
  try {
    insertFts.run(
      song.rowid,
      song.id,
      song.kind,
      song.title,
      song.chunk_text,
      song.lyrics || '',
      song.instructions || '',
      song.source_path
    );
    indexed++;
  } catch (error) {
    // Skip if already indexed
    if (!error.message.includes('UNIQUE constraint')) {
      console.error(`ERROR indexing ${song.title}: ${error.message}`);
    }
  }
}

console.log(`✓ Indexed ${indexed} records in FTS table\n`);

// Test FTS search
console.log('=== TESTING FTS SEARCH ===\n');

const testQueries = [
  'Humpty Dumpty',
  'counting numbers',
  'baby bounce',
  'fingerplay instructions',
  'circle game'
];

for (const query of testQueries) {
  const results = db.prepare(`
    SELECT id, title, kind, rank
    FROM search_chunks_fts
    WHERE search_chunks_fts MATCH ?
    ORDER BY rank
    LIMIT 3
  `).all(query);
  
  console.log(`Query: "${query}"`);
  console.log(`  Found ${results.length} results:`);
  for (const result of results) {
    console.log(`    • ${result.title} (${result.kind})`);
  }
  console.log('');
}

// Create triggers to keep FTS in sync
console.log('Creating triggers to keep FTS in sync...\n');

db.exec(`
  CREATE TRIGGER IF NOT EXISTS search_chunks_ai AFTER INSERT ON search_chunks BEGIN
    INSERT INTO search_chunks_fts (rowid, id, kind, title, chunk_text, lyrics, instructions, source_path)
    VALUES (new.rowid, new.id, new.kind, new.title, new.chunk_text, new.lyrics, new.instructions, new.source_path);
  END;
`);

db.exec(`
  CREATE TRIGGER IF NOT EXISTS search_chunks_ad AFTER DELETE ON search_chunks BEGIN
    DELETE FROM search_chunks_fts WHERE rowid = old.rowid;
  END;
`);

db.exec(`
  CREATE TRIGGER IF NOT EXISTS search_chunks_au AFTER UPDATE ON search_chunks BEGIN
    UPDATE search_chunks_fts
    SET id = new.id,
        kind = new.kind,
        title = new.title,
        chunk_text = new.chunk_text,
        lyrics = new.lyrics,
        instructions = new.instructions,
        source_path = new.source_path
    WHERE rowid = new.rowid;
  END;
`);

console.log('✓ Triggers created\n');

// Verify FTS is working
console.log('=== FTS STATUS ===');
const ftsCount = db.prepare('SELECT COUNT(*) as count FROM search_chunks_fts').get();
console.log(`FTS indexed records: ${ftsCount.count}`);

const mainCount = db.prepare('SELECT COUNT(*) as count FROM search_chunks').get();
console.log(`Main table records: ${mainCount.count}`);

if (ftsCount.count === mainCount.count) {
  console.log('\n✓ FTS is fully synchronized!');
} else {
  console.log(`\n⚠ FTS is out of sync (${mainCount.count - ftsCount.count} records missing)`);
}

db.close();
console.log('\n✓ FTS5 full-text search enabled successfully!');
