#!/usr/bin/env python3
"""Phase 1: Link unlinked songs to curriculum by analyzing lyrics.
Uses thematic + keyword analysis tuned to the specific curriculum topics.
Process songs in batches of 25 and records each batch in import_batches."""

import hashlib
import json
import re
import sqlite3
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Set
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument

DB = Path("data/omhas.db")

# Thematic classifiers - maps subject keys to detection patterns in lyrics
# Each entry: (subject_key, weight, [patterns])
# Patterns are regex patterns searched in lowercased lyrics
THEMATIC_CLASSIFIERS: List[Tuple[str, int, List[str], str]] = [
    # Music & Arts - singing, musical instruments, dance
    ("music-and-arts", 3, [
        r'\bsing\b', r'\bsong\b', r'\bdance\b', r'\bmelody\b', r'\btune\b',
        r'\bclap\b', r'\btap\b', r'\brhythm\b', r'\binstrument\b',
        r'\bshake\b.*\bbell', r'\bplay\b.*\bmusic', r'\blalala\b',
        r'\btra\s*la\s*la\b', r'\bfiddle\b',
    ], "Music & Arts"),
    
    # Gross Motor & Movement - physical actions, movement
    ("gross-motor-and-movement", 3, [
        r'\bjump\b', r'\bhop\b', r'\bskip\b', r'\brun\b', r'\bmarch\b',
        r'\bspin\b', r'\btwirl\b', r'\bstomp\b', r'\bwiggle\b', r'\bbounce\b',
        r'\bswing\b', r'\bstretch\b', r'\broll\b', r'\bcrawl\b',
        r'\bclimb\b', r'\bflap\b', r'\bstamp\b', r'\bslide\b',
        r'\bwave\b.*\barms', r'\bleap\b', r'\bprance\b',
        r'\bhands up\b', r'\bturn around\b', r'\bstand up\b',
        r'\bsit down\b', r'\bwalk\b', r'\bshuffle\b',
    ], "Gross Motor & Movement"),
    
    # Fine Motor Skills - hands, fingers, body parts
    ("fine-motor-skills", 3, [
        r'\bfinger\b', r'\bfingers\b', r'\bthumb\b', r'\bpalm\b',
        r'\bwrist\b', r'\bwiggle\b.*\bfinger', r'\bpoint\b',
        r'\bwave\b', r'\bclench\b', r'\bgrip\b', r'\bpinch\b',
        r'\broll\b.*\bhand', r'\bhand\b.*\broll',
        r'\bopen\b.*\bhand\b', r'\bclose\b.*\bhand\b',
        r'\bpat\b.*\bcake\b', r'\bthis little piggy\b',
        r'\bhere is the church\b', r'\bwhere is thumbkin\b',
    ], "Fine Motor Skills"),
    
    # Science & Nature - animals, weather, seasons, nature
    ("science-and-nature", 3, [
        r'\banimal\b', r'\bfarm\b', r'\bduck\b', r'\bcow\b', r'\bpig\b',
        r'\bhorse\b', r'\bsheep\b', r'\bchicken\b', r'\bhen\b',
        r'\bcat\b', r'\bdog\b', r'\bbunny\b', r'\brabbit\b',
        r'\bfrog\b', r'\bbird\b', r'\bbutterfly\b', r'\bbee\b',
        r'\bspider\b', r'\bfish\b', r'\bwhale\b', r'\bshark\b',
        r'\bsun\b', r'\bmoon\b', r'\bstar\b', r'\brain\b', r'\bsnow\b',
        r'\bwind\b', r'\bcloud\b', r'\bweather\b', r'\bseason\b',
        r'\bspring\b', r'\bsummer\b', r'\bwinter\b', r'\bfall\b',
        r'\bleaf\b', r'\btree\b', r'\bflower\b', r'\bgarden\b',
        r'\bnest\b', r'\begg\b', r'\bcaterpillar\b', r'\bseed\b',
        r'\bbug\b', r'\binsect\b', r'\bpond\b', r'\bocean\b',
        r'\bnature\b', r'\bgrow\b', r'\blife cycle\b',
        r'\bfive little ducks\b', r'\bwater cycle\b',
        r'\broar\b', r'\bmonkey\b', r'\belephant\b', r'\blion\b',
        r'\bgiraffe\b', r'\bzoo\b', r'\bsnake\b', r'\bturtle\b',
        r'\bpenguin\b', r'\bpolar bear\b', r'\bgroundhog\b',
    ], "Science & Nature"),
    
    # Math & Numeracy - counting, numbers, shapes, patterns
    ("math-and-numeracy", 3, [
        r'\bcount\b', r'\bcounting\b', r'\bnumber\b', r'\bnumer\b',
        r'\bone\b', r'\btwo\b', r'\bthree\b', r'\bfour\b', r'\bfive\b',
        r'\bsix\b', r'\bseven\b', r'\beight\b', r'\bnine\b', r'\bten\b',
        r'\btwenty\b', r'\bthirty\b', r'\bhundred\b',
        r'\bfirst\b', r'\bsecond\b', r'\bthird\b',
        r'\bshape\b', r'\bcircle\b', r'\bsquare\b', r'\btriangle\b',
        r'\brectangle\b', r'\bdiamond\b', r'\boval\b', r'\bstar\b.*\bshape',
        r'\bpattern\b', r'\bbig\b', r'\bsmall\b', r'\blarge\b',
        r'\bmore\b', r'\bless\b', r'\blower\b', r'\btall\b', r'\bshort\b',
        r'\blong\b', r'\baround\b.*\bclock\b', r'\btime\b',
        r'\bpair\b', r'\bdouble\b', r'\bhalf\b', r'\bwhole\b',
        r'\bhow many\b', r'\badd\b', r'\btake away\b',
        r'\blittle monkeys\b', r'\bgreen bottles\b', r'\bcurrant buns\b',
        r'\bfive little\b', r'\bten in the bed\b',
    ], "Math & Numeracy"),
    
    # Social-Emotional Learning (SEL) - feelings, friendship, kindness
    ("social-emotional-learning-sel", 3, [
        r'\bfeeling\b', r'\bfeel\b', r'\bhappy\b', r'\bsad\b',
        r'\bangry\b', r'\bscared\b', r'\bsilly\b', r'\bproud\b',
        r'\bfriend\b', r'\bfriendly\b', r'\bshare\b', r'\bkind\b',
        r'\bhelp\b', r'\bhelping\b', r'\bcare\b', r'\bcaring\b',
        r'\blove\b', r'\bloving\b', r'\bsorry\b', r'\bthank\b',
        r'\bplease\b', r'\bgentle\b', r'\bnice\b', r'\bsmile\b',
        r'\bfamily\b', r'\bbelong\b', r'\bincluded\b', r'\bwelcome\b',
        r'\bteam\b', r'\btogether\b', r'\bfair\b', r'\brespect\b',
        r'\bcooperate\b', r'\bpatience\b', r'\bwait\b', r'\bturn\b',
        r'\bmanners\b', r'\bhello friend\b',
    ], "Social-Emotional Learning (SEL)"),
    
    # Classroom Routine
    ("classroom-routine-and-approaches-to-learning", 3, [
        r'\bhello\b', r'\bgood\s*morning\b', r'\bgoodbye\b',
        r'\bcircle time\b', r'\bclean\s*up\b', r'\bcleanup\b',
        r'\bline up\b', r'\broutine\b', r'\btransition\b',
        r'\bgathering\b', r'\bwelcome\b', r'\bready\b',
        r'\blisten\b', r'\bpay attention\b', r'\bfollow\b.*\bdirection\b',
        r'\bput away\b', r'\btidy\b', r'\bwash\b.*\bhand\b',
        r'\bsnack time\b', r'\blunch time\b',
    ], "Classroom Routine & Approaches to Learning"),
    
    # Language & Vocabulary - word play, sounds, letters
    ("language-and-vocabulary", 3, [
        r'\bword\b', r'\bletter\b', r'\babc\b', r'\balphabet\b',
        r'\bsound\b', r'\bnoise\b', r'\becho\b', r'\bwhisper\b',
        r'\bshh\b', r'\bquiet\b', r'\bloud\b', r'\bspeak\b',
        r'\bsay\b', r'\btalk\b', r'\bcall out\b',
        r'\bname\b', r'\bopposite\b', r'\brhyme\b',
        r'\bonomatopoeia\b', r'\boink\b', r'\bquack\b', r'\bmooch\b',
        r'\bbaa\b', r'\bmeow\b', r'\bwoof\b', r'\bmoo\b',
        r'\bpeep\b', r'\bcock-a-doodle\b',
    ], "Language & Vocabulary"),
    
    # Physical Health & Development
    ("physical-health-and-development", 3, [
        r'\bbrush\b.*\bteeth\b', r'\bwash\b', r'\bbath\b',
        r'\bcomb\b.*\bhair\b', r'\bsleep\b', r'\brest\b',
        r'\beat\b', r'\bdrink\b', r'\bfood\b', r'\bfruit\b',
        r'\bvegetable\b', r'\bhealthy\b', r'\bexercise\b',
        r'\bclean\b', r'\bhygiene\b', r'\bdoctor\b', r'\bbandaid\b',
        r'\bbody\b', r'\bnose\b', r'\beyes\b', r'\bear\b', r'\bmouth\b',
        r'\btoes\b', r'\bknees\b', r'\bshoulders\b', r'\bhead\b',
        r'\btummy\b', r'\bbelly\b', r'\bhands\b', r'\b feet\b',
        r'\bteeth\b', r'\btongue\b',
    ], "Physical Health & Development"),
    
    # Self-Regulation / Calm Down
    ("self-regulation", 3, [
        r'\bcalm\b', r'\bquiet\b', r'\bbreathe\b', r'\bbreathing\b',
        r'\brelax\b', r'\bpeace\b', r'\bpeaceful\b', r'\bstill\b',
        r'\bsoftly\b', r'\bgentle\b', r'\blullaby\b', r'\bhush\b',
        r'\brock\b', r'\bnap\b', r'\btwinkle\b',
    ], "Self-Regulation"),
    
    # Literacy & Phonics - stories, reading, books
    ("literacy-and-phonics", 2, [
        r'\bstory\b', r'\bbook\b', r'\bread\b', r'\bauthor\b',
        r'\bnursery rhyme\b', r'\bfairy tale\b', r'\bcharacter\b',
        r'\bplot\b', r'\bending\b', r'\bbeginning\b',
        r'\bonce upon a time\b', r'\bhappily ever after\b',
    ], "Literacy & Phonics"),
    
    # Language & Literacy (subject 13 - composite)
    ("language-and-literacy", 2, [
        r'\bletter\b', r'\bword\b', r'\bwrite\b', r'\bspell\b',
        r'\bname\b.*\bletter\b', r'\bvowel\b', r'\bconsonant\b',
        r'\bsyllable\b', r'\bsentence\b',
    ], "Language & Literacy"),
    
    # Calm Down, Rest & Mindfulness
    ("calm-down-rest-and-mindfulness", 3, [
        r'\bcalm down\b', r'\bpeaceful\b', r'\bmeditat\b',
        r'\byoga\b', r'\bmindful\b', r'\brest\b', r'\blullaby\b',
        r'\bgoodnight\b', r'\bbedtime\b', r'\bdream\b',
        r'\bsoft\b.*\bmusic\b', r'\byawn\b', r'\bsleep\b',
    ], "Calm Down, Rest & Mindfulness"),
]

