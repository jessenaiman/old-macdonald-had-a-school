#!/usr/bin/env python3
"""Plan and, when explicitly allowed, attach reviewed duplicate song sources.

This is deliberately database-first. It emits a report to stdout and never
creates a corpus, queue, spreadsheet, or sidecar ledger. It will only write to
``data/omhas.db`` with ``--apply-exact-sources`` and only when a reviewed local
transcription exactly matches one existing canonical song after mechanical
normalization.

It does not insert new songs, edit lyrics, merge title-only matches, or decide
whether a near match is a meaningful variation. Those decisions require the
original-source review described by the early-years music skill.
"""

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import re
import sqlite3
import sys
import unicodedata
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


UNKNOWN_LOCATORS = {"", "unknown", "n/a", "none", "not stated"}


@dataclass(frozen=True)
class ExistingSong:
    id: int
    title: str
    lyrics: str | None
    source_title: str | None
    markdown_path: str | None
    verified: bool


@dataclass
class Candidate:
    source_path: str
    title: str
    review_status: str
    source_file: str
    page_section: str
    lyric_line_count: int
    classification: str
    canonical_song_id: int | None
    canonical_title: str | None
    notes: list[str]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    closing = re.search(r"\n---\s*\n", text[4:])
    if not closing:
        return {}, text
    end = closing.end() + 4
    values: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if not line or line.startswith((" ", "\t")) or ":" not in line:
            continue
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values, text[end:]


def lyric_body(markdown_body: str) -> tuple[str, str]:
    heading = re.search(r"(?m)^#\s+(.+?)\s*$", markdown_body)
    if not heading:
        raise ValueError("No level-one song title found")
    lines: list[str] = []
    leading_arrangement_note = re.compile(
        r"^\s*\*?\s*(?:tune|key|capo|tuning|meter|starting pitch|chords?)\s*:", re.IGNORECASE
    )
    for line in markdown_body[heading.end():].lstrip("\n").splitlines():
        # Review annotations and printed teaching prompts belong in song actions,
        # not the lyric fingerprint.
        if re.match(r"^\s*(?:#{2,}\s+|\*\*[^*]+\*\*\s*$)", line):
            break
        # A leading italicized tune/key line is useful teaching information but
        # is not part of the lyric fingerprint.
        if not lines and leading_arrangement_note.match(line):
            continue
        if not lines and not line.strip():
            continue
        lines.append(line.rstrip())
    while lines and not lines[-1]:
        lines.pop()
    return heading.group(1).strip(), "\n".join(lines)


def mechanical_fingerprint(value: str | None) -> str:
    """Compare text without deciding whether a lyrical variation is meaningful."""
    if not value:
        return ""
    normalized = unicodedata.normalize("NFKD", value).casefold()
    normalized = "".join(character for character in normalized if not unicodedata.combining(character))
    return re.sub(r"\s+", " ", re.sub(r"[^\w]+", " ", normalized)).strip()


def project_relative(path: Path, project_root: Path) -> str:
    try:
        return path.resolve().relative_to(project_root.resolve()).as_posix()
    except ValueError as error:
        raise ValueError(f"{path} must be inside {project_root}") from error


def source_pdf_candidates(source_file: str, project_root: Path) -> list[Path]:
    if not source_file:
        return []
    return [path for path in project_root.glob(f"docs/**/{source_file}") if path.is_file()]


def load_songs(connection: sqlite3.Connection) -> list[ExistingSong]:
    rows = connection.execute(
        "SELECT id, title, lyrics, source_title, markdown_path, verified FROM songs"
    ).fetchall()
    return [ExistingSong(
        id=int(row["id"]),
        title=str(row["title"]),
        lyrics=row["lyrics"],
        source_title=row["source_title"],
        markdown_path=row["markdown_path"],
        verified=bool(row["verified"]),
    ) for row in rows]


