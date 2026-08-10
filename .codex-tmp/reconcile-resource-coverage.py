import csv
import json
import re
import sqlite3
from pathlib import Path

resource_root = Path(r"C:\Users\jesse\OneDrive\Documents\New project\resources")
db = sqlite3.connect("data/omhas.db")
db.row_factory = sqlite3.Row

def normalize(value):
    return re.sub(r"[^a-z0-9]+", " ", (value or "").casefold()).strip()

songs = db.execute("SELECT id, song_name, markdown_path FROM SONGS").fetchall()
song_by_id = {row["id"]: row for row in songs}
song_by_title = {}
for row in songs:
    song_by_title.setdefault(normalize(row["song_name"]), []).append(row)

manifest_text = (resource_root / "songs" / "MANIFEST.yaml").read_text(encoding="utf-8-sig")
manifest_rows = []
current = None
for line in manifest_text.splitlines():
    if line.startswith("- song_name:"):
        if current:
            manifest_rows.append(current)
        current = {"song_name": line.split(":", 1)[1].strip()}
    elif current and re.match(r"^  [a-z_]+:", line):
        key, value = line.strip().split(":", 1)
        current[key] = value.strip()
if current:
    manifest_rows.append(current)

manifest_ids = []
missing_ids = []
title_matches = 0
title_mismatches = []
for row in manifest_rows:
    try:
        db_id = int(row.get("db_id", ""))
    except ValueError:
        continue
    manifest_ids.append(db_id)
    song = song_by_id.get(db_id)
    if not song:
        missing_ids.append(db_id)
    elif normalize(song["song_name"]) == normalize(row.get("song_name")):
        title_matches += 1
    else:
        title_mismatches.append({"db_id": db_id, "manifest": row.get("song_name"), "database": song["song_name"]})

catalog_path = resource_root / "songs" / "song_catalog_canonical.csv"
with catalog_path.open(encoding="utf-8-sig", newline="") as handle:
    catalog_rows = list(csv.DictReader(handle))

catalog_exact_title = 0
catalog_ambiguous_title = 0
catalog_unmatched = []
for row in catalog_rows:
    matches = song_by_title.get(normalize(row.get("title")), [])
    if len(matches) == 1:
        catalog_exact_title += 1
    elif len(matches) > 1:
        catalog_ambiguous_title += 1
    else:
        catalog_unmatched.append({"filename": row.get("filename"), "title": row.get("title")})

search_paths = {Path(row[0].replace("/", "\\")).name.casefold() for row in db.execute("SELECT source_path FROM search_chunks") if row[0]}
catalog_filename_in_search = sum(1 for row in catalog_rows if (row.get("filename") or "").casefold() in search_paths)

captured = list((resource_root / "songs" / "captured").glob("*.md"))
captured_db_ids = 0
captured_titles = 0
for path in captured:
    text = path.read_text(encoding="utf-8-sig", errors="replace")[:5000]
    db_id_match = re.search(r"(?m)^db_id:\s*[\"']?(\d+)", text)
    title_match = re.search(r"(?m)^title:\s*[\"']?(.+?)[\"']?\s*$", text)
    if db_id_match and int(db_id_match.group(1)) in song_by_id:
        captured_db_ids += 1
    if title_match and normalize(title_match.group(1)) in song_by_title:
        captured_titles += 1

print(json.dumps({
    "database_songs": len(songs),
    "manifest": {
        "rows": len(manifest_rows),
        "rows_with_db_id": len(manifest_ids),
        "unique_db_ids": len(set(manifest_ids)),
        "missing_db_ids": len(set(missing_ids)),
        "exact_title_matches": title_matches,
        "title_mismatches": len(title_mismatches),
        "title_mismatch_samples": title_mismatches[:12],
    },
    "canonical_catalog": {
        "rows": len(catalog_rows),
        "exact_unique_title_match": catalog_exact_title,
        "ambiguous_title_match": catalog_ambiguous_title,
        "unmatched_title": len(catalog_unmatched),
        "filename_already_in_search_chunks": catalog_filename_in_search,
        "unmatched_samples": catalog_unmatched[:20],
    },
    "captured_markdown": {
        "files": len(captured),
        "valid_existing_db_id": captured_db_ids,
        "title_found_in_songs": captured_titles,
    },
}, indent=2, ensure_ascii=False))
db.close()