# Subject ID mapping
SUBJECT_MAP = {
    "math-and-numeracy": 1,
    "literacy-and-phonics": 2,
    "classroom-routine-and-approaches-to-learning": 3,
    "fine-motor-skills": 4,
    "gross-motor-and-movement": 5,
    "language-and-vocabulary": 6,
    "science-and-nature": 7,
    "social-emotional-learning-sel": 8,
    "calm-down-rest-and-mindfulness": 9,
    "music-and-arts": 10,
    "physical-health-and-development": 11,
    "self-regulation": 12,
    "language-and-literacy": 13,
}

SUBJECT_LABEL = {
    "math-and-numeracy": "Math & Numeracy",
    "literacy-and-phonics": "Literacy & Phonics",
    "classroom-routine-and-approaches-to-learning": "Classroom Routine & Approaches to Learning",
    "fine-motor-skills": "Fine Motor Skills",
    "gross-motor-and-movement": "Gross Motor & Movement",
    "language-and-vocabulary": "Language & Vocabulary",
    "science-and-nature": "Science & Nature",
    "social-emotional-learning-sel": "Social-Emotional Learning (SEL)",
    "calm-down-rest-and-mindfulness": "Calm Down, Rest & Mindfulness",
    "music-and-arts": "Music & Arts",
    "physical-health-and-development": "Physical Health & Development",
    "self-regulation": "Self-Regulation",
    "language-and-literacy": "Language & Literacy",
}

