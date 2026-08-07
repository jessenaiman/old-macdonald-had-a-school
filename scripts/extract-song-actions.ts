import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');

console.log('=== PHASE 2: EXTRACTING SONG ACTIONS ===\n');

// Get all action vocabulary families
const actionFamilies = db.prepare('SELECT normalized_action_family FROM action_vocabulary').all();
console.log(`Found ${actionFamilies.length} action families:\n`);
actionFamilies.forEach(f => console.log(`  • ${f.normalized_action_family}`));

// Get all song chunks
const songs = db.prepare(`
  SELECT id, title, chunk_text, instructions 
  FROM search_chunks 
  WHERE kind = 'song'
`).all();

console.log(`\nFound ${songs.length} songs to analyze\n`);

// Action detection patterns
const actionPatterns = {
  'Hands / fingers': [
    /\b(open|shut|point|wiggle|tap|clap).*?(hand|finger)/gi,
    /\b(hand|finger).*?(open|shut|point|wiggle|tap|clap)/gi,
    /\b(clap|pat|tap)\b/gi
  ],
  'Clap / pat': [
    /\b(clap|pat)\s+(hand|knee|leg)/gi,
    /\b(clap|pat)\b/gi
  ],
  'Point / gesture': [
    /\b(point|wave|beckon|gesture)\b/gi,
    /\b(point)\s+(up|down|here|there)/gi
  ],
  'Animal imitation': [
    /\b(waddle|hop|crawl|flap|swim|fly)\b/gi,
    /\b(animal|duck|fish|bird|bunny|rabbit|frog)\b/gi
  ],
  'Whole-body movement': [
    /\b(march|turn|spin|jump|sway|dance|skip|run|walk)\b/gi,
    /\b(move|shake|wiggle)\b/gi
  ],
  'Lap / caregiver': [
    /\b(bounce|rock|lift|tickle|lap)\b/gi,
    /\b(baby|child)\s+(on|in)\s+(lap|knee)/gi
  ],
  'Story action': [
    /\b(fall|climb|hide|search|follow|chase|run away)\b/gi
  ],
  'Circle game': [
    /\b(circle|ring|round|pass|chase)\b/gi,
    /\b(walk|move)\s+in\s+(a\s+)?circle/gi
  ],
  'Instrument action': [
    /\b(tap|shake|scrape|play|beat|drum|shake|ring)\b/gi,
    /\b(instrument|shaker|drum|bell|stick)/gi
  ],
  'Vocal action': [
    /\b(echo|sing|call|response|shout|whisper|hum)\b/gi,
    /\b(call.*?response|echo.*?back)/gi
  ],
  'Stillness / listening': [
    /\b(listen|freeze|stop|wait|quiet|still|pause)\b/gi
  ],
  'Prop / object action': [
    /\b(hold|pass|hide|reveal|scarf|ball|beanbag|parachute)\b/gi,
    /\b(use|grab|take|give)\s+(scarf|ball|prop)/gi
  ]
};

// Prepare insert statement
const insertAction = db.prepare(`
  INSERT INTO song_actions (
    id,
    song_title,
    action_wording,
    normalized_action,
    action_classification,
    core_or_optional,
    source_title,
    evidence_note,
    research_status,
    created_at,
    updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

let totalActions = 0;
let songsWithActions = 0;

console.log('Analyzing songs for actions...\n');

for (const song of songs) {
  const textToAnalyze = `${song.title} ${song.chunk_text} ${song.instructions || ''}`;
  const detectedActions = new Map();
  
  // Check each action family
  for (const family of actionFamilies) {
    const familyName = family.normalized_action_family;
    const patterns = actionPatterns[familyName] || [];
    
    let found = false;
    let matchedText = [];
    
    for (const pattern of patterns) {
      const matches = textToAnalyze.match(pattern);
      if (matches && matches.length > 0) {
        found = true;
        matchedText.push(...matches);
      }
    }
    
    if (found) {
      detectedActions.set(familyName, matchedText.slice(0, 3)); // Keep first 3 matches
    }
  }
  
  // If we found actions, create song_actions records
  if (detectedActions.size > 0) {
    songsWithActions++;
    
    for (const [actionFamily, matches] of detectedActions) {
      const id = randomUUID();
      const actionWording = matches.join(', ');
      
      // Determine if core or optional
      const coreOrOptional = actionFamily === 'Vocal action' ? 'Core' : 'Optional';
      
      // Classify the action
      let actionClassification = 'Movement';
      if (actionFamily === 'Vocal action') actionClassification = 'Vocal';
      if (actionFamily === 'Stillness / listening') actionClassification = 'Listening';
      if (actionFamily === 'Instrument action') actionClassification = 'Instrumental';
      
      try {
        insertAction.run(
          id,
          song.title,
          actionWording,
          actionFamily,
          actionClassification,
          coreOrOptional,
          'Inferred from song text',
          `Detected patterns: ${matches.join(', ')}`,
          'Inferred'
        );
        totalActions++;
      } catch (error) {
        console.error(`ERROR creating action for ${song.title}: ${error.message}`);
      }
    }
  }
}

console.log(`\n=== EXTRACTION COMPLETE ===`);
console.log(`Songs analyzed: ${songs.length}`);
console.log(`Songs with actions: ${songsWithActions}`);
console.log(`Total action records created: ${totalActions}`);

// Show breakdown by action family
console.log(`\n=== ACTIONS BY FAMILY ===`);
const actionCounts = db.prepare(`
  SELECT normalized_action, COUNT(*) as count
  FROM song_actions
  GROUP BY normalized_action
  ORDER BY count DESC
`).all();

for (const row of actionCounts) {
  console.log(`  ${row.normalized_action}: ${row.count} actions`);
}

// Show sample actions
console.log(`\n=== SAMPLE ACTIONS ===`);
const sampleActions = db.prepare(`
  SELECT song_title, normalized_action, action_wording
  FROM song_actions
  LIMIT 10
`).all();

for (const action of sampleActions) {
  console.log(`\n  Song: ${action.song_title}`);
  console.log(`  Action: ${action.normalized_action}`);
  console.log(`  Wording: ${action.action_wording}`);
}

db.close();
console.log(`\n✓ Song actions extracted successfully!`);
