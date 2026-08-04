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

/**
 * 파코니 캐릭터 이미지 매핑.
 * 레벨별로 다른 이미지를 쓰려면 **이 파일만** 고치면 된다. 화면 코드는 전부
 * `getPaconyImage(level)` 를 통해서만 경로를 가져온다.
 *
 * 현재는 Lv.0~6 전 레벨이 `/pacony.png` 하나를 공유한다.
 * 예) Lv.6 전용 이미지를 넣고 싶다면 `6: "/pacony-lv6.png"` 로 바꾸면 끝.
 */
export const PACONY_IMAGE_DEFAULT = "/pacony.png";

export const PACONY_IMAGE_BY_LEVEL: Record<number, string> = {
  0: PACONY_IMAGE_DEFAULT,
  1: PACONY_IMAGE_DEFAULT,
  2: PACONY_IMAGE_DEFAULT,
  3: PACONY_IMAGE_DEFAULT,
  4: PACONY_IMAGE_DEFAULT,
  5: PACONY_IMAGE_DEFAULT,
  6: PACONY_IMAGE_DEFAULT,
};

/** 레벨에 해당하는 파코니 이미지 경로. 매핑에 없으면 기본 이미지로 폴백. */
export function getPaconyImage(level: number): string {
  return PACONY_IMAGE_BY_LEVEL[level] ?? PACONY_IMAGE_DEFAULT;
}
