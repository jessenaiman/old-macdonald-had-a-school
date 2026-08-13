#!/usr/bin/env python3
"""Repair teacher-facing September K–2 lesson relationships from reviewed evidence.

This is deliberately a bounded, idempotent data batch. It does not import a
corpus, change legacy pacing, or treat the teacher-provided map as policy.
"""
from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path

LESSONS = {
 "Welcome to Our Classroom Community": ("Our First Circle: Joining the Classroom Community", "Children practise entering a shared circle, hearing names, and choosing a welcoming response by voice, gesture, sign, or watching. Notice which entry supports each child so the next circle can be more accessible.", ["classroom community", "circle time", "welcoming routine"]),
 "Our Classroom Rules and Routines": ("Practise Our Shared Routines", "Children rehearse beginning together, stopping, listening, and waiting for the next cue. Listen for whether the group can use the cue without repeated reminders.", ["classroom routines", "self-regulation", "music and movement"]),
 "Getting to Know Our Neighbourhood": ("Walk, Notice, and Talk About Our Neighbourhood", "Children recall a nearby place, helper, or route and represent it with words or movement. Listen for growing vocabulary about the people and places around them.", ["community", "movement", "oral language"]),
 "All About Me and My Family": ("People Who Care for Me", "Children describe themselves and the people in their family or caring network, with sharing always optional. Notice how children use words, gesture, or images to represent their experiences.", ["identity", "family", "oral language"]),
 "Add drawings or other visual displays to descriptions": ("Show What You Mean: Words and Pictures", "Students add a drawing, labelled sketch, or other visual that makes an oral description clearer. Listen for whether the visual adds a relevant detail rather than decorating the page.", ["oral communication", "visual representation"]),
 "Ask and answer questions about key details in a text read aloud": ("Read-Aloud Detectives: Find the Key Details", "Students listen to a short read-aloud, identify the people, actions, or facts that matter most, and support an answer by pointing back to what they heard. Use responses to decide whether the next lesson should revisit listening for detail or move toward retelling.", ["read aloud", "listening comprehension", "questioning"]),
 "Ask and answer questions about key details in a text/media read aloud": ("Listen, Notice, and Ask About the Text", "Students pause during a read-aloud or short media text to ask and answer a question about an important detail. Notice whether they can return to what was heard or seen when explaining an answer.", ["read aloud", "listening comprehension", "questioning"]),
 "Ask and answer questions about what a speaker says": ("Listen to a Speaker, Then Ask a Helpful Question", "Students listen to a classmate or adult speaker, restate one idea, and ask a question that clarifies or extends it. Listen for relevant questions and respectful turn-taking.", ["listening", "discussion", "questioning"]),
 "Communication Device Design using light or sound": ("Design a Message Device", "Students test a simple device that uses a light or sound signal to communicate across a distance. Treat this as an enrichment design challenge, not Grade 1 Ontario science coverage.", ["engineering design", "enrichment", "collaboration"]),
 "Consonant blends (bl, cr, st, nd, nk)": ("Hear and Read Consonant Blends", "Students say, build, and read words with the featured consonant blends. Listen for accurate blending without inserting an extra vowel sound.", ["phonics", "word reading"]),
 "Consonant digraph spelling-sound correspondences": ("Match Digraphs to Their Sounds", "Students connect common consonant digraph spellings with the sounds they represent in words. Notice whether they can apply the correspondence when reading a new word.", ["phonics", "word reading"]),
 "Decode regularly spelled one-syllable words": ("Blend Through One-Syllable Words", "Students use known spelling-sound patterns to blend and read one-syllable words. Record which patterns need another brief practice cycle.", ["phonics", "word reading"]),
 "Decode two-syllable words by breaking them into syllables": ("Break Longer Words into Syllables", "Students mark or clap the syllable parts of a longer word, then blend the parts to read it. Notice whether they keep the word meaningful after blending.", ["phonics", "syllables", "word reading"]),
 "Demonstrate an understanding of variables and equalities": ("Make Both Sides Equal", "Students use objects, drawings, or equations to show when two quantities are equal and to find a missing value. Listen for explanations of why both sides stay balanced.", ["mathematics", "equality", "math talk"]),
 "Describe people, places, things, and events with relevant details": ("Say More: Add Relevant Details", "Students describe a person, place, object, or event with details that help a listener picture it. Notice whether the details match the topic and the audience.", ["oral language", "descriptive language"]),
 "Determine or clarify the meaning of unknown words using context and word parts": ("Work Out a New Word", "Students use nearby words, illustrations, and familiar word parts to propose and check a meaning. Listen for the strategy they used, not only the final definition.", ["vocabulary", "word meaning", "reading strategies"]),
 "Distinguish long from short vowel sounds in spoken single-syllable words (oral)": ("Hear the Vowel Sound", "Students say, sort, and compare one-syllable words by their vowel sounds before connecting sound to print. Notice which contrasts students can hear reliably.", ["phonological awareness", "vowel sounds"]),
 "Environmental Plant Needs": ("What Helps a Plant Live?", "Students observe what a plant needs to stay healthy and explain their thinking from evidence. Treat explicit light-as-a-plant-need work as a developmental bridge rather than Grade 1 standards coverage.", ["living things", "science inquiry", "developmental bridge"]),
 "Estimate the number of objects in collections up to 50; verify by counting": ("Estimate, Then Count to Check", "Students make a reasonable estimate for a collection and count to test it. Listen for the benchmark or grouping strategy that supported the estimate.", ["mathematics", "counting", "estimation"]),
 "Explore word relationships and nuances (categories, real-life connections, shades of meaning)": ("Sort and Compare Word Meanings", "Students group related words, connect words to real experiences, and discuss small differences in meaning. Notice whether they can explain why two words belong together or differ.", ["vocabulary", "word relationships"]),
 "Additional common vowel team spelling-sound correspondences": ("Read Words with Vowel Teams", "Students apply known vowel-team correspondences while reading and spelling words in a short practice set. Notice which patterns transfer to unfamiliar words.", ["phonics", "vowel teams", "word reading"]),
 "Behavior: Parents and Offspring": ("Notice How Young Animals Grow and Change", "Students compare how young animals and adults change across a life cycle using a carefully chosen text or image sequence. Use the lesson as a possible Grade 2 life-cycle connection, not a claim about a separate parents-and-offspring expectation.", ["life cycles", "animals", "science inquiry"]),
 "Count mixed sets of Canadian coins; solve money problems to $100": ("Count Canadian Coins for a Purpose", "Students sort and count mixed Canadian coins, explain an efficient counting strategy, and solve a simple contextual money problem. Notice how they organize the set before adding values.", ["mathematics", "financial literacy", "Canadian money"]),
 "Create audio recordings of stories/poems; add drawings or visual displays": ("Record a Story and Add Meaningful Visuals", "Students make a short audio recording and choose a drawing or visual that clarifies their message. Notice whether the visual and spoken words work together for a listener.", ["oral communication", "media creation", "visual representation"]),
 "Decode regularly spelled two-syllable words with long vowels": ("Read Two-Syllable Long-Vowel Words", "Students divide, blend, and read two-syllable words with familiar long-vowel patterns. Notice whether they can use the pattern in a new word rather than memorizing a list.", ["phonics", "syllables", "word reading"]),
 "Decode words with common prefixes and suffixes": ("Read Words with Prefixes and Suffixes", "Students identify a familiar prefix or suffix, read the base word, and discuss how the word part affects meaning. Listen for accurate reading before asking for a definition.", ["phonics", "morphology", "word reading"]),
 "Demonstrate understanding of equality, inequality, and missing values": ("Use Symbols to Compare and Balance", "Students use =, <, and > and a missing-value equation to represent a comparison or balance. Listen for explanations that connect the symbol to the quantities.", ["mathematics", "equality", "inequality"]),
 "Describe how characters respond to major events and challenges": ("How Does the Character Respond?", "Students describe a character's response to an important event and point to information that supports their thinking. Treat this as a possible connection to Grade 2 inference and text analysis, not a verbatim Ontario expectation.", ["reading comprehension", "characters", "inference"]),
 "Determine or clarify meaning of unknown/multiple-meaning words using context, prefixes, roots, and compounds": ("Use Clues to Clarify a Word", "Students use context and familiar word parts to test the meaning of an unknown or multiple-meaning word. Notice whether they revise an initial idea after checking the text.", ["vocabulary", "word meaning", "morphology"]),
}

