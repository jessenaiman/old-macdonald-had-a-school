#!/usr/bin/env python3
"""Record a completed, page-level PDF visual review for the intake gate."""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path


if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def relative_path(path: Path, project_root: Path) -> str:
    try:
        return path.resolve().relative_to(project_root).as_posix()
    except ValueError as error:
        raise ValueError("source PDF must be inside the project root") from error


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-pdf", type=Path, required=True)
    parser.add_argument("--page", type=int, required=True)
    parser.add_argument("--rendered-page-path", type=Path, required=True)
    parser.add_argument("--evidence-notes", required=True)
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--reviewed-by", default="early-years-music-expert")
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    if args.page < 1:
        raise ValueError("page must be positive")
    source_pdf = args.source_pdf.resolve()
    rendered_page = args.rendered_page_path.resolve()
    if not source_pdf.is_file():
        raise ValueError(f"missing source PDF: {source_pdf}")
    if not rendered_page.is_file():
        raise ValueError(f"missing rendered page: {rendered_page}")

    project_root = args.project_root.resolve()
    source_path = relative_path(source_pdf, project_root)
    payload = {
        "batch_id": args.batch_id,
        "source_path": source_path,
        "page": args.page,
        "assessment_method": "hybrid",
        "text_layer_state": "definitive",
        "visual_review_state": "reviewed",
        "image_or_layout_present": 1,
        "rendered_page_path": str(rendered_page),
        "reviewed_by": args.reviewed_by,
    }
    if not args.apply:
        print(json.dumps({"status": "dry-run", **payload}, ensure_ascii=True, indent=2))
        return 0

    connection = sqlite3.connect(args.db)
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        inventory = connection.execute(
            "SELECT id FROM resource_file_inventory WHERE source_path = ?", (source_path,)
        ).fetchone()
        if inventory is None:
            raise ValueError(f"source PDF is not in resource inventory: {source_path}")
        if connection.execute(
            "SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)
        ).fetchone():
            raise ValueError(f"batch already used: {args.batch_id}")
        source_document = connection.execute(
            "SELECT id FROM source_documents WHERE source_path = ?", (source_path,)
        ).fetchone()

        with connection:
            connection.execute(
                """
                INSERT INTO schema_migrations
                  (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
                VALUES (?, CURRENT_TIMESTAMP, 'DATA_IMPORT', 'NOT_APPLICABLE', 'NOT_APPLICABLE')
                """,
                (args.batch_id,),
            )
            connection.execute(
                """
                INSERT INTO resource_page_evidence
                  (inventory_id, source_document_id, page_number, assessment_method,
                   text_layer_state, visual_review_state, image_or_layout_present,
                   rendered_page_path, evidence_notes, reviewed_by, reviewed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(inventory_id, page_number) DO UPDATE SET
                  source_document_id = excluded.source_document_id,
                  assessment_method = excluded.assessment_method,
                  text_layer_state = excluded.text_layer_state,
                  visual_review_state = excluded.visual_review_state,
                  image_or_layout_present = excluded.image_or_layout_present,
                  rendered_page_path = excluded.rendered_page_path,
                  evidence_notes = excluded.evidence_notes,
                  reviewed_by = excluded.reviewed_by,
                  reviewed_at = CURRENT_TIMESTAMP
                """,
                (
                    inventory[0],
                    source_document[0] if source_document else None,
                    args.page,
                    payload["assessment_method"],
                    payload["text_layer_state"],
                    payload["visual_review_state"],
                    payload["image_or_layout_present"],
                    payload["rendered_page_path"],
                    args.evidence_notes,
                    args.reviewed_by,
                ),
            )
            connection.execute(
                """
                INSERT INTO import_batches
                  (migration_id, source_name, source_path, source_sha256, imported_at)
                VALUES (?, 'pdf_page_visual_evidence', ?, ?, CURRENT_TIMESTAMP)
                """,
                (args.batch_id, source_path, sha256(source_pdf)),
            )
            violations = connection.execute("PRAGMA foreign_key_check").fetchall()
            if violations:
                raise RuntimeError(f"foreign key violations: {violations}")
        print(json.dumps({"status": "applied", **payload}, ensure_ascii=True, indent=2))
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"record_pdf_page_evidence: {error}", file=sys.stderr)
        raise SystemExit(2)
