/**
 * Runtime image URLs used by TypeScript/Next Image consumers.
 *
 * CSS background assets remain in app/brand-assets.css. Keeping content and
 * component URLs here prevents individual components from inventing public
 * paths while preserving the existing optimized WebP/PNG assets.
 */
export const BRAND_IMAGE_ASSETS = {
  emblem: {
    micro: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-micro-16.png",
    favicon: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-favicon-32.png",
    flat: "/design-assets/brand-emblem-v1/candidate-flat-marks/brand-emblem-flat-32.png",
    navigation: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-nav-44.png",
    card: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-card-128.webp",
    detail: "/design-assets/brand-emblem-v1/candidate-detail-marks/brand-emblem-detail-512.webp",
  },
  portraits: {
    "old-macdonald": "/staff_and_students/old-macdonald-transparent-circle.webp",
    "miss-puddles": "/staff_and_students/miss-puddles-transparent-circle.webp",
    "mr-rusty": "/staff_and_students/mr-rusty-transparent-circle.webp",
    "miss-hayley": "/staff_and_students/miss-hayley-transparent-circle.webp",
    "mr-sam": "/staff_and_students/mr-sam-clean-v2.webp",
    "mr-maisy": "/staff_and_students/mr-maisy-transparent-circle.webp",
    "mr-puddles": "/staff_and_students/mr-puddles-transparent-circle.webp",
    "miss-maisy": "/staff_and_students/miss-maisy-transparent-circle.webp",
    hopper: "/staff_and_students/hopper-transparent-circle.webp",
    whiskers: "/staff_and_students/whiskers-transparent-circle.webp",
    scout: "/staff_and_students/scout-transparent-circle.webp",
    penny: "/staff_and_students/penny-transparent-circle.webp",
    maisy: "/staff_and_students/maisy-transparent-circle.webp",
    puddles: "/staff_and_students/puddles-transparent-circle.webp",
    sam: "/staff_and_students/sam-transparent-circle.webp",
    rusty: "/staff_and_students/rusty-transparent-circle.webp",
  },
  scenes: {
    "follow-the-duckling": "/scenes/follow-the-duckling.webp",
    "old-macs-open-circle-gathering": "/scenes/hero/old-macs-open-circle-gathering.webp",
    "singing-together-on-old-macs-farm": "/scenes/singing-together-on-old-macs-farm.webp",
    "clap-your-hands-2": "/scenes/clap-your-hands-2.webp",
    "plant-your-seeds-with-care": "/scenes/plant-your-seeds-with-care.webp",
    "seven-jumps-2": "/scenes/seven-jumps-2.webp",
    "early-years-worksheet-example": "/scenes/early-years-worksheet-example.webp",
  },
} as const;

export type CastPortraitKey = keyof typeof BRAND_IMAGE_ASSETS.portraits;
export type SceneAssetKey = keyof typeof BRAND_IMAGE_ASSETS.scenes;
