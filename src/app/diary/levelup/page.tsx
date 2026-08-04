"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import MobileContainer from "@/components/layout/MobileContainer";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useDiaryStore } from "@/store/useDiaryStore";

/** PRD §8 화면 05 — 파코니 레벨업 연출 (FR-07) */
export default function LevelUpPage() {
  return (
    <Suspense fallback={<MobileContainer><div className="min-h-screen bg-cgv-black" /></MobileContainer>}>
      <LevelUpContent />
    </Suspense>
  );
}

function LevelUpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const entries = useDiaryStore((s) => s.entries);
  const markLevelUpSeen = useDiaryStore((s) => s.markLevelUpSeen);

  const level = Number(params.get("level") ?? 1);
  const count = Number(params.get("count") ?? entries.length);

  // 레벨업 연출은 레벨당 1회만 (PRD §5.1)
  useEffect(() => {
    markLevelUpSeen(level);
  }, [level, markLevelUpSeen]);

  useEffect(() => {
    const shoot = () =>
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.45 },
        colors: ["#FF2949", "#F5C518", "#FF7553", "#FFFFFF"],
      });
    shoot();
    const t = setTimeout(shoot, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] px-6 py-14">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 1.15, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <PaconiCharacter level={level} size={200} priority />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-[26px] font-bold text-cgv-white"
        >
          파코니 Lv.{level} 달성!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-sub text-cgv-gray-400"
        >
          {count}편째 관람
        </motion.p>

        <div className="mt-12 w-full">
          <PrimaryButton onClick={() => router.push("/diary/share")}>씨네톡에 공유</PrimaryButton>
          <button
            type="button"
            onClick={() => router.push("/diary")}
            className="mt-4 h-11 w-full text-body text-cgv-gray-400"
          >
            다이어리로 돌아가기
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
