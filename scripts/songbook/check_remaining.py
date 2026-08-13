#!/usr/bin/env python3
"""Check remaining unlinked songs to understand why they weren't classified."""
import re
import sqlite3
from pathlib import Path

DB = Path("data/omhas.db")
conn = sqlite3.connect(str(DB))
c = conn.cursor()

# Get remaining unlinked songs with lyrics
remaining = c.execute("""
    SELECT id, title, lyrics, actions, educational_domain, age_range, type
    FROM songs 
    WHERE id NOT IN (SELECT song_id FROM song_curriculum_links)
      AND lyrics IS NOT NULL AND lyrics != ''
    ORDER BY id
""").fetchall()

print(f"Remaining unlinked with lyrics: {len(remaining)}")

# Classifiers for diagnosis
classifiers = {
    "music-and-arts": [r'\bsing\b', r'\bsong\b', r'\bdance\b', r'\bclap\b', r'\btune\b', r'\bchorus\b', r'\bverse\b'],
    "gross-motor": [r'\bjump\b', r'\bhop\b', r'\bmarch\b', r'\bstomp\b', r'\bspin\b', r'\bwiggle\b', r'\bbounce\b'],
    "fine-motor": [r'\bfinger\b', r'\bfingers\b', r'\bthumb\b', r'\bhand\b', r'\bwave\b'],
    "science-nature": [r'\banimal\b', r'\bbird\b', r'\bfish\b', r'\bduck\b', r'\bcow\b', r'\brain\b', r'\bsnow\b', r'\bsun\b'],
    "math": [r'\bone\b', r'\btwo\b', r'\bthree\b', r'\bfour\b', r'\bfive\b', r'\bcount\b', r'\bnumber\b'],
    "sel": [r'\bfeeling\b', r'\bhappy\b', r'\bsad\b', r'\bfriend\b', r'\bshare\b', r'\blove\b', r'\bhelp\b'],
    "routine": [r'\bhello\b', r'\bgood morning\b', r'\bgoodbye\b', r'\bclean\b', r'\bwelcome\b'],
    "physical": [r'\bhead\b', r'\bshoulders\b', r'\bknees\b', r'\btoes\b', r'\beyes\b', r'\bear\b'],
}

unclassified = 0
classified_low = 0

for s in remaining:
    text = f"{s[1]} {s[2]} {s[3]}".lower()
    max_score = 0
    best_cat = None
    for cat, patterns in classifiers.items():
        score = sum(len(re.findall(p, text)) for p in patterns)
        if score > max_score:
            max_score = score
            best_cat = cat
    
    if max_score == 0:
        unclassified += 1
        if unclassified <= 5:
            print(f"\n--- UNCLASSIFIED: id={s[0]} '{s[1]}' ---")
            print(f"  lyrics: {s[2][:150]}")
    elif max_score <= 2:
        classified_low += 1
        if classified_low <= 5:
            print(f"\n--- LOW SCORE ({max_score}, {best_cat}): id={s[0]} '{s[1]}' ---")
            print(f"  lyrics: {s[2][:150]}")

print(f"\nSummary:")
print(f"  Unclassified (score=0): {unclassified}")
print(f"  Low score (1-2): {classified_low}")
print(f"  Good score (3+): {len(remaining) - unclassified - classified_low}")

conn.close()