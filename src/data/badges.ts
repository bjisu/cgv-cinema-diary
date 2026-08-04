import type { BadgeRule, BadgeTier, Genre } from "@/types";

export const GENRES: Genre[] = [
  "액션",
  "드라마",
  "SF",
  "코미디",
  "로맨스",
  "스릴러",
  "애니메이션",
  "공포",
];

/** PRD §5.2 — 장르 뱃지 티어 */
const TIERS: { tier: BadgeTier; required: number; label: string }[] = [
  { tier: "intro", required: 1, label: "입문" },
  { tier: "fan", required: 3, label: "팬" },
  { tier: "master", required: 7, label: "마스터" },
];

export const BADGES: BadgeRule[] = GENRES.flatMap((genre) =>
  TIERS.map(({ tier, required, label }) => ({
    id: `${genre}-${tier}`,
    genre,
    tier,
    required,
    name: `${genre} ${label}`,
  })),
);

export const getBadge = (id: string) => BADGES.find((b) => b.id === id);
