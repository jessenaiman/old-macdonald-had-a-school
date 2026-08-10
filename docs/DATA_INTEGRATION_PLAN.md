# Data Integration Plan: Early Years Music Resources + Curriculum Export

## Goal
Merge 1,429 chunks (24 knowledge + 1,405 songs) from the early years research collection with the curriculum export file into a unified, revision-tracked database using Drizzle migrations.

---

## Phase 1: Schema Design & Migration Setup ✓ COMPLETE
- [x] Install Drizzle ORM and drizzle-kit
- [x] Create `drizzle.config.ts`
- [x] Create `src/db/schema.ts` with search_chunks table
- [x] Add migration scripts to package.json
- [x] Generate initial migration (0000_volatile_norman_osborn.sql)

---

## Phase 2: Curriculum Export Analysis
- [ ] Read and analyze `data/Curriculum_Export_v2_2026-08-06.xlsx`
- [ ] Identify schema structure (columns, data types, relationships)
- [ ] Map curriculum fields to search_chunks schema
- [ ] Identify missing fields that need schema extensions
- [ ] Document data quality issues (nulls, duplicates, inconsistencies)

---

## Phase 3: Schema Evolution
- [ ] Design extended schema to accommodate curriculum data
- [ ] Add curriculum-specific fields (grade level, subject area, standards, etc.)
- [ ] Create foreign key relationships if needed (e.g., to grade_levels table)
- [ ] Add indexes for common query patterns
- [ ] Generate migration for schema changes
- [ ] Test migration on Neon database

---

## Phase 4: Data Verification Scripts
- [ ] Create `scripts/data/verify-integrity.mjs` - check for:
  - Duplicate source_paths
  - Missing required fields
  - Invalid embedding dimensions
  - Orphaned records
- [ ] Create `scripts/data/compare-sources.mjs` - verify:
  - All song_versions files are in database
  - All knowledge chunks are in database
  - No data loss during ingestion
- [ ] Create `scripts/data/curriculum-validation.mjs` - verify:
  - All curriculum records imported correctly
  - Field mappings are accurate
  - No data truncation or type mismatches

---

## Phase 5: Curriculum Data Integration
- [ ] Create `scripts/data/import-curriculum.mjs` to:
  - Parse Excel file (using xlsx package)
  - Transform curriculum records to match schema
  - Generate embeddings for curriculum content
  - Insert into search_chunks with kind='curriculum'
- [ ] Run import script
- [ ] Verify import with validation script
- [ ] Generate report of import results

---

## Phase 6: Data Quality Audit
- [ ] Run integrity verification script
- [ ] Run source comparison script
- [ ] Run curriculum validation script
- [ ] Document findings in `docs/DATA_AUDIT_REPORT.md`
- [ ] Identify and fix any data quality issues
- [ ] Re-run verification after fixes

---

## Phase 7: Revision Tracking Setup
- [ ] Add `revision` field to schema (integer, auto-increment)
- [ ] Add `revision_notes` field (text, nullable)
- [ ] Add `superseded_by` field (uuid, nullable, foreign key to id)
- [ ] Create migration for revision tracking
- [ ] Update existing records with initial revision (1)
- [ ] Document revision workflow in `docs/REVISION_WORKFLOW.md`

---

## Phase 8: Query Optimization
- [ ] Analyze common query patterns
- [ ] Add composite indexes if needed
- [ ] Create `scripts/data/test-queries.mjs` to verify:
  - Hybrid search (semantic + keyword) performance
  - Filter by kind performance
  - Filter by grade level performance
  - Filter by date range performance
- [ ] Document query performance in `docs/QUERY_PERFORMANCE.md`

---

## Phase 9: Data Export & Backup
- [ ] Create `scripts/data/export-all.mjs` to export all data as JSON
- [ ] Create `scripts/data/backup-database.sh` to backup Neon database
- [ ] Schedule automated backups (if applicable)
- [ ] Document backup/restore procedure in `docs/BACKUP_RESTORE.md`

---

## Phase 10: Final Verification & Documentation
- [ ] Run all verification scripts one final time
- [ ] Generate comprehensive data report
- [ ] Document final schema in `docs/SCHEMA.md`
- [ ] Document data sources in `docs/DATA_SOURCES.md`
- [ ] Document integration process in `docs/INTEGRATION_COMPLETE.md`
- [ ] Create summary statistics:
  - Total records by kind
  - Records by grade level
  - Records by subject area
  - Embedding coverage percentage
  - Data quality score

---

## Deliverables

### Code
- `src/db/schema.ts` - Final schema with all fields
- `src/db/migrations/*.sql` - All migration files
- `scripts/data/*.mjs` - All data processing scripts

### Documentation
- `docs/DATA_AUDIT_REPORT.md` - Data quality findings
- `docs/REVISION_WORKFLOW.md` - How to manage revisions
- `docs/QUERY_PERFORMANCE.md` - Query optimization results
- `docs/BACKUP_RESTORE.md` - Backup and restore procedures
- `docs/SCHEMA.md` - Complete schema documentation
- `docs/DATA_SOURCES.md` - All data sources and mappings
- `docs/INTEGRATION_COMPLETE.md` - Final integration report

### Data
- Unified database with 3,000+ records (estimated)
- Revision tracking enabled
- Full embedding coverage
- Verified data integrity

---

## Success Criteria

✅ All early years data (1,429 chunks) merged with curriculum export  
✅ Schema supports both research and curriculum data  
✅ Migration system tracks all schema changes  
✅ Data integrity verified with automated scripts  
✅ Query performance meets <100ms target  
✅ Revision tracking enabled for all records  
✅ Comprehensive documentation complete  
✅ No data loss during integration  

---

## Next Step

**Start Phase 2:** Analyze the curriculum export file to understand its structure and plan the schema evolution.

Shall I proceed with Phase 2?
