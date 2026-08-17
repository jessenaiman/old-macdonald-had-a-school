export type HomeLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  subject: string;
  category: string;
};

export type HomeSubject = {
  key: "language" | "math" | "science" | "health" | "sel" | "fine-motor" | "music" | "arts";
  title: string;
  earlyYearsLabel: string;
  searchQuery: string;
  iconClass: string;
  teacherReason: string;
  highlights: readonly string[];
  fastenerClass: SubjectFastener;
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

export const SUBJECT_LEARNERS: Record<HomeSubject["key"], SubjectLearner> = {
  language: { character: "whiskers" },
  math: { character: "sam" },
  science: { character: "scout" },
  health: { character: "hopper" },
  sel: { character: "penny" },
  "fine-motor": { character: "puddles" },
  music: { character: "penny" },
  arts: { character: "puddles" },
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
    teacherReason: "Explore seasons, weather, and living things.",
    highlights: ["Observe and explore", "Seasons and weather", "Living things"],
    matches: (lesson) => /science|nature/i.test(lessonText(lesson)),
  },
  {
    key: "health",
    earlyYearsLabel: "Movement & wellbeing",
    title: "Health & physical education",
    searchQuery: "physical health development",
    iconClass: "physical-education-icon",
    fastenerClass: "fastener-masking-tape",
    teacherReason: "Practise movement, cooperation, and healthy routines.",
    highlights: ["Move your body", "Play and cooperate", "Stay healthy"],
    matches: (lesson) => /gross motor|physical|health|routine|approaches to learning/i.test(lessonText(lesson)),
  },
  {
    key: "sel",
    earlyYearsLabel: "Feelings & friendship",
    title: "Social-emotional learning",
    searchQuery: "social emotional learning SEL",
    iconClass: "community-helping",
    fastenerClass: "fastener-gingham-tape",
    teacherReason: "Build belonging, empathy, and confident participation.",
    highlights: ["Name feelings", "Practise kindness", "Learn together"],
    matches: (lesson) => /social-emotional|\bsel\b|feelings|friendship/i.test(lessonText(lesson)),
  },
  {
    key: "fine-motor",
    earlyYearsLabel: "Hands-on learning",
    title: "Fine motor skills",
    searchQuery: "fine motor skills",
    iconClass: "early-learning-lacing",
    fastenerClass: "fastener-apple-peg",
    teacherReason: "Strengthen the hands children use to make, draw, and write.",
    highlights: ["Pinch and place", "Thread and build", "Draw and prepare to write"],
    matches: (lesson) => /fine motor/i.test(lessonText(lesson)),
  },
  {
    key: "music",
    earlyYearsLabel: "Songs & rhythm",
    title: "Music",
    searchQuery: "music rhythm songs",
    iconClass: "music-hand-drum",
    fastenerClass: "fastener-masking-tape",
    teacherReason: "Sing, listen, play, and find the beat.",
    highlights: ["Sing and move", "Explore instruments", "Feel the steady beat"],
    matches: (lesson) => /music|song|rhythm|beat/i.test(lessonText(lesson)),
  },
  {
    key: "arts",
    earlyYearsLabel: "Creative expression",
    title: "Arts",
    searchQuery: "art creative expression",
    iconClass: "painting-easel",
    fastenerClass: "fastener-gingham-tape",
    teacherReason: "Make marks, mix colour, and create.",
    highlights: ["Draw and paint", "Explore materials", "Express ideas visually"],
    matches: (lesson) => /art|creative|draw|paint|colour|color/i.test(lessonText(lesson)),
  },
] as const;

const VIDEO_CHANNEL = "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=";

export const HOME_VIDEO_SONGS = [
  { slug: "find-the-steady-beat", title: "Find the Steady Beat", summary: "Feel and clap the heartbeat of songs.", grade: "All grades", icon: "music-hand-drum", href: `${VIDEO_CHANNEL}steady%20beat` },
  { slug: "animal-action-march", title: "Animal Action March", summary: "Move like the animals in the song.", grade: "All grades", icon: "dance-turning-footprints", href: `${VIDEO_CHANNEL}animal%20action%20march` },
  { slug: "old-macdonald-orchestra", title: "Old MacDonald Orchestra", summary: "Explore classroom instruments.", grade: "All grades", icon: "music-fiddle", href: `${VIDEO_CHANNEL}Old%20MacDonald%20Orchestra` },
  { slug: "the-itsy-bitsy-spider", title: "The Itsy Bitsy Spider", summary: "", grade: "Daycare, Preschool, Kindergarten", icon: "music-hand-drum", href: `${VIDEO_CHANNEL}Itsy%20Bitsy%20Spider` },
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
