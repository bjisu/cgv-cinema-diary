"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import MobileContainer from "@/components/layout/MobileContainer";
import { MAX_LEVEL } from "@/data/levels";
import { useDiaryStore } from "@/store/useDiaryStore";

/** PRD §8 화면 NFC — 굿즈 태그 시뮬레이션 (FR-01) */
export default function NfcPage() {
  const router = useRouter();
  const markNfcTagged = useDiaryStore((s) => s.markNfcTagged);
  const markOnboarded = useDiaryStore((s) => s.markOnboarded);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const succeed = useCallback(() => {
    if (done) return;
    setDone(true);
    markNfcTagged();
    markOnboarded();
    timers.current.push(setTimeout(() => router.replace("/diary"), 1200));
  }, [done, markNfcTagged, markOnboarded, router]);

  useEffect(() => {
    // 1.5초 후 자동 성공 (실패 케이스 없음)
    timers.current.push(setTimeout(succeed, 1500));
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [succeed]);

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] px-8">
        <div className="relative flex h-[240px] w-[240px] items-center justify-center">
          {!done &&
            [0, 0.6, 1.2].map((delay) => (
              <span
                key={delay}
                className="absolute h-[120px] w-[120px] rounded-full border-2 border-cgv-red animate-ripple"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}

          {done ? (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-cgv-red"
            >
              <Check size={56} strokeWidth={3} className="text-cgv-white" />
            </motion.span>
          ) : (
            <PhoneWithGoods />
          )}
        </div>

        <p className="mt-8 text-center text-[17px] font-bold text-cgv-white">
          {done ? "태그 완료! 시네마 다이어리로 이동합니다" : "파코니 굿즈를 휴대폰 뒷면에 대주세요"}
        </p>

        {!done && (
          <button
            type="button"
            onClick={succeed}
            className="mt-10 h-11 text-body text-cgv-gray-400 underline underline-offset-4"
          >
            태그 시뮬레이션
          </button>
        )}
      </div>
    </MobileContainer>
  );
}

/** 폰 뒷면 + 파코니 굿즈 일러스트 */
function PhoneWithGoods() {
  return (
    <div className="relative h-[180px] w-[150px]" aria-hidden>
      <svg
        width="150"
        height="180"
        viewBox="0 0 150 180"
        fill="none"
        className="absolute inset-0"
      >
        <rect x="26" y="14" width="82" height="152" rx="14" fill="#2B2B2B" stroke="#707070" strokeWidth="2" />
        <circle cx="45" cy="34" r="7" fill="#454545" />
      </svg>
      <motion.div
        animate={{ x: [12, 0, 12] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[78px] top-[52px]"
      >
        <PaconiCharacter level={MAX_LEVEL} size={52} />
      </motion.div>
    </div>
  );
}
