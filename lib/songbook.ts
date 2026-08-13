import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.join(process.cwd(), "data", "omhas.db");

function openDatabase() {
  return new Database(databasePath, { readonly: true });
}

export type SongbookFilters = {
  q?: string;
  grade?: string;
  topic?: string;
  type?: string;
  actions?: boolean;
  chords?: boolean;
  verified?: boolean;
};

export type SongbookSong = {
  id: number;
  title: string;
  artist: string | null;
  sourceTitle: string | null;
  type: string | null;
  verified: boolean;
  hasActions: boolean;
  hasChords: boolean;
  grades: string[];
  topics: string[];
  preview: string | null;
};

export type SongbookFacets = {
  grades: { key: string; label: string }[];
  topics: { id: string; label: string }[];
  types: string[];
};

export function getSongbookFacets(): SongbookFacets {
  const database = openDatabase();
  try {
    return {
      grades: database.prepare(`SELECT key, label FROM grades ORDER BY sort_order`).all() as SongbookFacets["grades"],
      topics: database.prepare(`
        SELECT lower(trim(t.topic)) id, trim(t.topic) label
        FROM topics t JOIN topic_materials tm ON tm.topic_id = t.id
        WHERE tm.material_kind = 'song'
        GROUP BY lower(trim(t.topic))
        ORDER BY trim(t.topic) COLLATE NOCASE
      `).all() as SongbookFacets["topics"],
      types: (database.prepare(`SELECT DISTINCT type FROM songs WHERE type IS NOT NULL AND trim(type) <> '' ORDER BY type`).all() as { type: string }[]).map((row) => row.type),
    };
  } finally {
    database.close();
  }
}

export function listSongbookSongs(filters: SongbookFilters): SongbookSong[] {
  const database = openDatabase();
  try {
    const where: string[] = [];
    const parameters: unknown[] = [];
    if (filters.q) {
      where.push(`(lower(s.title) LIKE ? OR lower(COALESCE(s.artist, '')) LIKE ? OR lower(COALESCE(s.tags, '')) LIKE ? OR lower(COALESCE(s.lyrics, '')) LIKE ?)`);
      const search = `%${filters.q.toLowerCase()}%`;
      parameters.push(search, search, search, search);
    }
    if (filters.grade) {
      where.push(`EXISTS (
        SELECT 1 FROM topic_materials tm
        JOIN topic_grades tg ON tg.topic_id = tm.topic_id
        JOIN grades g ON g.id = tg.grade_id
        WHERE tm.material_kind = 'song' AND tm.material_id = s.id AND g.key = ?
      )`);
      parameters.push(filters.grade);
    }
    if (filters.topic) {
      where.push(`EXISTS (
        SELECT 1 FROM topic_materials tm
        JOIN topics ft ON ft.id = tm.topic_id
        WHERE tm.material_kind = 'song' AND tm.material_id = s.id AND lower(trim(ft.topic)) = ?
      )`);
      parameters.push(filters.topic);
    }
    if (filters.type) {
      where.push(`s.type = ?`);
      parameters.push(filters.type);
    }
    if (filters.actions) where.push(`(
      NULLIF(trim(s.actions), '') IS NOT NULL
      OR EXISTS (SELECT 1 FROM song_sections ss WHERE ss.song_id = s.id AND NULLIF(trim(ss.actions), '') IS NOT NULL)
      OR EXISTS (SELECT 1 FROM song_actions sa WHERE sa.song_id = s.id AND NULLIF(trim(COALESCE(sa.action_wording, '')), '') IS NOT NULL)
    )`);
    if (filters.chords) where.push(`EXISTS (SELECT 1 FROM song_chord_guides cg WHERE cg.song_id = s.id)`);
    if (filters.verified) where.push(`s.verified = 1`);

    const rows = database.prepare(`
      SELECT s.id, s.title, s.artist, s.source_title, s.type, s.verified,
             CASE WHEN NULLIF(trim(s.actions), '') IS NOT NULL OR EXISTS (
               SELECT 1 FROM song_sections ss WHERE ss.song_id = s.id AND NULLIF(trim(ss.actions), '') IS NOT NULL
             ) OR EXISTS (
               SELECT 1 FROM song_actions sa WHERE sa.song_id = s.id AND NULLIF(trim(COALESCE(sa.action_wording, '')), '') IS NOT NULL
             ) THEN 1 ELSE 0 END has_actions,
             CASE WHEN EXISTS (SELECT 1 FROM song_chord_guides cg WHERE cg.song_id = s.id) THEN 1 ELSE 0 END has_chords,
             substr(s.lyrics, 1, 180) preview,
             GROUP_CONCAT(DISTINCT g.label) grades,
             GROUP_CONCAT(DISTINCT t.topic) topics
      FROM songs s
      LEFT JOIN topic_materials tm ON tm.material_kind = 'song' AND tm.material_id = s.id
      LEFT JOIN topics t ON t.id = tm.topic_id
      LEFT JOIN topic_grades tg ON tg.topic_id = t.id
      LEFT JOIN grades g ON g.id = tg.grade_id
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      GROUP BY s.id
      ORDER BY s.verified DESC, s.title COLLATE NOCASE
      LIMIT 240
    `).all(...parameters) as Array<{
      id: number; title: string; artist: string | null; source_title: string | null; type: string | null; verified: number;
      has_actions: number; has_chords: number; grades: string | null; topics: string | null; preview: string | null;
    }>;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      sourceTitle: row.source_title,
      type: row.type,
      verified: row.verified === 1,
      hasActions: row.has_actions === 1,
      hasChords: row.has_chords === 1,
      grades: row.grades?.split(",").filter(Boolean) ?? [],
      topics: row.topics?.split(",").filter(Boolean) ?? [],
      preview: row.preview,
    }));
  } finally {
    database.close();
  }
}

