"use client";

import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import MobileContainer from "@/components/layout/MobileContainer";
import Poster from "@/components/ui/Poster";
import { MOVIES } from "@/data/movies";

const DAYS = ["8/3 (월)", "8/4 (화)", "8/5 (수)", "8/6 (목)", "8/7 (금)"];

/** 목업 탭 — 예매·예약 (FR-11). 정적 화면 */
export default function BookingPage() {
  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="예매·예약" showBack={false} />

        {/* 비활성 날짜 셀렉터 목업 */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-2">
          {DAYS.map((d, i) => (
            <span
              key={d}
              className={`flex h-[52px] shrink-0 items-center rounded-btn px-4 text-sub ${
                i === 0
                  ? "bg-cgv-black font-bold text-cgv-white"
                  : "border border-black/10 text-cgv-gray-400"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        <ul className="mt-6 flex flex-col gap-4 px-5">
          {MOVIES.slice(0, 6).map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <Poster movieId={m.id} sizes="58px" className="w-[58px] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-bold text-cgv-black">{m.title}</p>
                <p className="mt-1 text-sub text-cgv-gray-600">
                  {m.genre} · {m.runtime}분
                </p>
                <p className="mt-0.5 text-sub text-cgv-gray-400">용산아이파크몰 · 상영 중</p>
              </div>
              <span className="shrink-0 rounded-full bg-cgv-red px-3 py-1.5 text-sub font-bold text-cgv-white">
                예매
              </span>
            </li>
          ))}
        </ul>

        <p className="px-5 pt-8 text-center text-sub text-cgv-gray-400">
          실제 예매·결제는 프로토타입 범위에 포함되지 않아요
        </p>
      </div>

      <BottomTab active="booking" />
    </MobileContainer>
  );
}
