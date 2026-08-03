"use client";

import { motion } from "framer-motion";
import {
  Drama,
  Eye,
  Flame,
  Ghost,
  Heart,
  Laugh,
  Lock,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import { BADGES, GENRES } from "@/data/badges";
import { formatDate } from "@/lib/format";
import { getEarnedBadgeIds, getGenreCounts } from "@/lib/progression";
import { useDiaryStore } from "@/store/useDiaryStore";
import type { BadgeRule, DiaryEntry, Genre } from "@/types";

const GENRE_ICON: Record<Genre, LucideIcon> = {
  액션: Flame,
  드라마: Drama,
  SF: Rocket,
  코미디: Laugh,
  로맨스: Heart,
  스릴러: Eye,
  애니메이션: Sparkles,
  공포: Ghost,
};

/** PRD §8 화면 06 — 장르 취향 뱃지 (FR-08) */
export default function BadgesPage() {
  return (
    <Suspense fallback={<MobileContainer><div className="min-h-screen" /></MobileContainer>}>
      <BadgesContent />
    </Suspense>
  );
}

function BadgesContent() {
  const router = useRouter();
  const params = useSearchParams();
  const newBadgeId = params.get("new");
  const entries = useDiaryStore((s) => s.entries);

  const earned = useMemo(() => new Set(getEarnedBadgeIds(entries)), [entries]);
  const counts = useMemo(() => getGenreCounts(entries), [entries]);
  const max = counts[0]?.count ?? 0;

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="장르 취향 뱃지" onBack={() => router.push("/diary")} />

        <Hydrated fallback={<div className="h-[300px]" />}>
          {/* 섹션 1 — 장르별 관람 분포 */}
          <section className="px-5 pt-3">
            <h2 className="text-h2 font-bold text-cgv-black">장르별 관람 분포</h2>
            {counts.length === 0 ? (
              <p className="py-8 text-center text-body text-cgv-gray-400">
                아직 기록이 없어요. 영화표를 인증해 보세요!
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {counts.map(({ genre, count }, i) => (
                  <li key={genre} className="flex items-center gap-3">
                    <span className="w-[64px] shrink-0 text-sub text-cgv-gray-600">{genre}</span>
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-cgv-gray-100">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${max ? (count / max) * 100 : 0}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className={`block h-full rounded-full ${
                          i === 0 ? "bg-cgv-gold" : "bg-cgv-red"
                        }`}
                      />
                    </span>
                    <span className="w-[34px] shrink-0 text-right text-sub font-bold text-cgv-black">
                      {count}편
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 섹션 2 — 뱃지 컬렉션 */}
          <section className="px-5 pt-9">
            <div className="flex items-baseline justify-between">
              <h2 className="text-h2 font-bold text-cgv-black">뱃지 컬렉션</h2>
              <span className="text-sub text-cgv-gray-600">
                {earned.size} / {BADGES.length}
              </span>
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5">
              {GENRES.flatMap((genre) =>
                BADGES.filter((b) => b.genre === genre).map((badge) => (
                  <BadgeCell
                    key={badge.id}
                    badge={badge}
                    unlocked={earned.has(badge.id)}
                    isNew={badge.id === newBadgeId}
                    entries={entries}
                  />
                )),
              )}
            </ul>
          </section>
        </Hydrated>
      </div>

      <BottomTab active="more" />
    </MobileContainer>
  );
}

function BadgeCell({
  badge,
  unlocked,
  isNew,
  entries,
}: {
  badge: BadgeRule;
  unlocked: boolean;
  isNew: boolean;
  entries: DiaryEntry[];
}) {
  const Icon = GENRE_ICON[badge.genre];

  // 획득일 = 해당 장르 N번째 관람일
  const earnedAt = useMemo(() => {
    if (!unlocked) return null;
    const sorted = entries
      .filter((e) => e.genre === badge.genre)
      .sort((a, b) => a.watchedAt.localeCompare(b.watchedAt));
    return sorted[badge.required - 1]?.watchedAt ?? null;
  }, [entries, badge, unlocked]);

  return (
    <li className="flex flex-col items-center">
      <motion.div
        initial={isNew ? { scale: 0.5, opacity: 0 } : false}
        animate={isNew ? { scale: [0.5, 1.2, 1], opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full ${
          unlocked ? "bg-cgv-gray-100" : "bg-cgv-gray-100/60"
        } ${isNew ? "ring-2 ring-cgv-gold" : ""}`}
      >
        {unlocked ? (
          <Icon
            size={30}
            strokeWidth={1.8}
            className={badge.tier === "master" ? "text-cgv-gold" : "text-cgv-red"}
          />
        ) : (
          <>
            <Icon size={30} strokeWidth={1.8} className="text-cgv-gray-400 opacity-40" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-cgv-white bg-cgv-gray-400">
              <Lock size={11} strokeWidth={2.4} className="text-cgv-white" />
            </span>
          </>
        )}
      </motion.div>

      <p
        className={`mt-2 text-center text-caption ${
          unlocked ? "font-bold text-cgv-black" : "text-cgv-gray-400"
        }`}
      >
        {badge.name}
      </p>
      <p className="mt-0.5 text-center text-[10px] text-cgv-gray-400">
        {unlocked && earnedAt ? formatDate(earnedAt) : `${badge.required}편 달성`}
      </p>
    </li>
  );
}
