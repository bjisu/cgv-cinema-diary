import { describe, expect, it } from "vitest";
import { getLevel, getLevelProgress, getNewlyUnlockedBadges, getPeriodCounts } from "./progression";
import type { DiaryEntry, Genre } from "@/types";

const entry = (genre: Genre, watchedAt = "2026-08-02T19:20"): DiaryEntry => ({
  id: Math.random().toString(36).slice(2),
  movieId: "m01",
  title: "테스트",
  posterUrl: "m01",
  watchedAt,
  theater: "용산아이파크몰",
  screen: "5관",
  genre,
  source: "manual",
  createdAt: watchedAt,
});

describe("getLevel", () => {
  it("기록이 없으면 Lv.0", () => {
    expect(getLevel(0)).toBe(0);
  });

  it("PRD §5.1 경계값에서 레벨이 오른다", () => {
    expect(getLevel(1)).toBe(1);
    expect(getLevel(2)).toBe(1);
    expect(getLevel(3)).toBe(2);
    expect(getLevel(7)).toBe(3);
    expect(getLevel(12)).toBe(4);
    expect(getLevel(24)).toBe(5);
    expect(getLevel(40)).toBe(6);
  });

  it("최대 레벨을 넘지 않는다", () => {
    expect(getLevel(999)).toBe(6);
  });
});

describe("getLevelProgress", () => {
  it("다음 레벨까지 남은 편수를 계산한다", () => {
    const p = getLevelProgress(20);
    expect(p.level).toBe(4);
    expect(p.next?.level).toBe(5);
    expect(p.remain).toBe(4);
    expect(p.ratio).toBeCloseTo((20 - 12) / (24 - 12));
  });

  it("만렙이면 진행률 100%", () => {
    const p = getLevelProgress(40);
    expect(p.level).toBe(6);
    expect(p.ratio).toBe(1);
    expect(p.remain).toBe(0);
  });
});

describe("getNewlyUnlockedBadges", () => {
  it("장르 1편이면 입문 뱃지가 해금된다", () => {
    const found = getNewlyUnlockedBadges([entry("액션")], []);
    expect(found.map((b) => b.id)).toEqual(["액션-intro"]);
  });

  it("장르 3편이면 팬 뱃지가 추가 해금된다", () => {
    const entries = [entry("액션"), entry("액션"), entry("액션")];
    const found = getNewlyUnlockedBadges(entries, ["액션-intro"]);
    expect(found.map((b) => b.id)).toEqual(["액션-fan"]);
  });

  it("이미 획득한 뱃지는 다시 반환하지 않는다", () => {
    const found = getNewlyUnlockedBadges([entry("드라마")], ["드라마-intro"]);
    expect(found).toHaveLength(0);
  });
});

describe("getPeriodCounts", () => {
  it("이번 달/올해 편수를 구분한다", () => {
    const now = new Date("2026-08-15T00:00");
    const entries = [
      entry("액션", "2026-08-02T19:20"),
      entry("드라마", "2026-07-11T14:00"),
      entry("SF", "2025-12-25T18:30"),
    ];
    expect(getPeriodCounts(entries, now)).toEqual({ month: 1, year: 2 });
  });
});
