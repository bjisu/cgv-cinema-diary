"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import MobileContainer from "@/components/layout/MobileContainer";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useDiaryStore } from "@/store/useDiaryStore";

/**
 * FR-14 온보딩 스플래시 — NFC 태그 유도.
 * 앱 첫 화면은 더보기(`/`)이므로 이 화면은 별도 라우트로 두고 매점 굿즈 카드에서 연결한다.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const markOnboarded = useDiaryStore((s) => s.markOnboarded);

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PaconiCharacter level={1} size={180} priority />
        </motion.div>

        <h1 className="mt-8 text-center text-[24px] font-bold leading-snug text-cgv-black">
          파코니 굿즈를
          <br />
          태그해 보세요
        </h1>
        <p className="mt-3 text-center text-body text-cgv-gray-600">
          영화표를 찍으면 관람 기록이 쌓이고
          <br />
          파코니가 함께 성장해요
        </p>

        <div className="mt-12 w-full">
          <PrimaryButton onClick={() => router.push("/nfc")}>굿즈 태그하기</PrimaryButton>
          <button
            type="button"
            onClick={() => {
              markOnboarded();
              router.replace("/");
            }}
            className="mt-4 h-11 w-full text-body text-cgv-gray-600"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
