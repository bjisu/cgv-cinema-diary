import type { ReactNode } from "react";

/** PRD §7.3 — #F4F4F4 배경, radius 16px, 그림자 없음(플랫), 내부 패딩 20px */
export default function GrayCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card bg-cgv-gray-100 p-5 ${className}`}>{children}</div>
  );
}
