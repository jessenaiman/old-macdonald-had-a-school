import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');

console.log('=== PHASE 3: LINKING SONGS TO CURRICULUM TOPICS ===\n');

// Get all curriculum topics
const topics = db.prepare('SELECT * FROM curriculum_topics').all();
console.log(`Found ${topics.length} curriculum topics\n`);

// Get all songs
const songs = db.prepare(`
  SELECT id, title, chunk_text, meta 
  FROM search_chunks 
  WHERE kind = 'song'
`).all();
console.log(`Found ${songs.length} songs to link\n`);

// Subject mapping: keywords in songs → curriculum subjects
const subjectMapping = {
  'Math & Numeracy': [
    'count', 'number', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'add', 'subtract', 'plus', 'minus', 'sum', 'total',
    'shape', 'circle', 'square', 'triangle', 'rectangle',
    'big', 'small', 'bigger', 'smaller', 'size',
    'first', 'second', 'third', 'last', 'next',
    'many', 'few', 'more', 'less', 'most', 'least',
    'pattern', 'sequence', 'order'
  ],
  'Literacy & Phonics': [
    'letter', 'alphabet', 'a b c', 'abc',
    'word', 'sound', 'rhyme', 'rhyming',
    'read', 'book', 'story', 'tale',
    'spell', 'spelling', 'write', 'writing',
    'vowel', 'consonant', 'syllable',
    'poem', 'poetry', 'verse'
  ],
  'Social-Emotional Learning (SEL)': [
    'feel', 'feeling', 'emotion', 'happy', 'sad', 'angry', 'scared', 'excited',
    'friend', 'friendship', 'share', 'sharing', 'kind', 'kindness',
    'love', 'care', 'help', 'helping',
    'sorry', 'thank', 'please', 'excuse',
    'brave', 'strong', 'proud', 'confident',
    'calm', 'peace', 'quiet', 'gentle'
  ],
  'Gross Motor & Movement': [
    'jump', 'hop', 'skip', 'run', 'walk', 'dance', 'move', 'movement',
    'clap', 'stomp', 'march', 'spin', 'turn', 'twirl',
    'stretch', 'reach', 'bend', 'bounce',
    'fast', 'slow', 'quick', 'speed',
    'up', 'down', 'high', 'low', 'over', 'under'
  ],
  'Science & Nature': [
    'animal', 'animals', 'dog', 'cat', 'bird', 'fish', 'duck', 'cow', 'horse', 'pig',
    'tree', 'flower', 'plant', 'leaf', 'garden',
    'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind',
    'water', 'fire', 'earth', 'air',
    'grow', 'growing', 'seed', 'sprout',
    'bug', 'insect', 'spider', 'butterfly', 'bee',
    'season', 'spring', 'summer', 'fall', 'autumn', 'winter',
    'day', 'night', 'morning', 'evening'
  ],
  'Language & Vocabulary': [
    'word', 'name', 'say', 'speak', 'talk', 'tell',
    'hello', 'goodbye', 'hi', 'bye',
    'yes', 'no', 'maybe',
    'color', 'colour', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white',
    'body', 'head', 'hand', 'foot', 'feet', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth',
    'family', 'mother', 'father', 'mom', 'dad', 'sister', 'brother', 'baby',
    'food', 'eat', 'drink', 'hungry', 'thirsty'
  ],
  'Fine Motor Skills': [
    'finger', 'fingers', 'hand', 'hands', 'thumb',
    'point', 'touch', 'tap', 'pat', 'clap',
    'wiggle', 'wave', 'shake',
    'small', 'tiny', 'little',
    'pick', 'grab', 'hold', 'squeeze',
    'draw', 'color', 'colour', 'paint', 'write'
  ],
  'Classroom Routine & Approaches to Learning': [
    'hello', 'goodbye', 'welcome', 'good morning', 'good afternoon',
    'clean', 'tidy', 'put away', 'pack up',
    'line', 'line up', 'queue',
    'sit', 'stand', 'listen', 'quiet',
    'ready', 'start', 'begin', 'finish', 'end', 'done',
    'time', 'clock', 'hour', 'minute',
    'today', 'tomorrow', 'yesterday',
    'routine', 'schedule', 'plan'
  ],
  'Calm Down, Rest & Mindfulness': [
    'calm', 'quiet', 'peace', 'still', 'rest', 'relax',
    'breathe', 'breathing', 'breath',
    'sleep', 'nap', 'dream', 'bed', 'night',
    'slow', 'gentle', 'soft',
    'mindful', 'mindfulness', 'meditation',
    'peaceful', 'serene', 'tranquil'
  ],
  'Self-Regulation': [
    'stop', 'wait', 'pause', 'freeze',
    'go', 'start', 'begin',
    'fast', 'slow', 'quick',
    'loud', 'quiet', 'soft',
    'control', 'manage', 'regulate',
    'focus', 'attention', 'concentrate'
  ],
  'Physical Health & Development': [
    'body', 'health', 'healthy', 'strong',
    'exercise', 'active', 'activity',
    'heart', 'beat', 'pulse',
    'muscle', 'bone', 'skin',
    'eat', 'food', 'nutrition', 'fruit', 'vegetable',
    'wash', 'clean', 'hygiene', 'brush', 'teeth'
  ],
  'Music & Arts': [
    'sing', 'song', 'music', 'musical',
    'dance', 'rhythm', 'beat', 'tempo',
    'instrument', 'drum', 'piano', 'guitar', 'violin',
    'art', 'draw', 'paint', 'color', 'colour', 'create',
    'play', 'game', 'fun', 'enjoy'
  ],
  'Language & Literacy': [
    'letter', 'word', 'read', 'write', 'book', 'story',
    'sound', 'phonics', 'rhyme', 'poem',
    'speak', 'talk', 'listen', 'hear',
    'language', 'vocabulary', 'grammar'
  ]
};

