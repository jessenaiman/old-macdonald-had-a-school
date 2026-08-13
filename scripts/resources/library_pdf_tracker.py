#!/usr/bin/env python3
"""Shared helpers for marking high-value library PDFs as scanned."""

from __future__ import annotations

from pathlib import Path

PROCESSED_SOURCE_SUFFIX = "-processed"
LIBRARIES_AGENCIES_PDF_ROOT = Path("docs/early-years-music-resources/01-libraries-agencies/pdf")


def _candidate_library_roots(project_root: Path) -> list[Path]:
    """Return likely repo roots for the library-PDF watch directory."""
    roots = []
    for candidate in (
        project_root,
        Path.cwd(),
        Path(__file__).resolve().parents[2],
    ):
        candidate_root = (candidate / LIBRARIES_AGENCIES_PDF_ROOT).resolve()
        if candidate_root.exists():
            roots.append(candidate_root)
    # Keep order stable but deduplicate. Duplicate entries are harmless for runtime,
    # but dedup keeps `any(relative_to(...))` readable when debugging.
    deduped: list[Path] = []
    seen: set[Path] = set()
    for root in roots:
        if root not in seen:
            seen.add(root)
            deduped.append(root)
    return deduped


def _library_root(project_root: Path) -> Path:
    candidates = _candidate_library_roots(project_root)
    if candidates:
        return candidates[0]
    # Fallback preserves legacy behavior for callers that expect the direct
    # path even when the directory has not yet materialized.
    return (project_root / LIBRARIES_AGENCIES_PDF_ROOT).resolve()


def _is_library_pdf_path(project_root: Path, source_pdf: Path) -> bool:
    if source_pdf.suffix.lower() != ".pdf":
        return False
    if source_pdf.stem.lower().endswith(PROCESSED_SOURCE_SUFFIX):
        return False
    try:
        resolved = source_pdf.resolve()
    except (OSError, RuntimeError):
        return False

    for root in _candidate_library_roots(project_root):
        try:
            resolved.relative_to(root)
            return True
        except (ValueError, OSError):
            pass
    return False


def mark_library_pdf_processed(source_pdf: Path, project_root: Path) -> tuple[Path, bool]:
    """Rename library-agent PDFs to add ``-processed`` once they have been handled."""
    if not _is_library_pdf_path(project_root, source_pdf):
        return source_pdf, False

    processed_pdf = source_pdf.with_name(f"{source_pdf.stem}{PROCESSED_SOURCE_SUFFIX}{source_pdf.suffix}")
    if processed_pdf.exists():
        return processed_pdf, True

    try:
        source_pdf.rename(processed_pdf)
        return processed_pdf, True
    except OSError:
        return source_pdf, False
