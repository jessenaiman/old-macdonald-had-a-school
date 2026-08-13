#!/usr/bin/env python3
"""Dispatch pending resource files without allowing one failure to stop the run."""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument


def latest_pending(connection: sqlite3.Connection, limit: int) -> list[sqlite3.Row]:
    return connection.execute('''
        SELECT i.* FROM resource_file_inventory i
        JOIN resource_file_dispositions d ON d.id = (
          SELECT max(d2.id) FROM resource_file_dispositions d2 WHERE d2.inventory_id=i.id
        )
        WHERE d.disposition='pending'
        ORDER BY i.id LIMIT ?
    ''', (limit,)).fetchall()


def classify(path: Path) -> tuple[str, str]:
    if not path.exists():
        return 'quarantined', 'missing_file'
    if path.stat().st_size == 0:
        return 'quarantined', 'empty_file'
    return 'pending', 'worker_required'


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=Path('data/omhas.db'))
    parser.add_argument('--limit', type=int, default=10)
    parser.add_argument('--packet', type=Path)
    parser.add_argument('--apply', action='store_true')
    maybe_add_runtime_argument(parser, default_seconds=None)
    args = parser.parse_args()
    guard = install_runtime_guard("run_resource_pipeline", args.max_runtime_seconds)
    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA foreign_keys = ON')
    selected = latest_pending(connection, args.limit)
    packet: list[dict[str, object]] = []
    for row in selected:
        if check_runtime(guard):
            print(json.dumps({'status': 'stopped', 'count': len(packet), 'limit_hit': 'runtime'}), end='\n')
            break
        path = Path(str(row['source_path']))
        disposition, reason = classify(path)
        packet.append({
            'inventory_id': row['id'], 'source_path': row['source_path'],
            'source_kind': row['source_kind'], 'checksum': row['checksum'],
            'byte_size': row['byte_size'], 'routing': reason,
            'rules': ['Return structured JSON only', 'Never write SQLite',
                      'Preserve source wording', 'Flag uncertainty instead of guessing'],
        })
        if args.apply and disposition == 'quarantined':
            with connection:
                connection.execute('''INSERT INTO resource_file_dispositions
                    (inventory_id, disposition, evidence_note, decided_by)
                    VALUES (?, 'quarantined', ?, 'python-dispatcher')''', (row['id'], reason))
                connection.execute('''INSERT INTO resource_quarantine
                    (inventory_id, reason_code, evidence)
                    VALUES (?, ?, ?)''', (row['id'], reason, f"File check failed: {row['source_path']}"))
    output = json.dumps({'schema_version': 1, 'count': len(packet), 'records': packet}, ensure_ascii=False, indent=2) + '\n'
    if args.packet:
        args.packet.parent.mkdir(parents=True, exist_ok=True)
        args.packet.write_text(output, encoding='utf-8', newline='\n')
    else:
        print(output, end='')
    connection.close()
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (KeyboardInterrupt, TimeoutError, OSError) as error:
        print(f"run_resource_pipeline stopped: {error}", file=sys.stderr)
        raise SystemExit(130)
