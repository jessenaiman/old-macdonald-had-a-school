// Transparent, no-backing character busts. Unknown keys deliberately return
// null so callers never substitute a different character or an old baked
// patch as a visual fallback.
const BUST_FILE: Record<string, string> = {
  "old-macdonald": "old-mac",
  "miss-puddles": "miss-puddles",
  "mr-rusty": "mr-rusty",
  "miss-hayley": "miss-hayley",
  "mr-sam": "mr-sam",
  "mr-maisy": "mr-maisy",
  "mr-puddles": "mr-puddles",
  "miss-maisy": "miss-maisy",
  hopper: "hopper",
  maisy: "maisy",
  penny: "penny",
  puddles: "puddles",
  sam: "sam",
  scout: "scout",
  whiskers: "whiskers",
  rusty: "rusty",
};

export function bustPath(key: string): string | null {
  const file = BUST_FILE[key];
  return file ? `/icons/staff/${file}.png` : null;
}

export function iconPath(key: string): string | null {
  return bustPath(key);
}

export function iconPathSmall(key: string): string | null {
  return bustPath(key);
}

// The full-body transparent portrait remains available for genuinely large,
// single-character moments.
export function portraitPath(key: string): string {
  return `/portraits/${key}-transparent-circle.png`;
}