// Grade level mapping: age ranges in song metadata → grade levels
const gradeMapping = {
  'daycare': ['infant', 'baby', 'toddler', '0-2', '0-3', 'birth'],
  'preschool': ['toddler', 'preschool', 'pre-k', 'prek', '2-4', '3-5', '2-5'],
  'kindergarten': ['kindergarten', 'k', '4-6', '5-6', '5-7'],
  'grade-1': ['grade 1', 'grade-1', 'first grade', '6-7', '6-8'],
  'grade-2': ['grade 2', 'grade-2', 'second grade', '7-8', '7-9'],
  'grade-3': ['grade 3', 'grade-3', 'third grade', '8-9', '8-10']
};

// Prepare insert statement
const insertLink = db.prepare(`
  INSERT OR IGNORE INTO curriculum_topic_songs (
    id,
    curriculum_topic_id,
    search_chunk_id,
    link_type,
    created_at
  ) VALUES (
    ?, ?, ?, ?, datetime('now')
  )
`);

let totalLinks = 0;
let songsLinked = new Set();
let topicsLinked = new Set();

console.log('Matching songs to curriculum topics...\n');

for (const song of songs) {
  const songText = `${song.title} ${song.chunk_text}`.toLowerCase();
  
  // Parse metadata for age range
  let songAgeRange = '';
  try {
    const meta = JSON.parse(song.meta || '{}');
    songAgeRange = (meta.ageRange || '').toLowerCase();
  } catch (e) {
    // Ignore parse errors
  }
  
  // Find matching topics
  for (const topic of topics) {
    let isMatch = false;
    let linkType = 'inferred';
    
    // Check subject match
    const subjectKeywords = subjectMapping[topic.subject] || [];
    for (const keyword of subjectKeywords) {
      if (songText.includes(keyword.toLowerCase())) {
        isMatch = true;
        linkType = 'subject-match';
        break;
      }
    }
    
    // Check grade level match (if we have age range info)
    if (songAgeRange) {
      const gradeKeywords = gradeMapping[topic.grade_key] || [];
      for (const keyword of gradeKeywords) {
        if (songAgeRange.includes(keyword)) {
          // If subject already matched, upgrade to strong match
          if (isMatch) {
            linkType = 'strong-match';
          } else {
            isMatch = true;
            linkType = 'grade-match';
          }
          break;
        }
      }
    }
    
    // Create link if we found a match
    if (isMatch) {
      const id = randomUUID();
      
      try {
        insertLink.run(id, topic.id, song.id, linkType);
        totalLinks++;
        songsLinked.add(song.id);
        topicsLinked.add(topic.id);
      } catch (error) {
        // Ignore duplicate errors
        if (!error.message.includes('UNIQUE constraint')) {
          console.error(`ERROR linking ${song.title} to ${topic.lesson_topic}: ${error.message}`);
        }
      }
    }
  }
}

console.log(`\n=== LINKING COMPLETE ===`);
console.log(`Songs analyzed: ${songs.length}`);
console.log(`Songs linked: ${songsLinked.size}`);
console.log(`Topics linked: ${topicsLinked.size}`);
console.log(`Total links created: ${totalLinks}`);

// Show breakdown by link type
console.log(`\n=== LINKS BY TYPE ===`);
const linkTypes = db.prepare(`
  SELECT link_type, COUNT(*) as count
  FROM curriculum_topic_songs
  GROUP BY link_type
  ORDER BY count DESC
`).all();

for (const row of linkTypes) {
  console.log(`  ${row.link_type}: ${row.count} links`);
}

// Show breakdown by grade level
console.log(`\n=== LINKS BY GRADE LEVEL ===`);
const gradeLinks = db.prepare(`
  SELECT ct.grade_key, COUNT(*) as count
  FROM curriculum_topic_songs cts
  JOIN curriculum_topics ct ON cts.curriculum_topic_id = ct.id
  GROUP BY ct.grade_key
  ORDER BY ct.grade_key
`).all();

for (const row of gradeLinks) {
  console.log(`  ${row.grade_key}: ${row.count} links`);
}

// Show breakdown by subject
console.log(`\n=== TOP 10 SUBJECTS BY LINK COUNT ===`);
const subjectLinks = db.prepare(`
  SELECT ct.subject, COUNT(*) as count
  FROM curriculum_topic_songs cts
  JOIN curriculum_topics ct ON cts.curriculum_topic_id = ct.id
  GROUP BY ct.subject
  ORDER BY count DESC
  LIMIT 10
`).all();

for (const row of subjectLinks) {
  console.log(`  ${row.subject}: ${row.count} links`);
}

// Show sample links
console.log(`\n=== SAMPLE LINKS ===`);
const sampleLinks = db.prepare(`
  SELECT ct.lesson_topic, ct.subject, ct.grade_key, sc.title, cts.link_type
  FROM curriculum_topic_songs cts
  JOIN curriculum_topics ct ON cts.curriculum_topic_id = ct.id
  JOIN search_chunks sc ON cts.search_chunk_id = sc.id
  LIMIT 10
`).all();

for (const link of sampleLinks) {
  console.log(`\n  Topic: ${link.lesson_topic}`);
  console.log(`  Subject: ${link.subject} | Grade: ${link.grade_key}`);
  console.log(`  Song: ${link.title}`);
  console.log(`  Link type: ${link.link_type}`);
}

db.close();
console.log(`\n✓ Songs linked to curriculum topics successfully!`);
