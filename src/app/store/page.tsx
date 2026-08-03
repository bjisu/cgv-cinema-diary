"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import MobileContainer from "@/components/layout/MobileContainer";
import BottomSheet from "@/components/ui/BottomSheet";
import PrimaryButton from "@/components/ui/PrimaryButton";

const PRODUCTS = [
  { id: "p1", name: "고소한 팝콘 (L)", price: "6,000원", emoji: "🍿" },
  { id: "p2", name: "콜라 (R)", price: "2,500원", emoji: "🥤" },
  { id: "p3", name: "치즈 나초", price: "5,500원", emoji: "🧀" },
  { id: "p4", name: "핫도그 콤보", price: "8,000원", emoji: "🌭" },
];

/** 목업 탭 — 매점 (FR-11). '파코니 NFC 굿즈' 카드 → 굿즈 소개 바텀시트 → /nfc */
export default function StorePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="매점" showBack={false} />

        {/* 파코니 NFC 굿즈 */}
        <div className="px-5 pt-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-4 rounded-card bg-cgv-gray-100 p-5 text-left"
          >
            <PaconiCharacter level={3} size={76} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-h2 font-bold text-cgv-black">파코니 NFC 굿즈</span>
                <span className="text-[9px] font-bold text-cgv-red">NEW</span>
              </span>
              <span className="mt-1 block text-sub text-cgv-gray-600">
                태그하면 시네마 다이어리로 바로 이동
              </span>
              <span className="mt-1 block text-body font-bold text-cgv-black">18,000원</span>
            </span>
          </button>
        </div>

        <section className="px-5 pt-8">
          <h2 className="text-h2 font-bold text-cgv-black">인기 상품</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {PRODUCTS.map((p) => (
              <li key={p.id} className="rounded-card bg-cgv-gray-100 p-4">
                <span className="text-[36px]">{p.emoji}</span>
                <p className="mt-2 text-body font-bold text-cgv-black">{p.name}</p>
                <p className="mt-0.5 text-sub text-cgv-gray-600">{p.price}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="파코니 NFC 굿즈">
        <div className="pb-2">
          <div className="flex justify-center py-3">
            <PaconiCharacter level={5} size={140} />
          </div>
          <p className="text-body leading-relaxed text-cgv-gray-600">
            굿즈를 휴대폰 뒷면에 태그하면 CGV 앱의 시네마 다이어리가 바로 열려요. 영화표를 인증하면
            관람 기록이 자동으로 쌓이고, 파코니가 레벨업합니다.
          </p>
          <div className="mt-6">
            <PrimaryButton onClick={() => router.push("/nfc")}>태그 시뮬레이션 해보기</PrimaryButton>
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="mt-3 h-11 w-full text-sub text-cgv-gray-600 underline underline-offset-2"
            >
              굿즈 안내 온보딩 다시 보기
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomTab active="store" />
    </MobileContainer>
  );
}