DOMAIN_MAP = {
    "math-and-numeracy": "Math/Counting",
    "literacy-and-phonics": "Literacy & Language",
    "classroom-routine-and-approaches-to-learning": "Classroom Routine",
    "fine-motor-skills": "Fine Motor",
    "gross-motor-and-movement": "Gross Motor",
    "language-and-vocabulary": "Language & Literacy",
    "science-and-nature": "Science & Nature",
    "social-emotional-learning-sel": "Social-Emotional",
    "calm-down-rest-and-mindfulness": "Self-Regulation/Calm",
    "music-and-arts": "Music & Rhythm",
    "physical-health-and-development": "Physical Development",
    "self-regulation": "Self-Regulation/Calm",
    "language-and-literacy": "Language & Literacy",
}


def classify_song(title: str, lyrics: str, actions: str, existing_domain: str, existing_type: str) -> Dict[str, Any]:
    """Analyze song text and return subject scores."""
    text = f"{title} {lyrics} {actions}".lower()
    
    scores: Dict[str, int] = {}
    subject_evidence: Dict[str, List[str]] = {}
    
    for subject_key, weight, patterns, label in THEMATIC_CLASSIFIERS:
        score = 0
        evidence = []
        for p in patterns:
            matches = re.findall(p, text)
            if matches:
                score += len(matches)
                evidence.append(p)
        if score > 0:
            weighted = score * weight
            scores[subject_key] = weighted
            subject_evidence[subject_key] = evidence
    
    # Sort by score descending
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    result = {
        "ranked_subjects": [
            {"key": k, "score": s, "label": SUBJECT_LABEL[k]} for k, s in ranked
        ],
        "evidence": subject_evidence,
    }
    return result


