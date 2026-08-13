export type HomeLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  subject: string;
  category: string;
};

export type HomeSubject = {
  key: string;
  title: string;
  earlyYearsLabel: string;
  searchQuery: string;
  color: string;
  iconClass: string;
  highlights: readonly string[];
  fastenerClass: SubjectFastener;
  paperAsset: string;
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
  name: string;
  portrait: string;
  color: `#${string}`;
  texture: string;
  ink?: "light" | "dark";
};

export const SUBJECT_LEARNERS: Record<string, SubjectLearner> = {
  language: { name: "Whiskers", portrait: "/staff_and_students/whiskers-transparent-circle.png", color: "#6D5596", texture: "/design-assets/web-material-library-v1/felt/felt-10-whiskers-tile.png" },
  math: { name: "Sam", portrait: "/staff_and_students/sam-transparent-circle.png", color: "#A8323A", texture: "/design-assets/web-material-library-v1/felt/felt-06-mr-maisy-tile.png" },
  science: { name: "Scout", portrait: "/staff_and_students/scout-transparent-circle.png", color: "#477A4D", texture: "/design-assets/web-material-library-v1/felt/felt-11-scout-tile.png" },
  music: { name: "Penny", portrait: "/staff_and_students/penny-transparent-circle.png", color: "#E3AD27", texture: "/design-assets/web-material-library-v1/felt/felt-12-penny-tile.png", ink: "dark" },
  arts: { name: "Puddles", portrait: "/staff_and_students/puddles-transparent-circle.png", color: "#76508F", texture: "/design-assets/web-material-library-v1/felt/felt-07-mr-puddles-tile.png" },
  health: { name: "Hopper", portrait: "/staff_and_students/hopper-transparent-circle.png", color: "#C65F28", texture: "/design-assets/web-material-library-v1/felt/felt-09-hopper-tile.png" },
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
    color: "#C9527A",
    iconClass: "drama-storytelling-icon",
    fastenerClass: "fastener-paperclip",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/01-torn-notebook-note.png",
    rotation: "left",
    highlights: ["Build vocabulary", "Explore phonics", "Tell and retell stories"],
    matches: (lesson) => /language|literacy|phonic|reading|vocabulary/i.test(lessonText(lesson)),
  },
  {
    key: "math",
    earlyYearsLabel: "Numbers",
    title: "Math",
    searchQuery: "math numeracy",
    color: "#1F6B6B",
    iconClass: "math-building-icon",
    fastenerClass: "fastener-push-pin",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/02-blue-grid-note.png",
    rotation: "none",
    highlights: ["Count and compare", "Explore shapes", "Find patterns in songs"],
    matches: (lesson) => /math|numeracy/i.test(lessonText(lesson)),
  },
  {
    key: "science",
    earlyYearsLabel: "Nature & discovery",
    title: "Nature & science",
    searchQuery: "science nature",
    color: "#55705A",
    iconClass: "gardening-health-icon",
    fastenerClass: "fastener-binder-clip",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/03-sage-deckled-note.png",
    rotation: "right",
    highlights: ["Observe and explore", "Seasons and weather", "Living things"],
    matches: (lesson) => /science|nature/i.test(lessonText(lesson)),
  },
  {
    key: "music",
    earlyYearsLabel: "Songs & movement",
    title: "Music",
    searchQuery: "music",
    color: "#2C6C9B",
    iconClass: "music-icon",
    fastenerClass: "fastener-masking-tape",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/04-rose-ruled-note.png",
    rotation: "left",
    highlights: ["Rhythm and beat", "Sing and move", "Create and perform"],
    matches: (lesson) => /music/i.test(lessonText(lesson)),
  },
  {
    key: "arts",
    earlyYearsLabel: "Making & imagining",
    title: "The arts",
    searchQuery: "arts drama creativity",
    color: "#4F5FA0",
    iconClass: "art-photography-icon",
    fastenerClass: "fastener-gingham-tape",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/05-gold-scalloped-note.png",
    rotation: "none",
    highlights: ["Create and imagine", "Explore colour", "Draw and design"],
    matches: (lesson) => /\bart\b|arts|drama|creative/i.test(lessonText(lesson)),
  },
  {
    key: "health",
    earlyYearsLabel: "Movement & wellbeing",
    title: "Health & physical education",
    searchQuery: "health physical education movement",
    color: "#B5272C",
    iconClass: "physical-education-icon",
    fastenerClass: "fastener-apple-peg",
    paperAsset: "/design-assets/classroom-paper-notes-v1-review/individual-notes/06-lavender-folded-note.png",
    rotation: "right",
    highlights: ["Move your body", "Play and cooperate", "Stay healthy"],
    matches: (lesson) => /gross motor|physical|health|routine|approaches to learning/i.test(lessonText(lesson)),
  },
] as const;

export const EARLY_YEARS_STAFF = [
  {
    name: "Miss Puddles",
    role: "Daycare & movement",
    href: "/search?q=daycare+movement+circle+time",
    portrait: "/staff_and_students/miss-puddles-transparent-circle.png",
    color: "#E8A227",
    texture: "/design-assets/web-material-library-v1/felt/felt-02-miss-puddles-tile.png",
  },
  {
    name: "Miss Maisy",
    role: "Gardening & health",
    href: "/search?q=gardening+health+preschool",
    portrait: "/staff_and_students/miss-maisy-transparent-circle.png",
    color: "#55705A",
    texture: "/design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.png",
  },
  {
    name: "Mr Rusty",
    role: "Dance & rhythm",
    href: "/search?q=dance+rhythm+movement",
    portrait: "/staff_and_students/mr-rusty-transparent-circle.png",
    color: "#2C6C9B",
    texture: "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png",
  },
  {
    name: "Miss Hayley",
    role: "Stories & drama",
    href: "/search?q=stories+drama+language",
    portrait: "/staff_and_students/miss-hayley-transparent-circle.png",
    color: "#C9527A",
    texture: "/design-assets/web-material-library-v1/felt/felt-04-miss-hayley-tile.png",
  },
] as const;

const VIDEO_CHANNEL = "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=";

export const HOME_VIDEO_SONGS = [
  { slug: "find-the-steady-beat", title: "Find the Steady Beat", summary: "Feel and clap the heartbeat of songs.", grade: "All grades", href: `${VIDEO_CHANNEL}steady%20beat` },
  { slug: "animal-action-march", title: "Animal Action March", summary: "Move like the animals in the song.", grade: "All grades", href: `${VIDEO_CHANNEL}animal%20action%20march` },
  { slug: "old-macdonald-orchestra", title: "Old MacDonald Orchestra", summary: "Explore classroom instruments.", grade: "All grades", href: `${VIDEO_CHANNEL}Old%20MacDonald%20Orchestra` },
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
