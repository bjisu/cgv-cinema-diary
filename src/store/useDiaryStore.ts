"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CINETALK_POSTS } from "@/data/cinetalk";
import { MOVIES } from "@/data/movies";
import { getEarnedBadgeIds } from "@/lib/progression";
import type { CinetalkPost, DiaryEntry } from "@/types";

export const STORAGE_KEY = "cgv-cinema-diary";

export interface DiaryState {
  nickname: string;
  cjGrade: "일반";
  points: number;
  nfcTagged: boolean;
  onboarded: boolean;
  entries: DiaryEntry[];
  unlockedBadges: string[];
  seenLevelUps: number[];
  posts: CinetalkPost[];

  addEntry: (entry: Omit<DiaryEntry, "id" | "createdAt">) => DiaryEntry;
  removeEntry: (id: string) => void;
  setNickname: (name: string) => void;
  markNfcTagged: () => void;
  markOnboarded: () => void;
  markLevelUpSeen: (level: number) => void;
  unlockBadges: (ids: string[]) => void;
  addPost: (post: Omit<CinetalkPost, "id" | "createdAt">) => void;
  resetDemo: () => void;
}

/** PRD §5.3 — 최초 방문 시 시연용 기록 2건 시드 */
function seedEntries(): DiaryEntry[] {
  const base: Array<Pick<DiaryEntry, "movieId" | "watchedAt" | "theater" | "screen" | "seat">> = [
    {
      movieId: "m03",
      watchedAt: "2026-07-18T19:20",
      theater: "용산아이파크몰",
      screen: "5관",
      seat: "H12",
    },
    {
      movieId: "m06",
      watchedAt: "2026-07-05T16:40",
      theater: "왕십리",
      screen: "2관",
      seat: "D07",
    },
  ];

  return base.map((b, i) => {
    const movie = MOVIES.find((m) => m.id === b.movieId)!;
    return {
      ...b,
      id: `seed-${i + 1}`,
      title: movie.title,
      posterUrl: movie.id,
      genre: movie.genre,
      source: "booking" as const,
      createdAt: b.watchedAt,
    };
  });
}

function initialState() {
  const entries = seedEntries();
  return {
    nickname: "파코니팬6671",
    cjGrade: "일반" as const,
    points: 745,
    nfcTagged: false,
    onboarded: false,
    entries,
    unlockedBadges: getEarnedBadgeIds(entries),
    seenLevelUps: [] as number[],
    posts: CINETALK_POSTS,
  };
}

/** id 생성 — crypto.randomUUID가 없는 구형 브라우저 대비 (NFR-02) */
function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      addEntry: (input) => {
        const entry: DiaryEntry = {
          ...input,
          id: makeId(),
          createdAt: new Date().toISOString(),
        };
        set({ entries: [entry, ...get().entries] });
        return entry;
      },

      removeEntry: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),

      setNickname: (nickname) => set({ nickname }),
      markNfcTagged: () => set({ nfcTagged: true }),
      markOnboarded: () => set({ onboarded: true }),

      markLevelUpSeen: (level) =>
        set({ seenLevelUps: [...new Set([...get().seenLevelUps, level])] }),

      unlockBadges: (ids) =>
        set({ unlockedBadges: [...new Set([...get().unlockedBadges, ...ids])] }),

      addPost: (post) =>
        set({
          posts: [
            { ...post, id: makeId(), createdAt: new Date().toISOString() },
            ...get().posts,
          ],
        }),

      // FR-13 데모 데이터 초기화
      resetDemo: () => set({ ...initialState(), onboarded: true }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // NFR-03 — 저장값이 깨져도 앱이 죽지 않고 시드로 복구
      merge: (persisted, current) => {
        try {
          const p = persisted as Partial<DiaryState> | undefined;
          if (!p || !Array.isArray(p.entries)) return current;
          return { ...current, ...p };
        } catch {
          return current;
        }
      },
    },
  ),
);

/** SSR/hydration 불일치 방지용 — persist rehydrate 완료 여부 */
export function useHydrated(): boolean {
  return useDiaryStore.persist?.hasHydrated?.() ?? true;
}
