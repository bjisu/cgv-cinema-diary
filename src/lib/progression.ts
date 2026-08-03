import { BADGES } from "@/data/badges";
import { LEVELS, MAX_LEVEL } from "@/data/levels";
import type { BadgeRule, DiaryEntry, Genre, LevelRule } from "@/types";

/** PRD §5.1 — 누적 편수 → 레벨. 1편 미만은 Lv.0(레벨 없음)으로 본다. */
export function getLevel(count: number): number {
  let level = 0;
  for (const rule of LEVELS) {
    if (count >= rule.required) level = rule.level;
  }
  return level;
}

export function getLevelRule(level: number): LevelRule | undefined {
  return LEVELS.find((l) => l.level === level);
}

/** 현재 칭호 (Lv.0이면 '관람 대기') */
export function getTitleName(count: number): string {
  const rule = getLevelRule(getLevel(count));
  return rule?.titleName ?? "관람 대기";
}

/** 다음 레벨까지의 진행 정보 — GradeBar 재사용용 */
export function getLevelProgress(count: number): {
  level: number;
  titleName: string;
  next?: LevelRule;
  /** 0~1 */
  ratio: number;
  /** 다음 레벨까지 남은 편수 */
  remain: number;
} {
  const level = getLevel(count);
  const titleName = getTitleName(count);
  const next = LEVELS.find((l) => l.level === level + 1);

  if (!next || level >= MAX_LEVEL) {
    return { level, titleName, ratio: 1, remain: 0 };
  }

  const base = getLevelRule(level)?.required ?? 0;
  const span = next.required - base;
  const ratio = span <= 0 ? 1 : Math.min(1, Math.max(0, (count - base) / span));
  return { level, titleName, next, ratio, remain: Math.max(0, next.required - count) };
}

/** 장르별 관람 편수 (편수 내림차순) */
export function getGenreCounts(entries: DiaryEntry[]): { genre: Genre; count: number }[] {
  const map = new Map<Genre, number>();
  for (const e of entries) {
    map.set(e.genre, (map.get(e.genre) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

/** 현재 기록 기준으로 조건을 만족하는 모든 뱃지 id */
export function getEarnedBadgeIds(entries: DiaryEntry[]): string[] {
  const counts = new Map<Genre, number>();
  for (const e of entries) {
    counts.set(e.genre, (counts.get(e.genre) ?? 0) + 1);
  }
  return BADGES.filter((b) => (counts.get(b.genre) ?? 0) >= b.required).map((b) => b.id);
}

/** PRD §10 — 이번 저장으로 새로 해금된 뱃지 (이미 획득한 것 제외) */
export function getNewlyUnlockedBadges(entries: DiaryEntry[], unlocked: string[]): BadgeRule[] {
  const owned = new Set(unlocked);
  return BADGES.filter((b) => !owned.has(b.id) && getEarnedBadgeIds(entries).includes(b.id));
}

/** 이번 달 / 올해 관람 편수 */
export function getPeriodCounts(
  entries: DiaryEntry[],
  now: Date = new Date(),
): { month: number; year: number } {
  const y = now.getFullYear();
  const m = now.getMonth();
  let month = 0;
  let year = 0;
  for (const e of entries) {
    const d = new Date(e.watchedAt);
    if (Number.isNaN(d.getTime())) continue;
    if (d.getFullYear() === y) {
      year += 1;
      if (d.getMonth() === m) month += 1;
    }
  }
  return { month, year };
}
