#!/usr/bin/env python3
"""Compare the live OMHAS schema with its generated manifest."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from inspect_schema import inspect_schema


def table_contract(manifest: dict, names: list[str]) -> dict:
    missing = [name for name in names if name not in manifest["tables"]]
    if missing:
        raise ValueError(f"Unknown relevant tables: {', '.join(missing)}")
    return {name: manifest["tables"][name] for name in names}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--manifest", type=Path, default=Path("scripts/db/schema-manifest.json"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--tables", nargs="*", default=[], help="Emit only these relevant live table contracts")
    args = parser.parse_args()

    expected = json.loads(args.manifest.read_text(encoding="utf-8"))
    live = inspect_schema(args.db, args.project_root.resolve())
    unchanged = live["schema_fingerprint"] == expected["schema_fingerprint"]
    result = {
        "status": "schema unchanged" if unchanged else "schema changed",
        "expected": expected["schema_fingerprint"],
        "live": live["schema_fingerprint"],
        "object_counts": live["object_counts"],
        "migration_metadata_changed": live["migration_state"] != expected["migration_state"],
    }
    if args.tables:
        result["relevant_tables"] = table_contract(live, args.tables)
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 0 if unchanged else 2


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "schema check failed", "error": str(error)}, indent=2))
        raise SystemExit(2)
