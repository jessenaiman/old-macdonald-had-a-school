// Canonical song/topic sets for the Daycare, Pre-School and Kindergarten hubs.
// Single source of truth — one record keyed by grade. Each row is tagged with
// its grade so the set can be sliced any way a future caller needs without
// re-deriving the grouping.
export type EarlyYearsGradeKey = "daycare" | "pre-school" | "kindergarten";

export type EarlyYearsTopic = {
  grade: EarlyYearsGradeKey;
  slug: string;
  title: string;
  focus: string;
  patch: string; // /patches/<patch>.png — the topic's own patch, not the teacher's
  image: string; // /scenes/<image> — preview shown in the lightbox
  steps: string[]; // the teaching rhythm, e.g. Identify → Imitate → Move → Join In
  choice?: string[]; // Pre-School tier only — an explicit choice point in the activity
  noticeFor?: string[]; // Pre-School tier only — "what to notice" checklist
};

export const EARLY_YEARS: Record<EarlyYearsGradeKey, EarlyYearsTopic[]> = {
  daycare: [
    { grade: "daycare", slug: "follow-the-duckling", title: "Follow the Duckling", focus: "Animal sounds and simple imitation", patch: "puddles", image: "/scenes/follow-the-duckling.png", steps: ["Listen", "Name", "Copy the sound"] },
    { grade: "daycare", slug: "open-circle-gathering", title: "Old Mac's Open Circle", focus: "Group gathering and turn-taking", patch: "penny", image: "/scenes/old-macs-open-circle-gathering.png", steps: ["Sit together", "Listen", "Take a turn"] },
    { grade: "daycare", slug: "clap-your-hands", title: "Clap Your Hands", focus: "Steady beat, hands and feet", patch: "hopper", image: "/scenes/clap-your-hands.png", steps: ["Listen", "Clap along"] },
    { grade: "daycare", slug: "plant-your-seeds", title: "Plant Your Seeds", focus: "Fingerplay and gentle motion", patch: "maisy", image: "/scenes/plant-your-seeds.png", steps: ["Watch", "Copy the motion"] },
    { grade: "daycare", slug: "seven-jumps", title: "Seven Jumps", focus: "Whole-body movement, stop and go", patch: "rusty", image: "/scenes/seven-jumps.png", steps: ["Move", "Freeze"] },
    { grade: "daycare", slug: "singing-together", title: "Singing Together", focus: "Whole-school music circle", patch: "scout", image: "/scenes/singing-together-on-old-macs-farm.png", steps: ["Listen", "Hum along"] },
  ],
  "pre-school": [
    { grade: "pre-school", slug: "clap-your-hands-2", title: "Clap Your Hands", focus: "Steady beat, hands and feet, faster tempo", patch: "hopper", image: "/scenes/clap-your-hands-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Standing", "Seated", "Gesture only", "Watch and listen"], noticeFor: ["Copies the beat", "Joins without a prompt", "Notices tempo change"] },
    { grade: "pre-school", slug: "plant-your-seeds-with-care", title: "Plant Your Seeds With Care", focus: "Sequenced fingerplay with a growing pattern", patch: "maisy", image: "/scenes/plant-your-seeds-with-care.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Full motion", "Hands only", "Watch and listen"], noticeFor: ["Follows the sequence", "Names the next step", "Repeats independently"] },
    { grade: "pre-school", slug: "seven-jumps-2", title: "Seven Jumps", focus: "Counted movement with a freeze cue", patch: "rusty", image: "/scenes/seven-jumps-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Standing", "Seated", "Gesture only"], noticeFor: ["Counts along", "Freezes on cue", "Recovers after a miss"] },
    { grade: "pre-school", slug: "early-year-example", title: "Barnyard Roll Call", focus: "Naming and sorting the farm animals", patch: "scout", image: "/scenes/early-year-example-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Point and name", "Sound and name", "Watch and listen"], noticeFor: ["Names correctly", "Sorts by type", "Asks a question"] },
    { grade: "pre-school", slug: "worksheet-example", title: "A Barn Band Day", focus: "Instruments, sound and simple choice-making", patch: "whiskers", image: "/scenes/early-years-worksheet-example.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Shaker", "Drum", "Voice only"], noticeFor: ["Chooses an instrument", "Keeps the beat briefly", "Shares with a peer"] },
  ],
  kindergarten: [
    { grade: "kindergarten", slug: "barnyard-count-along", title: "Barnyard Count-Along", focus: "Counting the animals as they appear on the page", patch: "sam", image: "/scenes/singing-together-on-old-macs-farm.png", steps: ["Look", "Count", "Mark the picture"] },
    { grade: "kindergarten", slug: "sound-and-letter-walk", title: "Sound & Letter Walk", focus: "Matching an animal sound to its starting letter", patch: "whiskers", image: "/scenes/old-macs-open-circle-gathering.png", steps: ["Listen", "Find the letter", "Mark the picture"] },
  ],
};
