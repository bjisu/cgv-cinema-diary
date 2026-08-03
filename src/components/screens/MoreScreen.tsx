"use client";

import { Bell, ChevronRight, CreditCard, Search, Ticket, User } from "lucide-react";
import Link from "next/link";
import BottomTab from "@/components/layout/BottomTab";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import { PaconiMiniBadge } from "@/components/diary/PaconiCharacter";
import CjOneLogo from "@/components/ui/CjOneLogo";
import GradeBar from "@/components/ui/GradeBar";
import GrayCard from "@/components/ui/GrayCard";
import { OutlineButton } from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/Toast";
import { getLevel } from "@/lib/progression";
import { useDiaryStore } from "@/store/useDiaryStore";

/**
 * PRD §8 화면 01 — 스크린샷 1:1 재현. 허용된 변경 외 임의 변경 금지.
 * 앱의 첫 화면이므로 `/` 와 `/more` 두 라우트가 이 화면을 공유한다.
 */
export default function MoreScreen() {
  const nickname = useDiaryStore((s) => s.nickname);
  const points = useDiaryStore((s) => s.points);
  const entries = useDiaryStore((s) => s.entries);
  const resetDemo = useDiaryStore((s) => s.resetDemo);
  const showToast = useToast((s) => s.show);
  const level = getLevel(entries.length);

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        {/* 1. 상단 우측 아이콘 3개 (목업) */}
        <div className="flex h-[52px] items-center justify-end gap-1 px-3">
          {[Ticket, Bell, Search].map((Icon, i) => (
            <span key={i} className="flex h-11 w-11 items-center justify-center">
              <Icon size={24} strokeWidth={1.8} className="text-cgv-black" />
            </span>
          ))}
        </div>

        {/* 2. 프로필 영역 */}
        <div className="flex items-start justify-between px-5 pt-2">
          <div>
            <Hydrated fallback={<h1 className="text-[24px] font-bold text-cgv-black">&nbsp;</h1>}>
              <h1 className="text-[24px] font-bold leading-8 text-cgv-black">{nickname} 님</h1>
            </Hydrated>
            <button
              type="button"
              onClick={() => showToast("등급 화면은 프로토타입 범위 밖이에요")}
              className="mt-1.5 flex items-center gap-0.5 text-body text-cgv-black"
            >
              내 등급 보러 가기
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* 아바타 + FR-12 미니 파코니 뱃지 */}
          <div className="relative h-[72px] w-[72px] shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cgv-gray-100">
              <User size={38} strokeWidth={1.6} className="text-cgv-gray-400" />
            </div>
            <Hydrated>{level > 0 && <PaconiMiniBadge level={level} />}</Hydrated>
          </div>
        </div>

        {/* 3. 등급 진행바 (정적 목업) */}
        <div className="px-5 pt-6">
          <GradeBar pillLabel="0점" leftLabel="일반" rightLabel="10,000점" ratio={0} />
        </div>

        {/* 4. CJ ONE Point 카드 (정적 목업) */}
        <div className="px-5 pt-5">
          <GrayCard>
            <div className="flex items-center gap-2">
              <CjOneLogo />
              <span className="text-[17px] text-cgv-black">CJ ONE Point</span>
              <span className="ml-auto text-[17px] font-bold text-cgv-black">
                {points.toLocaleString()}P
              </span>
            </div>
            <div className="mt-4 border-t border-black/10 pt-4">
              <ul className="flex items-center">
                {[
                  { value: "2", label: "쿠폰" },
                  { value: "0", label: "관람/기프트콘" },
                  { value: "0", label: "기간횟수권" },
                ].map((item) => (
                  <li key={item.label} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[22px] font-bold leading-none text-cgv-black">
                      {item.value}
                    </span>
                    <span className="text-[13px] text-cgv-gray-600">{item.label}</span>
                  </li>
                ))}
                <li className="flex flex-1 flex-col items-center gap-1.5">
                  <CreditCard size={22} strokeWidth={1.8} className="text-cgv-black" />
                  <span className="text-[13px] text-cgv-gray-600">기프트카드</span>
                </li>
              </ul>
            </div>
          </GrayCard>
        </div>

        {/* 5~6. 나의 정보 관리 — TextMenuGrid 2열 */}
        <section className="px-5 pt-8">
          <h2 className="text-body text-cgv-gray-600">나의 정보 관리</h2>
          <ul className="mt-5 grid grid-cols-2 gap-y-[26px]">
            <li>
              {/* ★ 유일한 텍스트 교체: '내가 본 영화' → '시네마 다이어리' */}
              <Link href="/diary" className="relative inline-flex items-start">
                <span className="text-h2 font-bold text-cgv-black">시네마 다이어리</span>
                <span className="ml-1 mt-0.5 text-[9px] font-bold leading-none text-cgv-red">
                  NEW
                </span>
              </Link>
            </li>
            {["보관함", "스마트결제관리", "예약/결제내역", "내 차량번호 조회", "자주가는 CGV"].map(
              (label) => (
                <li key={label}>
                  <span className="text-h2 font-bold text-cgv-black">{label}</span>
                </li>
              ),
            )}
          </ul>
        </section>

        {/* 7. 하단 배너 → 시네마 다이어리 프로모 */}
        <div className="px-5 pt-8">
          <div className="relative flex items-center gap-3 overflow-hidden rounded-card bg-[#E6DCFF] px-5 py-4">
            <div className="flex-1">
              <p className="text-sub text-cgv-black">영화표 찍고 파코니 키우자!</p>
              <p className="mt-0.5 text-[19px] font-bold leading-tight text-cgv-black">
                시네마 다이어리 오픈
              </p>
              <Link href="/diary" className="mt-3 inline-block">
                <OutlineButton>자세히보기</OutlineButton>
              </Link>
            </div>
            <PromoPaconi />
            <span className="absolute right-3 top-3 rounded-full border border-cgv-red px-1.5 py-0.5 text-[9px] font-bold leading-none text-cgv-red">
              NEW
            </span>
          </div>
        </div>

        {/* FR-13 데모 데이터 초기화 */}
        <div className="px-5 pb-6 pt-8">
          <button
            type="button"
            onClick={() => {
              if (confirm("데모 데이터를 초기화할까요? 기록·레벨·뱃지가 모두 리셋됩니다.")) {
                resetDemo();
                showToast("데모 데이터를 초기화했어요 🍿");
              }
            }}
            className="text-sub text-cgv-gray-400 underline underline-offset-2"
          >
            데모 데이터 초기화
          </button>
        </div>
      </div>

      <BottomTab active="more" />
    </MobileContainer>
  );
}

function PromoPaconi() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="46" cy="22" r="9" fill="#F5C518" />
      <circle cx="34" cy="18" r="8" fill="#FFF6D6" />
      <circle cx="24" cy="24" r="8" fill="#F5C518" />
      <path d="M16 30h40l-5 32a5 5 0 0 1-5 4H26a5 5 0 0 1-5-4z" fill="#FFFFFF" />
      <g clipPath="url(#promoCup)">
        <rect x="21" y="30" width="6" height="38" fill="#FF2949" />
        <rect x="33" y="30" width="6" height="38" fill="#FF2949" />
        <rect x="45" y="30" width="6" height="38" fill="#FF2949" />
      </g>
      <defs>
        <clipPath id="promoCup">
          <path d="M16 30h40l-5 32a5 5 0 0 1-5 4H26a5 5 0 0 1-5-4z" />
        </clipPath>
      </defs>
      <path
        d="M16 30h40l-5 32a5 5 0 0 1-5 4H26a5 5 0 0 1-5-4z"
        stroke="#121212"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="30" cy="44" r="2.6" fill="#121212" />
      <circle cx="42" cy="44" r="2.6" fill="#121212" />
      <path d="M31 51q5 5 10 0" stroke="#121212" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
