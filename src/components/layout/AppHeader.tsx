"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/**
 * PRD §7.3 AppHeader — 높이 52px, 흰 배경, 구분선 없음.
 * 좌측 뒤로가기 + 타이틀(H1), 우측 아이콘 슬롯.
 */
export default function AppHeader({
  title,
  right,
  onBack,
  showBack = true,
}: {
  title?: string;
  right?: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    // pt-3: 상단 여백 (더보기 화면은 이 헤더를 쓰지 않으므로 영향 없음)
    <header className="sticky top-0 z-30 flex h-[64px] items-center gap-1 bg-cgv-white px-2 pt-3">
      {showBack && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => (onBack ? onBack() : router.back())}
          className="flex h-11 w-11 items-center justify-center"
        >
          <ChevronLeft size={24} strokeWidth={1.8} className="text-cgv-black" />
        </button>
      )}
      {title && (
        <h1 className={`text-h1 font-bold text-cgv-black ${showBack ? "" : "pl-3"}`}>{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-1 pr-1">{right}</div>
    </header>
  );
}
