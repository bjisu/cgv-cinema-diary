"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import BottomSheet from "@/components/ui/BottomSheet";
import Poster from "@/components/ui/Poster";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/Toast";
import { GENRES } from "@/data/badges";
import { MAX_LEVEL } from "@/data/levels";
import { MOVIES, getMovie } from "@/data/movies";
import { fromDateTimeInput } from "@/lib/format";
import { getLevel, getNewlyUnlockedBadges } from "@/lib/progression";
import {
  CLOSE_TIME,
  OPEN_TIME,
  isFutureDate,
  isWithinOperatingHours,
  todayInputValue,
} from "@/lib/theater";
import { useDiaryStore } from "@/store/useDiaryStore";
import { emptyDraft, useDraftStore } from "@/store/useDraftStore";
import type { Genre } from "@/types";

/** PRD §8 화면 04 — 자동 기입 결과 (FR-04, FR-05, FR-06) */
export default function VerifyResultPage() {
  const router = useRouter();
  const draft = useDraftStore((s) => s.draft);
  const clearDraft = useDraftStore((s) => s.clearDraft);

  const entries = useDiaryStore((s) => s.entries);
  const addEntry = useDiaryStore((s) => s.addEntry);
  const unlockedBadges = useDiaryStore((s) => s.unlockedBadges);
  const unlockBadges = useDiaryStore((s) => s.unlockBadges);
  const seenLevelUps = useDiaryStore((s) => s.seenLevelUps);
  const showToast = useToast((s) => s.show);

  const source = draft?.source ?? "manual";
  const auto = draft?.auto ?? false;

  // 자동 기입 연출: 값은 위에서부터 순차적으로 채워진다
  const [form, setForm] = useState(() => (auto ? emptyDraft() : (draft ?? emptyDraft())));
  const [filledStep, setFilledStep] = useState(auto ? 0 : 99);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!auto || !draft) return;
    const steps: Array<() => void> = [
      () => setForm((f) => ({ ...f, movieId: draft.movieId, genre: draft.genre })),
      () => setForm((f) => ({ ...f, date: draft.date, time: draft.time })),
      () => setForm((f) => ({ ...f, theater: draft.theater })),
      () => setForm((f) => ({ ...f, screen: draft.screen })),
      () => setForm((f) => ({ ...f, seat: draft.seat })),
    ];
    steps.forEach((run, i) => {
      timers.current.push(
        setTimeout(() => {
          run();
          setFilledStep(i + 1);
        }, 260 * (i + 1)),
      );
    });
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [auto, draft]);

  const movie = getMovie(form.movieId);
  const filteredMovies = useMemo(
    () => MOVIES.filter((m) => m.title.replace(/\s/g, "").includes(query.replace(/\s/g, ""))),
    [query],
  );

  const maxDate = todayInputValue();
  const canSave = !!form.movieId && !!form.date && !!form.genre;

  const handleSave = () => {
    if (!canSave) {
      showToast("영화와 관람일시를 입력해 주세요");
      return;
    }
    // 미래 날짜·운영 시간 외 관람은 기록할 수 없다
    if (isFutureDate(form.date)) {
      showToast("아직 보지 않은 날짜예요. 오늘까지만 기록할 수 있어요");
      return;
    }
    if (!isWithinOperatingHours(form.time)) {
      showToast(`상영 시간은 ${OPEN_TIME}~${CLOSE_TIME} 사이로 입력해 주세요`);
      return;
    }

    const watchedAt = fromDateTimeInput(form.date, form.time);
    const entry = addEntry({
      movieId: form.movieId,
      title: movie?.title ?? "",
      posterUrl: movie?.posterUrl ?? "",
      watchedAt,
      theater: form.theater.trim() || "용산아이파크몰",
      screen: form.screen.trim() || "1관",
      seat: form.seat.trim() || undefined,
      genre: form.genre as Genre,
      source,
    });

    const nextEntries = [entry, ...entries];
    const prevLevel = getLevel(entries.length);
    const nextLevel = getLevel(nextEntries.length);

    const newBadges = getNewlyUnlockedBadges(nextEntries, unlockedBadges);
    if (newBadges.length > 0) unlockBadges(newBadges.map((b) => b.id));

    clearDraft();

    // FR-06 분기: 레벨업 > 새 뱃지 > 홈
    if (nextLevel > prevLevel && !seenLevelUps.includes(nextLevel)) {
      router.replace(`/diary/levelup?level=${nextLevel}&count=${nextEntries.length}`);
      return;
    }
    if (newBadges.length > 0) {
      router.replace(`/diary/badges?new=${encodeURIComponent(newBadges[0].id)}`);
      return;
    }
    showToast("다이어리에 저장했어요 🍿");
    router.replace("/diary");
  };

  return (
    <MobileContainer>
      <div className="min-h-screen pb-10">
        <AppHeader title="관람 기록 완료" onBack={() => router.push("/diary/verify")} />

        {/* 파코니 말풍선 */}
        <div className="flex items-center gap-3 px-5 pt-2">
          <PaconiCharacter level={MAX_LEVEL} size={44} />
          <p className="rounded-card rounded-bl-[4px] bg-cgv-gray-100 px-4 py-3 text-body text-cgv-black">
            {auto ? "자동으로 기입했어! 저장할까? 🍿" : "직접 기록해줘! 🍿"}
          </p>
        </div>

        {/* 기록 카드 (수정 가능 폼) */}
        <div className="mt-5 flex flex-col gap-4 px-5">
          <Field label="영화" highlight={filledStep === 1}>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex h-[52px] w-full items-center gap-3 rounded-btn border border-black/10 px-3 text-left"
            >
              {movie ? (
                <>
                  <Poster movieId={movie.id} sizes="28px" className="w-[28px] shrink-0" />
                  <span className="flex-1 truncate text-body text-cgv-black">{movie.title}</span>
                </>
              ) : (
                <span className="flex-1 text-body text-cgv-gray-400">영화를 선택하세요</span>
              )}
              <ChevronDown size={18} className="shrink-0 text-cgv-gray-400" />
            </button>
          </Field>

          <Field label="관람일시" highlight={filledStep === 2}>
            <div className="flex gap-2">
              <input
                type="date"
                value={form.date}
                max={maxDate}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isFutureDate(v)) return; // 미래 날짜 선택 차단
                  setForm((f) => ({ ...f, date: v }));
                }}
                className="h-[52px] flex-1 rounded-btn border border-black/10 px-3 text-body text-cgv-black"
              />
              <input
                type="time"
                value={form.time}
                min={OPEN_TIME}
                max={CLOSE_TIME}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={`h-[52px] w-[120px] rounded-btn border px-3 text-body text-cgv-black ${
                  form.time && !isWithinOperatingHours(form.time)
                    ? "border-cgv-red"
                    : "border-black/10"
                }`}
              />
            </div>
            <p
              className={`mt-1.5 text-sub ${
                form.time && !isWithinOperatingHours(form.time)
                  ? "text-cgv-red"
                  : "text-cgv-gray-400"
              }`}
            >
              오늘까지의 날짜만, 상영 시간은 {OPEN_TIME}~{CLOSE_TIME} 사이로 입력할 수 있어요
            </p>
          </Field>

          <Field label="극장" highlight={filledStep === 3}>
            <TextInput
              value={form.theater}
              onChange={(v) => setForm((f) => ({ ...f, theater: v }))}
              placeholder="용산아이파크몰"
            />
          </Field>

          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="상영관" highlight={filledStep === 4}>
                <TextInput
                  value={form.screen}
                  onChange={(v) => setForm((f) => ({ ...f, screen: v }))}
                  placeholder="5관"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="좌석" highlight={filledStep === 5}>
                <TextInput
                  value={form.seat}
                  onChange={(v) => setForm((f) => ({ ...f, seat: v }))}
                  placeholder="H12"
                />
              </Field>
            </div>
          </div>

          <Field label="장르">
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => {
                const active = form.genre === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, genre: g }))}
                    className={`h-9 rounded-full px-3.5 text-sub ${
                      active
                        ? "bg-cgv-black font-bold text-cgv-white"
                        : "border border-black/10 text-cgv-gray-600"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="px-5 pt-8">
          <Hydrated>
            <PrimaryButton onClick={handleSave}>다이어리에 저장</PrimaryButton>
          </Hydrated>
        </div>
      </div>

      {/* 영화 선택 (검색 가능) */}
      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="영화 선택">
        <div className="flex h-11 items-center gap-2 rounded-btn bg-cgv-gray-100 px-3">
          <Search size={18} className="text-cgv-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영화 제목 검색"
            className="h-full flex-1 bg-transparent text-body text-cgv-black outline-none placeholder:text-cgv-gray-400"
          />
        </div>
        <ul className="mt-3 flex flex-col gap-2 pb-2">
          {filteredMovies.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, movieId: m.id, genre: m.genre }));
                  setPickerOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-btn p-2 text-left"
              >
                <Poster movieId={m.id} sizes="38px" className="w-[38px] shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-bold text-cgv-black">
                    {m.title}
                  </span>
                  <span className="mt-0.5 block text-sub text-cgv-gray-600">
                    {m.genre} · {m.runtime}분
                  </span>
                </span>
              </button>
            </li>
          ))}
          {filteredMovies.length === 0 && (
            <li className="py-6 text-center text-body text-cgv-gray-400">검색 결과가 없어요</li>
          )}
        </ul>
      </BottomSheet>
    </MobileContainer>
  );
}

function Field({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sub text-cgv-gray-600">{label}</p>
      <div className={highlight ? "animate-pulse" : ""}>{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-btn border border-black/10 px-3 text-body text-cgv-black placeholder:text-cgv-gray-400"
    />
  );
}