export type SongDetail = {
  id: number;
  title: string;
  artist: string | null;
  type: string | null;
  verified: boolean;
  educationalDomain: string | null;
  materialsNeeded: string | null;
  instructions: string | null;
  sections: Array<{
    id: number; label: string | null; sectionType: string; lyrics: string;
    actions: string | null; actionScope: string | null; actionLineNumber: number | null; actionProvenance: string | null;
  }>;
  chords: Array<{
    id: number; sectionId: number | null; scope: string; lineNumber: number | null; progression: string;
    musicalKey: string | null; capo: string | null; tuning: string | null; meter: string | null;
    startingPitch: string | null; provenance: string; sourceNote: string | null;
  }>;
  actions: Array<{
    id: string; sectionId: number | null; lineNumber: number | null; wording: string;
    sequence: number | null; classification: string | null; provenance: string | null; evidenceNote: string | null;
  }>;
  topics: Array<{ id: number; label: string; grades: string[]; rationale: string | null }>;
  sources: Array<{ path: string; kind: string; state: string; relationship: string; locator: string | null; note: string | null }>;
};

export function getSongbookSong(id: number): SongDetail | null {
  const database = openDatabase();
  try {
    const song = database.prepare(`
      SELECT id, title, artist, type, verified, educational_domain, materials_needed, instructions
      FROM songs WHERE id = ?
    `).get(id) as {
      id: number; title: string; artist: string | null; type: string | null; verified: number;
      educational_domain: string | null; materials_needed: string | null; instructions: string | null;
    } | undefined;
    if (!song) return null;

    const sections = database.prepare(`
      SELECT id, label, section_type, lyrics, actions, action_scope, action_line_number, action_provenance
      FROM song_sections WHERE song_id = ? ORDER BY sort_order
    `).all(id) as Array<Record<string, string | number | null>>;
    const fallbackLyrics = database.prepare(`SELECT lyrics, actions FROM songs WHERE id = ?`).get(id) as { lyrics: string | null; actions: string | null };
    const normalizedSections = sections.length ? sections.map((section) => ({
      id: Number(section.id), label: section.label as string | null, sectionType: String(section.section_type), lyrics: String(section.lyrics),
      actions: section.actions as string | null, actionScope: section.action_scope as string | null,
      actionLineNumber: section.action_line_number as number | null, actionProvenance: section.action_provenance as string | null,
    })) : fallbackLyrics.lyrics ? [{
      id: 0, label: null, sectionType: "song", lyrics: fallbackLyrics.lyrics, actions: fallbackLyrics.actions,
      actionScope: fallbackLyrics.actions ? "song" : null, actionLineNumber: null, actionProvenance: fallbackLyrics.actions ? "community-legacy" : null,
    }] : [];

    const chords = database.prepare(`
      SELECT id, section_id, scope, line_number, progression, musical_key, capo, tuning, meter, starting_pitch, provenance, source_note
      FROM song_chord_guides WHERE song_id = ? ORDER BY sort_order, id
    `).all(id) as Array<Record<string, string | number | null>>;
    const actions = database.prepare(`
      SELECT id, section_id, line_number, action_wording, action_sequence, action_classification, provenance, evidence_note
      FROM song_actions
      WHERE song_id = ? AND NULLIF(trim(COALESCE(action_wording, '')), '') IS NOT NULL
      ORDER BY COALESCE(section_id, 0), COALESCE(line_number, 0),
               CAST(COALESCE(action_sequence, '9999') AS INTEGER), id
    `).all(id) as Array<Record<string, string | number | null>>;
    const topics = database.prepare(`
      SELECT t.id, t.topic label, tm.teacher_rationale rationale, GROUP_CONCAT(DISTINCT g.label) grades
      FROM topic_materials tm JOIN topics t ON t.id = tm.topic_id
      LEFT JOIN topic_grades tg ON tg.topic_id = t.id LEFT JOIN grades g ON g.id = tg.grade_id
      WHERE tm.material_kind = 'song' AND tm.material_id = ?
      GROUP BY t.id ORDER BY t.topic
    `).all(id) as Array<{ id: number; label: string; rationale: string | null; grades: string | null }>;
    const sources = database.prepare(`
      SELECT sd.source_path path, sd.source_kind kind, sd.review_state state,
             ss.relationship, ss.locator, ss.evidence_note note
      FROM song_sources ss JOIN source_documents sd ON sd.id = ss.source_document_id
      WHERE ss.song_id = ? ORDER BY CASE ss.relationship WHEN 'primary' THEN 0 ELSE 1 END, sd.source_path
    `).all(id) as SongDetail["sources"];

    return {
      id: song.id, title: song.title, artist: song.artist, type: song.type, verified: song.verified === 1,
      educationalDomain: song.educational_domain, materialsNeeded: song.materials_needed, instructions: song.instructions,
      sections: normalizedSections,
      chords: chords.map((chord) => ({
        id: Number(chord.id), sectionId: chord.section_id as number | null, scope: String(chord.scope),
        lineNumber: chord.line_number as number | null, progression: String(chord.progression),
        musicalKey: chord.musical_key as string | null, capo: chord.capo as string | null,
        tuning: chord.tuning as string | null, meter: chord.meter as string | null,
        startingPitch: chord.starting_pitch as string | null, provenance: String(chord.provenance), sourceNote: chord.source_note as string | null,
      })),
      actions: actions.map((action) => ({
        id: String(action.id), sectionId: action.section_id as number | null, lineNumber: action.line_number as number | null,
        wording: String(action.action_wording), sequence: action.action_sequence === null ? null : Number(action.action_sequence), classification: action.action_classification as string | null,
        provenance: action.provenance as string | null, evidenceNote: action.evidence_note as string | null,
      })),
      topics: topics.map((topic) => ({ ...topic, grades: topic.grades?.split(",").filter(Boolean) ?? [] })),
      sources,
    };
  } finally {
    database.close();
  }
}
