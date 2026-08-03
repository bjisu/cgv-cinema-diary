"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** PRD §7.3 — 높이 52px, cgv-red 배경, 흰 16px Bold, radius 12px, 전체 폭 */
export default function PrimaryButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      {...rest}
      className={`h-[52px] w-full rounded-btn bg-cgv-red text-[16px] font-bold text-cgv-white transition-colors active:bg-cgv-red-deep disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/** 보조 버튼 — 아웃라인 pill ('자세히보기' 스타일) */
export function OutlineButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex h-[36px] items-center rounded-full border border-cgv-black px-4 text-sub text-cgv-black ${className}`}
    >
      {children}
    </button>
  );
}
