import type { ReactNode } from "react";

/**
 * PRD §7.3 — #F4F4F4 배경, radius 16px, 그림자 없음(플랫), 내부 패딩 20px.
 * `compact` 은 패딩만 16px 로 줄인다 (다이어리 히어로 카드처럼 내용이 많은 경우).
 */
export default function GrayCard({
  children,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-card bg-cgv-gray-100 ${compact ? "p-4" : "p-5"} ${className}`}>
      {children}
    </div>
  );
}
