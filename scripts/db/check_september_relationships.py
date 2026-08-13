#!/usr/bin/env python3
"""Compact release gate for September Kindergarten, Grade 1, and Grade 2."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

db = sqlite3.connect(f"file:{Path('data/omhas.db').resolve()}?mode=ro", uri=True)
try:
    rows = db.execute("""
      WITH scope AS (
        SELECT DISTINCT t.id AS topic_id, g.label AS grade, wp.week_number, wp.month
        FROM suggested_curriculum_plan_placements placement
        JOIN suggested_curriculum_plans plan ON plan.id=placement.plan_id AND plan.active=1
        JOIN topic_grades tg ON tg.id=placement.topic_grade_id
        JOIN topics t ON t.id=tg.topic_id JOIN grades g ON g.id=tg.grade_id
        JOIN weekly_pacing wp ON wp.topic_grade_id=tg.id AND wp.week_number=placement.week_number AND wp.month=placement.month
        WHERE g.label IN ('Kindergarten','Grade 1','Grade 2') AND placement.month='Sep'
      )
      SELECT scope.grade, scope.week_number, t.topic,
        NULLIF(TRIM(t.teacher_title),'') IS NOT NULL AS has_title,
        NULLIF(TRIM(t.teacher_summary),'') IS NOT NULL AS has_summary,
        EXISTS(SELECT 1 FROM topic_tags tt WHERE tt.topic_id=scope.topic_id) AS has_tags,
        EXISTS(SELECT 1 FROM topic_materials tm JOIN resources r ON r.id=tm.material_id AND tm.material_kind='resource'
               WHERE tm.topic_id=scope.topic_id AND r.verified=1 AND NULLIF(TRIM(tm.teacher_rationale),'') IS NOT NULL) AS has_reviewed_material,
        EXISTS(SELECT 1 FROM topic_standards ts WHERE ts.topic_id=scope.topic_id AND NULLIF(TRIM(ts.alignment_notes),'') IS NOT NULL) AS has_alignment_note
      FROM scope JOIN topics t ON t.id=scope.topic_id
      ORDER BY scope.grade, scope.week_number, t.topic
    """).fetchall()
    required = ["title", "summary", "tags", "reviewed_material", "alignment_note"]
    gaps = []
    for grade, week, topic, title, summary, tags, material, alignment in rows:
        values = [title, summary, tags, material, alignment]
        missing = [field for field, present in zip(required, values, strict=True) if not present]
        if missing: gaps.append({"grade": grade, "week": week, "topic": topic, "missing": missing})
    result = {"scope": "September Kindergarten, Grade 1, Grade 2", "placements": len(rows), "complete": len(rows) - len(gaps), "gaps": gaps}
    print(json.dumps(result, indent=2))
    raise SystemExit(1 if gaps else 0)
finally:
    db.close()