def plan_candidate(path: Path, project_root: Path, songs: list[ExistingSong]) -> Candidate:
    text = read_text(path)
    frontmatter, body = parse_frontmatter(text)
    title, lyrics = lyric_body(body)
    source_path = project_relative(path, project_root)
    review_status = frontmatter.get("review_status", "").casefold()
    source_file = frontmatter.get("source_file", "")
    page_section = frontmatter.get("page_section", "")

    same_path = [song for song in songs if song.markdown_path == source_path]
    if same_path:
        song = same_path[0]
        return Candidate(source_path, title, review_status, source_file, page_section,
                         len(lyrics.splitlines()), "already-imported", song.id, song.title,
                         ["This transcription path is already attached to a song record."])

    title_key = mechanical_fingerprint(title)
    lyric_key = mechanical_fingerprint(lyrics)
    exact = [song for song in songs if mechanical_fingerprint(song.title) == title_key
             and mechanical_fingerprint(song.lyrics) == lyric_key and lyric_key]
    if len(exact) == 1:
        song = exact[0]
        notes = ["Exact title-and-lyrics match after mechanical normalization."]
        if review_status != "reviewed":
            notes.append("Do not attach automatically: the transcription is not source-reviewed.")
        if page_section.casefold() in UNKNOWN_LOCATORS:
            notes.append("Do not attach automatically: the source page locator is missing.")
        pdfs = source_pdf_candidates(source_file, project_root)
        if len(pdfs) != 1:
            notes.append(f"Do not attach automatically: expected one local source PDF, found {len(pdfs)}.")
        return Candidate(source_path, title, review_status, source_file, page_section,
                         len(lyrics.splitlines()), "exact-duplicate", song.id, song.title, notes)
    if len(exact) > 1:
        return Candidate(source_path, title, review_status, source_file, page_section,
                         len(lyrics.splitlines()), "ambiguous-exact-match", None, None,
                         [f"{len(exact)} canonical records have the same normalized title and lyrics; do not auto-attach."])

    same_title = [song for song in songs if mechanical_fingerprint(song.title) == title_key]
    if same_title:
        return Candidate(source_path, title, review_status, source_file, page_section,
                         len(lyrics.splitlines()), "material-variation-review", None, None,
                         ["A title match has different normalized lyrics. Review the original pages before choosing a separate version or a source reference."])

    same_lyrics = [song for song in songs if mechanical_fingerprint(song.lyrics) == lyric_key and lyric_key]
    if same_lyrics:
        return Candidate(source_path, title, review_status, source_file, page_section,
                         len(lyrics.splitlines()), "title-variation-review", None, None,
                         ["Lyrics match a different title. Preserve both source identities until an archivist verifies the relationship."])

    return Candidate(source_path, title, review_status, source_file, page_section,
                     len(lyrics.splitlines()), "unique-song-review", None, None,
                     ["No automatic merge candidate. Review the original source and import only after lyrics, actions, and provenance are verified."])


def safe_to_attach(candidate: Candidate, project_root: Path) -> bool:
    return (
        candidate.classification == "exact-duplicate"
        and candidate.canonical_song_id is not None
        and candidate.review_status == "reviewed"
        and candidate.page_section.casefold() not in UNKNOWN_LOCATORS
        and len(source_pdf_candidates(candidate.source_file, project_root)) == 1
    )


def attach_exact_sources(connection: sqlite3.Connection, candidate: Candidate, project_root: Path) -> dict[str, Any]:
    if not safe_to_attach(candidate, project_root):
        raise ValueError(f"{candidate.source_path} is not a safe exact-source attachment")
    source_markdown = project_root / candidate.source_path
    source_pdf = source_pdf_candidates(candidate.source_file, project_root)[0]
    pdf_path = project_relative(source_pdf, project_root)
    now = "CURRENT_TIMESTAMP"

    connection.execute(
        f"""
        INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
        VALUES (?, 'markdown', 'reviewed', ?, {now})
        ON CONFLICT(source_path) DO UPDATE SET
          source_kind = excluded.source_kind, review_state = excluded.review_state,
          checksum = excluded.checksum, imported_at = excluded.imported_at
        """,
        (candidate.source_path, sha256(source_markdown)),
    )
    connection.execute(
        f"""
        INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
        VALUES (?, 'pdf', 'reviewed', ?, {now})
        ON CONFLICT(source_path) DO UPDATE SET
          source_kind = excluded.source_kind, review_state = excluded.review_state,
          checksum = excluded.checksum, imported_at = excluded.imported_at
        """,
        (pdf_path, sha256(source_pdf)),
    )
    markdown_id = connection.execute(
        "SELECT id FROM source_documents WHERE source_path = ?", (candidate.source_path,)
    ).fetchone()[0]
    pdf_id = connection.execute(
        "SELECT id FROM source_documents WHERE source_path = ?", (pdf_path,)
    ).fetchone()[0]
    connection.execute(
        """
        INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
        VALUES (?, ?, 'transcription', 'Reviewed local transcription', ?)
        ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
          locator = excluded.locator, evidence_note = excluded.evidence_note
        """,
        (candidate.canonical_song_id, markdown_id,
         "Exact normalized title-and-lyrics match; attached by the reviewed-source importer."),
    )
    connection.execute(
        """
        INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
        VALUES (?, ?, 'primary', ?, ?)
        ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
          locator = excluded.locator, evidence_note = excluded.evidence_note
        """,
        (candidate.canonical_song_id, pdf_id, candidate.page_section,
         "Exact normalized title-and-lyrics match; original PDF reference attached by the reviewed-source importer."),
    )
    return {"song_id": candidate.canonical_song_id, "markdown": candidate.source_path, "pdf": pdf_path}


