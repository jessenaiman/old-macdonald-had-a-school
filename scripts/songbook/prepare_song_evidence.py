#!/usr/bin/env python3
"""Create local-only, auditable song-evidence manifests.

The script never writes SQLite. Python handles deterministic parsing and exact
matching; Qwen is optional and may only add an explicitly unverified extraction
proposal to each manifest record. Use the companion apply script for controlled
exact-source links after reviewing this output.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

# Make direct root invocation use the same package imports as module invocation.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.songbook.plan_song_import import (
    collect_source_paths,
    load_songs,
    parse_frontmatter,
    plan_candidate,
    project_relative,
    read_text,
    sha256,
)
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument


OLLAMA_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "lyrics": {"type": "array", "items": {"type": "string"}},
        "explicit_actions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "cue": {"type": ["string", "null"]},
                    "wording": {"type": "string"},
                    "scope": {"type": "string", "enum": ["line", "section", "song"]},
                },
                "required": ["cue", "wording", "scope"],
            },
        },
        "arrangement_notes": {"type": "array", "items": {"type": "string"}},
        "continuation_prompts": {"type": "array", "items": {"type": "string"}},
        "keywords": {"type": "array", "items": {"type": "string"}},
        "needs_review": {"type": "boolean"},
    },
    "required": ["lyrics", "explicit_actions", "arrangement_notes", "continuation_prompts", "keywords", "needs_review"],
}


def source_state(connection: sqlite3.Connection, source_path: str) -> str | None:
    row = connection.execute(
        "SELECT review_state FROM source_documents WHERE source_path = ?", (source_path,)
    ).fetchone()
    return str(row[0]) if row else None


def qwen_extract(text: str, endpoint: str, model: str) -> dict[str, Any]:
    prompt = """Extract only visible structure from this unverified song transcription.
Return JSON matching the supplied schema. The input contains only Markdown song
body, never YAML metadata. Preserve lyric-line order and empty stanza breaks.
Treat a visible `*Action*` at the end of a lyric line as an explicit line
action with that line as its cue. Treat printed suggestions to continue or
substitute verses as continuation_prompts, not lyrics. Extract actions only
when visibly printed. Do not infer educational value, lyrics, sources, chords,
or missing actions.
Set needs_review true whenever boundaries or meaning are uncertain.

TRANSCRIPTION:\n""" + text
    body = json.dumps({
        "model": model,
        "prompt": prompt,
        "format": OLLAMA_SCHEMA,
        "stream": False,
        "think": False,
        "options": {"temperature": 0},
    }).encode("utf-8")
    request = urllib.request.Request(endpoint, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return {"model": model, "proposal": json.loads(payload["response"])}
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as error:
        return {"model": model, "error": str(error)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", nargs="*", type=Path)
    parser.add_argument("--source-directory", action="append", type=Path, default=[])
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--format", choices=("jsonl", "summary"), default="jsonl")
    parser.add_argument("--limit", type=int)
    maybe_add_runtime_argument(parser, default_seconds=180)
    parser.add_argument("--ollama", action="store_true", help="Add a local Qwen extraction proposal; never writes SQLite")
    parser.add_argument("--ollama-endpoint", default="http://127.0.0.1:11434/api/generate")
    parser.add_argument("--ollama-model", default="qwen3:4b")
    args = parser.parse_args()

    root = args.project_root.resolve()
    guard = install_runtime_guard("prepare_song_evidence", args.max_runtime_seconds)
    paths = collect_source_paths(args.sources, args.source_directory)
    if args.limit is not None:
        paths = paths[:args.limit]
    connection = sqlite3.connect(f"file:{args.db.resolve().as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    try:
        songs = load_songs(connection)
        records: list[dict[str, Any]] = []
        for path in paths:
            if check_runtime(guard):
                print(json.dumps({"status": "stopped", "count": len(records), "limit_hit": "runtime"}, indent=2))
                break
            candidate = plan_candidate(path, root, songs)
            relative_path = project_relative(path, root)
            record: dict[str, Any] = {
                "schema_version": 1,
                "source_path": relative_path,
                "source_checksum": sha256(path),
                "source_review_state": source_state(connection, relative_path),
                "title": candidate.title,
                "classification": candidate.classification,
                "canonical_song_id": candidate.canonical_song_id,
                "canonical_title": candidate.canonical_title,
                "source_file": candidate.source_file,
                "page_section": candidate.page_section,
                "lyric_line_count": candidate.lyric_line_count,
                "notes": candidate.notes,
                "exact_unreviewed_attachment": candidate.classification == "exact-duplicate" and candidate.canonical_song_id is not None,
            }
            if args.ollama:
                _, markdown_body = parse_frontmatter(read_text(path))
                record["ollama_unverified"] = qwen_extract(markdown_body, args.ollama_endpoint, args.ollama_model)
            records.append(record)
        if args.format == "summary":
            counts: dict[str, int] = {}
            for record in records:
                counts[record["classification"]] = counts.get(record["classification"], 0) + 1
            print(json.dumps({"prepared": len(records), "classification": counts, "ollama": args.ollama}, indent=2))
        else:
            for record in records:
                print(json.dumps(record, ensure_ascii=False, sort_keys=True))
    finally:
        connection.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (KeyboardInterrupt, TimeoutError, OSError, sqlite3.Error) as error:
        print(f"prepare_song_evidence stopped: {error}", file=sys.stderr)
        raise SystemExit(130)
