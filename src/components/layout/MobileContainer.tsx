import type { ReactNode } from "react";

/**
 * PRD §2 — 최대폭 480px 컨테이너를 중앙 배치, 바깥은 뉴트럴 배경.
 * 모든 레이아웃은 375px 기준.
 */
export default function MobileContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-mobile bg-cgv-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className={className}>{children}</div>
    </div>
  );
}
