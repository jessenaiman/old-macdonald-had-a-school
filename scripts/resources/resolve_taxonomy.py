#!/usr/bin/env python3
"""Resolve a tag or alias to its full inherited taxonomy path."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('term')
    parser.add_argument('--db', type=Path, default=Path('data/omhas.db'))
    args = parser.parse_args()
    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    row = connection.execute('''SELECT t.id,t.name,t.parent_tag_id FROM tags t
      LEFT JOIN tag_aliases a ON a.tag_id=t.id
      WHERE t.name=? COLLATE NOCASE OR a.alias=? COLLATE NOCASE
      ORDER BY CASE WHEN t.name=? COLLATE NOCASE THEN 0 ELSE 1 END LIMIT 1''',
      (args.term, args.term, args.term)).fetchone()
    if not row:
        print(json.dumps({'term': args.term, 'matched': False, 'new_tag_candidate': True}))
        return 1
    path = []
    seen = set()
    while row:
        if row['id'] in seen:
            raise RuntimeError('Taxonomy cycle detected')
        seen.add(row['id'])
        path.append({'id': row['id'], 'name': row['name']})
        row = connection.execute('SELECT id,name,parent_tag_id FROM tags WHERE id=?', (row['parent_tag_id'],)).fetchone() if row['parent_tag_id'] else None
    print(json.dumps({'term': args.term, 'matched': True, 'path': list(reversed(path))}, ensure_ascii=False))
    connection.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
