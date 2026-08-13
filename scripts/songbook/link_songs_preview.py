#!/usr/bin/env python3
"""Preview first batch with details to validate classifications."""
import json
import re
import sqlite3
from pathlib import Path

DB = Path("data/omhas.db")
conn = sqlite3.connect(str(DB))
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Load subjects
subjects = {r[0]: r[2] for r in c.execute("SELECT id, key, label FROM subjects").fetchall()}

# Load topics
topics_by_subject = {}
for sid in range(1, 14):
    topics_by_subject[sid] = list(c.execute(
        "SELECT id, topic, skill FROM topics WHERE subject_id=? AND merged_into IS NULL ORDER BY id",
        (sid,)
    ).fetchall())

# Get first 5 unlinked songs with full data
songs = c.execute("""
    SELECT id, title, lyrics, actions, educational_domain, age_range, type
    FROM songs 
    WHERE id NOT IN (SELECT song_id FROM song_curriculum_links)
      AND lyrics IS NOT NULL AND lyrics != ''
    ORDER BY 
        CASE WHEN actions IS NOT NULL AND actions != '' THEN 0 ELSE 1 END,
        id
    LIMIT 5
""").fetchall()

for s in songs:
    print(f"\n{'='*60}")
    print(f"SONG #{s['id']}: {s['title']}")
    print(f"  domain={s['educational_domain']}, age={s['age_range']}, type={s['type']}")
    lyrics = s['lyrics'] or ''
    actions = s['actions'] or ''
    text = f"{s['title']} {lyrics} {actions}".lower()
    
    # Detect keywords per subject
    print(f"  Lyrics preview: {lyrics[:120].strip()}")
    print(f"  Actions: {actions[:120].strip()}")
    
    # Score each subject
    classifiers = [
        ("math-and-numeracy", [r'\bcount\b', r'\bnumber\b', r'\bten\b', r'\bfive\b', r'\bone\b', r'\btwo\b', r'\bthree\b', r'\bfour\b', r'\bfive\b']),
        ("literacy-and-phonics", [r'\bstory\b', r'\bbook\b', r'\bnursery rhyme\b']),
        ("classroom-routine", [r'\bhello\b', r'\bgood morning\b', r'\bgoodbye\b', r'\bclean up\b']),
        ("fine-motor-skills", [r'\bfinger\b', r'\bfingers\b', r'\bthumb\b', r'\bwiggle\b.*\bfinger\b']),
        ("gross-motor-and-movement", [r'\bjump\b', r'\bhop\b', r'\bmarch\b', r'\bdance\b', r'\bstomp\b']),
        ("language-and-vocabulary", [r'\bword\b', r'\bsound\b', r'\brhyme\b']),
        ("science-and-nature", [r'\banimal\b', r'\bduck\b', r'\bcow\b', r'\bbutterfly\b', r'\bsnow\b', r'\brain\b']),
        ("social-emotional-learning-sel", [r'\bfeeling\b', r'\bhappy\b', r'\bfriend\b', r'\bshare\b']),
        ("calm-down-rest-and-mindfulness", [r'\bcalm\b', r'\blullaby\b', r'\bgoodnight\b', r'\bdream\b']),
        ("music-and-arts", [r'\bsing\b', r'\bsong\b', r'\bdance\b', r'\bclap\b']),
        ("physical-health-and-development", [r'\bhead\b', r'\bshoulders\b', r'\bknees\b', r'\btoes\b', r'\bteeth\b']),
        ("self-regulation", [r'\bcalm\b', r'\bbreathe\b', r'\bstill\b', r'\bhush\b', r'\btwinkle\b']),
    ]
    
    for label, patterns in classifiers:
        score = 0
        matches = []
        for p in patterns:
            m = re.findall(p, text)
            if m:
                score += len(m)
                matches.append(p)
        if score > 0:
            print(f"  [{label}] score={score} matches={matches}")

conn.close()