#!/usr/bin/env python3
"""Report authoritative progress for the complete teacher-resource workflow."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=Path('data/omhas.db'))
    args = parser.parse_args()
    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    latest = '''SELECT d.* FROM resource_file_dispositions d JOIN
      (SELECT inventory_id,max(id) id FROM resource_file_dispositions GROUP BY inventory_id) x ON x.id=d.id'''
    counts = {row['disposition']: row['count'] for row in connection.execute(
        f'SELECT disposition,count(*) count FROM ({latest}) GROUP BY disposition')}
    total = connection.execute('SELECT count(*) FROM resource_file_inventory').fetchone()[0]
    pending = counts.get('pending', 0)
    report = {
        'files_discovered': total,
        'files_with_disposition': sum(counts.values()),
        'dispositions': counts,
        'completion_percent': round(100 * (total - pending) / total, 2) if total else 100,
        'open_quarantine': connection.execute(
            "SELECT count(*) FROM resource_quarantine WHERE retry_status NOT IN ('resolved','closed')").fetchone()[0],
        'materials': {table: connection.execute(f'SELECT count(*) FROM {table}').fetchone()[0]
                      for table in ('songs', 'activities', 'book_suggestions', 'resources', 'lesson_assets')},
        'search_chunks': connection.execute('SELECT count(*) FROM search_chunks').fetchone()[0],
    }
    print(json.dumps(report, indent=2))
    connection.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
