"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import GradeBar from "@/components/ui/GradeBar";
import GrayCard from "@/components/ui/GrayCard";
import Poster from "@/components/ui/Poster";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { formatWatchedAt } from "@/lib/format";
import { getLevelProgress, getPeriodCounts } from "@/lib/progression";
import { useDiaryStore } from "@/store/useDiaryStore";

/** PRD §8 화면 02 — 시네마 다이어리 홈 (FR-02) */
export default function DiaryHomePage() {
  const router = useRouter();
  const entries = useDiaryStore((s) => s.entries);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.watchedAt.localeCompare(a.watchedAt)),
    [entries],
  );
  const progress = getLevelProgress(entries.length);
  const period = getPeriodCounts(entries);

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="시네마 다이어리" onBack={() => router.push("/more")} />

        <Hydrated fallback={<div className="h-[220px]" />}>
          {/* 히어로 카드 */}
          <div className="px-5 pt-2">
            <GrayCard>
              <div className="flex items-center gap-4">
                <PaconiCharacter level={progress.level} size={92} />
                <div className="min-w-0 flex-1">
                  <p className="text-[22px] font-bold leading-tight text-cgv-black">
                    파코니 Lv.{progress.level}
                  </p>
                  <p className="mt-1 text-body text-cgv-gray-600">{progress.titleName}</p>
                </div>
              </div>
              <div className="mt-4">
                <GradeBar
                  pillLabel={`Lv.${progress.level}`}
                  ratio={progress.ratio}
                  leftLabel={`${entries.length}편`}
                  rightLabel={
                    progress.next ? `다음 레벨 ${progress.next.required}편` : "최고 레벨 달성"
                  }
                />
              </div>
            </GrayCard>
          </div>

          {/* 통계 라인 */}
          <p className="px-5 pt-4 text-body text-cgv-black">
            이번 달 <b className="font-bold">{period.month}편</b> · 올해{" "}
            <b className="font-bold">{period.year}편</b>
          </p>

          {/* CTA */}
          <div className="px-5 pt-4">
            <PrimaryButton onClick={() => router.push("/diary/verify")}>
              영화표로 기록하기
            </PrimaryButton>
          </div>

          {/* 최근 관람 기록 */}
          <section className="px-5 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 font-bold text-cgv-black">최근 관람 기록</h2>
              <Link href="/diary/archive" className="text-sub text-cgv-gray-600">
                전체보기 →
              </Link>
            </div>

            {sorted.length === 0 ? (
              <p className="py-8 text-center text-body text-cgv-gray-400">
                아직 기록이 없어요. 영화표를 인증해 보세요!
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {sorted.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <Link href="/diary/archive" className="flex items-center gap-3">
                      <Poster movieId={e.movieId} sizes="48px" className="w-[48px] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body font-bold text-cgv-black">{e.title}</p>
                        <p className="mt-1 text-sub text-cgv-gray-600">
                          {formatWatchedAt(e.watchedAt)}
                        </p>
                        <p className="mt-0.5 text-sub text-cgv-gray-400">
                          {e.theater} · {e.screen}
                        </p>
                      </div>
                      <ChevronRight size={20} className="shrink-0 text-cgv-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 퀵링크 */}
          <div className="grid grid-cols-2 gap-3 px-5 pt-8">
            <Link href="/diary/badges">
              <GrayCard className="h-full">
                <p className="text-h2 font-bold leading-snug text-cgv-black">
                  장르 취향
                  <br />
                  뱃지
                </p>
                <p className="mt-2 text-sub text-cgv-gray-600">모은 뱃지 보기</p>
              </GrayCard>
            </Link>
            <Link href="/diary/archive">
              <GrayCard className="h-full">
                <p className="text-h2 font-bold leading-snug text-cgv-black">
                  마이 무비
                  <br />
                  다이어리
                </p>
                <p className="mt-2 text-sub text-cgv-gray-600">올해 {period.year}편</p>
              </GrayCard>
            </Link>
          </div>
        </Hydrated>
      </div>

      <BottomTab active="more" />
    </MobileContainer>
  );
}
