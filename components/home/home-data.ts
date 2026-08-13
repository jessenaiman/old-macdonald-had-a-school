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
  matches: (lesson: HomeLesson) => boolean;
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
  { slug: "old-macdonald-had-a-farm", title: "Old MacDonald Had a Farm", summary: "", grade: "All grades", href: `${VIDEO_CHANNEL}Old%20MacDonald%20Had%20a%20Farm` },
  { slug: "the-wheels-on-the-bus", title: "The Wheels on the Bus", summary: "", grade: "All grades", href: `${VIDEO_CHANNEL}The%20Wheels%20on%20the%20Bus` },
  { slug: "five-little-ducks", title: "Five Little Ducks", summary: "", grade: "Daycare, Preschool, Kindergarten", href: `${VIDEO_CHANNEL}Five%20Little%20Ducks` },
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
