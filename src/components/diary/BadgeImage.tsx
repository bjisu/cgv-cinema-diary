"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import type { BadgeTier, Genre } from "@/types";

/** 장르 → design-reference/badge.png 에서 잘라낸 뱃지 이미지 파일 */
const GENRE_IMAGE: Record<Genre, string> = {
  액션: "action",
  드라마: "drama",
  SF: "sf",
  코미디: "comedy",
  로맨스: "romance",
  스릴러: "thriller",
  애니메이션: "anime",
  공포: "horror",
};

/** 티어는 원본 뱃지 스타일을 유지한 채 테두리 색·라벨만 바꿔 구분한다 */
const TIER_STYLE: Record<BadgeTier, { ring: string; chip: string; label: string }> = {
  intro: { ring: "ring-cgv-gray-400", chip: "bg-cgv-gray-400", label: "입문" },
  fan: { ring: "ring-cgv-red", chip: "bg-cgv-red", label: "팬" },
  master: { ring: "ring-cgv-gold", chip: "bg-cgv-gold", label: "마스터" },
};

export function getBadgeImageSrc(genre: Genre): string {
  return `/badges/${GENRE_IMAGE[genre]}.png`;
}

export default function BadgeImage({
  genre,
  tier,
  unlocked,
  showTierChip = true,
  className = "",
}: {
  genre: Genre;
  tier: BadgeTier;
  unlocked: boolean;
  showTierChip?: boolean;
  className?: string;
}) {
  const style = TIER_STYLE[tier];

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-full ring-2 ${
        unlocked ? style.ring : "ring-black/10"
      } ${className}`}
    >
      <Image
        src={getBadgeImageSrc(genre)}
        alt={`${genre} 뱃지`}
        fill
        sizes="120px"
        className={`object-cover ${unlocked ? "" : "grayscale"}`}
      />

      {/* 미획득 — 반투명 어두운 오버레이 + 자물쇠 */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Lock size={22} strokeWidth={2.4} className="text-cgv-white/90" />
        </div>
      )}

      {/* 티어 표시 */}
      {showTierChip && (
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[6px] px-2 py-[2px] text-[10px] font-bold leading-none text-cgv-white ${
            unlocked ? style.chip : "bg-black/45"
          }`}
        >
          {style.label}
        </span>
      )}
    </div>
  );
}
