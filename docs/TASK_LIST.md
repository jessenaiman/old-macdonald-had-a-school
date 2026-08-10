# Data Collection & Schema Improvement Task List

## Context
We switched to SQLite to avoid PostgreSQL authentication/networking issues. The database is now at `./data/omhas.db` with 1,429 search chunks (1,405 songs + 24 knowledge chunks).

**Where we got stuck:**
- Tried to add `lyrics` and `instructions` columns to `search_chunks` table
- btree indexes exceeded PostgreSQL's 2704 byte limit
- Had to drop those indexes
- Got stuck in PostgreSQL authentication hell (Docker, WSL, Neon limits)
- Switched to SQLite (no limits, no auth issues)

**Current state:**
- SQLite database working ✓
- 1,429 chunks migrated ✓
- Curriculum queries working ✓
- Need to: integrate spreadsheet data, continue data collection, improve schema

---

## Phase 1: Integrate Spreadsheet Data

### 1.1 Import Curriculum Topics
- [ ] Read `data/Curriculum_Export_v2_2026-08-06.xlsx`
- [ ] Parse all sheets (Daycare, Preschool, Kindergarten, Grade 1-3)
- [ ] Import into `curriculum_topics` table
- [ ] Verify: 470 topics across 6 grade levels
- [ ] Test queries: "Find Grade 2 Math topics", "Find Early Years topics"

### 1.2 Import Research Sources
- [ ] Read `data/Early Years Action Song Research Corpus.xlsx`
- [ ] Import Sources sheet (5 sources: Bedford Music, ECFE, Health Unit, etc.)
- [ ] Import into `research_sources` table
- [ ] Verify: 5 sources with URLs and download status

### 1.3 Import Action Vocabulary
- [ ] Read Action Vocabulary sheet (12 action families)
- [ ] Import into `action_vocabulary` table
- [ ] Verify: 12 families (hands/fingers, clap/pat, point/gesture, etc.)

### 1.4 Import Research Queue
- [ ] Read Research Queue sheet (5 priority items)
- [ ] Import into `research_queue` table
- [ ] Verify: 5 items with priority, resource, why_it_matters

### 1.5 Import Song Actions (Template)
- [ ] Read Song Actions sheet (template, mostly empty)
- [ ] Import structure into `song_actions` table
- [ ] Note: This will be populated during data collection phase

---

## Phase 2: Schema Improvements

### 2.1 Add Full-Text Search to SQLite
- [ ] Enable FTS5 extension
- [ ] Create FTS5 virtual table for search_chunks
- [ ] Index: title, chunk_text, lyrics, instructions
- [ ] Test: Full-text search for "Humpty Dumpty sat"

### 2.2 Add Lyrics/Instructions Columns (SQLite has no btree limit!)
- [ ] Add `lyrics` TEXT column to search_chunks
- [ ] Add `instructions` TEXT column to search_chunks
- [ ] Run parsing script to populate from chunk_text
- [ ] Verify: SELECT lyrics, instructions FROM search_chunks WHERE title LIKE '%humpty%'

### 2.3 Add Metadata Indexes
- [ ] Index on meta->>'kind' for filtering
- [ ] Index on meta->>'ageRange' for age-based queries
- [ ] Index on meta->>'educationalDomain' for domain-based queries

### 2.4 Add Curriculum Topic Links
- [ ] Create junction table: curriculum_topic_songs
- [ ] Link curriculum topics to songs (many-to-many)
- [ ] Test: "Find all songs for Grade 1 Math"

---

## Phase 3: Data Collection (Song Actions)

### 3.1 Download Research Sources
- [ ] Download Bedford Music lesson plans (SRC-001, SRC-004, SRC-005)
- [ ] Download ECFE Favorite Songs (SRC-002)
- [ ] Download Health Unit circle time cards (SRC-003)
- [ ] Update research_sources.download_status to 'Downloaded'

### 3.2 Extract Song Actions from Sources
- [ ] Parse Bedford Music lesson plans
- [ ] Extract: song title, action wording, normalized action, action sequence
- [ ] Import into song_actions table
- [ ] Link to research_sources (source_id)

### 3.3 Normalize Actions
- [ ] Map extracted actions to action_vocabulary families
- [ ] Update song_actions.normalized_action with family names
- [ ] Verify: All actions map to one of 12 families

### 3.4 Link Song Actions to Search Chunks
- [ ] Match song_actions to search_chunks by song title
- [ ] Create song_action_chunks junction records
- [ ] Verify: "Find all actions for Humpty Dumpty"

---

## Phase 4: Curriculum Integration

### 4.1 Link Songs to Curriculum Topics
- [ ] Match songs to curriculum topics by subject/grade
- [ ] Create curriculum_topic_songs junction records
- [ ] Verify: "Find all songs for Kindergarten Language & Literacy"

### 4.2 Generate Curriculum Reports
- [ ] Count songs per curriculum topic
- [ ] Identify gaps (topics with 0 songs)
- [ ] Generate report: curriculum_coverage.json

### 4.3 Create Lesson Plan Templates
- [ ] For each curriculum topic, generate:
  - Topic name, grade, subject
  - List of linked songs (with lyrics/instructions)
  - Suggested activities
- [ ] Export as JSON for website

---

## Phase 5: Quality Assurance

### 5.1 Data Integrity Checks
- [ ] Verify: All curriculum topics have at least 1 song
- [ ] Verify: All song actions map to action vocabulary
- [ ] Verify: No orphaned records in junction tables

### 5.2 Search Quality Tests
- [ ] Test: Full-text search for common songs
- [ ] Test: Filter by grade level
- [ ] Test: Filter by subject
- [ ] Test: Filter by action family

### 5.3 Performance Tests
- [ ] Benchmark: Full-text search latency (<100ms target)
- [ ] Benchmark: Filtered query latency (<50ms target)
- [ ] Optimize: Add indexes if needed

---

## Phase 6: Export & Documentation

### 6.1 Export Database Schema
- [ ] Generate schema documentation
- [ ] Document all tables, columns, indexes
- [ ] Create ER diagram

### 6.2 Export Data Dictionary
- [ ] Document each table's purpose
- [ ] Document column meanings
- [ ] Provide example queries

### 6.3 Create Migration Guide
- [ ] Document how to migrate from SQLite to PostgreSQL (for production)
- [ ] Document how to add new data sources
- [ ] Document how to run data collection

---

## Success Criteria

✅ All 470 curriculum topics imported  
✅ All 5 research sources imported  
✅ All 12 action vocabulary families imported  
✅ All 5 research queue items imported  
✅ Lyrics/instructions columns added and populated  
✅ Full-text search working  
✅ Song actions extracted from at least 1 source  
✅ Curriculum topics linked to songs  
✅ Data integrity checks passing  
✅ Search latency <100ms  

---

## Next Immediate Action

**Start Phase 1.1:** Import curriculum topics from `Curriculum_Export_v2_2026-08-06.xlsx`

This will give us the foundation to link songs to curriculum topics and generate lesson plans.
