#!/usr/bin/env python3
"""Import the curriculum map and the user-supplied local resource workbook.

This is intentionally a small, idempotent batch. Exact duplicate resources are
reused; they do not prevent new map rows or new resource links from being
processed.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from openpyxl import load_workbook


BATCH_ID = "data-20260813-curriculum-map-local-resources-v1"
GRADE_KEYS = {"Grade 1": "grade-1", "Grade 2": "grade-2", "Grade 3": "grade-3"}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def normalize(value: object) -> str:
    return re.sub(r"[^a-z0-9]+", " ", str(value or "").casefold()).strip()


def project_path(path: Path, root: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def source_document_id(db: sqlite3.Connection, path: str, checksum: str) -> int:
    now = datetime.now(timezone.utc).isoformat()
    db.execute(
        """
        INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
        VALUES (?, 'xlsx', 'reviewed', ?, ?)
        ON CONFLICT(source_path) DO UPDATE SET
          review_state = 'reviewed', checksum = excluded.checksum, imported_at = excluded.imported_at
        """,
        (path, checksum, now),
    )
    return db.execute("SELECT id FROM source_documents WHERE source_path = ?", (path,)).fetchone()[0]


def source_id(db: sqlite3.Connection, path: str, checksum: str) -> int:
    row = db.execute("SELECT id FROM sources WHERE path_or_url = ?", (path,)).fetchone()
    if row:
        db.execute("UPDATE sources SET checksum = ?, type = 'xlsx' WHERE id = ?", (checksum, row[0]))
        return row[0]
    cursor = db.execute(
        "INSERT INTO sources (path_or_url, type, checksum) VALUES (?, 'xlsx', ?)",
        (path, checksum),
    )
    return cursor.lastrowid


def import_map(db: sqlite3.Connection, workbook_path: Path, root: Path) -> dict[str, int]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    grade_ids = {
        row[0]: row[1]
        for row in db.execute("SELECT key, id FROM grades WHERE key IN ('grade-1', 'grade-2', 'grade-3')")
    }
    topic_grade_rows = db.execute(
        """
        SELECT tg.id, tg.topic_id, tg.grade_id, t.topic
        FROM topic_grades tg
        JOIN topics t ON t.id = tg.topic_id
        WHERE tg.grade_id IN (?, ?, ?)
        """,
        (grade_ids["grade-1"], grade_ids["grade-2"], grade_ids["grade-3"]),
    ).fetchall()
    topic_grades = {(grade_id, normalize(topic)): (tg_id, topic_id) for tg_id, topic_id, grade_id, topic in topic_grade_rows}

    stats = {"map_rows": 0, "pacing_inserted": 0, "pacing_updated": 0, "standards_linked": 0, "unresolved": 0}
    source_path = project_path(workbook_path, root)
    for sheet_name, grade_key in GRADE_KEYS.items():
        worksheet = workbook[sheet_name]
        for week, month, strand, lesson_name, ontario_code in worksheet.iter_rows(min_row=2, values_only=True):
            if not lesson_name or not month or not week:
                continue
            stats["map_rows"] += 1
            grade_id = grade_ids[grade_key]
            match = topic_grades.get((grade_id, normalize(lesson_name)))
            if not match:
                stats["unresolved"] += 1
                continue
            topic_grade_id, topic_id = match
            map_note = f"Source: {source_path}; strand={strand or 'not recorded'}; Ontario code={ontario_code or 'not recorded'}"
            existing = db.execute(
                "SELECT id, week_number, month FROM weekly_pacing WHERE topic_grade_id = ? ORDER BY week_number",
                (topic_grade_id,),
            ).fetchall()
            same_slot = next((row for row in existing if row[1] == week and row[2] == month), None)
            if same_slot:
                db.execute("UPDATE weekly_pacing SET notes = ? WHERE id = ?", (map_note, same_slot[0]))
                pacing_id = same_slot[0]
            elif len(existing) == 1:
                pacing_id = existing[0][0]
                db.execute(
                    "UPDATE weekly_pacing SET week_number = ?, month = ?, notes = ? WHERE id = ?",
                    (week, month, map_note, pacing_id),
                )
                stats["pacing_updated"] += 1
            else:
                cursor = db.execute(
                    "INSERT INTO weekly_pacing (topic_grade_id, week_number, month, notes) VALUES (?, ?, ?, ?)",
                    (topic_grade_id, week, month, map_note),
                )
                pacing_id = cursor.lastrowid
                stats["pacing_inserted"] += 1

            standard = db.execute(
                "SELECT id, code FROM standards WHERE framework = 'Ontario' AND full_text = ? ORDER BY id LIMIT 1",
                (lesson_name,),
            ).fetchone()
            if standard:
                standard_id = standard[0]
                if not standard[1] and ontario_code:
                    db.execute("UPDATE standards SET code = ? WHERE id = ?", (ontario_code, standard_id))
            else:
                cursor = db.execute(
                    """
                    INSERT INTO standards (framework, code, full_text, source)
                    VALUES ('Ontario', ?, ?, ?)
                    """,
                    (ontario_code, lesson_name, "Curriculum_Map.xlsx"),
                )
                standard_id = cursor.lastrowid
            linked = db.execute(
                "SELECT 1 FROM topic_standards WHERE topic_id = ? AND standard_id = ?",
                (topic_id, standard_id),
            ).fetchone()
            if not linked:
                db.execute(
                    "INSERT INTO topic_standards (topic_id, standard_id, alignment_notes) VALUES (?, ?, ?)",
                    (topic_id, standard_id, map_note),
                )
                stats["standards_linked"] += 1
    return stats


def import_resources(db: sqlite3.Connection, workbook_path: Path, root: Path) -> dict[str, int]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    worksheet = workbook["Resources"]
    rows = list(worksheet.iter_rows(min_row=2, values_only=True))
    source_path = project_path(workbook_path, root)
    workbook_source_id = source_id(db, source_path, sha256(workbook_path))
    stats = {"resource_rows": 0, "resources_inserted": 0, "resources_reused": 0, "materials_linked": 0}
    resources: dict[str, int] = {}
    for name, resource_type, creator, url, age_band, categories, tags, verified, verified_by, verified_date, notes in rows:
        if not name:
            continue
        stats["resource_rows"] += 1
        existing = None
        if url:
            existing = db.execute("SELECT id FROM resources WHERE url = ? ORDER BY id LIMIT 1", (url,)).fetchone()
        if not existing:
            existing = db.execute(
                "SELECT id FROM resources WHERE lower(name) = lower(?) ORDER BY id LIMIT 1", (name,)
            ).fetchone()
        resource_kind = str(resource_type or "resource").casefold()
        description = "; ".join(
            value for value in [
                f"Creator/artist: {creator}" if creator else None,
                f"Age band: {age_band}" if age_band else None,
                f"Categories: {categories}" if categories else None,
                f"Tags: {tags}" if tags else None,
                f"Verified by: {verified_by} ({verified_date})" if verified_by or verified_date else None,
                str(notes) if notes else None,
            ]
            if value
        )
        verified_value = 1 if str(verified or "").casefold() in {"y", "yes", "true", "1"} else 0
        if existing:
            resource_id = existing[0]
            db.execute(
                "UPDATE resources SET description = ?, url = COALESCE(?, url), verified = ?, source_id = ? WHERE id = ?",
                (description, url, verified_value, workbook_source_id, resource_id),
            )
            stats["resources_reused"] += 1
        else:
            cursor = db.execute(
                """
                INSERT INTO resources (name, type, description, url, verified, source_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (name, resource_kind, description, url, verified_value, workbook_source_id),
            )
            resource_id = cursor.lastrowid
            stats["resources_inserted"] += 1
        resources[normalize(name)] = resource_id

    links = [
        (
            "Old MacDonald Had a Farm",
            427,
            "focus",
            "opening",
            "circle-time-core",
            "The workbook identifies this traditional song for infant-to-preschool use and links it to language/vocabulary and science/nature; use the existing Old MacDonald topic as the direct lesson home without creating another song record.",
        ),
        (
            "Open Shut Them",
            404,
            "supporting",
            "opening",
            "circle-time-core",
            "The workbook identifies this fingerplay for infant-to-preschool use and categorizes it for fine-motor and classroom-routine work; offer it as a brief hand warm-up before palmar-grasp exploration.",
        ),
        (
            "The Very Hungry Caterpillar",
            411,
            "focus",
            "guided-practice",
            "circle-time-core",
            "The workbook identifies this book for toddler-to-preschool use across literacy, science, and mathematics; use it as an optional picture-book choice for pointing, shared attention, and oral retell.",
        ),
    ]
    for name, topic_id, role, phase, routine, rationale in links:
        resource_id = resources.get(normalize(name))
        if resource_id is None:
            continue
        before = db.execute(
            "SELECT 1 FROM topic_materials WHERE topic_id = ? AND material_kind = 'resource' AND material_id = ?",
            (topic_id, resource_id),
        ).fetchone()
        db.execute(
            """
            INSERT INTO topic_materials
              (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
            VALUES (?, 'resource', ?, ?, ?, ?, ?)
            ON CONFLICT(topic_id, material_kind, material_id) DO UPDATE SET
              role = excluded.role, use_in_phase = excluded.use_in_phase,
              routine_slot = excluded.routine_slot, teacher_rationale = excluded.teacher_rationale
            """,
            (topic_id, resource_id, role, phase, routine, rationale),
        )
        if not before:
            stats["materials_linked"] += 1
    return stats


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--map", dest="map_path", type=Path, default=Path("data/Curriculum_Map.xlsx"))
    parser.add_argument("--resources", dest="resources_path", type=Path, default=Path("data/Curriculum_Resource_Database.xlsx"))
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    root = Path.cwd().resolve()
    map_path = args.map_path.resolve()
    resources_path = args.resources_path.resolve()
    if not map_path.is_file() or not resources_path.is_file():
        raise SystemExit("Both workbook paths must exist before importing.")
    db = sqlite3.connect(args.db)
    db.execute("PRAGMA foreign_keys = ON")
    try:
        if db.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (BATCH_ID,)).fetchone():
            print('{"status":"already applied","batch_id":"%s"}' % BATCH_ID)
            return 0
        result = {"batch_id": BATCH_ID, "status": "dry-run"}
        if args.apply:
            db.execute("BEGIN")
            map_path_rel = project_path(map_path, root)
            resources_path_rel = project_path(resources_path, root)
            source_document_id(db, map_path_rel, sha256(map_path))
            source_document_id(db, resources_path_rel, sha256(resources_path))
            result["map"] = import_map(db, map_path, root)
            result["resources"] = import_resources(db, resources_path, root)
            db.execute(
                "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (BATCH_ID, "curriculum_map_and_local_resources", f"{map_path_rel}; {resources_path_rel}", sha256(map_path) + ";" + sha256(resources_path)),
            )
            db.execute("COMMIT")
            result["status"] = "applied"
        else:
            result["map_source"] = project_path(map_path, root)
            result["resource_source"] = project_path(resources_path, root)
        print(result)
        return 0
    except Exception:
        if db.in_transaction:
            db.execute("ROLLBACK")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
