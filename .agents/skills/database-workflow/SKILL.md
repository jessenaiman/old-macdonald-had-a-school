# Database Workflow — Drizzle + SQLite

## Architecture Principle

**Curriculum IS the lesson.** There is no separate "lesson" entity. A lesson page is a dynamic query that assembles:
- Topic metadata (name, skill statement, category)
- Grade associations
- Standards alignment
- Tags
- Materials (songs, resources)
- Assets (worksheets, posters, printables)
- Weekly pacing (when to teach it)

## Drizzle Migration Workflow

### 1. Update Schema
Edit `src/db/schema-sqlite.ts` to reflect the desired state.

### 2. Generate Migration
```bash
npx drizzle-kit generate --config=drizzle.sqlite.config.ts --name descriptive_name
```

This creates `src/db/migrations-sqlite/NNNN_name.sql` with the SQL diff.

### 3. Apply Migration
```bash
npx drizzle-kit migrate --config=drizzle.sqlite.config.ts
```

This runs the SQL against `data/omhas.db` and records it in `__drizzle_migrations`.

### 4. Verify
```bash
npx drizzle-kit studio --config=drizzle.sqlite.config.ts
```

Opens a web UI to inspect the database.

## Important: Baseline Migration

The baseline migration (`0000_baseline_sqlite_schema.sql`) captures the schema as it existed at a point in time. It must be marked as applied before generating new migrations:

```sql
INSERT INTO __drizzle_migrations (hash, created_at) 
VALUES ('baseline_hash', datetime('now'));
```

## Query Patterns

### Lesson Page Query
Assemble a complete lesson from curriculum data:

```typescript
import { db } from '@/lib/db';
import { topics, topicGrades, grades, topicStandards, standards, 
         topicTags, tags, topicMaterials, songs, resources,
         lessonAssets, weeklyPacing } from '@/db/schema-sqlite';
import { eq, and } from 'drizzle-orm';

export async function getLessonPage(topicId: number) {
  // Topic + grades
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
    with: {
      topicGrades: { with: { grade: true } },
      topicStandards: { with: { standard: true } },
      topicTags: { with: { tag: true } },
      topicMaterials: true,
      lessonAssets: true,
      weeklyPacing: true,
    },
  });

  // Fetch related songs/resources
  const materials = await Promise.all(
    topic.topicMaterials.map(async (tm) => {
      if (tm.materialKind === 'song') {
        return await db.query.songs.findFirst({
          where: eq(songs.id, tm.materialId),
        });
      }
      if (tm.materialKind === 'resource') {
        return await db.query.resources.findFirst({
          where: eq(resources.id, tm.materialId),
        });
      }
      return null;
    })
  );

  return { ...topic, materials };
}
```

### Search Query
Semantic + keyword search against curriculum:

```typescript
export async function searchCurriculum(query: string, grade?: string) {
  const results = await db
    .select({
      id: topics.id,
      topic: topics.lessonTopic,
      skill: topics.skillStatement,
      grade: grades.label,
      subject: subjects.label,
    })
    .from(topics)
    .leftJoin(topicGrades, eq(topics.id, topicGrades.topicId))
    .leftJoin(grades, eq(topicGrades.gradeId, grades.id))
    .leftJoin(subjects, eq(topics.subjectId, subjects.id))
    .where(
      and(
        grade ? eq(grades.key, grade) : undefined,
        // FTS5 or semantic search would go here
      )
    );
  
  return results;
}
```

## Schema Rules

1. **All schema changes go through Drizzle migrations** — never raw SQL
2. **Foreign keys are explicit** — use `.references()` in schema
3. **Tables are lowercase** — `songs`, `topics`, `grades` (not `SONGS`, `TOPICS`)
4. **Fields are camelCase** — `lessonTopic`, `skillStatement` (not `lesson_topic`)
5. **Junction tables are named** — `topicGrades`, `topicStandards` (not `TOPIC_GRADES`)

## File Locations

- Schema: `src/db/schema-sqlite.ts`
- Migrations: `src/db/migrations-sqlite/`
- Database: `data/omhas.db`
- Config: `drizzle.sqlite.config.ts`
