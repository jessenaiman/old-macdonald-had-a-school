import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db', { readonly: true });
console.log('═══ DATABASE HEALTH AUDIT ═══\n');

// ── 1. Table naming consistency ────────────────────────────────────────────
console.log('── 1. TABLE NAMING ──');
const tables = db.prepare(`SELECT name, type FROM sqlite_master WHERE type='table' AND name NOT LIKE '%fts%' AND name NOT LIKE 'sqlite_%' AND name != '__drizzle_migrations' ORDER BY name`).all();
const upper = tables.filter(t => /[A-Z]/.test(t.name.split('_')[0][0]));
console.log(`Uppercase-first table names: ${upper.length ? upper.map(t => t.name).join(', ') : 'NONE — all consistent'}`);

// ── 2. FK Integrity: orphaned children ─────────────────────────────────────
console.log('\n── 2. RELATIONAL KEY INTEGRITY ──');
const fkChecks = [
  ['topic_grades', 'topic_id', 'topics', 'id'],
  ['topic_grades', 'grade_id', 'grades', 'id'],
  ['topic_standards', 'topic_id', 'topics', 'id'],
  ['topic_standards', 'standard_id', 'standards', 'id'],
  ['topic_tags', 'topic_id', 'topics', 'id'],
  ['topic_tags', 'tag_id', 'tags', 'id'],
  ['topic_materials', 'topic_id', 'topics', 'id'],
  ['weekly_pacing', 'topic_grade_id', 'topic_grades', 'id'],
  ['material_tags', 'tag_id', 'tags', 'id'],
  ['song_curriculum_links', 'song_id', 'songs', 'id'],
  ['search_chunk_sources', 'search_chunk_id', 'search_chunks', 'id'],
  ['search_chunk_sources', 'source_document_id', 'source_documents', 'id'],
  ['curriculum_topic_songs', 'search_chunk_id', 'search_chunks', 'id'],
  ['curriculum_topic_songs', 'topic_id', 'topics', 'id'],
  ['curriculum_topic_songs', 'curriculum_topic_id', 'curriculum_topics', 'id'],
  ['lesson_assets', 'topic_id', 'topics', 'id'],
  ['standards', 'parent_standard_id', 'standards', 'id'],
  ['tags', 'parent_tag_id', 'tags', 'id'],
];
let orphanTotal = 0;
for (const [child, fkCol, parent, pkCol] of fkChecks) {
  let orphan = 0;
  try {
    orphan = db.prepare(
      `SELECT COUNT(*) as n FROM ${child} c LEFT JOIN ${parent} p ON p.${pkCol} = c.${fkCol} WHERE c.${fkCol} IS NOT NULL AND p.${pkCol} IS NULL`
    ).get().n;
  } catch (e) { orphan = -1; }
  if (orphan > 0) { orphanTotal += orphan; console.log(`  ✗ ${child}.${fkCol} → ${parent}: ${orphan} orphans`); }
  else if (orphan === 0) console.log(`  ✓ ${child}.${fkCol} → ${parent}: ok`);
  else console.log(`  ? ${child}.${fkCol}: table missing (ok if intentionally dropped)`);
}
console.log(orphanTotal === 0 ? '  → NO orphaned FK references' : `  → ${orphanTotal} orphans total`);

// ── 3. Leftover raw text fields that should be parsed ─────────────────────
console.log('\n── 3. TEXT FIELDS PARTIALLY PARSED (assess readability) ──');
const checks = [
  ['songs', 'curriculum_links', 'parsed into song_curriculum_links'],
  ['songs', 'early_years_links', 'parsed into song_curriculum_links'],
  ['songs', 'tags', 'parsed into material_tags'],
  ['curriculum_topics', 'linked_songs', 'parsed into topic_materials'],
  ['curriculum_topics', 'linked_resources', 'parsed into topic_materials'],
  ['curriculum_topics', 'standards', 'parsed into topic_standards'],
  ['curriculum_topics', 'tags', 'parsed into topic_tags'],
];
for (const [t, col, parsedInto] of checks) {
  const stat = db.prepare(`SELECT COUNT(*) as total, SUM(CASE WHEN ${col} IS NOT NULL AND ${col} != '' THEN 1 ELSE 0 END) as filled FROM ${t}`).get();
  if (stat.filled > 0) console.log(`  ⚠ ${t}.${col}: ${stat.filled}/${stat.total} still hold raw text (${parsedInto})`);
  else console.log(`  ✓ ${t}.${col}: clean`);
}

// ── 4. SANITY: duplicates in songs ─────────────────────────────────────────
console.log('\n── 4. DUPLICATE SONGS ──');
const dup = db.prepare('SELECT title, COUNT(*) as n FROM songs GROUP BY title HAVING n > 1 ORDER BY n DESC LIMIT 5').all();
console.log(dup.length ? dup.map(d => `  "${d.title}" ×${d.n}`).join('\n') : '  none');

// ── 5. Standards final state ───────────────────────────────────────────────
console.log('\n── 5. STANDARDS FINAL ──');
const stds = db.prepare(`SELECT framework, COUNT(*) as total, SUM(CASE WHEN full_text IS NOT NULL AND full_text != '' THEN 1 ELSE 0 END) as text FROM standards GROUP BY framework ORDER BY total DESC`).all();
stds.forEach(f => {
  const pct = Math.round(f.text / f.total * 100);
  console.log(`  ${f.framework}: ${f.text}/${f.total} (${pct}%)${pct < 100 ? ' ⚠️' : ' ✓'}`);
});

db.close();