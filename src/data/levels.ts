import type { LevelRule } from "@/types";

/** PRD §5.1 — 파코니 레벨·칭호 규칙 (누적 관람 편수 기준) */
export const LEVELS: LevelRule[] = [
  { level: 1, required: 1, titleName: "첫 관람" },
  { level: 2, required: 3, titleName: "영화 새싹" },
  { level: 3, required: 7, titleName: "극장 단골" },
  { level: 4, required: 12, titleName: "시네필" },
  { level: 5, required: 24, titleName: "시네마 마니아" },
  { level: 6, required: 40, titleName: "파코니 마스터" },
];

export const MAX_LEVEL = LEVELS[LEVELS.length - 1].level;
