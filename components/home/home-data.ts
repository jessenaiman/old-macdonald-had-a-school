export type HomeLesson = { slug: string; title: string; summary: string; grade: string };

export type HomeTopic = {
  key: string;
  filter: string;
  title: string;
  prompt: string;
  color: string;
  portrait: string;
  patch: string;
  icon: string;
  lessonTitles: readonly string[];
};

export const HOME_TOPICS: readonly HomeTopic[] = [
  {
    key: "stories", filter: "words", title: "Language & stories", prompt: "Read, rhyme, retell, and imagine together.", color: "#C9527A",
    portrait: "/staff_and_students/miss-hayley-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
    lessonTitles: ["Story Time: Board Books", "Show & Tell Story Circle", "Rhyming & Sound Play"],
  },
  {
    key: "numbers", filter: "numbers", title: "Numbers & making", prompt: "Count, notice patterns, investigate, and build.", color: "#1F6B6B",
    portrait: "/staff_and_students/mr-sam-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-circle.png",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
    lessonTitles: ["Sensory Tray Exploration", "Shape Hunt Outdoors", "Adding with Equal Groups"],
  },
  {
    key: "music", filter: "music", title: "Music & movement", prompt: "Sing, keep the beat, move, and join in your way.", color: "#8B5E34",
    portrait: "/staff_and_students/old-macdonald-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-circle.png",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png",
    lessonTitles: ["Singing Together", "Seven Jumps", "Clap Your Hands"],
  },
  {
    key: "routines", filter: "heart", title: "Routines & wellbeing", prompt: "Build belonging, confidence, and calm classroom rhythms.", color: "#E8A227",
    portrait: "/staff_and_students/miss-puddles-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-community-leadership.png",
    lessonTitles: ["Feelings Check-In", "Clean Up Song Sequence", "Kind Hands, Kind Words"],
  },
] as const;

export const SONG_SLUGS = ["singing-together", "seven-jumps", "clap-your-hands", "follow-the-duckling"] as const;
export const NEW_SLUGS = ["sound-and-letter-walk", "properties-of-operations", "plant-your-seeds"] as const;