def build_relevance_reason(lyrics: str, subject_key: str, evidence: List[str]) -> str:
    """Create a brief rationale referencing lyrics."""
    # Find a representative lyric snippet
    lines = [l.strip() for l in lyrics.split('\n') if l.strip()]
    snippet = ""
    for line in lines[:6]:
        for pat in evidence[:3]:
            if re.search(pat, line.lower()):
                snippet = line[:80]
                break
        if snippet:
            break
    if not snippet and lines:
        snippet = lines[0][:80]
    
    label = SUBJECT_LABEL.get(subject_key, subject_key)
    if snippet:
        return f"Lyrics '{snippet}' support {label.lower()} learning"
    return f"Song content supports {label.lower()} learning"


def determine_educational_domain(title: str, lyrics: str, actions: str, 
                                  existing_domain: str, ranked_subjects: List[Dict]) -> Optional[str]:
    """Determine the best educational domain based on top subject."""
    if existing_domain:
        return None  # Don't overwrite
    
    if not ranked_subjects:
        return None
    
    best_key = ranked_subjects[0]["key"]
    return DOMAIN_MAP.get(best_key, "Cross-Curricular")


def determine_age_range(lyrics: str, actions: str, existing_age: str) -> Optional[str]:
    """Infer age range from content complexity."""
    if existing_age:
        return None
    
    text = f"{lyrics} {actions}".lower()
    
    # Infant indicators
    infant = ['bounce', 'rock', 'cuddle', 'lullaby', 'peek-a-boo', 'patty-cake', 'tickle', 'baby']
    # Toddler indicators
    toddler = ['hop', 'jump', 'clap', 'stomp', 'wiggle', 'march', 'spin', 'wiggly']
    # Preschool indicators
    preschool = ['count', 'letter', 'abc', 'rhyme', 'story', 'friend', 'share', 'feeling']
    
    has_infant = sum(1 for w in infant if w in text)
    has_toddler = sum(1 for w in toddler if w in text)
    has_preschool = sum(1 for w in preschool if w in text)
    
    ranges = []
    if has_infant >= 2:
        ranges.append("Infant")
    if has_toddler >= 2:
        ranges.append("Toddler")
    if has_preschool >= 2:
        ranges.append("Preschool")
    
    if len(ranges) >= 2:
        return ", ".join(ranges)
    elif len(ranges) == 1:
        return ranges[0]
    elif len(lyrics) < 100:
        return "Infant, Toddler"
    return "Preschool"


