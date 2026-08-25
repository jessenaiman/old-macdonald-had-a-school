/**
 * Runtime image URLs used by TypeScript/Next Image consumers.
 *
 * CSS background assets remain in app/brand-assets.css. Keeping content and
 * component URLs here prevents individual components from inventing public
 * paths while preserving the existing optimized WebP/PNG assets.
 *
 * This registry exposes available files. Character meaning, color meaning, grade
 * routing, and subject routing remain defined by content/pages/branding/characters.mdx
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
    "old-macdonald": "/characters/full-body-transparent/old-macdonald-transparent-circle.webp",
    "miss-puddles": "/characters/full-body-transparent/miss-puddles-transparent-circle.webp",
    "mr-rusty": "/characters/full-body-transparent/mr-rusty-transparent-circle.webp",
    "miss-hayley": "/characters/full-body-transparent/miss-hayley-transparent-circle.webp",
    "mr-sam": "/characters/full-body-transparent/mr-sam-clean-v2.webp",
    "mr-maisy": "/characters/full-body-transparent/mr-maisy-transparent-circle.webp",
    "mr-puddles": "/characters/full-body-transparent/mr-puddles-transparent-circle.webp",
    "miss-maisy": "/characters/full-body-transparent/miss-maisy-transparent-circle.webp",
    hopper: "/characters/full-body-transparent/hopper-transparent-circle.webp",
    whiskers: "/characters/full-body-transparent/whiskers-transparent-circle.webp",
    scout: "/characters/full-body-transparent/scout-transparent-circle.webp",
    penny: "/characters/full-body-transparent/penny-transparent-circle.webp",
    maisy: "/characters/full-body-transparent/maisy-transparent-circle.webp",
    puddles: "/characters/full-body-transparent/puddles-transparent-circle.webp",
    sam: "/characters/full-body-transparent/sam-transparent-circle.webp",
    rusty: "/characters/full-body-transparent/rusty-transparent-circle.webp",
  },
  badges: {
    "old-macdonald": "/characters/high-res-cloth/01-old-macdonald-badge.webp",
    "miss-puddles": "/characters/high-res-cloth/02-miss-puddles-badge.webp",
    "mr-rusty": "/characters/high-res-cloth/03-mr-rusty-badge.webp",
    "miss-hayley": "/characters/high-res-cloth/04-miss-hayley-badge.webp",
    "mr-sam": "/characters/high-res-cloth/05-mr-sam-badge.webp",
    "mr-maisy": "/characters/high-res-cloth/06-mr-maisy-badge.webp",
    "mr-puddles": "/characters/high-res-cloth/07-mr-puddles-badge.webp",
    "miss-maisy": "/characters/high-res-cloth/08-miss-maisy-badge.webp",
    hopper: "/characters/high-res-cloth/09-hopper-badge.webp",
    whiskers: "/characters/high-res-cloth/10-whiskers-badge.webp",
    scout: "/characters/high-res-cloth/11-scout-badge.webp",
    penny: "/characters/high-res-cloth/12-penny-badge.webp",
    maisy: "/characters/high-res-cloth/13-maisy-badge.webp",
    puddles: "/characters/high-res-cloth/14-puddles-badge.webp",
    sam: "/characters/high-res-cloth/15-sam-badge.webp",
    rusty: "/characters/high-res-cloth/16-rusty-badge.webp",
  },
  facePatches: {
    "old-macdonald": "/characters/face-patch-transparent/old-macdonald-yellow.webp",
    "miss-puddles": "/characters/face-patch-transparent/miss-puddles-purple.webp",
    "mr-rusty": "/characters/face-patch-transparent/mr-rusty-blue.webp",
    "miss-hayley": "/characters/face-patch-transparent/miss-hayley-purple.webp",
    "mr-sam": "/characters/face-patch-transparent/mr-sam-clean-v2.webp",
    "mr-maisy": "/characters/face-patch-transparent/mr-maisy-orange.webp",
    "mr-puddles": "/characters/face-patch-transparent/mr-puddles-green.webp",
    "miss-maisy": "/characters/face-patch-transparent/miss-maisy-purple.webp",
    hopper: "/characters/face-patch-transparent/hopper-red.webp",
    whiskers: "/characters/face-patch-transparent/whiskers-orange.webp",
    scout: "/characters/face-patch-transparent/scout-green.webp",
    penny: "/characters/face-patch-transparent/penny-orange.webp",
    maisy: "/characters/face-patch-transparent/maisy-yellow.webp",
    puddles: "/characters/face-patch-transparent/puddles-blue.webp",
    sam: "/characters/face-patch-transparent/sam-red.webp",
    rusty: "/characters/face-patch-transparent/rusty-blue.webp",
  },
  faceBusts: {
    "old-macdonald": "/characters/face-patches-background-circle/old-macdonald-yellow.webp",
    "miss-puddles": "/characters/face-patches-background-circle/miss-puddles-purple.webp",
    "mr-rusty": "/characters/face-patches-background-circle/mr-rusty-blue.webp",
    "miss-hayley": "/characters/face-patches-background-circle/miss-hayley-purple.webp",
    "mr-sam": "/characters/face-patches-background-circle/mr-sam-clean-v2.webp",
    "mr-maisy": "/characters/face-patches-background-circle/mr-maisy-orange.webp",
    "mr-puddles": "/characters/face-patches-background-circle/mr-puddles-green.webp",
    "miss-maisy": "/characters/face-patches-background-circle/miss-maisy-purple.webp",
    hopper: "/characters/face-patches-background-circle/hopper-red.webp",
    whiskers: "/characters/face-patches-background-circle/whiskers-orange.webp",
    scout: "/characters/face-patches-background-circle/scout-green.webp",
    penny: "/characters/face-patches-background-circle/penny-orange.webp",
    maisy: "/characters/face-patches-background-circle/maisy-yellow.webp",
    puddles: "/characters/face-patches-background-circle/puddles-blue.webp",
    sam: "/characters/face-patches-background-circle/sam-red.webp",
    rusty: "/characters/face-patches-background-circle/rusty-blue.webp",
  },
  scenes: {
    "old-macs-open-circle-gathering": "/hero/old-macs-open-circle-gathering.webp",
    "clap-your-hands-2": "/worksheets/clap-your-hands-2.webp",
  },
} as const;

export type CharacterPortraitKey = keyof typeof BRAND_IMAGE_ASSETS.portraits;
export type CharacterFacePatchKey = keyof typeof BRAND_IMAGE_ASSETS.facePatches;
export type CharacterFaceBustKey = keyof typeof BRAND_IMAGE_ASSETS.faceBusts;
export type SceneAssetKey = keyof typeof BRAND_IMAGE_ASSETS.scenes;
