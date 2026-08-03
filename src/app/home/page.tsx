"use client";

import { Bell, Search, Ticket } from "lucide-react";
import Link from "next/link";
import BottomTab from "@/components/layout/BottomTab";
import MobileContainer from "@/components/layout/MobileContainer";
import Poster from "@/components/ui/Poster";
import { OutlineButton } from "@/components/ui/PrimaryButton";
import { MOVIES } from "@/data/movies";

/** 목업 탭 — 홈 (FR-11). 빈 화면 금지: 배너 + 무비차트 가로 스크롤 */
export default function HomePage() {
  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <div className="flex h-[64px] items-center px-3 pt-3">
          <span className="pl-2 text-h1 font-bold text-cgv-black">CGV</span>
          <div className="ml-auto flex items-center">
            {[Ticket, Bell, Search].map((Icon, i) => (
              <span key={i} className="flex h-11 w-11 items-center justify-center">
                <Icon size={24} strokeWidth={1.8} className="text-cgv-black" />
              </span>
            ))}
          </div>
        </div>

        {/* 시네마 다이어리 프로모 배너 */}
        <div className="px-5 pt-2">
          <Link href="/diary">
            <div className="flex items-center gap-3 rounded-card bg-[#E6DCFF] px-5 py-5">
              <div className="flex-1">
                <p className="text-sub text-cgv-black">NEW</p>
                <p className="mt-1 text-[19px] font-bold leading-tight text-cgv-black">
                  영화표 찍고
                  <br />
                  파코니 키우자!
                </p>
                <div className="mt-3">
                  <OutlineButton>시네마 다이어리 열기</OutlineButton>
                </div>
              </div>
              <span className="text-[44px]">🍿</span>
            </div>
          </Link>
        </div>

        <section className="pt-8">
          <h2 className="px-5 text-h2 font-bold text-cgv-black">무비차트</h2>
          <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5">
            {MOVIES.slice(0, 8).map((m, i) => (
              <li key={m.id} className="w-[112px] shrink-0">
                <Poster movieId={m.id} sizes="112px" />
                <p className="mt-2 truncate text-sub font-bold text-cgv-black">
                  {i + 1}. {m.title}
                </p>
                <p className="mt-0.5 text-caption text-cgv-gray-600">
                  {m.genre} · {m.runtime}분
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 pt-9">
          <h2 className="text-h2 font-bold text-cgv-black">이벤트</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { title: "파코니 NFC 굿즈 출시", desc: "매점에서 만나보세요", href: "/store" },
              { title: "시네마 다이어리 오픈 기념", desc: "첫 기록하고 뱃지 받기", href: "/diary" },
            ].map((e) => (
              <li key={e.title}>
                <Link href={e.href} className="block rounded-card bg-cgv-gray-100 p-5">
                  <p className="text-body font-bold text-cgv-black">{e.title}</p>
                  <p className="mt-1 text-sub text-cgv-gray-600">{e.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BottomTab active="home" />
    </MobileContainer>
  );
}
