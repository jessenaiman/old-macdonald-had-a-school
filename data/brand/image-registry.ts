/**
 * Runtime image URLs used by TypeScript/Next Image consumers.
 *
 * CSS background assets remain in app/brand-assets.css. Keeping content and
 * component URLs here prevents individual components from inventing public
 * paths while preserving the existing optimized WebP/PNG assets.
 *
 * This registry exposes available files. Character meaning, color meaning, grade
 * routing, and subject routing remain defined by DESIGN.md
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
    "old-macdonald": "/characters/full-body-transparent/old-macdonald-fullbody.webp",
    "miss-puddles": "/characters/full-body-transparent/miss-puddles-fullbody.webp",
    "mr-rusty": "/characters/full-body-transparent/mr-rusty-fullbody.webp",
    "miss-hayley": "/characters/full-body-transparent/miss-hayley-fullbody.webp",
    "mr-sam": "/characters/full-body-transparent/mr-sam-fullbody.webp",
    "mr-maisy": "/characters/full-body-transparent/mr-maisy-fullbody.webp",
    "mr-puddles": "/characters/full-body-transparent/mr-puddles-fullbody.webp",
    "miss-maisy": "/characters/full-body-transparent/miss-maisy-fullbody.webp",
    hopper: "/characters/full-body-transparent/hopper-fullbody.webp",
    whiskers: "/characters/full-body-transparent/whiskers-fullbody.webp",
    scout: "/characters/full-body-transparent/scout-fullbody.webp",
    penny: "/characters/full-body-transparent/penny-fullbody.webp",
    maisy: "/characters/full-body-transparent/maisy-fullbody.webp",
    puddles: "/characters/full-body-transparent/puddles-fullbody.webp",
    sam: "/characters/full-body-transparent/sam-fullbody.webp",
    rusty: "/characters/full-body-transparent/rusty-fullbody.webp",
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
    "old-macdonald": "/characters/face-patch-transparent/old-macdonald.webp",
    "miss-puddles": "/characters/face-patch-transparent/miss-puddles.webp",
    "mr-rusty": "/characters/face-patch-transparent/mr-rusty.webp",
    "miss-hayley": "/characters/face-patch-transparent/miss-hayley.webp",
    "mr-sam": "/characters/face-patch-transparent/mr-sam.webp",
    "mr-maisy": "/characters/face-patch-transparent/mr-maisy.webp",
    "mr-puddles": "/characters/face-patch-transparent/mr-puddles.webp",
    "miss-maisy": "/characters/face-patch-transparent/miss-maisy.webp",
    hopper: "/characters/face-patch-transparent/hopper.webp",
    whiskers: "/characters/face-patch-transparent/whiskers.webp",
    scout: "/characters/face-patch-transparent/scout.webp",
    penny: "/characters/face-patch-transparent/penny.webp",
    maisy: "/characters/face-patch-transparent/maisy.webp",
    puddles: "/characters/face-patch-transparent/puddles.webp",
    sam: "/characters/face-patch-transparent/sam.webp",
    rusty: "/characters/face-patch-transparent/rusty.webp",
  },
  scenes: {
    "old-macs-open-circle-gathering": "/hero/old-macs-open-circle-gathering.webp",
    "clap-your-hands-2": "/worksheets/clap-your-hands-2.webp",
  },
} as const;

export type CharacterPortraitKey = keyof typeof BRAND_IMAGE_ASSETS.portraits;
export type CharacterFacePatchKey = keyof typeof BRAND_IMAGE_ASSETS.facePatches;
export type SceneAssetKey = keyof typeof BRAND_IMAGE_ASSETS.scenes;
