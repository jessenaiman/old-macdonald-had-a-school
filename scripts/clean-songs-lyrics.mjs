import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

console.log('=== Cleaning songs: extract actions from lyrics ===\n');

const songs = db.prepare(`
  SELECT id, title, lyrics, actions
  FROM songs
  WHERE lyrics LIKE '%*%'
`).all();

console.log(`Processing ${songs.length} songs...\n`);

const updateStmt = db.prepare(`
  UPDATE songs
  SET lyrics = ?, actions = ?
  WHERE id = ?
`);

let updated = 0;

for (const song of songs) {
  // Extract actions between asterisks
  const actionMatches = song.lyrics.match(/\*([^*]+)\*/g) || [];
  const actions = actionMatches.map(a => a.replace(/\*/g, '').trim()).filter(Boolean);

  if (actions.length === 0) continue;

  // Remove action markers from lyrics
  const cleanLyrics = song.lyrics
    .replace(/\*[^*]+\*\n?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Combine with existing actions
  const existingActions = song.actions ? song.actions.split('\n').filter(Boolean) : [];
  const allActions = [...existingActions, ...actions];
  const actionsText = allActions.join('\n');

  updateStmt.run(cleanLyrics, actionsText, song.id);
  updated++;

  console.log(`[${song.id}] ${song.title}`);
  console.log(`  Extracted ${actions.length} actions`);
  console.log(`  Lyrics cleaned: ${song.lyrics.length} → ${cleanLyrics.length} chars`);
}

console.log(`\nUpdated ${updated} songs`);

// Verify
const verify = db.prepare(`
  SELECT COUNT(*) as n FROM songs WHERE lyrics LIKE '%*%'
`).get();
console.log(`Songs still with *actions*: ${verify.n}`);

db.close();
