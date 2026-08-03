"use client";

import { create } from "zustand";
import type { EntrySource, Genre } from "@/types";

/** /diary/verify → /diary/verify/result 로 넘기는 임시 입력값 (저장 전이므로 persist 안 함) */
export interface Draft {
  movieId: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  theater: string;
  screen: string;
  seat: string;
  genre: Genre | "";
  source: EntrySource;
  /** 자동 기입(OCR 시뮬레이션)으로 채워졌는지 — 타이핑 연출 여부 결정 */
  auto: boolean;
}

interface DraftState {
  draft: Draft | null;
  setDraft: (draft: Draft) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));

export const emptyDraft = (): Draft => ({
  movieId: "",
  date: "",
  time: "",
  theater: "용산아이파크몰",
  screen: "5관",
  seat: "",
  genre: "",
  source: "manual",
  auto: false,
});
