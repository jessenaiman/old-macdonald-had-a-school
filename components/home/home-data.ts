export type HomeLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  subject: string;
  category: string;
};

export type HomeSubject = {
  key: "language" | "math" | "science" | "music" | "arts" | "health";
  title: string;
  earlyYearsLabel: string;
  searchQuery: string;
  iconClass: string;
  teacherReason: string;
  highlights: readonly string[];
  fastenerClass: SubjectFastener;
  noteShape: "torn" | "grid" | "deckled" | "ruled" | "scalloped" | "folded";
  rotation: "left" | "none" | "right";
  matches: (lesson: HomeLesson) => boolean;
};

export type SubjectFastener =
  | "fastener-paperclip"
  | "fastener-push-pin"
  | "fastener-binder-clip"
  | "fastener-masking-tape"
  | "fastener-gingham-tape"
  | "fastener-apple-peg";

export type SubjectLearner = {
  character: "whiskers" | "sam" | "scout" | "penny" | "puddles" | "hopper";
};

export const SUBJECT_LEARNERS: Record<string, SubjectLearner> = {
  language: { character: "whiskers" },
  math: { character: "sam" },
  science: { character: "scout" },
  music: { character: "penny" },
  arts: { character: "puddles" },
  health: { character: "hopper" },
};

function lessonText(lesson: HomeLesson) {
  return lesson.subject;
}

export const HOME_SUBJECTS: readonly HomeSubject[] = [
  {
    key: "language",
    earlyYearsLabel: "Stories & sounds",
    title: "Language & literacy",
    searchQuery: "language literacy",
    iconClass: "drama-storytelling-icon",
    fastenerClass: "fastener-paperclip",
    noteShape: "torn",
    rotation: "left",
    teacherReason: "Build confident talk, reading, and storytelling.",
    highlights: ["Build vocabulary", "Explore phonics", "Tell and retell stories"],
    matches: (lesson) => /language|literacy|phonic|reading|vocabulary/i.test(lessonText(lesson)),
  },
  {
    key: "math",
    earlyYearsLabel: "Numbers",
    title: "Math",
    searchQuery: "math numeracy",
    iconClass: "math-building-icon",
    fastenerClass: "fastener-push-pin",
    noteShape: "grid",
    rotation: "none",
    teacherReason: "Make counting, shape, and patterns visible.",
    highlights: ["Count and compare", "Explore shapes", "Find patterns in songs"],
    matches: (lesson) => /math|numeracy/i.test(lessonText(lesson)),
  },
  {
    key: "science",
    earlyYearsLabel: "Nature & discovery",
    title: "Nature & science",
    searchQuery: "science nature",
    iconClass: "gardening-health-icon",
    fastenerClass: "fastener-binder-clip",
    noteShape: "deckled",
    rotation: "right",
    teacherReason: "Explore seasons, weather, and living things.",
    highlights: ["Observe and explore", "Seasons and weather", "Living things"],
    matches: (lesson) => /science|nature/i.test(lessonText(lesson)),
  },
  {
    key: "music",
    earlyYearsLabel: "Songs & movement",
    title: "Music",
    searchQuery: "music",
    iconClass: "music-icon",
    fastenerClass: "fastener-masking-tape",
    noteShape: "ruled",
    rotation: "left",
    teacherReason: "Teach rhythm, listening, and movement through songs.",
    highlights: ["Rhythm and beat", "Sing and move", "Create and perform"],
    matches: (lesson) => /music/i.test(lessonText(lesson)),
  },
  {
    key: "arts",
    earlyYearsLabel: "Making & imagining",
    title: "The arts",
    searchQuery: "arts drama creativity",
    iconClass: "art-photography-icon",
    fastenerClass: "fastener-gingham-tape",
    noteShape: "scalloped",
    rotation: "none",
    teacherReason: "Invite children to create, imagine, and express ideas.",
    highlights: ["Create and imagine", "Explore colour", "Draw and design"],
    matches: (lesson) => /\bart\b|arts|drama|creative/i.test(lessonText(lesson)),
  },
  {
    key: "health",
    earlyYearsLabel: "Movement & wellbeing",
    title: "Health & physical education",
    searchQuery: "health physical education movement",
    iconClass: "physical-education-icon",
    fastenerClass: "fastener-apple-peg",
    noteShape: "folded",
    rotation: "right",
    teacherReason: "Practise movement, cooperation, and healthy routines.",
    highlights: ["Move your body", "Play and cooperate", "Stay healthy"],
    matches: (lesson) => /gross motor|physical|health|routine|approaches to learning/i.test(lessonText(lesson)),
  },
] as const;

const VIDEO_CHANNEL = "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=";

export const HOME_VIDEO_SONGS = [
  { slug: "find-the-steady-beat", title: "Find the Steady Beat", summary: "Feel and clap the heartbeat of songs.", grade: "All grades", icon: "music-hand-drum", href: `${VIDEO_CHANNEL}steady%20beat` },
  { slug: "animal-action-march", title: "Animal Action March", summary: "Move like the animals in the song.", grade: "All grades", icon: "dance-turning-footprints", href: `${VIDEO_CHANNEL}animal%20action%20march` },
  { slug: "old-macdonald-orchestra", title: "Old MacDonald Orchestra", summary: "Explore classroom instruments.", grade: "All grades", icon: "music-fiddle", href: `${VIDEO_CHANNEL}Old%20MacDonald%20Orchestra` },
  { slug: "the-itsy-bitsy-spider", title: "The Itsy Bitsy Spider", summary: "", grade: "Daycare, Preschool, Kindergarten", href: `${VIDEO_CHANNEL}Itsy%20Bitsy%20Spider` },
] as const;

export const SONG_SLUGS = [
  "singing-together",
  "seven-jumps",
  "clap-your-hands",
  "follow-the-duckling",
] as const;

export const NEW_SLUGS = [
  "sound-and-letter-walk",
  "properties-of-operations",
  "plant-your-seeds",
] as const;
