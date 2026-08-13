#!/usr/bin/env python3
"""Inventory collected teaching-resource files and assign explicit dispositions."""

from __future__ import annotations

import argparse
import hashlib
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

SUPPORTED = {'.pdf', '.md', '.markdown', '.docx', '.xlsx', '.csv', '.txt', '.html', '.htm', '.mp3', '.wav', '.mp4'}
SKIP_PARTS = {'.git', 'node_modules', '.next', 'qa', '.codex-tmp', '__pycache__'}
RESOURCE_HINTS = ('curriculum', 'early-years', 'song', 'music', 'lesson', 'story', 'stories', 'activity', 'activities', 'craft', 'book', 'video')
PROJECT_DOC_NAMES = {'asset-inventory.md', 'asset_library_governance.md', 'brand_kit_asset_map.md'}


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest().upper()


def kind(path: Path) -> str:
    return path.suffix.lower().lstrip('.') or 'unknown'


def initial_disposition(path: Path) -> tuple[str, str]:
    if path.suffix.lower() not in SUPPORTED:
        return 'unsupported', 'Unsupported file extension'
    relative = path.as_posix().casefold()
    if path.name.casefold() in PROJECT_DOC_NAMES:
        return 'intentionally_excluded', 'Project operations document, not a teaching resource'
    if path.parts and path.parts[0].casefold() == 'data':
        return 'pending', 'Awaiting extraction'
    if any(hint in relative for hint in RESOURCE_HINTS):
        return 'pending', 'Awaiting extraction'
    return 'intentionally_excluded', 'No teaching-resource path or filename signal'


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=Path('data/omhas.db'))
    parser.add_argument('--root', type=Path, action='append', default=[])
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    roots = args.root or [Path('docs'), Path('data')]
    project = Path.cwd().resolve()
    found: list[Path] = []
    for root in roots:
        if not root.exists():
            continue
        found.extend(path for path in root.rglob('*') if path.is_file()
                     and not any(part in SKIP_PARTS for part in path.parts)
                     and path.resolve() != args.db.resolve())

    records = []
    for path in sorted(set(found)):
        stat = path.stat()
        disposition, note = initial_disposition(path)
        records.append((path.resolve().relative_to(project).as_posix(), kind(path), digest(path), stat.st_size,
                        datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(), disposition, note))

    if not args.apply:
        counts: dict[str, int] = {}
        for *_, disposition, _note in records:
            counts[disposition] = counts.get(disposition, 0) + 1
        print({'dry_run': True, 'files': len(records), 'dispositions': counts})
        return 0

    connection = sqlite3.connect(args.db)
    connection.execute('PRAGMA foreign_keys = ON')
    with connection:
        for source_path, source_kind, checksum, size, modified, disposition, note in records:
            connection.execute('''INSERT INTO resource_file_inventory
                (source_path, source_kind, checksum, byte_size, modified_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(source_path) DO UPDATE SET source_kind=excluded.source_kind,
                  checksum=excluded.checksum, byte_size=excluded.byte_size,
                  modified_at=excluded.modified_at, last_scanned_at=CURRENT_TIMESTAMP''',
                (source_path, source_kind, checksum, size, modified))
            inventory_id = connection.execute('SELECT id FROM resource_file_inventory WHERE source_path=?', (source_path,)).fetchone()[0]
            latest = connection.execute('''SELECT disposition FROM resource_file_dispositions
                WHERE inventory_id=? ORDER BY id DESC LIMIT 1''', (inventory_id,)).fetchone()
            if not latest or (latest[0] == 'pending' and disposition == 'intentionally_excluded'):
                connection.execute('''INSERT INTO resource_file_dispositions
                    (inventory_id, disposition, evidence_note, decided_by)
                    VALUES (?, ?, ?, 'python-inventory')''',
                    (inventory_id, disposition, note))
    print({'dry_run': False, 'files': len(records)})
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