RESOURCE_BY_TOPIC = {
 "phonics": "UFLI Foundations", "read": "Storyline Online", "listen": "Storyline Online",
 "vocabulary": "Reading Universe", "math": "The Very Hungry Caterpillar", "science": "The Very Hungry Caterpillar",
 "community": "Open Shut Them", "routine": "Open Shut Them", "family": "Open Shut Them", "identity": "Open Shut Them",
}

EXACT_RESOURCE_BY_TOPIC = {
 "Demonstrate an understanding of variables and equalities": "Math Learning Center Number Rack",
 "Demonstrate understanding of equality, inequality, and missing values": "Math Learning Center Number Rack",
 "Estimate the number of objects in collections up to 50; verify by counting": "K5 Learning Grade 1 Numbers",
 "Count mixed sets of Canadian coins; solve money problems to $100": "K5 Learning Canadian Money",
 "Environmental Plant Needs": "Science Buddies",
}

OFFICIAL = [
 ("Grade 1", "Ask and answer questions about key details in a text read aloud", "Ontario Language 2023", "C2.6", "identify important information in a simple text, including the main idea", "Direct curriculum connection; the map placement remains a suggested sequence."),
 ("Grade 1", "Ask and answer questions about what a speaker says", "Ontario Language 2023", "B1.1", "use effective listening skills, including listening attentively and asking relevant questions, in formal and informal contexts, including conversations and classroom activities", "Direct curriculum connection; the map placement remains a suggested sequence."),
 ("Grade 2", "Ask and answer questions about what a speaker says", "Ontario Language 2023", "B1.1", "use effective listening skills, including asking relevant questions, restating what they heard, and expressing interest, in formal and informal contexts and for various purposes, including in conversations and various classroom activities", "Direct curriculum connection; the map placement remains a suggested sequence."),
 ("Grade 2", "Behavior: Parents and Offspring", "Ontario Science and Technology 2022", "B2.3", "describe the life cycle of a variety of animals, including insects, amphibians, birds, and mammals", "Possible Grade 2 curriculum connection; this lesson is framed through life cycles, not a separate parents-and-offspring expectation."),
 ("Grade 1", "Environmental Plant Needs", "Ontario Science and Technology 2022", "B2.2", "identify the basic needs of living things, including the need for air, water, food, heat, shelter, and space", "Developmental bridge: explicit plant needs including light belong to Grade 3; do not present this as direct Grade 1 coverage."),
 ("Grade 2", "Describe how characters respond to major events and challenges", "Ontario Language 2023", "C3.2", "make simple inferences using stated and implied information and ideas to understand simple texts", "Possible Grade 2 curriculum connection; not a verbatim Ontario expectation."),
]

