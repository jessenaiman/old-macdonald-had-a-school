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
  icon: string;
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
    icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
    matches: (lesson) => /language|literacy|phonic|reading|vocabulary/i.test(lessonText(lesson)),
  },
  {
    key: "math",
    earlyYearsLabel: "Numbers",
    title: "Math",
    searchQuery: "math numeracy",
    color: "#1F6B6B",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
    matches: (lesson) => /math|numeracy/i.test(lessonText(lesson)),
  },
  {
    key: "science",
    earlyYearsLabel: "Nature & discovery",
    title: "Nature & science",
    searchQuery: "science nature",
    color: "#55705A",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png",
    matches: (lesson) => /science|nature/i.test(lessonText(lesson)),
  },
  {
    key: "music",
    earlyYearsLabel: "Songs & movement",
    title: "Music",
    searchQuery: "music",
    color: "#2C6C9B",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png",
    matches: (lesson) => /music/i.test(lessonText(lesson)),
  },
  {
    key: "arts",
    earlyYearsLabel: "Making & imagining",
    title: "The arts",
    searchQuery: "arts drama creativity",
    color: "#4F5FA0",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png",
    matches: (lesson) => /\bart\b|arts|drama|creative/i.test(lessonText(lesson)),
  },
  {
    key: "health",
    earlyYearsLabel: "Movement & wellbeing",
    title: "Health & physical education",
    searchQuery: "health physical education movement",
    color: "#B5272C",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-physical-education.png",
    matches: (lesson) => /gross motor|physical|health|routine|approaches to learning/i.test(lessonText(lesson)),
  },
] as const;

export const EARLY_YEARS_STAFF = [
  {
    portrait: "/staff_and_students/miss-puddles-transparent-circle.png",
    color: "#E8A227",
    texture: "/design-assets/web-material-library-v1/felt/felt-02-miss-puddles-tile.png",
  },
  {
    portrait: "/staff_and_students/miss-maisy-transparent-circle.png",
    color: "#55705A",
    texture: "/design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.png",
  },
  {
    portrait: "/staff_and_students/mr-rusty-transparent-circle.png",
    color: "#2C6C9B",
    texture: "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png",
  },
  {
    portrait: "/staff_and_students/miss-hayley-transparent-circle.png",
    color: "#C9527A",
    texture: "/design-assets/web-material-library-v1/felt/felt-04-miss-hayley-tile.png",
  },
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
