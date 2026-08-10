# Essential Curriculum Query Suite

**Purpose:** Verification checklist to run after every database migration or update to ensure curriculum planning queries return relevant results.

**How to run:** `node scripts/data/test-curriculum-queries.mjs`

**Success criteria:** All queries should return ≥1 result with score ≥0.2 within 200ms.

---

## Science (3 queries)
1. `"Science: electricity"` - Find lessons about electricity
2. `"weather seasons rain snow"` - Find lessons about weather and seasons
3. `"plants growing seeds garden"` - Find lessons about plant life cycles

## Animals (4 queries)
4. `"Animals: horses"` - Find lessons featuring horses
5. `"farm animals cow pig chicken"` - Find farm animal lessons
6. `"ocean animals fish whale dolphin"` - Find ocean/marine animal lessons
7. `"birds flying nest eggs"` - Find bird-themed lessons

## Fingerplays (3 queries)
8. `"Fingerplays with ponies"` - Find pony/horse fingerplays
9. `"fingerplays counting numbers"` - Find counting fingerplays
10. `"fingerplays body parts hands feet"` - Find body awareness fingerplays

## Social-Emotional (3 queries)
11. `"feelings emotions happy sad angry"` - Find emotional literacy content
12. `"sharing taking turns cooperation"` - Find social skills content
13. `"self-regulation calm breathing"` - Find self-regulation strategies

## Literacy (3 queries)
14. `"alphabet letters ABC"` - Find alphabet/letter content
15. `"rhyming words phonological awareness"` - Find rhyming/phonological content
16. `"storytelling narrative sequence"` - Find storytelling content

## Math (3 queries)
17. `"counting numbers 1-10"` - Find counting content
18. `"shapes circle square triangle"` - Find shape content
19. `"patterns sorting categorizing"` - Find pattern/sorting content

## Transitions (3 queries)
20. `"hello welcome greeting songs"` - Find greeting/opening content
21. `"goodbye farewell closing songs"` - Find closing content
22. `"cleanup transition songs"` - Find transition content

## Cultural (1 query)
23. `"multicultural diverse traditions"` - Find multicultural content

## Seasonal (3 queries)
24. `"autumn fall leaves harvest"` - Find autumn content
25. `"winter snow cold holidays"` - Find winter content
26. `"spring flowers butterflies"` - Find spring content

## Age-Specific (3 queries)
27. `"infant baby lullaby soothing"` - Find infant-appropriate content
28. `"toddler movement active energetic"` - Find toddler-appropriate content
29. `"preschool complex narrative"` - Find preschool-appropriate content

---

## Verification Checklist

After each migration, verify:

- [ ] All 29 queries return ≥1 result
- [ ] Average latency <100ms
- [ ] No query exceeds 200ms
- [ ] Top result score ≥0.2 for each query
- [ ] Results are relevant (spot-check 5 random queries)

## Current Baseline (2026-08-07)

- **Success rate:** 29/29 (100%)
- **Average latency:** 67ms
- **Slow queries:** 1 ("Science: electricity" - 373ms)
- **Weak matches:** 3 queries with low scores (<0.2)

## Known Gaps (Need More Data)

1. **Science: electricity** - Only 1 weak result
2. **Shapes/patterns** - Limited math content
3. **Multicultural** - Only 2 results
4. **Pony-specific fingerplays** - Semantic matches but no exact pony content

---

## Query Syntax Reference

### Hybrid Search Formula
```sql
combined_score = (0.4 × keyword_score) + (0.6 × semantic_score)
```

- **Keyword search** (40%): Exact word matches using PostgreSQL full-text search
- **Semantic search** (60%): Meaning-based matches using embeddings

### Filter Examples
```sql
-- Only songs
WHERE kind = 'song'

-- Only knowledge chunks
WHERE kind = 'knowledge'

-- Grade level filter (if meta contains grade)
WHERE meta->>'grade' = 'preschool'

-- Date range
WHERE created_at >= '2026-01-01'
```

---

## Maintenance

- **Run after:** Every migration, schema change, or data import
- **Frequency:** At minimum, weekly during active development
- **Owner:** Data integrity team (not front-end developers)
- **Alert threshold:** Alert if success rate drops below 95% or average latency exceeds 150ms
