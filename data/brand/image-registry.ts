/**
 * Runtime image URLs used by TypeScript/Next Image consumers.
 *
 * CSS background assets remain in app/brand-assets.css. Keeping content and
 * component URLs here prevents individual components from inventing public
 * paths while preserving the existing optimized WebP/PNG assets.
 *
 * This registry exposes available files. Cast meaning, color meaning, grade
 * routing, and subject routing remain defined by content/pages/branding/cast.mdx
 * and implemented through app/globals.css plus app/brand-assets.css.
 */
export const BRAND_IMAGE_ASSETS = {
  emblem: {
    micro: "/design-assets/logo/individual-marks/brand-emblem-micro-16.png",
    favicon: "/design-assets/logo/individual-marks/brand-emblem-favicon-32.png",
    flat: "/design-assets/logo/candidate-flat-marks/brand-emblem-flat-32.png",
    navigation: "/design-assets/logo/individual-marks/brand-emblem-nav-44.png",
    card: "/design-assets/logo/individual-marks/brand-emblem-card-128.webp",
    detail: "/design-assets/logo/candidate-detail-marks/brand-emblem-detail-512.webp",
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
  badges: {
    "old-macdonald": "/design-assets/cast-badges-v1/individual-badges/01-old-macdonald-badge.webp",
    "miss-puddles": "/design-assets/cast-badges-v1/individual-badges/02-miss-puddles-badge.webp",
    "mr-rusty": "/design-assets/cast-badges-v1/individual-badges/03-mr-rusty-badge.webp",
    "miss-hayley": "/design-assets/cast-badges-v1/individual-badges/04-miss-hayley-badge.webp",
    "mr-sam": "/design-assets/cast-badges-v1/individual-badges/05-mr-sam-badge.webp",
    "mr-maisy": "/design-assets/cast-badges-v1/individual-badges/06-mr-maisy-badge.webp",
    "mr-puddles": "/design-assets/cast-badges-v1/individual-badges/07-mr-puddles-badge.webp",
    "miss-maisy": "/design-assets/cast-badges-v1/individual-badges/08-miss-maisy-badge.webp",
    hopper: "/design-assets/cast-badges-v1/individual-badges/09-hopper-badge.webp",
    whiskers: "/design-assets/cast-badges-v1/individual-badges/10-whiskers-badge.webp",
    scout: "/design-assets/cast-badges-v1/individual-badges/11-scout-badge.webp",
    penny: "/design-assets/cast-badges-v1/individual-badges/12-penny-badge.webp",
    maisy: "/design-assets/cast-badges-v1/individual-badges/13-maisy-badge.webp",
    puddles: "/design-assets/cast-badges-v1/individual-badges/14-puddles-badge.webp",
    sam: "/design-assets/cast-badges-v1/individual-badges/15-sam-badge.webp",
    rusty: "/design-assets/cast-badges-v1/individual-badges/16-rusty-badge.webp",
  },
  facePatches: {
    "old-macdonald": "/icons/early-years/face-patches/old-macdonald-yellow.webp",
    "miss-puddles": "/icons/early-years/face-patches/miss-puddles-purple.webp",
    "mr-rusty": "/icons/early-years/face-patches/mr-rusty-blue.webp",
    "miss-hayley": "/icons/early-years/face-patches/miss-hayley-purple.webp",
    "mr-sam": "/icons/early-years/face-patches/mr-sam-clean-v2.webp",
    "mr-maisy": "/icons/early-years/face-patches/mr-maisy-orange.webp",
    "mr-puddles": "/icons/early-years/face-patches/mr-puddles-green.webp",
    "miss-maisy": "/icons/early-years/face-patches/miss-maisy-purple.webp",
    hopper: "/icons/early-years/face-patches/hopper-red.webp",
    whiskers: "/icons/early-years/face-patches/whiskers-orange.webp",
    scout: "/icons/early-years/face-patches/scout-green.webp",
    penny: "/icons/early-years/face-patches/penny-orange.webp",
    maisy: "/icons/early-years/face-patches/maisy-yellow.webp",
    puddles: "/icons/early-years/face-patches/puddles-blue.webp",
    sam: "/icons/early-years/face-patches/sam-red.webp",
    rusty: "/icons/early-years/face-patches/rusty-blue.webp",
  },
  faceBusts: {
    "old-macdonald": "/icons/early-years/face-busts/old-macdonald-yellow.webp",
    "miss-puddles": "/icons/early-years/face-busts/miss-puddles-purple.webp",
    "mr-rusty": "/icons/early-years/face-busts/mr-rusty-blue.webp",
    "miss-hayley": "/icons/early-years/face-busts/miss-hayley-purple.webp",
    "mr-sam": "/icons/early-years/face-busts/mr-sam-clean-v2.webp",
    "mr-maisy": "/icons/early-years/face-busts/mr-maisy-orange.webp",
    "mr-puddles": "/icons/early-years/face-busts/mr-puddles-green.webp",
    "miss-maisy": "/icons/early-years/face-busts/miss-maisy-purple.webp",
    hopper: "/icons/early-years/face-busts/hopper-red.webp",
    whiskers: "/icons/early-years/face-busts/whiskers-orange.webp",
    scout: "/icons/early-years/face-busts/scout-green.webp",
    penny: "/icons/early-years/face-busts/penny-orange.webp",
    maisy: "/icons/early-years/face-busts/maisy-yellow.webp",
    puddles: "/icons/early-years/face-busts/puddles-blue.webp",
    sam: "/icons/early-years/face-busts/sam-red.webp",
    rusty: "/icons/early-years/face-busts/rusty-blue.webp",
  },
  feltPatches: {
    "old-macdonald": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.webp",
    },
    "miss-puddles": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-square.webp",
    },
    "mr-rusty": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-square.webp",
    },
    "miss-hayley": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-square.webp",
    },
    "mr-sam": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-square.webp",
    },
    "mr-maisy": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/06-mr-maisy-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/06-mr-maisy-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/06-mr-maisy-square.webp",
    },
    "mr-puddles": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/07-mr-puddles-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/07-mr-puddles-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/07-mr-puddles-square.webp",
    },
    "miss-maisy": {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-square.webp",
    },
    hopper: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/09-hopper-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/09-hopper-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/09-hopper-square.webp",
    },
    whiskers: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/10-whiskers-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/10-whiskers-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/10-whiskers-square.webp",
    },
    scout: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/11-scout-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/11-scout-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/11-scout-square.webp",
    },
    penny: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/12-penny-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/12-penny-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/12-penny-square.webp",
    },
    maisy: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/13-maisy-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/13-maisy-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/13-maisy-square.webp",
    },
    puddles: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/14-puddles-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/14-puddles-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/14-puddles-square.webp",
    },
    sam: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/15-sam-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/15-sam-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/15-sam-square.webp",
    },
    rusty: {
      circle: "/design-assets/blank-felt-patches-v1/individual-patches/16-rusty-circle.webp",
      rectangle: "/design-assets/blank-felt-patches-v1/individual-patches/16-rusty-rectangle.webp",
      square: "/design-assets/blank-felt-patches-v1/individual-patches/16-rusty-square.webp",
    },
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
export type CastFacePatchKey = keyof typeof BRAND_IMAGE_ASSETS.facePatches;
export type CastFaceBustKey = keyof typeof BRAND_IMAGE_ASSETS.faceBusts;
export type CastFeltPatchKey = keyof typeof BRAND_IMAGE_ASSETS.feltPatches;
export type CastFeltPatchShape = keyof (typeof BRAND_IMAGE_ASSETS.feltPatches)[CastFeltPatchKey];
export type SceneAssetKey = keyof typeof BRAND_IMAGE_ASSETS.scenes;
