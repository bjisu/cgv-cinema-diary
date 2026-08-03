"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import BottomSheet from "@/components/ui/BottomSheet";
import Poster from "@/components/ui/Poster";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/Toast";
import { formatStamp, formatWatchedAt, getMonth, getYear } from "@/lib/format";
import { useDiaryStore } from "@/store/useDiaryStore";
import type { DiaryEntry } from "@/types";
import { useRouter } from "next/navigation";

const SOURCE_LABEL: Record<DiaryEntry["source"], string> = {
  photo: "종이 티켓 촬영",
  mobile: "모바일 영화표",
  booking: "예매내역 불러오기",
  manual: "직접 입력",
};

/** PRD §8 화면 07 — 다이어리 아카이브 (FR-09) */
export default function ArchivePage() {
  const router = useRouter();
  const entries = useDiaryStore((s) => s.entries);
  const removeEntry = useDiaryStore((s) => s.removeEntry);
  const showToast = useToast((s) => s.show);

  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState<number | "all">("all");
  const [selected, setSelected] = useState<DiaryEntry | null>(null);

  const years = useMemo(() => {
    const set = new Set<number>(entries.map((e) => getYear(e.watchedAt)));
    set.add(thisYear);
    return [...set].filter((y) => !Number.isNaN(y)).sort((a, b) => b - a);
  }, [entries, thisYear]);

  const yearEntries = useMemo(
    () =>
      entries
        .filter((e) => getYear(e.watchedAt) === year)
        .sort((a, b) => b.watchedAt.localeCompare(a.watchedAt)),
    [entries, year],
  );

  const filtered = useMemo(
    () => (month === "all" ? yearEntries : yearEntries.filter((e) => getMonth(e.watchedAt) === month)),
    [yearEntries, month],
  );

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="마이 무비 다이어리" onBack={() => router.push("/diary")} />

        <Hydrated fallback={<div className="h-[200px]" />}>
          {/* 대형 카운터 + 연도 셀렉터 */}
          <div className="flex items-end justify-between px-5 pt-3">
            <div>
              <p className="text-number-big font-extrabold leading-none text-cgv-black">
                {yearEntries.length} <span className="text-[24px]">편</span>
              </p>
              <p className="mt-2 text-body text-cgv-gray-600">{year}년 관람 기록</p>
            </div>
            <YearSelect years={years} value={year} onChange={setYear} />
          </div>

          {/* 월 필터 칩 */}
          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
            {(["all", ...Array.from({ length: 12 }, (_, i) => i + 1)] as const).map((m) => {
              const active = month === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonth(m as number | "all")}
                  className={`h-9 shrink-0 rounded-full px-4 text-[14px] leading-none ${
                    active
                      ? "bg-cgv-black font-bold text-cgv-white"
                      : "border border-[#D9D9D9] text-cgv-gray-600"
                  }`}
                >
                  {m === "all" ? "전체" : `${m}월`}
                </button>
              );
            })}
          </div>

          {/* 포스터 그리드 */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14">
              <PaconiCharacter level={0} size={104} />
              <p className="mt-4 text-body text-cgv-gray-600">
                아직 기록이 없어요. 영화표를 인증해 보세요!
              </p>
              <div className="mt-5 w-full">
                <PrimaryButton onClick={() => router.push("/diary/verify")}>
                  영화표로 기록하기
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-3 gap-3 px-5 pt-6">
              {filtered.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className="w-full text-left"
                    aria-label={`${e.title} 기록 상세`}
                  >
                    <Poster movieId={e.movieId} sizes="140px" />
                    <p className="mt-1.5 text-center text-caption text-cgv-gray-600">
                      {formatStamp(e.watchedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Hydrated>
      </div>

      {/* 상세 바텀시트 */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title="관람 기록">
        {selected && (
          <div className="pb-2">
            <div className="flex gap-4">
              <Poster movieId={selected.movieId} sizes="92px" className="w-[92px] shrink-0" />
              <dl className="flex-1 text-sub">
                <p className="text-h2 font-bold text-cgv-black">{selected.title}</p>
                <div className="mt-3 flex flex-col gap-1.5 text-cgv-gray-600">
                  <Row label="관람일시" value={formatWatchedAt(selected.watchedAt)} />
                  <Row label="극장" value={`${selected.theater} · ${selected.screen}`} />
                  {selected.seat && <Row label="좌석" value={selected.seat} />}
                  <Row label="장르" value={selected.genre} />
                  <Row label="기록 방식" value={SOURCE_LABEL[selected.source]} />
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!confirm("이 기록을 삭제할까요?")) return;
                removeEntry(selected.id);
                setSelected(null);
                showToast("기록을 삭제했어요");
              }}
              className="mt-6 h-[52px] w-full rounded-btn border border-black/10 text-[15px] font-bold text-cgv-gray-600"
            >
              기록 삭제
            </button>
          </div>
        )}
      </BottomSheet>

      <BottomTab active="more" />
    </MobileContainer>
  );
}

/**
 * 연도 선택 — native select 는 기본 화살표 때문에 좌우 패딩을 제어할 수 없어
 * 버튼형 드롭다운으로 직접 구현한다. (pill: 흰 배경 / 1px #D9D9D9 / h-36 / 14px)
 */
function YearSelect({
  years,
  value,
  onChange,
}: {
  years: number[];
  value: number;
  onChange: (y: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="연도 선택"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-full border border-[#D9D9D9] bg-cgv-white px-4 text-[14px] leading-none text-cgv-black"
      >
        {value}년
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`text-cgv-black transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul className="absolute right-0 top-[42px] z-20 min-w-[104px] overflow-hidden rounded-btn border border-[#D9D9D9] bg-cgv-white py-1">
            {years.map((y) => (
              <li key={y}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(y);
                    setOpen(false);
                  }}
                  className={`flex h-10 w-full items-center px-4 text-[14px] ${
                    y === value ? "font-bold text-cgv-black" : "text-cgv-gray-600"
                  }`}
                >
                  {y}년
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-[60px] shrink-0 text-cgv-gray-400">{label}</dt>
      <dd className="text-cgv-black">{value}</dd>
    </div>
  );
}
