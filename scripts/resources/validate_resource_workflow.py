#!/usr/bin/env python3
"""Validate completion accounting, quarantine, taxonomy, provenance, and FTS."""

from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path


def scalar(connection: sqlite3.Connection, sql: str) -> int:
    return int(connection.execute(sql).fetchone()[0])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=Path('data/omhas.db'))
    args = parser.parse_args()
    connection = sqlite3.connect(args.db)
    checks = {
        'integrity_ok': connection.execute('PRAGMA integrity_check').fetchone()[0] == 'ok',
        'foreign_key_violations': len(connection.execute('PRAGMA foreign_key_check').fetchall()),
        'inventory_rows': scalar(connection, 'SELECT count(*) FROM resource_file_inventory'),
        'undisposed_files': scalar(connection, '''SELECT count(*) FROM resource_file_inventory i
            WHERE NOT EXISTS (SELECT 1 FROM resource_file_dispositions d WHERE d.inventory_id=i.id)'''),
        'orphan_quarantine': scalar(connection, '''SELECT count(*) FROM resource_quarantine q
            LEFT JOIN resource_file_inventory i ON i.id=q.inventory_id WHERE i.id IS NULL'''),
        'tag_cycles': scalar(connection, '''WITH RECURSIVE ancestry(origin,id,parent) AS (
            SELECT id,id,parent_tag_id FROM tags UNION ALL
            SELECT ancestry.origin,t.id,t.parent_tag_id FROM ancestry JOIN tags t ON t.id=ancestry.parent
            WHERE ancestry.parent IS NOT NULL) SELECT count(*) FROM ancestry WHERE origin=parent'''),
        'search_chunks': scalar(connection, 'SELECT count(*) FROM search_chunks'),
        'fts_rows': scalar(connection, 'SELECT count(*) FROM search_chunks_fts'),
        'internal_public_leaks': scalar(connection, '''SELECT count(*) FROM search_chunks
            WHERE json_extract(meta,'$.visibility')='internal' AND json_extract(meta,'$.reviewState')='reviewed' '''),
    }
    connection.close()
    checks['fts_parity'] = checks['search_chunks'] == checks['fts_rows']
    passed = checks['integrity_ok'] and checks['foreign_key_violations'] == 0 and checks['undisposed_files'] == 0 \
        and checks['orphan_quarantine'] == 0 and checks['tag_cycles'] == 0 and checks['fts_parity'] \
        and checks['internal_public_leaks'] == 0
    print({'passed': passed, **checks})
    return 0 if passed else 1


if __name__ == '__main__':
    raise SystemExit(main())