def determine_song_type(lyrics: str, actions: str, title: str, existing_type: str) -> Optional[str]:
    """Determine song type: Song, Fingerplay, Movement, Story, Bounce."""
    if existing_type:
        return None
    
    text = f"{title} {lyrics} {actions}".lower()
    
    if re.search(r'\bfinger\b|\bfingers\b', text):
        return "Fingerplay"
    if re.search(r'\bbounce\b', text):
        return "Bounce"
    if re.search(r'\baction\b|\bmove\b|\bdance\b|\bjump\b|\bhop\b', text):
        return "Movement"
    if re.search(r'\bstory\b|\bold macdonald\b|\bthree little\b|\bonce upon\b', text):
        return "Story"
    
    return "Song"


def process_batch(
    c: sqlite3.Cursor,
    conn: sqlite3.Connection,
    batch_id: str,
    guard: Any | None,
    limit: int = 25,
    offset: int = 0,
    dry_run: bool = False,
) -> Dict[str, Any]:
    """Process one batch of unlinked songs."""
    
    # Load topic data for all subjects
    topics = {}
    for subj_id in range(1, 14):
        rows = c.execute(
            "SELECT id, topic, skill FROM topics WHERE subject_id=? AND merged_into IS NULL ORDER BY id",
            (subj_id,)
        ).fetchall()
        topics[subj_id] = [{"id": r[0], "topic": r[1], "skill": r[2]} for r in rows]
    
    # Get existing song_curriculum_links to avoid duplicates
    existing_song_links = set(
        r[0] for r in c.execute("SELECT DISTINCT song_id FROM song_curriculum_links").fetchall()
    )
    
    # Also get existing topic_materials for songs
    existing_topic_materials = set(
        (r[0], r[1]) for r in c.execute(
            "SELECT topic_id, material_id FROM topic_materials WHERE material_kind='song'"
        ).fetchall()
    )
    
    # Get unlinked songs with most complete data first
    songs = c.execute("""
        SELECT id, title, lyrics, actions, educational_domain, age_range, type,
               materials_needed, tags, source_title
        FROM songs 
        WHERE id NOT IN (SELECT song_id FROM song_curriculum_links)
          AND lyrics IS NOT NULL AND lyrics != ''
        ORDER BY 
            CASE WHEN actions IS NOT NULL AND actions != '' THEN 0 ELSE 1 END,
            id
        LIMIT ? OFFSET ?
    """, (limit, offset)).fetchall()
    
    if not songs:
        return {"status": "no-more", "songs_seen": 0}
    
    # Results accumulators
    curriculum_links: List[Tuple[int, str, str, str, str]] = []  # song_id, subject, description, relevance, link_type
    topic_material_links: List[Tuple[int, int, str, str, str]] = []  # topic_id, song_id, role, use_in_phase, rationale
    song_updates: Dict[int, Dict[str, str]] = {}  # song_id -> {field: value}
    
    stats = {
        "songs_with_classifications": 0,
        "total_potential_links": 0,
    }
    
    for song in songs:
        if guard is not None and check_runtime(guard):
            break
        song_id = int(song[0])
        title = song[1] or ""
        lyrics = song[2] or ""
        actions = song[3] or ""
        existing_domain = song[4] or ""
        existing_age = song[5] or ""
        existing_type = song[6] or ""
        
        # Classify the song
        classification = classify_song(title, lyrics, actions, existing_domain, existing_type)
        ranked = classification["ranked_subjects"]
        evidence = classification["evidence"]
        
        if not ranked:
            continue
        
        stats["songs_with_classifications"] += 1
        
        # Determine primary (top 1-2) and secondary (next 2-3) subjects
        primary = ranked[:2]  # top 2
        secondary = ranked[2:5]  # next 3
        
        # Build song_curriculum_links
        for rank_entry in primary:
            subject_key = rank_entry["key"]
            subject_label = rank_entry["label"]
            subject_id = SUBJECT_MAP[subject_key]
            subj_evidence = evidence.get(subject_key, [])
            relevance = build_relevance_reason(lyrics, subject_key, subj_evidence)
            
            curriculum_links.append((
                song_id, subject_label, relevance, relevance, "primary"
            ))
            stats["total_potential_links"] += 1
        
        for rank_entry in secondary:
            subject_key = rank_entry["key"]
            subject_label = rank_entry["label"]
            subj_evidence = evidence.get(subject_key, [])
            relevance = build_relevance_reason(lyrics, subject_key, subj_evidence)
            
            curriculum_links.append((
                song_id, subject_label, relevance, relevance, "secondary"
            ))
            stats["total_potential_links"] += 1
        
        # Build topic_materials links (map to specific topics)
        # For each subject the song relates to, find the best matching topic
        for rank_entry in ranked[:4]:
            subject_key = rank_entry["key"]
            subject_id = SUBJECT_MAP[subject_key]
            subject_topics = topics.get(subject_id, [])
            
            if not subject_topics:
                continue
            
            text_lower = f"{title} {lyrics} {actions}".lower()
            
            # Score each topic against the lyrics
            best_topic = None
            best_score = -1
            
            for t in subject_topics:
                topic_text = f"{t['topic']} {t['skill'] or ''}".lower()
                # Count overlapping significant words
                topic_words = set(re.findall(r'\b[a-z]+\b', topic_text))
                text_words = set(re.findall(r'\b[a-z]+\b', text_lower))
                overlap = len(topic_words & text_words)
                
                # Give bonus for exact title mentions
                title_lower = title.lower()
                if title_lower and t['topic'].lower()[:3] in title_lower:
                    overlap += 3
                
                if overlap > best_score:
                    best_score = overlap
                    best_topic = t
            
            if best_topic and best_score > 1:
                role = "focus" if primary and rank_entry == primary[0] else "supporting"
                
                if (best_topic["id"], song_id) not in existing_topic_materials:
                    rationale = build_relevance_reason(lyrics, subject_key, evidence.get(subject_key, []))
                    topic_material_links.append((
                        best_topic["id"], song_id, role, "circle-time-core", rationale
                    ))
                    existing_topic_materials.add((best_topic["id"], song_id))
        
        # Determine fields to fill
        updates = {}
        domain = determine_educational_domain(title, lyrics, actions, existing_domain, ranked)
        if domain:
            updates["educational_domain"] = domain
        
        age = determine_age_range(lyrics, actions, existing_age)
        if age:
            updates["age_range"] = age
        
        stype = determine_song_type(lyrics, actions, title, existing_type)
        if stype:
            updates["type"] = stype
        
        if updates:
            song_updates[song_id] = updates
    
    if dry_run:
        return {
            "status": "dry-run",
            "batch_id": batch_id,
            "offset": offset,
            "limit": limit,
            "songs_seen": len(songs),
            "songs_classified": stats["songs_with_classifications"],
            "curriculum_links": len(curriculum_links),
            "topic_material_links": len(topic_material_links),
            "song_updates": len(song_updates),
        }
    
    # Apply batch
    with conn:
        # Register migration
        existing = c.execute("SELECT 1 FROM schema_migrations WHERE migration_id = ?", (batch_id,)).fetchone()
        if not existing:
            c.execute(
                "INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?)",
                (batch_id, 'LLM-CLASSIFY', 'N/A', 'N/A')
            )
        
        # Check for duplicate batch
        existing_batch = c.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (batch_id,)).fetchone()
        if existing_batch:
            raise ValueError(f"Batch '{batch_id}' already recorded")
        
        # Insert curriculum links
        links_inserted = 0
        for sl in curriculum_links:
            song_id, subject, description, relevance, link_type = sl
            inserted = c.execute(
                "INSERT OR IGNORE INTO song_curriculum_links (song_id, subject, description, relevance, link_type) VALUES (?, ?, ?, ?, ?)",
                (song_id, subject, description, relevance, link_type)
            )
            links_inserted += inserted.rowcount
        
        # Insert topic_materials links
        topic_links_inserted = 0
        for tml in topic_material_links:
            topic_id, song_id, role, phase, rationale = tml
            c.execute(
                "INSERT OR IGNORE INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, teacher_rationale) VALUES (?, 'song', ?, ?, ?, ?)",
                (topic_id, song_id, role, phase, rationale)
            )
            topic_links_inserted += 1
        
        # Update songs
        songs_updated = 0
        for song_id, updates in song_updates.items():
            set_parts = []
            params = []
            for field, value in updates.items():
                set_parts.append(f"{field} = ?")
                params.append(value)
            if set_parts:
                set_clause = ", ".join(set_parts)
                params.append(song_id)
                c.execute(f"UPDATE songs SET {set_clause} WHERE id = ?", params)
                songs_updated += 1
        
        # Record import batch
        file_hash = hashlib.sha256(Path("scripts/songbook/link_songs_to_curriculum.py").read_bytes()).hexdigest().upper()
        c.execute(
            "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
            (batch_id, "song-curriculum-llm-link", "scripts/songbook/link_songs_to_curriculum.py", file_hash),
        )
        
        # Foreign key check
        fk_violations = c.execute("PRAGMA foreign_key_check").fetchall()
        if fk_violations:
            raise RuntimeError(f"Foreign-key violations: {fk_violations}")
    
    return {
        "status": "applied",
        "batch_id": batch_id,
        "offset": offset,
        "limit": limit,
        "songs_seen": len(songs),
        "songs_classified": stats["songs_with_classifications"],
        "curriculum_links_inserted": links_inserted,
        "topic_materials_inserted": topic_links_inserted,
        "songs_updated": songs_updated,
    }


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Link songs to curriculum via LLM lyrics analysis")
    parser.add_argument("--db", type=str, default="data/omhas.db")
    parser.add_argument("--limit", type=int, default=25, help="Batch size")
    parser.add_argument("--offset", type=int, default=0, help="Starting offset")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    parser.add_argument("--batch-id", default=None, help="Custom batch ID")
    maybe_add_runtime_argument(parser, default_seconds=300)
    args = parser.parse_args()
    
    batch_id = args.batch_id or f"llm-song-curric-link-{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    guard = install_runtime_guard("link_songs_to_curriculum", args.max_runtime_seconds)
    
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    try:
        c.execute("PRAGMA foreign_keys = ON")
        if check_runtime(guard):
            print(json.dumps({"status": "stopped", "batch_id": batch_id, "reason": "runtime"}, indent=2))
            return 0
        result = process_batch(c, conn, batch_id, guard=guard, limit=args.limit, offset=args.offset, dry_run=args.dry_run)
        print(json.dumps(result, indent=2, default=str))
        return 0
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
