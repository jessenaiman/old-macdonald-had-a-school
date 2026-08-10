import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

console.log('=== CURRICULUM QUERY TESTS (SQLite) ===\n');

const testQueries = [
  { name: 'Humpty Dumpty', query: "SELECT * FROM search_chunks WHERE title LIKE '%humpty%' OR chunk_text LIKE '%humpty%'" },
  { name: 'Itsy Bitsy Spider', query: "SELECT * FROM search_chunks WHERE title LIKE '%itsy%' OR chunk_text LIKE '%itsy%'" },
  { name: 'Wheels on the Bus', query: "SELECT * FROM search_chunks WHERE title LIKE '%wheels%' OR chunk_text LIKE '%wheels%'" },
  { name: 'Twinkle Twinkle', query: "SELECT * FROM search_chunks WHERE title LIKE '%twinkle%' OR chunk_text LIKE '%twinkle%'" },
  { name: 'Old MacDonald', query: "SELECT * FROM search_chunks WHERE title LIKE '%macdonald%' OR chunk_text LIKE '%macdonald%'" },
  { name: 'Five Little Monkeys', query: "SELECT * FROM search_chunks WHERE title LIKE '%monkey%' OR chunk_text LIKE '%monkey%'" },
  { name: 'Baby bounce songs', query: "SELECT * FROM search_chunks WHERE kind = 'song' AND chunk_text LIKE '%baby%'" },
  { name: 'Fingerplay instructions', query: "SELECT * FROM search_chunks WHERE instructions IS NOT NULL AND instructions != '' LIMIT 10" },
  { name: 'Songs with lyrics', query: "SELECT * FROM search_chunks WHERE lyrics IS NOT NULL AND lyrics != '' LIMIT 10" },
  { name: 'Counting songs', query: "SELECT * FROM search_chunks WHERE chunk_text LIKE '%one%' OR chunk_text LIKE '%two%' OR chunk_text LIKE '%three%' LIMIT 10" },
];

let passed = 0;
let failed = 0;

for (const test of testQueries) {
  try {
    const results = db.prepare(test.query).all();
    console.log(`✓ ${test.name}: ${results.length} results`);
    passed++;
  } catch (error) {
    console.log(`✗ ${test.name}: ${error.message}`);
    failed++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Passed: ${passed}/${testQueries.length}`);
console.log(`Failed: ${failed}/${testQueries.length}`);

db.close();
