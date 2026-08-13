#!/usr/bin/env python3
"""Inspect the live OMHAS SQLite schema and emit a deterministic manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
from pathlib import Path
from typing import Any


SCHEMA_OBJECT_TYPES = ("table", "index", "trigger", "view")


def rows_as_dicts(cursor: sqlite3.Cursor) -> list[dict[str, Any]]:
    columns = [item[0] for item in cursor.description]
    return [dict(zip(columns, row, strict=True)) for row in cursor.fetchall()]


def inspect_schema(database_path: Path, project_root: Path) -> dict[str, Any]:
    resolved_database = database_path.resolve()
    connection = sqlite3.connect(f"file:{resolved_database.as_posix()}?mode=ro", uri=True)
    try:
        objects = rows_as_dicts(connection.execute(
            """SELECT type, name, tbl_name, COALESCE(sql, '') AS sql
               FROM sqlite_master
               WHERE name NOT LIKE 'sqlite_%' AND type IN ('table', 'index', 'trigger', 'view')
               ORDER BY type, name"""
        ))
        tables: dict[str, Any] = {}
        for row in objects:
            if row["type"] != "table":
                continue
            name = str(row["name"])
            quoted = name.replace('"', '""')
            tables[name] = {
                "columns": rows_as_dicts(connection.execute(f'PRAGMA table_info("{quoted}")')),
                "foreign_keys": rows_as_dicts(connection.execute(f'PRAGMA foreign_key_list("{quoted}")')),
                "indexes": rows_as_dicts(connection.execute(f'PRAGMA index_list("{quoted}")')),
            }

        canonical_schema = json.dumps(
            {"objects": objects, "tables": tables},
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        fingerprint = hashlib.sha256(canonical_schema.encode("utf-8")).hexdigest()

        drizzle = []
        if "__drizzle_migrations" in tables:
            drizzle = rows_as_dicts(connection.execute(
                "SELECT id, hash, created_at FROM __drizzle_migrations ORDER BY id"
            ))
        legacy = []
        if "schema_migrations" in tables:
            legacy = rows_as_dicts(connection.execute(
                "SELECT migration_id, applied_at FROM schema_migrations ORDER BY migration_id"
            ))
        migration_files = sorted(
            path.relative_to(project_root).as_posix()
            for path in (project_root / "src/db/migrations-sqlite").glob("*.sql")
        )
        return {
            "manifest_version": 1,
            "database": resolved_database.relative_to(project_root).as_posix(),
            "schema_fingerprint": fingerprint,
            "user_version": connection.execute("PRAGMA user_version").fetchone()[0],
            "object_counts": {
                kind: sum(item["type"] == kind for item in objects)
                for kind in SCHEMA_OBJECT_TYPES
            },
            "migration_state": {
                "drizzle": drizzle,
                "legacy": legacy,
                "checked_in_sql": migration_files,
            },
            "objects": objects,
            "tables": tables,
        }
    finally:
        connection.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--output", type=Path, help="Write the manifest to this path; otherwise print JSON")
    args = parser.parse_args()
    manifest = inspect_schema(args.db, args.project_root.resolve())
    rendered = json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8", newline="\n")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