SOURCE_URLS = {
 "UFLI Foundations": "https://ufli.education.ufl.edu/foundations/toolbox/",
 "Reading Universe": "https://readinguniverse.org/",
 "Storyline Online": "https://storylineonline.net/",
 "Math Learning Center Number Rack": "https://www.mathlearningcenter.org/number-rack",
 "K5 Learning Grade 1 Numbers": "https://www.k5learning.com/free-math-worksheets/first-grade-1/numbers-and-counting",
 "K5 Learning Canadian Money": "https://www.k5learning.com/free-math-worksheets/second-grade-2/counting-money/canadian-coins-and-bills",
 "Science Buddies": "https://www.sciencebuddies.org/teacher-resources/lesson-plans/plant-basic-needs",
}

def material_for(topic: str, tags: list[str]) -> str:
    if topic in EXACT_RESOURCE_BY_TOPIC:
        return EXACT_RESOURCE_BY_TOPIC[topic]
    text = f"{topic} {' '.join(tags)}".casefold()
    for key, name in RESOURCE_BY_TOPIC.items():
        if key in text:
            return name
    return "Think-Pair-Share - Reading Rockets"

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    db = sqlite3.connect(args.db)
    try:
        db.execute("PRAGMA foreign_keys = ON")
        rows = db.execute("""
          SELECT DISTINCT t.id, t.topic, g.label FROM weekly_pacing wp
          JOIN topic_grades tg ON tg.id=wp.topic_grade_id JOIN grades g ON g.id=tg.grade_id
          JOIN topics t ON t.id=tg.topic_id
          WHERE g.label IN ('Kindergarten','Grade 1','Grade 2') AND wp.month='Sep' AND t.merged_into IS NULL
        """).fetchall()
        missing = sorted(topic for _, topic, _ in rows if topic not in LESSONS)
        if missing: raise ValueError(f"No reviewed teacher fields defined for: {missing}")
        if not args.apply:
            print({"status": "dry-run", "topics": len(rows), "missing": missing})
            return 0
        attached_backup = False
        # A prior title-based draft could touch matching titles outside the
        # September K–2 release. Restore only those fields and batch-marked
        # links from the verified pre-migration backup before applying ID-based
        # updates below.
        backup = Path("data/backups/omhas-before-0021-suggested-curriculum-plans.db")
        if backup.exists():
            db.execute("ATTACH DATABASE ? AS before_batch", (str(backup.resolve()),))
            attached_backup = True
        db.execute("BEGIN")
        if attached_backup:
            db.execute("""UPDATE topics SET teacher_title=(SELECT teacher_title FROM before_batch.topics WHERE id=topics.id),
              teacher_summary=(SELECT teacher_summary FROM before_batch.topics WHERE id=topics.id),
              teacher_title_state=(SELECT teacher_title_state FROM before_batch.topics WHERE id=topics.id)
              WHERE id NOT IN (SELECT DISTINCT t.id FROM weekly_pacing wp JOIN topic_grades tg ON tg.id=wp.topic_grade_id JOIN grades g ON g.id=tg.grade_id JOIN topics t ON t.id=tg.topic_id WHERE g.label IN ('Kindergarten','Grade 1','Grade 2') AND wp.month='Sep')
              AND EXISTS (SELECT 1 FROM before_batch.topics WHERE id=topics.id)""")
            db.execute("""DELETE FROM topic_materials WHERE teacher_rationale LIKE 'Use % as a reviewed teacher resource for%'
              AND topic_id NOT IN (SELECT DISTINCT t.id FROM weekly_pacing wp JOIN topic_grades tg ON tg.id=wp.topic_grade_id JOIN grades g ON g.id=tg.grade_id JOIN topics t ON t.id=tg.topic_id WHERE g.label IN ('Kindergarten','Grade 1','Grade 2') AND wp.month='Sep')""")
        for name, url in SOURCE_URLS.items():
            db.execute("""INSERT INTO source_documents (source_path, source_kind, review_state, imported_at)
              VALUES (?, 'web', 'reviewed', CURRENT_TIMESTAMP)
              ON CONFLICT(source_path) DO UPDATE SET review_state='reviewed', imported_at=CURRENT_TIMESTAMP""", (url,))
            db.execute("UPDATE resources SET verified=1 WHERE name=?", (name,))
        tag_ids: dict[str, int] = {}
        topic_ids_by_key = {(topic, grade): topic_id for topic_id, topic, grade in rows}
        for topic_id, topic, _grade in rows:
            title, summary, tags = LESSONS[topic]
            db.execute("UPDATE topics SET teacher_title=?, teacher_summary=?, teacher_title_state='education-reviewed' WHERE id=?", (title, summary, topic_id))
            for tag in tags:
                existing_tag = db.execute("SELECT id FROM tags WHERE name=?", (tag,)).fetchone()
                if existing_tag is None:
                    db.execute("INSERT INTO tags (name, definition) VALUES (?, ?)", (tag, "Flexible discovery facet; it does not determine curriculum placement."))
                    existing_tag = db.execute("SELECT id FROM tags WHERE name=?", (tag,)).fetchone()
                tag_ids[tag] = existing_tag[0]
            for tag in tags:
                db.execute("INSERT OR IGNORE INTO topic_tags (topic_id, tag_id) VALUES (?, ?)", (topic_id, tag_ids[tag]))
            resource_name = material_for(topic, tags)
            resource = db.execute("SELECT id FROM resources WHERE name=?", (resource_name,)).fetchone()
            if resource:
                rationale = f"Use {resource_name} as a reviewed teacher resource for the specific practice named in this lesson; it supports the lesson but does not establish curriculum coverage."
                db.execute("""INSERT INTO topic_materials
                  (topic_id, material_kind, material_id, role, use_in_phase, teacher_rationale)
                  VALUES (?, 'resource', ?, 'supporting', 'guided-practice', ?)
                  ON CONFLICT(topic_id, material_kind, material_id) DO UPDATE SET
                    teacher_rationale=COALESCE(NULLIF(TRIM(topic_materials.teacher_rationale),''), excluded.teacher_rationale),
                    use_in_phase=COALESCE(topic_materials.use_in_phase, excluded.use_in_phase),
                    role=COALESCE(topic_materials.role, excluded.role)""", (topic_id, resource[0], rationale))
            if topic in EXACT_RESOURCE_BY_TOPIC:
                # The story page is a valid life-cycle/counting resource, but it
                # is not evidence for money or equality. Remove only the
                # erroneous relationship this bounded batch created.
                db.execute("""DELETE FROM topic_materials WHERE topic_id=? AND material_kind='resource'
                  AND material_id=(SELECT id FROM resources WHERE name='The Very Hungry Caterpillar')
                  AND teacher_rationale LIKE 'Use The Very Hungry Caterpillar as a reviewed teacher resource%'""", (topic_id,))
            db.execute("""UPDATE topic_standards SET alignment_notes=
              'Teacher-provided suggested map reference only; not an official Ontario expectation or required sequence. Verify current provincial policy before claiming standards coverage.'
              WHERE topic_id=? AND standard_id IN (SELECT id FROM standards WHERE source='Curriculum_Map.xlsx')""", (topic_id,))
            if _grade == "Kindergarten":
                db.execute("""UPDATE topic_standards SET alignment_notes=
                  COALESCE(NULLIF(TRIM(alignment_notes), ''),
                  'Legacy Kindergarten Program 2016 reference retained for planning context. Verify against the current 2026 Kindergarten Program; this is not an official sequence claim.')
                  WHERE topic_id=?""", (topic_id,))
        for grade, topic, framework, code, full_text, note in OFFICIAL:
            topic_id = topic_ids_by_key[(topic, grade)]
            source = "https://assets-us-01.kc-usercontent.com/fbd574c4-da36-0066-a0c5-849ffb2de96e/524f0b97-2910-48f7-ad61-1339c2948a33/Language_G1-8_2023_AODA.pdf" if framework == "Ontario Language 2023" else "https://assets-us-01.kc-usercontent.com/fbd574c4-da36-0066-a0c5-849ffb2de96e/a6136d61-3120-43f0-94a3-5859e0319382/The%20Ontario%20Curriculum%20Grades%201%E2%80%938%20%E2%80%93%20Science%20and%20Technology%202022.pdf"
            db.execute("INSERT OR IGNORE INTO standards (framework, code, full_text, source) VALUES (?, ?, ?, ?)", (framework, code, full_text, source))
            standard_id = db.execute("SELECT id FROM standards WHERE framework=? AND code=? AND full_text=?", (framework, code, full_text)).fetchone()[0]
            db.execute("INSERT OR IGNORE INTO topic_standards (topic_id, standard_id, alignment_notes) VALUES (?, ?, ?)", (topic_id, standard_id, note))
        db.commit()
        if attached_backup:
            db.execute("DETACH DATABASE before_batch")
        print({"status": "applied", "topics": len(rows), "tags": len(tag_ids), "official_connections": len(OFFICIAL)})
        return 0
    except Exception:
        db.rollback(); raise
    finally: db.close()

if __name__ == "__main__": raise SystemExit(main())