def render_text(candidates: list[Candidate], attachments: list[dict[str, Any]]) -> str:
    lines = []
    for candidate in candidates:
        target = f" -> {candidate.canonical_song_id} ({candidate.canonical_title})" if candidate.canonical_song_id else ""
        lines.append(f"{candidate.classification}: {candidate.title}{target}")
        lines.append(f"  {candidate.source_path}")
        for note in candidate.notes:
            lines.append(f"  - {note}")
    if attachments:
        lines.append("Attached exact reviewed source references:")
        lines.extend(f"  - song {item['song_id']}: {item['pdf']}" for item in attachments)
    return "\n".join(lines)


def render_summary(
    candidates: list[Candidate], attachments: list[dict[str, Any]], project_root: Path
) -> str:
    """Report batch triage without emitting one token-heavy record per source."""
    classifications = collections.Counter(candidate.classification for candidate in candidates)
    sources: dict[str, list[Candidate]] = collections.defaultdict(list)
    for candidate in candidates:
        sources[candidate.source_file or "(missing source file)"].append(candidate)

    lines = [f"planned={len(candidates)}", "classification="]
    lines.extend(
        f"  {classification}={count}"
        for classification, count in sorted(classifications.items())
    )
    lines.append(
        "reviewed_exact_attachable=" + str(sum(
            1 for candidate in candidates if safe_to_attach(candidate, project_root)
        ))
    )
    lines.append("highest-priority-source-files=")
    for source_file, grouped in sorted(
        sources.items(),
        key=lambda item: sum(candidate.classification != "already-imported" for candidate in item[1]),
        reverse=True,
    )[:20]:
        not_imported = sum(candidate.classification != "already-imported" for candidate in grouped)
        if not_imported:
            grouped_classes = collections.Counter(candidate.classification for candidate in grouped)
            breakdown = ", ".join(
                f"{classification}={count}"
                for classification, count in sorted(grouped_classes.items())
                if classification != "already-imported"
            )
            lines.append(
                f"  {source_file}: total={len(grouped)}, decision={not_imported}; {breakdown}"
            )
    if attachments:
        lines.append(f"attached_exact_reviewed_sources={len(attachments)}")
    return "\n".join(lines)


def collect_source_paths(explicit_paths: list[Path], source_directories: list[Path]) -> list[Path]:
    """Expand local directory input without an OS command-line-length limit."""
    source_paths = list(explicit_paths)
    for directory in source_directories:
        if not directory.is_dir():
            raise ValueError(f"Source directory does not exist: {directory}")
        source_paths.extend(directory.rglob("*.md"))
    unique_paths = {path.resolve() for path in source_paths}
    if not unique_paths:
        raise ValueError("Provide at least one Markdown source or --source-directory")
    return sorted(unique_paths)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", nargs="*", type=Path, help="Reviewed song-transcription Markdown file(s) inside this project")
    parser.add_argument(
        "--source-directory", action="append", type=Path, default=[],
        help="Directory of local transcription Markdown files to classify without shell argument-length limits",
    )
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"), help="Managed SQLite database")
    parser.add_argument("--project-root", type=Path, default=Path.cwd(), help="Repository root used for relative source paths")
    parser.add_argument("--apply-exact-sources", action="store_true", help="Attach only safe, reviewed exact duplicates as source references; never creates or edits songs")
    parser.add_argument("--format", choices=("text", "json", "summary"), default="text")
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    database_path = args.db.resolve()
    source_paths = collect_source_paths(args.sources, args.source_directory)
    for path in source_paths:
        if not path.is_file():
            parser.error(f"Source file does not exist: {path}")
        if path.suffix.casefold() != ".md":
            parser.error(f"Source must be Markdown: {path}")

    mode = "rw" if args.apply_exact_sources else "ro"
    connection = sqlite3.connect(f"file:{database_path.as_posix()}?mode={mode}", uri=True)
    connection.row_factory = sqlite3.Row
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        songs = load_songs(connection)
        candidates = [plan_candidate(path, project_root, songs) for path in source_paths]
        attachments: list[dict[str, Any]] = []
        if args.apply_exact_sources:
            with connection:
                for candidate in candidates:
                    if safe_to_attach(candidate, project_root):
                        attachments.append(attach_exact_sources(connection, candidate, project_root))
                violations = connection.execute("PRAGMA foreign_key_check").fetchall()
                if violations:
                    raise RuntimeError(f"Foreign-key check failed: {violations}")
        if args.format == "json":
            print(json.dumps({"candidates": [asdict(item) for item in candidates], "attachments": attachments}, indent=2))
        elif args.format == "summary":
            print(render_summary(candidates, attachments, project_root))
        else:
            print(render_text(candidates, attachments))
    finally:
        connection.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, sqlite3.Error, ValueError) as error:
        print(f"song import planner: {error}", file=sys.stderr)
        raise SystemExit(2)
